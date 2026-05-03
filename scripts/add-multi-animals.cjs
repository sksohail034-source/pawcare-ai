const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/pages/ProductsPage.jsx');
let code = fs.readFileSync(filePath, 'utf8');

// 1. Add new imports
const newImports = `import { FaDove, FaFish, FaHorse, FaPaw } from 'react-icons/fa';`;
code = code.replace("import { GiDogBowl, GiCat, GiComb, GiTennisBall, GiFirstAidKit } from 'react-icons/gi';", "import { GiDogBowl, GiCat, GiComb, GiTennisBall, GiFirstAidKit } from 'react-icons/gi';\n" + newImports);

// 2. Add New Categories
const newCategories = `
const BIRD_CATEGORIES = [
  { id: 'food', name: 'Bird Food & Seeds', icon: <GiDogBowl /> },
  { id: 'cages', name: 'Cages & Accessories', icon: <FiHome /> },
  { id: 'toys', name: 'Toys & Feeders', icon: <GiTennisBall /> }
];

const RABBIT_CATEGORIES = [
  { id: 'food', name: 'Hay & Pellets', icon: <GiDogBowl /> },
  { id: 'cages', name: 'Cages & Bedding', icon: <FiHome /> },
  { id: 'grooming', name: 'Grooming & Toys', icon: <GiComb /> }
];

const FISH_CATEGORIES = [
  { id: 'food', name: 'Fish Food', icon: <GiDogBowl /> },
  { id: 'aquarium', name: 'Aquarium & Filters', icon: <FiBox /> },
  { id: 'accessories', name: 'Decor & Accessories', icon: <FiTag /> }
];

const HAMSTER_CATEGORIES = [
  { id: 'food', name: 'Hamster Food', icon: <GiDogBowl /> },
  { id: 'cages', name: 'Cages & Wheels', icon: <FiActivity /> },
  { id: 'bedding', name: 'Bedding', icon: <FiBox /> }
];

const GOAT_CATEGORIES = [
  { id: 'feed', name: 'Goat Feed & Supplements', icon: <GiDogBowl /> },
  { id: 'grooming', name: 'Grooming & Health', icon: <GiFirstAidKit /> },
  { id: 'accessories', name: 'Accessories', icon: <FiTag /> }
];

const HORSE_CATEGORIES = [
  { id: 'feed', name: 'Horse Feed & Supplements', icon: <GiDogBowl /> },
  { id: 'grooming', name: 'Grooming & Hoof Care', icon: <GiComb /> },
  { id: 'accessories', name: 'Saddles & Gear', icon: <FiBriefcase /> }
];

const COW_CATEGORIES = [
  { id: 'feed', name: 'Cattle Feed & Minerals', icon: <GiDogBowl /> },
  { id: 'health', name: 'Health & Supplements', icon: <GiFirstAidKit /> },
  { id: 'equipment', name: 'Milking Equipment', icon: <FiBox /> }
];
`;

code = code.replace("const STORE_THEMES = {", newCategories + "\nconst STORE_THEMES = {");

// 3. Update STORE_THEMES
const updatedThemes = `const STORE_THEMES = {
  dog: {
    heroImage: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=1600&q=80',
    position: 'center 30%'
  },
  cat: {
    heroImage: 'https://images.unsplash.com/photo-1592194996308-7b43878e84a6?w=1600&q=80',
    position: 'center 40%'
  },
  bird: {
    heroImage: 'https://images.unsplash.com/photo-1552728089-571ebd6a45cb?w=1600&q=80',
    position: 'center 30%'
  },
  rabbit: {
    heroImage: 'https://images.unsplash.com/photo-1585110396000-c9fd4e4e5030?w=1600&q=80',
    position: 'center 40%'
  },
  fish: {
    heroImage: 'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?w=1600&q=80',
    position: 'center 50%'
  },
  hamster: {
    heroImage: 'https://images.unsplash.com/photo-1425082661705-1834bfddef6d?w=1600&q=80',
    position: 'center 50%'
  },
  goat: {
    heroImage: 'https://images.unsplash.com/photo-1524024973431-2ad916746881?w=1600&q=80',
    position: 'center 60%'
  },
  horse: {
    heroImage: 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=1600&q=80',
    position: 'center 40%'
  },
  cow: {
    heroImage: 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?w=1600&q=80',
    position: 'center 50%'
  }
};`;

code = code.replace(/const STORE_THEMES = \{[\s\S]*?cat: \{[\s\S]*?\}[\s\S]*?\};/, updatedThemes);

