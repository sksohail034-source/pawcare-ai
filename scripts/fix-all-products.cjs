const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/pages/ProductsPage.jsx');
let code = fs.readFileSync(filePath, 'utf8');

// ====================================================================
// 1. FIX: Replace all multi-animal products with proper images + price ranges
// ====================================================================

const replacements = [
  {
    old: "id: 'boltz-bird-food', name: 'Boltz Bird Food for Budgies (1.2 kg)', brand: 'Boltz', category: 'food', subCategory: 'Bird Food', petType: 'bird', price: '299', rating: 4.3, reviews: 12500, image: '/images/products/boltz-bird-food.jpg'",
    new: "id: 'boltz-bird-food', name: 'Boltz Bird Food for Budgies (1.2 kg)', brand: 'Boltz', category: 'food', subCategory: 'Bird Food', petType: 'bird', price: '249 - 399', rating: 4.3, reviews: 12500, image: 'https://m.media-amazon.com/images/I/713q7hlIjuL._SL1500_.jpg'"
  },
  {
    old: "id: 'vitapol-bird-treat', name: 'Vitapol Smakers for Cockatiel (Fruit Flavor)', brand: 'Vitapol', category: 'toys', subCategory: 'Bird Treat', petType: 'bird', price: '399', rating: 4.5, reviews: 3200, image: 'https://images.unsplash.com/photo-1543852786-1cf6624b9987?w=400&q=80'",
    new: "id: 'vitapol-bird-treat', name: 'Vitapol Smakers for Cockatiel (Fruit Flavor)', brand: 'Vitapol', category: 'toys', subCategory: 'Bird Treat', petType: 'bird', price: '349 - 499', rating: 4.5, reviews: 3200, image: 'https://m.media-amazon.com/images/I/71MNS1GM2xL._SL1500_.jpg'"
  },
  {
    old: "id: 'bird-cage', name: 'Jainsons Pet Products Medium Bird Cage', brand: 'Jainsons', category: 'cages', subCategory: 'Bird Cage', petType: 'bird', price: '899', rating: 4.1, reviews: 1800, image: '/images/products/bird-cage.jpg'",
    new: "id: 'bird-cage', name: 'Jainsons Pet Products Medium Bird Cage', brand: 'Jainsons', category: 'cages', subCategory: 'Bird Cage', petType: 'bird', price: '799 - 1,299', rating: 4.1, reviews: 1800, image: 'https://m.media-amazon.com/images/I/71dL624iV8L._SL1500_.jpg'"
  },
  {
    old: "id: 'vitapol-rabbit-food', name: 'Vitapol Economic Food for Rabbit (1.2 kg)', brand: 'Vitapol', category: 'food', subCategory: 'Rabbit Pellets', petType: 'rabbit', price: '450', rating: 4.4, reviews: 4100, image: '/images/products/vitapol-rabbit-food.jpg'",
    new: "id: 'vitapol-rabbit-food', name: 'Vitapol Economic Food for Rabbit (1.2 kg)', brand: 'Vitapol', category: 'food', subCategory: 'Rabbit Pellets', petType: 'rabbit', price: '399 - 549', rating: 4.4, reviews: 4100, image: 'https://m.media-amazon.com/images/I/81zB1EClcIL._SL1500_.jpg'"
  },
  {
    old: "id: 'rabbit-hay', name: 'Boltz Premium Timothy Hay for Rabbits (400g)', brand: 'Boltz', category: 'food', subCategory: 'Rabbit Hay', petType: 'rabbit', price: '399', rating: 4.2, reviews: 2500, image: '/images/products/rabbit-hay.jpg'",
    new: "id: 'rabbit-hay', name: 'Boltz Premium Timothy Hay for Rabbits (400g)', brand: 'Boltz', category: 'food', subCategory: 'Rabbit Hay', petType: 'rabbit', price: '349 - 499', rating: 4.2, reviews: 2500, image: 'https://m.media-amazon.com/images/I/81GLHntwlAL._SL1500_.jpg'"
  },
  {
    old: "id: 'taiyo-fish-food', name: 'Taiyo Pluss Discovery Special Fish Food (1 kg)', brand: 'Taiyo', category: 'food', subCategory: 'Fish Food', petType: 'fish', price: '350', rating: 4.2, reviews: 15800, image: '/images/products/taiyo-fish-food.jpg'",
    new: "id: 'taiyo-fish-food', name: 'Taiyo Pluss Discovery Special Fish Food (1 kg)', brand: 'Taiyo', category: 'food', subCategory: 'Fish Food', petType: 'fish', price: '299 - 449', rating: 4.2, reviews: 15800, image: 'https://m.media-amazon.com/images/I/713Y0fNIUKL._SL1500_.jpg'"
  },
  {
    old: "id: 'sobo-filter', name: 'SOBO WP-1050F Internal Aquarium Filter Pump', brand: 'SOBO', category: 'aquarium', subCategory: 'Filter', petType: 'fish', price: '299', rating: 4.0, reviews: 5500, image: '/images/products/sobo-filter.jpg'",
    new: "id: 'sobo-filter', name: 'SOBO WP-1050F Internal Aquarium Filter Pump', brand: 'SOBO', category: 'aquarium', subCategory: 'Filter', petType: 'fish', price: '249 - 399', rating: 4.0, reviews: 5500, image: 'https://m.media-amazon.com/images/I/6129thEW1XL._SL1500_.jpg'"
  },
  {
    old: "id: 'seachem-prime', name: 'Seachem Prime Water Conditioner (100 ml)', brand: 'Seachem', category: 'aquarium', subCategory: 'Conditioner', petType: 'fish', price: '599', rating: 4.7, reviews: 4200, image: '/images/products/seachem-prime.jpg'",
    new: "id: 'seachem-prime', name: 'Seachem Prime Water Conditioner (100 ml)', brand: 'Seachem', category: 'aquarium', subCategory: 'Conditioner', petType: 'fish', price: '499 - 699', rating: 4.7, reviews: 4200, image: 'https://m.media-amazon.com/images/I/612S4CwwT5L._SL1500_.jpg'"
  },
  {
    old: "id: 'hamster-food', name: 'Vitapol Economic Food for Hamster (1.2 kg)', brand: 'Vitapol', category: 'food', subCategory: 'Hamster Food', petType: 'hamster', price: '450', rating: 4.4, reviews: 2900, image: '/images/products/hamster-food.jpg'",
    new: "id: 'hamster-food', name: 'Vitapol Economic Food for Hamster (1.2 kg)', brand: 'Vitapol', category: 'food', subCategory: 'Hamster Food', petType: 'hamster', price: '399 - 549', rating: 4.4, reviews: 2900, image: 'https://m.media-amazon.com/images/I/61L7PxD8dEL._SL1500_.jpg'"
  },
  {
    old: "id: 'hamster-wheel', name: 'Savic Hamster Exercise Wheel (Medium)', brand: 'Savic', category: 'cages', subCategory: 'Hamster Wheel', petType: 'hamster', price: '399', rating: 4.0, reviews: 850, image: '/images/products/hamster-wheel.jpg'",
    new: "id: 'hamster-wheel', name: 'Savic Hamster Exercise Wheel (Medium)', brand: 'Savic', category: 'cages', subCategory: 'Hamster Wheel', petType: 'hamster', price: '349 - 599', rating: 4.0, reviews: 850, image: 'https://m.media-amazon.com/images/I/71iVm-MCpbL._SL1500_.jpg'"
  },
  {
    old: "id: 'goat-mineral', name: 'Intas Chelated Agrimin Forte Mineral Mixture (1 kg)', brand: 'Intas', category: 'feed', subCategory: 'Supplement', petType: 'goat', price: '250', rating: 4.3, reviews: 1200, image: '/images/products/goat-mineral.webp'",
    new: "id: 'goat-mineral', name: 'Intas Chelated Agrimin Forte Mineral Mixture (1 kg)', brand: 'Intas', category: 'feed', subCategory: 'Supplement', petType: 'goat', price: '199 - 349', rating: 4.3, reviews: 1200, image: 'https://m.media-amazon.com/images/I/61n0kFKZNNL._SL1200_.jpg'"
  },
  {
    old: "id: 'horse-ointment', name: 'Himalaya Himax Ointment for Animal Wound Care (50g)', brand: 'Himalaya', category: 'grooming', subCategory: 'Health', petType: 'horse', price: '100', rating: 4.5, reviews: 4100, image: '/images/products/horse-ointment.jpg'",
    new: "id: 'horse-ointment', name: 'Himalaya Himax Ointment for Animal Wound Care (50g)', brand: 'Himalaya', category: 'grooming', subCategory: 'Health', petType: 'horse', price: '85 - 150', rating: 4.5, reviews: 4100, image: 'https://m.media-amazon.com/images/I/61Pn8SwjzDL._SL1500_.jpg'"
  },
  {
    old: "id: 'horse-brush', name: 'Equine Premium Grooming Brush & Curry Comb Set', brand: 'Equine', category: 'grooming', subCategory: 'Brush', petType: 'horse', price: '899', rating: 4.2, reviews: 300, image: '/images/products/horse-brush.jpg'",
    new: "id: 'horse-brush', name: 'Equine Premium Grooming Brush & Curry Comb Set', brand: 'Equine', category: 'grooming', subCategory: 'Brush', petType: 'horse', price: '699 - 1,199', rating: 4.2, reviews: 300, image: 'https://m.media-amazon.com/images/I/71HVgWokzPL._SL1500_.jpg'"
  },
  {
    old: "id: 'cow-calcium', name: 'Virbac Ostovet Forte Liquid Calcium (5 Liters)', brand: 'Virbac', category: 'feed', subCategory: 'Supplement', petType: 'cow', price: '800', rating: 4.5, reviews: 2800, image: '/images/products/cow-calcium.jpg'",
    new: "id: 'cow-calcium', name: 'Virbac Ostovet Forte Liquid Calcium (5 Liters)', brand: 'Virbac', category: 'feed', subCategory: 'Supplement', petType: 'cow', price: '699 - 999', rating: 4.5, reviews: 2800, image: 'https://m.media-amazon.com/images/I/616pWWBGbGL._SL1500_.jpg'"
  },
  {
    old: "id: 'cow-digestion', name: 'Ayurvet Ruchamax Digestion Powder for Cattle (1 kg)', brand: 'Ayurvet', category: 'health', subCategory: 'Digestion', petType: 'cow', price: '350', rating: 4.3, reviews: 1500, image: '/images/products/cow-digestion.jpg'",
    new: "id: 'cow-digestion', name: 'Ayurvet Ruchamax Digestion Powder for Cattle (1 kg)', brand: 'Ayurvet', category: 'health', subCategory: 'Digestion', petType: 'cow', price: '299 - 449', rating: 4.3, reviews: 1500, image: 'https://m.media-amazon.com/images/I/71vr2k4peEL._SL1500_.jpg'"
  }
];

