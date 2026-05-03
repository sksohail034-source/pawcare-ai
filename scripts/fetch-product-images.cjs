const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');
const google = require('googlethis');

const PRODUCTS_FILE = path.join(__dirname, '../src/pages/ProductsPage.jsx');
const IMAGES_DIR = path.join(__dirname, '../public/images/products');

const downloadImage = (url, filepath) => {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    client.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode !== 200) {
        return reject(new Error(`Failed: ${res.statusCode}`));
      }
      const file = fs.createWriteStream(filepath);
      res.pipe(file);
      file.on('finish', () => file.close(resolve));
      file.on('error', (err) => fs.unlink(filepath, () => reject(err)));
    }).on('error', (err) => fs.unlink(filepath, () => reject(err)));
  });
};

const run = async () => {
  console.log('Starting image fetch process...');
  let content = fs.readFileSync(PRODUCTS_FILE, 'utf8');

  const productsToUpdate = [];
  const lines = content.split('\n');
  
  let currentId = null;
  let currentName = null;
  let currentBrand = null;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    if (line.includes('id: \'')) {
      currentId = line.split('id: \'')[1].split('\'')[0];
    }
    if (line.includes('name: \'')) {
      currentName = line.split('name: \'')[1].split('\'')[0];
    }
    if (line.includes('brand: \'')) {
      currentBrand = line.split('brand: \'')[1].split('\'')[0];
    }
    
    if (line.includes('image: \'https://images.unsplash.com')) {
      const oldImage = line.split('image: \'')[1].split('\'')[0];
      if (currentId && currentName) {
        productsToUpdate.push({
          id: currentId,
          name: currentName,
          brand: currentBrand || '',
          oldImage
        });
        currentId = null; currentName = null; currentBrand = null;
      }
    }
  }

  console.log(`Found ${productsToUpdate.length} products using Unsplash placeholders.`);

  for (const product of productsToUpdate) {
    console.log(`\nFetching image for: [${product.brand}] ${product.name}`);
    try {
      const cleanName = product.name.split(',')[0].split('(')[0].trim();
      const query = `${product.brand} ${cleanName} product white background`;
      const images = await google.image(query, { safe: false });
      
      if (images && images.length > 0) {
        let downloaded = false;
        for (let i = 0; i < Math.min(3, images.length); i++) {
          const imgUrl = images[i].url;
          if (!imgUrl.startsWith('http')) continue;
          
          try {
            const ext = imgUrl.split('.').pop().split('?')[0].toLowerCase();
            const validExt = ['jpg', 'jpeg', 'png', 'webp'].includes(ext) ? ext : 'jpg';
            const filename = `${product.id}.${validExt}`;
            const filepath = path.join(IMAGES_DIR, filename);
            
            console.log(`  Downloading: ${imgUrl} -> ${filename}`);
            await downloadImage(imgUrl, filepath);
            
            const stats = fs.statSync(filepath);
            if (stats.size > 1000) {
              const newPath = `/images/products/${filename}`;
              
              // Simple string replace for the entire block text instead of regex
              // We'll replace the old image string only in the section containing this ID
              const parts = content.split(`id: '${product.id}'`);
              if (parts.length > 1) {
                const afterId = parts[1];
                const replacedAfterId = afterId.replace(`image: '${product.oldImage}'`, `image: '${newPath}'`);
                content = parts[0] + `id: '${product.id}'` + replacedAfterId;
              }
              
              downloaded = true;
              console.log(`  Success! Updated mapped path.`);
              break;
            } else {
              fs.unlinkSync(filepath);
            }
          } catch (e) {
            console.log(`  Failed: ${e.message}`);
          }
        }
      } else {
        console.log(`  No images found on Google.`);
      }
    } catch (err) {
      console.log(`  Error: ${err.message}`);
    }
    
    await new Promise(r => setTimeout(r, 1500)); // Play nice with Google
  }

  fs.writeFileSync(PRODUCTS_FILE, content, 'utf8');
  console.log('\nSaved updated ProductsPage.jsx!');
};

run().catch(console.error);
