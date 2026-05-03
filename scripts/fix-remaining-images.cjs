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

const badProducts = [
  // DOG
  { id: 'pedigree-dentastix-fresh', query: 'Pedigree Dentastix Fresh Green Tea Medium Dog packaging photo -chart -banner' },
  { id: 'drools-calcium-biscuits', query: 'Drools Absolute Calcium Biscuits 800g jar dog supplement' },
  { id: 'drools-calcium-tabs', query: 'Drools Absolute Calcium Tablets 50 pcs supplement bottle dog' },
  { id: 'petvit-multivitamin', query: 'Petvit Multivitamin Multimineral for Dogs 60 Tabs bottle' },
  { id: 'himalaya-erina-plus', query: 'Himalaya Erina Plus Coat Cleanser dog shampoo bottle' },
  { id: 'wahl-oatmeal-shampoo', query: 'Wahl Oatmeal Moisturizing Dog Shampoo 200ml pet bottle' },
  { id: 'wahl-dog-conditioner', query: 'Wahl Dog Conditioner Oatmeal Formula 200ml bottle' },
  { id: 'beaphar-conditioner', query: 'Beaphar Premium Conditioner for Dogs 250ml bottle -chart -banner' },
  { id: 'medilogy-dog-soap', query: 'Medilogy Biotech Anti-Tick Flea Dog Soap bar packaging' },
  { id: 'himalaya-dog-soap', query: 'Himalaya Erina EP Dog Soap Tick Flea bar packaging' },
  { id: 'arava-tick-shampoo', query: 'Arava Natural Medicated Dog Shampoo 400ml bottle -chart' },
  { id: 'pawpaya-dog-wipes', query: 'Pawpaya Premium Pet Wipes 80 Wipes packaging -banner' },
  { id: 'basil-pet-wipes', query: 'Basil Anti-Bacterial Pet Wipes Aloe Vera pack' },
  { id: 'himalaya-ear-cleaner', query: 'Himalaya Ear Cleansing Drops for Dogs Cats 100ml bottle' },
  { id: 'beaphar-ear-cleaner', query: 'Beaphar Ear Cleaner for Dogs Cats 50ml' },
  { id: 'himalaya-antiseptic-cream', query: 'Himalaya Scavon Vet Spray for Dogs wound care 100ml' },
  { id: 'trixie-dog-toothpaste', query: 'Trixie Dog Toothpaste Beef Flavor tube' },
  { id: 'boltz-dog-perfume', query: 'Boltz Dog Cat Body Perfume Spray 300ml bottle' },
  { id: 'wahl-dog-cologne', query: 'Wahl Dog Deodorizer Spray Eucalyptus Spearmint 236ml front bottle' },
  { id: 'goofy-tails-rope-ball', query: 'Goofy Tails Rope Ball Toy for Dogs Tug Fetch' },
  { id: 'trixie-fetch-ball', query: 'Trixie Natural Rubber Fetch Ball for Dogs 7cm' },
  { id: 'trixie-retractable-leash', query: 'Trixie Flexi Retractable Dog Leash 5m' },
  { id: 'pets-empire-harness', query: 'Pets Empire No-Pull Dog Harness Medium harness product' },
  { id: 'goofy-tails-harness', query: 'Goofy Tails Reflective Dog Harness with Handle Large' },
  { id: 'petsnbuds-raincoat', query: 'Pets Empire Waterproof Dog Raincoat Hood' },
  { id: 'foodie-puppies-pee-pads', query: 'Foodie Puppies Super Absorbent Training Pee Pads 50 Pcs box' },
  { id: 'foodie-puppies-poop-bags', query: 'Foodie Puppies Biodegradable Dog Poop Bags Rolls' },
  { id: 'pets-empire-carrier', query: 'Pets Empire Airline Approved Soft-Sided Dog Carrier' },
  { id: 'foodie-puppies-car-cover', query: 'Foodie Puppies Waterproof Dog Car Seat Cover Universal' },
  { id: 'cat-bowl-ceramic', query: 'Foodie Puppies Ceramic Elevated Cat Bowl Set' },
  { id: 'trixie-travel-bowl', query: 'Trixie Collapsible Silicone Travel Bowl for Dogs 500ml' },
  { id: 'himalaya-tick-spray', query: 'Himalaya Erina-EP Tick Flea Control Spray 100ml' },
  { id: 'beaphar-flea-spray', query: 'Beaphar Caniguard Spot-On for Dogs 3 Pipettes pack' },
  { id: 'drools-dewormer', query: 'Drools Absolute Deworming Tablets Dogs 10 Tabs' },
  { id: 'beaphar-wormer', query: 'Beaphar WORMclear Tablets for Dogs' },
  { id: 'drools-joint-tabs', query: 'Drools Absolute Joint Supplement Dogs Tablets' },

  // CAT
  { id: 'purepet-cat-litter', query: 'Purepet Clumping Cat Litter Lemon 5kg bag' },
  { id: 'cat-teaser-wand', query: 'Foodie Puppies Interactive Cat Teaser Wand' },
  { id: 'cat-ball-toy-set', query: 'Pets Empire Cat Ball Toys with Bell' },
  { id: 'cat-catnip-toy', query: 'Foodie Puppies Realistic Catnip Fish Toy' },
  { id: 'meo-persian-cat', query: 'Me-O Persian Cat Food Dry 1.1kg bag' },
  { id: 'whiskas-dry-adult', query: 'Whiskas Adult Dry Cat Food Tuna Flavour 1.2kg bag' },
  { id: 'royal-canin-cat-adult', query: 'Royal Canin Indoor Adult Dry Cat Food 2kg bag -kitten -maine' },
  { id: 'drools-cat-dry', query: 'Drools Adult Dry Cat Food Ocean Fish 3kg bag -wet' },
  { id: 'royal-canin-kitten', query: 'Royal Canin Kitten Dry Cat Food 2kg bag white background' },
  { id: 'purepet-cat-treats', query: 'Purepet Cat Treats Tuna Flavour 30g pouch' },
  { id: 'petvit-cat-multivitamin', query: 'Petvit Multivitamin Tablets for Cats 60 Tabs' },
  { id: 'himalaya-cat-shampoo', query: 'Himalaya Erina Plus Coat Cleanser for Cats 200ml' },
  { id: 'captain-zack-cat-shampoo', query: 'Captain Zack Cat Shampoo Gentle Tearless' },
  { id: 'litter-star-silica', query: 'Litter Star Silica Gel Cat Litter 5kg bag' },
  { id: 'basil-cat-wipes', query: 'Basil Anti-Bacterial Pet Wipes for Cats 80 Wipes' },
  { id: 'himalaya-cat-ear', query: 'Himalaya Ear Cleansing Drops for Cats 100ml bottle' },
  { id: 'cat-scratching-toy', query: 'Foodie Puppies Corrugated Cardboard Cat Scratcher board' }
];

