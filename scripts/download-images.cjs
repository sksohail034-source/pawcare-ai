const fs = require('fs');
const https = require('https');
const path = require('path');

const filePath = path.join(__dirname, '../src/pages/ProductsPage.jsx');
let code = fs.readFileSync(filePath, 'utf8');

const products = [
  { id: 'boltz-bird-food', query: 'Boltz Bird Food for Budgies 1.2 kg' },
  { id: 'vitapol-bird-treat', query: 'Vitapol Smakers for Cockatiel Fruit Flavor' },
  { id: 'bird-cage', query: 'Jainsons Pet Products Medium Bird Cage' },
  { id: 'vitapol-rabbit-food', query: 'Vitapol Economic Food for Rabbit' },
  { id: 'rabbit-hay', query: 'Boltz Premium Timothy Hay for Rabbits' },
  { id: 'taiyo-fish-food', query: 'Taiyo Pluss Discovery Special Fish Food' },
  { id: 'sobo-filter', query: 'SOBO WP-1050F Internal Aquarium Filter Pump' },
  { id: 'seachem-prime', query: 'Seachem Prime Water Conditioner' },
  { id: 'hamster-food', query: 'Vitapol Economic Food for Hamster' },
  { id: 'hamster-wheel', query: 'Savic Hamster Exercise Wheel' },
  { id: 'goat-mineral', query: 'Intas Chelated Agrimin Forte Mineral Mixture' },
  { id: 'horse-ointment', query: 'Himalaya Himax Ointment for Animal Wound Care' },
  { id: 'horse-brush', query: 'Equine Premium Grooming Brush' },
  { id: 'cow-calcium', query: 'Virbac Ostovet Forte Liquid Calcium' },
  { id: 'cow-digestion', query: 'Ayurvet Ruchamax Digestion Powder for Cattle' }
];

const imgDir = path.join(__dirname, '../public/images/products');
if (!fs.existsSync(imgDir)) fs.mkdirSync(imgDir, { recursive: true });

async function getImageUrl(query) {
  return new Promise((resolve) => {
    https.get(`https://images.search.yahoo.com/search/images?p=${encodeURIComponent(query)}`, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        const match = data.match(/https:\/\/tse[0-9]\.mm\.bing\.net\/th\?id=OIP\.[^&"]+/);
        if (match) {
          resolve(match[0]);
        } else {
          resolve(null);
        }
      });
    }).on('error', () => resolve(null));
  });
}

async function downloadImage(url, dest) {
  return new Promise((resolve) => {
    https.get(url, (res) => {
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
    const imgUrl = await getImageUrl(p.query);
    if (imgUrl) {
      console.log(`Found image: ${imgUrl}`);
      const dest = path.join(imgDir, `${p.id}.jpg`);
      await downloadImage(imgUrl, dest);
      console.log(`Saved to ${dest}`);
      
      // Update code
      const regex = new RegExp(`(id:\\s*'${p.id}'[\\s\\S]*?image:\\s*')[^']+(')`);
      code = code.replace(regex, `$1/images/products/${p.id}.jpg$2`);
    } else {
      console.log(`Failed to find image for ${p.query}`);
    }
    // Small delay to prevent rate limiting
    await new Promise(r => setTimeout(r, 1000));
  }
  
  fs.writeFileSync(filePath, code);
  console.log("Updated ProductsPage.jsx with local image paths.");
}

run();
