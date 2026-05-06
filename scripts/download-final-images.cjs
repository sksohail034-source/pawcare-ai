const fs = require('fs');
const https = require('https');
const http = require('http');
const path = require('path');

const imgData = [
  { id: 'boltz-bird-food', url: 'https://m.media-amazon.com/images/I/713q7hlIjuL._AC_UF1000%2C1000_QL80_.jpg' },
  { id: 'vitapol-bird-treat', url: 'https://m.media-amazon.com/images/I/81tCg94yBRL._AC_UF1000%2C1000_QL80_.jpg' },
  { id: 'bird-cage', url: 'https://m.media-amazon.com/images/I/71dL624iV8L.jpg' },
  { id: 'vitapol-rabbit-food', url: 'https://m.media-amazon.com/images/I/81zB1EClcIL._AC_UF1000%2C1000_QL80_.jpg' },
  { id: 'rabbit-hay', url: 'https://m.media-amazon.com/images/I/81GLHntwlAL._AC_UF1000%2C1000_QL80_.jpg' },
  { id: 'taiyo-fish-food', url: 'https://m.media-amazon.com/images/I/713Y0fNIUKL.jpg' },
  { id: 'sobo-filter', url: 'https://m.media-amazon.com/images/I/6129thEW1XL.jpg' },
  { id: 'seachem-prime', url: 'https://m.media-amazon.com/images/I/612S4CwwT5L._AC_UF1000%2C1000_QL80_.jpg' },
  { id: 'hamster-food', url: 'https://m.media-amazon.com/images/I/61L7PxD8dEL.jpg' },
  { id: 'hamster-wheel', url: 'https://m.media-amazon.com/images/I/71iVm+MCpbL._AC_UF350,350_QL80_.jpg' },
  { id: 'goat-mineral', url: 'https://kamapet.com/wp-content/uploads/2023/10/CHELATED-AGRIMIN-FORTE-1.webp' },
  { id: 'horse-ointment', url: 'https://m.media-amazon.com/images/I/61Pn8SwjzDL.jpg' },
  { id: 'horse-brush', url: 'https://m.media-amazon.com/images/I/71HVgWokzPL._AC_UF1000,1000_QL80_.jpg' },
  { id: 'cow-calcium', url: 'https://m.media-amazon.com/images/I/616pWWBGbGL.jpg' },
  { id: 'cow-digestion', url: 'https://m.media-amazon.com/images/I/71vr2k4peEL._AC_UF1000%2C1000_QL80_.jpg' }
];

const imgDir = path.join(__dirname, '../public/images/products');
if (!fs.existsSync(imgDir)) fs.mkdirSync(imgDir, { recursive: true });

async function downloadImage(url, dest) {
  return new Promise((resolve) => {
    const lib = url.startsWith('https') ? https : http;
    const req = lib.get(url, (res) => {
      // Handle redirects
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return downloadImage(res.headers.location, dest).then(resolve);
      }
      if (res.statusCode !== 200) {
        console.error(`Status Code: ${res.statusCode} for ${url}`);
        resolve(false);
        return;
      }
      const file = fs.createWriteStream(dest);
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve(true);
      });
    }).on('error', (err) => {
      console.error(err.message);
      resolve(false);
    });
    
    // Timeout
    req.setTimeout(10000, () => {
      req.abort();
      resolve(false);
    });
  });
}

async function run() {
  const filePath = path.join(__dirname, '../src/pages/ProductsPage.jsx');
  let code = fs.readFileSync(filePath, 'utf8');

  for (const p of imgData) {
    const ext = p.url.includes('.webp') ? '.webp' : '.jpg';
    const destName = p.id + ext;
    const dest = path.join(imgDir, destName);
    
    console.log(`Downloading ${p.id}...`);
    const success = await downloadImage(p.url, dest);
    
    if (success) {
      console.log(`Saved ${destName}`);
      // Replace in ProductsPage.jsx
      const regex = new RegExp(`(id:\\s*'${p.id}'[\\s\\S]*?image:\\s*')[^']+(')`);
      code = code.replace(regex, `$1/images/products/${destName}$2`);
    } else {
      console.log(`Failed to download ${p.id}`);
    }
  }

  fs.writeFileSync(filePath, code);
  console.log("Updated ProductsPage.jsx with local image paths.");
}

run();