// 4. Update the Pet Type Selector UI inside the component
const newPetSelector = `
        {/* Pet Type Selector */}
        <div style={{ display: 'flex', gap: '0.8rem', overflowX: 'auto', paddingBottom: '1rem', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {[
            { id: 'dog', name: 'DOG', icon: <GiDogBowl size={24} /> },
            { id: 'cat', name: 'CAT', icon: <GiCat size={24} /> },
            { id: 'bird', name: 'BIRD', icon: <FaDove size={24} /> },
            { id: 'rabbit', name: 'RABBIT', icon: <FaPaw size={24} /> },
            { id: 'fish', name: 'FISH', icon: <FaFish size={24} /> },
            { id: 'hamster', name: 'HAMSTER', icon: <FaPaw size={24} /> },
            { id: 'goat', name: 'GOAT', icon: <FaPaw size={24} /> },
            { id: 'horse', name: 'HORSE', icon: <FaHorse size={24} /> },
            { id: 'cow', name: 'COW', icon: <FaPaw size={24} /> }
          ].map((pet) => (
            <button 
              key={pet.id}
              onClick={() => handlePetChange(pet.id)}
              style={{
                flex: '0 0 auto',
                padding: '1rem',
                minWidth: '110px',
                borderRadius: '20px',
                border: '2px solid',
                borderColor: activePet === pet.id ? '#22c55e' : 'transparent',
                background: activePet === pet.id ? '#fff' : '#f1f5f9',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.5rem',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: activePet === pet.id ? '0 10px 20px rgba(34, 197, 94, 0.1)' : 'none',
                color: activePet === pet.id ? '#22c55e' : '#64748b'
              }}
            >
              {pet.icon}
              <span style={{ fontWeight: '800', color: activePet === pet.id ? '#1f2937' : '#64748b', fontSize: '0.85rem' }}>{pet.name}</span>
            </button>
          ))}
        </div>`;

const petSelectorRegex = /\{\/\* Pet Type Selector \*\/\}[\s\S]*?\{\/\* Section Header \*\/\}/;
code = code.replace(petSelectorRegex, newPetSelector + "\n\n        {/* Section Header */}");