let fixed = 0;
for (const r of replacements) {
  if (code.includes(r.old)) {
    code = code.replace(r.old, r.new);
    fixed++;
    console.log(`Fixed: ${r.old.match(/id: '([^']+)'/)[1]}`);
  } else {
    console.log(`NOT FOUND: ${r.old.match(/id: '([^']+)'/)[1]}`);
  }
}

// ====================================================================
// 2. FIX: Category switch - replace dog/cat-only with full multi-animal
// ====================================================================

const oldCatSwitch = "const currentCategories = activePet === 'dog' ? DOG_CATEGORIES : CAT_CATEGORIES;";
const newCatSwitch = `let currentCategories;
  switch (activePet) {
    case 'dog': currentCategories = DOG_CATEGORIES; break;
    case 'cat': currentCategories = CAT_CATEGORIES; break;
    case 'bird': currentCategories = BIRD_CATEGORIES; break;
    case 'rabbit': currentCategories = RABBIT_CATEGORIES; break;
    case 'fish': currentCategories = FISH_CATEGORIES; break;
    case 'hamster': currentCategories = HAMSTER_CATEGORIES; break;
    case 'goat': currentCategories = GOAT_CATEGORIES; break;
    case 'horse': currentCategories = HORSE_CATEGORIES; break;
    case 'cow': currentCategories = COW_CATEGORIES; break;
    default: currentCategories = DOG_CATEGORIES;
  }`;

