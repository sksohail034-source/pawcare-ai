const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');
const google = require('googlethis');

const IMAGES_DIR = path.join(__dirname, '../public/images/products');

const downloadImage = (url, filepath) => {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    client.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode !== 200) return reject(new Error(`Failed: ${res.statusCode}`));
      const file = fs.createWriteStream(filepath);
      res.pipe(file);
      file.on('finish', () => file.close(resolve));
      file.on('error', (err) => fs.unlink(filepath, () => reject(err)));
    }).on('error', (err) => fs.unlink(filepath, () => reject(err)));
  });
};

const itemsToFix = [
  { id: 'himalaya-antiseptic-cream', query: 'Himalaya Scavon Vet Spray pet white background' },
  { id: 'wahl-oatmeal-shampoo', query: 'Wahl Oatmeal Moisturizing Dog Shampoo 200ml bottle' },
  { id: 'wahl-dog-conditioner', query: 'Wahl Dog Conditioner Oatmeal Formula bottle' },
  { id: 'double-sided-comb', query: 'Pecute Double Sided Pet Dematting Comb Brush' },
  { id: 'nail-clipper-pro', query: 'Foodie Puppies Professional Dog Nail Clipper' },
  { id: 'meo-persian-cat', query: 'Me-O Persian Dry Cat Food bag white background' },
  { id: 'sheba-wet-cat', query: 'Sheba Rich Premium Wet Cat Food Fish Mix' },
  { id: 'royal-canin-kitten', query: 'Royal Canin Kitten Dry Cat Food 2kg bag white background' },
  { id: 'purepet-cat-treats', query: 'Purepet Cat Treats Tuna Flavour pouch' },
  { id: 'cat-litter-box', query: 'Enclosed Cat Litter Box with Scoop' },
  { id: 'cat-scratching-post', query: 'Sisal Cat Scratching Post' },
  { id: 'captain-zack-cat-shampoo', query: 'Captain Zack Purrfectly Calm Cat Shampoo' },
  { id: 'slicker-brush-pro', query: 'Foodie Puppies Self-Cleaning Slicker Brush pet product' },
  { id: 'petsafe-slimcat', query: 'PetSafe SlimCat Interactive Toy Dispenser' },
  { id: 'cat-laser-toy', query: 'LED Laser Pointer Toy for Cats pet product' },
  { id: 'cat-catnip-toy', query: 'Catnip Fish Toy for Cats' },
  { id: 'cat-collar-bell', query: 'Pets Empire Cat Collar with Bell product photo' }
];

const run = async () => {
  for (const item of itemsToFix) {
    console.log(`Fetching correct image for: ${item.id}`);
    try {
      const images = await google.image(item.query, { safe: false });
      if (images && images.length > 0) {
        let downloaded = false;
        // Try the first 5 images
        for (let i = 0; i < Math.min(5, images.length); i++) {
          const imgUrl = images[i].url;
          if (!imgUrl.startsWith('http') || imgUrl.includes('vector') || imgUrl.includes('illustration') || imgUrl.includes('chart')) continue;
          
          try {
            let ext = imgUrl.split('.').pop().split('?')[0].toLowerCase();
            if (!['jpg', 'jpeg', 'png', 'webp'].includes(ext)) ext = 'jpg';
            
            // Delete old existing files for this ID
            const oldFiles = fs.readdirSync(IMAGES_DIR).filter(f => f.startsWith(item.id + '.'));
            for (const f of oldFiles) fs.unlinkSync(path.join(IMAGES_DIR, f));

            const filename = `${item.id}.${ext}`;
            const filepath = path.join(IMAGES_DIR, filename);
            
            console.log(`  Downloading: ${imgUrl} -> ${filename}`);
            await downloadImage(imgUrl, filepath);
            
            const stats = fs.statSync(filepath);
            if (stats.size > 2000) { // must be > 2KB
              downloaded = true;
              console.log(`  Success!`);
              break;
            } else {
              fs.unlinkSync(filepath);
            }
          } catch (e) {
            console.log(`  Failed: ${e.message}`);
          }
        }
      }
    } catch (err) {
      console.log(`  Error: ${err.message}`);
    }
    await new Promise(r => setTimeout(r, 1000));
  }
};

run().catch(console.error);