// 5. Update Switch statement in ProductsPage component for categories
const switchStatementRegex = /switch \(activePet\) \{[\s\S]*?default:\s*currentCategories = DOG_CATEGORIES;\s*\}/;
const newSwitchStatement = `switch (activePet) {
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
code = code.replace(switchStatementRegex, newSwitchStatement);

// 6. Append new products to CURATED_PRODUCTS array
const newProductsString = `
  // ============================================================
  // MULTI-ANIMAL CATALOG (Bird, Rabbit, Fish, etc.)
  // ============================================================
  {
    id: 'boltz-bird-food',
    name: 'Boltz Bird Food for Budgies (1.2 kg)',
    brand: 'Boltz',
    category: 'food',
    subCategory: 'Bird Food',
    petType: 'bird',
    price: '299',
    rating: 4.3,
    reviews: 12500,
    image: 'https://m.media-amazon.com/images/I/71u9sJqP64L._AC_SL1500_.jpg',
    badge: 'Best Seller',
    desc: 'Premium seed mix tailored for Budgies to boost immunity and maintain healthy feathers.',
    benefits: ['100% Natural', 'High in vitamins', 'Easily digestible'],
    affiliateUrl: 'https://www.amazon.in/s?k=Boltz+Bird+Food+for+Budgies+1.2kg&tag=mypawcare-21'
  },
  {
    id: 'vitapol-bird-treat',
    name: 'Vitapol Smakers for Cockatiel (Fruit Flavor)',
    brand: 'Vitapol',
    category: 'toys',
    subCategory: 'Bird Treat',
    petType: 'bird',
    price: '399',
    rating: 4.5,
    reviews: 3200,
    image: 'https://m.media-amazon.com/images/I/71G1P6Q2G4L._SL1500_.jpg',
    badge: 'Amazon Choice',
    desc: 'Nutritious fruit treat sticks that encourage natural foraging behavior.',
    benefits: ['Rich in natural fruits', 'Wooden stick included', 'Promotes active foraging'],
    affiliateUrl: 'https://www.amazon.in/s?k=Vitapol+Smakers+for+Cockatiel&tag=mypawcare-21'
  },
  {
    id: 'bird-cage',
    name: 'Jainsons Pet Products Medium Bird Cage',
    brand: 'Jainsons',
    category: 'cages',
    subCategory: 'Bird Cage',
    petType: 'bird',
    price: '899',
    rating: 4.1,
    reviews: 1800,
    image: 'https://m.media-amazon.com/images/I/71gV4X6QfLL._SL1500_.jpg',
    badge: 'Top Rated',
    desc: 'Spacious wire cage with feeding bowls and perches.',
    benefits: ['Anti-rust coating', 'Includes feeding bowls', 'Removable bottom tray'],
    affiliateUrl: 'https://www.amazon.in/s?k=Jainsons+Pet+Products+Medium+Bird+Cage&tag=mypawcare-21'
  },
  {
    id: 'vitapol-rabbit-food',
    name: 'Vitapol Economic Food for Rabbit (1.2 kg)',
    brand: 'Vitapol',
    category: 'food',
    subCategory: 'Rabbit Pellets',
    petType: 'rabbit',
    price: '450',
    rating: 4.4,
    reviews: 4100,
    image: 'https://m.media-amazon.com/images/I/71lR4k5aY6L._SL1500_.jpg',
    badge: 'Best Seller',
    desc: 'A balanced everyday diet consisting of high-quality pellets.',
    benefits: ['High fiber content', 'Helps wear teeth down', 'Enriched with vitamins'],
    affiliateUrl: 'https://www.amazon.in/s?k=Vitapol+Economic+Food+for+Rabbit+1.2kg&tag=mypawcare-21'
  },
  {
    id: 'rabbit-hay',
    name: 'Boltz Premium Timothy Hay for Rabbits (400g)',
    brand: 'Boltz',
    category: 'food',
    subCategory: 'Rabbit Hay',
    petType: 'rabbit',
    price: '399',
    rating: 4.2,
    reviews: 2500,
    image: 'https://m.media-amazon.com/images/I/81xU-aG+q6L._SL1500_.jpg',
    badge: 'Amazon Choice',
    desc: 'Sun-cured Timothy hay providing essential roughage.',
    benefits: ['100% natural hay', 'Prevents obesity', 'High fiber'],
    affiliateUrl: 'https://www.amazon.in/s?k=Boltz+Premium+Timothy+Hay+for+Rabbits&tag=mypawcare-21'
  },
  {
    id: 'taiyo-fish-food',
    name: 'Taiyo Pluss Discovery Special Fish Food (1 kg)',
    brand: 'Taiyo',
    category: 'food',
    subCategory: 'Fish Food',
    petType: 'fish',
    price: '350',
    rating: 4.2,
    reviews: 15800,
    image: 'https://m.media-amazon.com/images/I/61gR21T39NL._SL1000_.jpg',
    badge: 'Best Seller',
    desc: 'Highly nutritious daily diet formulated with color-enhancing ingredients.',
    benefits: ['Does not cloud water', 'Spirulina added', 'Promotes rapid growth'],
    affiliateUrl: 'https://www.amazon.in/s?k=Taiyo+Pluss+Discovery+Special+Fish+Food+1kg&tag=mypawcare-21'
  },
  {
    id: 'sobo-filter',
    name: 'SOBO WP-1050F Internal Aquarium Filter Pump',
    brand: 'SOBO',
    category: 'aquarium',
    subCategory: 'Filter',
    petType: 'fish',
    price: '299',
    rating: 4.0,
    reviews: 5500,
    image: 'https://m.media-amazon.com/images/I/61z+H3P7t1L._SL1500_.jpg',
    badge: 'Amazon Choice',
    desc: 'Silent and highly efficient internal water filter.',
    benefits: ['Mechanical filtration', 'Easy to install', 'Energy efficient'],
    affiliateUrl: 'https://www.amazon.in/s?k=SOBO+WP-1050F+Internal+Aquarium+Filter&tag=mypawcare-21'
  },
  {
    id: 'seachem-prime',
    name: 'Seachem Prime Water Conditioner (100 ml)',
    brand: 'Seachem',
    category: 'aquarium',
    subCategory: 'Conditioner',
    petType: 'fish',
    price: '599',
    rating: 4.7,
    reviews: 4200,
    image: 'https://m.media-amazon.com/images/I/61P1P8N8+7L._SL1500_.jpg',
    badge: 'Premium',
    desc: 'Ultimate concentrated conditioner that safely removes chlorine.',
    benefits: ['Detoxifies ammonia', 'Promotes slime coat', 'Highly concentrated'],
    affiliateUrl: 'https://www.amazon.in/s?k=Seachem+Prime+Water+Conditioner+100ml&tag=mypawcare-21'
  },
  {
    id: 'hamster-food',
    name: 'Vitapol Economic Food for Hamster (1.2 kg)',
    brand: 'Vitapol',
    category: 'food',
    subCategory: 'Hamster Food',
    petType: 'hamster',
    price: '450',
    rating: 4.4,
    reviews: 2900,
    image: 'https://m.media-amazon.com/images/I/71Q3Xq1j8uL._SL1500_.jpg',
    badge: 'Best Seller',
    desc: 'Carefully formulated blend of grains and dried veggies.',
    benefits: ['Complete nutrition', 'Controls tooth growth', 'Natural ingredients'],
    affiliateUrl: 'https://www.amazon.in/s?k=Vitapol+Economic+Food+for+Hamster&tag=mypawcare-21'
  },
  {
    id: 'hamster-wheel',
    name: 'Savic Hamster Exercise Wheel (Medium)',
    brand: 'Savic',
    category: 'cages',
    subCategory: 'Hamster Wheel',
    petType: 'hamster',
    price: '399',
    rating: 4.0,
    reviews: 850,
    image: 'https://m.media-amazon.com/images/I/61H4h4F7R1L._SL1000_.jpg',
    badge: 'Trending',
    desc: 'Silent, smooth-spinning exercise wheel.',
    benefits: ['Solid running surface', 'Whisper-quiet', 'Easily attaches to cage'],
    affiliateUrl: 'https://www.amazon.in/s?k=Savic+Hamster+Exercise+Wheel&tag=mypawcare-21'
  },
  {
    id: 'goat-mineral',
    name: 'Intas Chelated Agrimin Forte Mineral Mixture (1 kg)',
    brand: 'Intas',
    category: 'feed',
    subCategory: 'Supplement',
    petType: 'goat',
    price: '250',
    rating: 4.3,
    reviews: 1200,
    image: 'https://m.media-amazon.com/images/I/71X8k4j3LSL._SL1500_.jpg',
    badge: 'Best Seller',
    desc: 'High-quality chelated mineral mixture to improve health.',
    benefits: ['Enhances fertility', 'Prevents deficiency', 'Improves immunity'],
    affiliateUrl: 'https://www.amazon.in/s?k=Intas+Chelated+Agrimin+Forte+Mineral+Mixture&tag=mypawcare-21'
  },
  {
    id: 'horse-ointment',
    name: 'Himalaya Himax Ointment for Animal Wound Care (50g)',
    brand: 'Himalaya',
    category: 'grooming',
    subCategory: 'Health',
    petType: 'horse',
    price: '100',
    rating: 4.5,
    reviews: 4100,
    image: 'https://m.media-amazon.com/images/I/51wX5C9jLWL._SL1000_.jpg',
    badge: 'Best Seller',
    desc: 'Broad-spectrum antifungal herbal ointment.',
    benefits: ['Fast healing', 'Fly-repellent', 'Herbal formula'],
    affiliateUrl: 'https://www.amazon.in/s?k=Himalaya+Himax+Ointment+for+Animal+Wound+Care&tag=mypawcare-21'
  },
  {
    id: 'horse-brush',
    name: 'Equine Premium Grooming Brush & Curry Comb Set',
    brand: 'Equine',
    category: 'grooming',
    subCategory: 'Brush',
    petType: 'horse',
    price: '899',
    rating: 4.2,
    reviews: 300,
    image: 'https://m.media-amazon.com/images/I/71k4QYjY51L._SL1500_.jpg',
    badge: 'Premium',
    desc: 'Comprehensive horse grooming kit.',
    benefits: ['Removes deep mud', 'Stimulates natural oils', 'Ergonomic grip'],
    affiliateUrl: 'https://www.amazon.in/s?k=Equine+Premium+Grooming+Brush+Set&tag=mypawcare-21'
  },
  {
    id: 'cow-calcium',
    name: 'Virbac Ostovet Forte Liquid Calcium (5 Liters)',
    brand: 'Virbac',
    category: 'feed',
    subCategory: 'Supplement',
    petType: 'cow',
    price: '800',
    rating: 4.5,
    reviews: 2800,
    image: 'https://m.media-amazon.com/images/I/71e9u1j3o1L._SL1500_.jpg',
    badge: 'Best Seller',
    desc: 'High-performance liquid calcium to maximize milk yield.',
    benefits: ['Increases milk production', 'Prevents milk fever', 'Fortified with Vitamin D3'],
    affiliateUrl: 'https://www.amazon.in/s?k=Virbac+Ostovet+Forte+Liquid+Calcium+5+Liters&tag=mypawcare-21'
  },
  {
    id: 'cow-digestion',
    name: 'Ayurvet Ruchamax Digestion Powder for Cattle (1 kg)',
    brand: 'Ayurvet',
    category: 'health',
    subCategory: 'Digestion',
    petType: 'cow',
    price: '350',
    rating: 4.3,
    reviews: 1500,
    image: 'https://m.media-amazon.com/images/I/71Yv3P0xMML._SL1500_.jpg',
    badge: 'Amazon Choice',
    desc: 'Natural herbal digestive stimulant.',
    benefits: ['Treats indigestion', 'Normalizes rumen pH', 'Increases feed intake'],
    affiliateUrl: 'https://www.amazon.in/s?k=Ayurvet+Ruchamax+Digestion+Powder&tag=mypawcare-21'
  }
];`;

code = code.replace("];\n\nexport default function ProductsPage()", newProductsString + "\n\nexport default function ProductsPage()");

fs.writeFileSync(filePath, code);
console.log("Successfully updated ProductsPage.jsx");