if (code.includes(oldCatSwitch)) {
  code = code.replace(oldCatSwitch, newCatSwitch);
  console.log('Fixed: Category switch statement');
} else {
  console.log('Category switch not found (may already be fixed)');
}

// ====================================================================
// 3. FIX: Hero subtitle - make it work for all animals
// ====================================================================

const PET_LABELS = {
  dog: 'loyal companion',
  cat: 'graceful feline',
  bird: 'feathered friend',
  rabbit: 'fluffy bunny',
  fish: 'aquatic beauty',
  hamster: 'tiny explorer',
  goat: 'farm buddy',
  horse: 'majestic steed',
  cow: 'gentle giant'
};

const oldSubtitle = `Premium essentials for your {activePet === 'dog' ? 'loyal companion' : 'graceful feline'}.`;
const newSubtitle = `Premium essentials for your {${JSON.stringify(PET_LABELS)}[activePet] || 'beloved pet'}.`;

if (code.includes(oldSubtitle)) {
  code = code.replace(oldSubtitle, newSubtitle);
  console.log('Fixed: Hero subtitle');
} else {
  console.log('Hero subtitle not found (may already be fixed)');
}

// ====================================================================
// 4. FIX: Also update pet type detection to support all animals  
// ====================================================================

const oldPetCheck = "if (firstPetType === 'cat' || firstPetType === 'dog') {";
const newPetCheck = "if (['dog','cat','bird','rabbit','fish','hamster','goat','horse','cow'].includes(firstPetType)) {";

if (code.includes(oldPetCheck)) {
  code = code.replace(oldPetCheck, newPetCheck);
  console.log('Fixed: Pet type detection');
} else {
  console.log('Pet type detection not found');
}

fs.writeFileSync(filePath, code);
console.log(`\nDone! Fixed ${fixed} product entries.`);
