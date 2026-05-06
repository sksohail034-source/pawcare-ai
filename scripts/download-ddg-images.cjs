const fs = require('fs');
const https = require('https');
const path = require('path');
const { image_search } = require('duckduckgo-images-api');

const filePath = path.join(__dirname, '../src/pages/ProductsPage.jsx');
let code = fs.readFileSync(filePath, 'utf8');

const products = [
  { id: 'boltz-bird-food', query: 'Boltz Bird Food for Budgies 1.2 kg package' },
  { id: 'vitapol-bird-treat', query: 'Vitapol Smakers for Cockatiel Fruit Flavor box' },
  { id: 'bird-cage', query: 'Jainsons Pet Products Medium Bird Cage' },
  { id: 'vitapol-rabbit-food', query: 'Vitapol Economic Food for Rabbit box' },
  { id: 'rabbit-hay', query: 'Boltz Premium Timothy Hay for Rabbits package' },
  { id: 'taiyo-fish-food', query: 'Taiyo Pluss Discovery Special Fish Food' },
  { id: 'sobo-filter', query: 'SOBO WP-1050F Internal Aquarium Filter Pump' },
  { id: 'seachem-prime', query: 'Seachem Prime Water Conditioner bottle' },
  { id: 'hamster-food', query: 'Vitapol Economic Food for Hamster box' },
  { id: 'hamster-wheel', query: 'Savic Hamster Exercise Wheel' },
  { id: 'goat-mineral', query: 'Intas Chelated Agrimin Forte Mineral Mixture' },
  { id: 'horse-ointment', query: 'Himalaya Himax Ointment for Animal Wound Care' },
  { id: 'horse-brush', query: 'Equine Premium Grooming Brush horse' },
  { id: 'cow-calcium', query: 'Virbac Ostovet Forte Liquid Calcium bottle' },
  { id: 'cow-digestion', query: 'Ayurvet Ruchamax Digestion Powder for Cattle' }
];

const imgDir = path.join(__dirname, '../public/images/products');
if (!fs.existsSync(imgDir)) fs.mkdirSync(imgDir, { recursive: true });

async function downloadImage(url, dest) {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      // follow redirects
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return downloadImage(res.headers.location, dest).then(resolve);
      }
      if (res.statusCode !== 200) {
        resolve(false);
        return;
      }
      const file = fs.createWriteStream(dest);
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve(true);
      });
    }).on('error', () => resolve(false));
  });
}

async function run() {
  for (const p of products) {
    console.log(`Searching for: ${p.query}...`);
    try {
      const results = await image_search({ query: p.query, moderate: true });
      if (results && results.length > 0) {
        let imgUrl = results[0].image;
        console.log(`Found image: ${imgUrl}`);
        const dest = path.join(imgDir, `${p.id}.jpg`);
        const success = await downloadImage(imgUrl, dest);
        if (success) {
          console.log(`Saved to ${dest}`);
          const regex = new RegExp(`(id:\\s*'${p.id}'[\\s\\S]*?image:\\s*')[^']+(')`);
          code = code.replace(regex, `$1/images/products/${p.id}.jpg$2`);
        } else {
          console.log(`Failed to download ${imgUrl}`);
        }
      } else {
        console.log(`No results for ${p.query}`);
      }
    } catch (e) {
      console.log(`Error searching ${p.query}: ${e.message}`);
    }
    // delay to avoid rate limits
    await new Promise(r => setTimeout(r, 1000));
  }
  
  fs.writeFileSync(filePath, code);
  console.log("Updated ProductsPage.jsx with local image paths.");
}

run();