const run = async () => {
  for (const item of badProducts) {
    console.log(`Fetching image for: ${item.id}`);
    try {
      const images = await google.image(item.query, { safe: false });
      if (images && images.length > 0) {
        let downloaded = false;
        for (let i = 0; i < Math.min(5, images.length); i++) {
          const imgUrl = images[i].url;
          if (!imgUrl.startsWith('http') || imgUrl.includes('vector') || imgUrl.includes('illustration') || imgUrl.includes('banner')) continue;
          
          try {
            let ext = imgUrl.split('.').pop().split('?')[0].toLowerCase();
            if (!['jpg', 'jpeg', 'png', 'webp'].includes(ext)) ext = 'jpg';
            
            // Cleanup old files
            const oldFiles = fs.readdirSync(IMAGES_DIR).filter(f => f.startsWith(item.id + '.'));
            for (const f of oldFiles) fs.unlinkSync(path.join(IMAGES_DIR, f));

            const filename = `${item.id}.${ext}`;
            const filepath = path.join(IMAGES_DIR, filename);
            
            console.log(`  Downloading: ${imgUrl} -> ${filename}`);
            await downloadImage(imgUrl, filepath);
            
            const stats = fs.statSync(filepath);
            if (stats.size > 2000) {
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
        if (!downloaded) console.log(`  FAILED to download any valid image.`);
      } else {
        console.log(`  No images found.`);
      }
    } catch (err) {
      console.log(`  Error: ${err.message}`);
    }
    await new Promise(r => setTimeout(r, 1000));
  }
};

run().catch(console.error);
