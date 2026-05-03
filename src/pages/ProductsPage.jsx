import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiSearch, FiShoppingCart, FiChevronRight, FiGrid, FiBox, FiActivity, FiTruck, FiHeart, FiTag, FiHome, FiBriefcase } from 'react-icons/fi';
import { GiDogBowl, GiCat, GiComb, GiTennisBall, GiFirstAidKit } from 'react-icons/gi';
import { FaDove, FaFish, FaHorse, FaPaw } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { api } from '../api';

const DOG_CATEGORIES = [
  { id: 'food', name: 'Food & Nutrition', icon: <GiDogBowl /> },
  { id: 'grooming', name: 'Grooming & Hygiene', icon: <GiComb /> },
  { id: 'toys', name: 'Toys & Entertainment', icon: <GiTennisBall /> },
  { id: 'accessories', name: 'Accessories', icon: <FiTag /> },
  { id: 'essentials', name: 'Daily Use Essentials', icon: <FiBox /> },
  { id: 'travel', name: 'Travel & Outdoor', icon: <FiTruck /> },
  { id: 'health', name: 'Health & Care', icon: <GiFirstAidKit /> }
];

const CAT_CATEGORIES = [
  { id: 'food', name: 'Food & Nutrition', icon: <GiDogBowl /> },
  { id: 'grooming', name: 'Grooming & Hygiene', icon: <GiComb /> },
  { id: 'toys', name: 'Toys & Entertainment', icon: <GiTennisBall /> },
  { id: 'accessories', name: 'Accessories', icon: <FiTag /> },
  { id: 'essentials', name: 'Daily Use Essentials', icon: <FiBox /> },
  { id: 'furniture', name: 'Furniture & Activity', icon: <FiHome /> },
  { id: 'travel', name: 'Travel', icon: <FiBriefcase /> },
  { id: 'health', name: 'Health & Care', icon: <GiFirstAidKit /> }
];


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

const STORE_THEMES = {
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
};

// ============================================================
// DOG â†’ FOOD & NUTRITION â€” Complete Product Catalog
// Tracking ID: mypawcare-21
// All products from amazon.in, 4â˜…+ rated, best-sellers
// ============================================================
const CURATED_PRODUCTS = [
  // â”€â”€â”€ 1. DRY DOG FOOD (Puppy) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    id: 'rc-mini-puppy',
    name: 'Royal Canin Mini Puppy Dry Dog Food (800g)',
    brand: 'Royal Canin',
    category: 'food',
    subCategory: 'Dry Food - Puppy',
    petType: 'dog',
    price: '719 - 1,019',
    rating: 4.4,
    reviews: 9185,
    image: '/images/products/rc-mini-puppy.png',
    badge: 'Vet Recommended',
    desc: 'Supports immune system & digestive health. Specialized formula for small breed puppies with natural defence nutrients.',
    benefits: ['Boosts natural immunity', 'Supports healthy digestion', 'Perfect for small breed puppies'],
    affiliateUrl: 'https://amzn.to/3QJGyL2'
  },
  {
    id: 'drools-puppy-chicken',
    name: 'Drools Puppy Dry Dog Food, Chicken & Egg (3kg)',
    brand: 'Drools',
    category: 'food',
    subCategory: 'Dry Food - Puppy',
    petType: 'dog',
    price: '449 - 749',
    rating: 4.3,
    reviews: 52890,
    image: '/images/products/drools-puppy-chicken.png',
    badge: 'Best Seller',
    desc: 'Real chicken & egg for strong muscles and shiny coat. India\'s most trusted puppy food brand.',
    benefits: ['Real chicken as #1 ingredient', 'Omega fatty acids for coat', 'Supports bone & teeth growth'],
    affiliateUrl: 'https://www.amazon.in/dp/B07HBFY5VJ?tag=mypawcare-21'
  },

  // â”€â”€â”€ 2. DRY DOG FOOD (Adult) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    id: 'pedigree-adult-chicken',
    name: 'Pedigree Adult Dry Dog Food, Chicken & Vegetables (3kg)',
    brand: 'Pedigree',
    category: 'food',
    subCategory: 'Dry Food - Adult',
    petType: 'dog',
    price: '529 - 829',
    rating: 4.4,
    reviews: 24999,
    image: '/images/products/pedigree-adult-chicken.png',
    badge: 'Best Seller',
    desc: 'Complete & balanced nutrition with 37 essential nutrients. Supports muscles, digestion & shiny coat.',
    benefits: ['37 essential nutrients', 'High-quality protein for muscles', 'Omega-6 & zinc for shiny coat'],
    affiliateUrl: 'https://www.amazon.in/dp/B00LHS8I3A?tag=mypawcare-21'
  },
  {
    id: 'drools-adult-chicken',
    name: 'Drools Adult Dry Dog Food, Chicken & Egg (3kg)',
    brand: 'Drools',
    category: 'food',
    subCategory: 'Dry Food - Adult',
    petType: 'dog',
    price: '449 - 599',
    rating: 4.3,
    reviews: 78650,
    image: '/images/products/drools-adult-chicken.png',
    badge: 'Amazon Choice',
    desc: 'India\'s #1 selling dog food. Real chicken & egg protein for active adult dogs.',
    benefits: ['Real chicken protein', 'Calcium for strong bones', 'No artificial flavors'],
    affiliateUrl: 'https://www.amazon.in/dp/B07HBMB3WW?tag=mypawcare-21'
  },
  {
    id: 'rc-medium-adult',
    name: 'Royal Canin Medium Adult Dry Dog Food (4kg)',
    brand: 'Royal Canin',
    category: 'food',
    subCategory: 'Dry Food - Adult',
    petType: 'dog',
    price: '2,239 - 2,839',
    rating: 4.5,
    reviews: 11230,
    image: '/images/products/rc-medium-adult.png',
    badge: 'Premium',
    desc: 'Tailored nutrition for medium breed adults (11-25kg). Supports skin health & optimal weight.',
    benefits: ['Breed-specific formula', 'Skin & coat nourishment', 'Digestive care prebiotics'],
    affiliateUrl: 'https://www.amazon.in/s?k=Royal+Canin+Medium+Adult+Dry+Dog+Food+4kg&tag=mypawcare-21'
  },

  // â”€â”€â”€ 3. DRY DOG FOOD (Senior) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    id: 'rc-maxi-ageing',
    name: 'Royal Canin Maxi Ageing 8+ Dry Dog Food (3kg)',
    brand: 'Royal Canin',
    category: 'food',
    subCategory: 'Dry Food - Senior',
    petType: 'dog',
    price: '1,989 - 2,589',
    rating: 4.4,
    reviews: 3250,
    image: '/images/products/rc-maxi-ageing.png',
    badge: 'Premium',
    desc: 'Specially formulated for senior large breed dogs 8+. Joint support & vitality boost.',
    benefits: ['Joint health with glucosamine', 'Easy to chew kibble', 'Antioxidant complex for vitality'],
    affiliateUrl: 'https://www.amazon.in/s?k=Royal+Canin+Maxi+Ageing+8%2B+Senior+Dog+Food&tag=mypawcare-21'
  },

  // â”€â”€â”€ 4. WET DOG FOOD (Gravy / Chunks) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    id: 'pedigree-wet-chicken-gravy',
    name: 'Pedigree Adult Wet Dog Food, Chicken & Liver Chunks in Gravy (70g x 15)',
    brand: 'Pedigree',
    category: 'food',
    subCategory: 'Wet Food - Gravy',
    petType: 'dog',
    price: '429 - 729',
    rating: 4.3,
    reviews: 18540,
    image: '/images/products/pedigree-wet-gravy.png',
    badge: 'Best Seller',
    desc: 'Delicious chicken & liver chunks in rich gravy. Perfect topper or standalone meal for picky eaters.',
    benefits: ['Rich gravy dogs love', 'Easy to mix with dry food', 'No artificial colors'],
    affiliateUrl: 'https://www.amazon.in/dp/B0849982T8?tag=mypawcare-21'
  },
  {
    id: 'drools-wet-chicken-gravy',
    name: 'Drools Adult Wet Dog Food, Real Chicken & Liver Chunks (150g x 6)',
    brand: 'Drools',
    category: 'food',
    subCategory: 'Wet Food - Gravy',
    petType: 'dog',
    price: '509 - 809',
    rating: 4.3,
    reviews: 9264,
    image: '/images/products/drools-wet-gravy.png',
    badge: 'Trending',
    desc: 'Juicy real chicken chunks in thick gravy. Grain-free wet food for all dog breeds.',
    benefits: ['100% real chicken', 'Healthy skin & coat', 'Stronger bones & teeth'],
    affiliateUrl: 'https://www.amazon.in/dp/B0CFLRSTY6?tag=mypawcare-21'
  },

  // â”€â”€â”€ 5. GRAIN-FREE DOG FOOD â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    id: 'drools-grain-free',
    name: 'Drools Grain Free Adult Dog Food, Chicken & Sweet Potato (3kg)',
    brand: 'Drools',
    category: 'food',
    subCategory: 'Grain-Free',
    petType: 'dog',
    price: '899 - 1,499',
    rating: 4.2,
    reviews: 5680,
    image: '/images/products/drools-grain-free.png',
    badge: 'Top Rated',
    desc: '100% grain-free with sweet potato carbs. Ideal for dogs with grain sensitivities.',
    benefits: ['Zero grains, gluten-free', 'Sweet potato for energy', 'Easy on sensitive stomachs'],
    affiliateUrl: 'https://www.amazon.in/s?k=Drools+Grain+Free+Dog+Food+Chicken&tag=mypawcare-21'
  },

  // â”€â”€â”€ 6. HIGH PROTEIN DOG FOOD â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    id: 'gooddog-adult-high-protein',
    name: 'Good Dog Adult Dry Dog Food, Real Chicken & Eggs (8kg)',
    brand: 'Good Dog',
    category: 'food',
    subCategory: 'High Protein',
    petType: 'dog',
    price: '1,299 - 1,899',
    rating: 4.2,
    reviews: 3450,
    image: '/images/products/gooddog-high-protein.png',
    badge: 'Trending',
    desc: 'Oven-baked high-protein formula with real chicken & eggs. Human-grade ingredients with Indian herbs.',
    benefits: ['High protein for muscles', 'Oven-baked for taste', 'Human-grade ingredients'],
    affiliateUrl: 'https://www.amazon.in/s?k=Good+Dog+by+Drools+Adult+Dry+Dog+Food+Chicken+Eggs&tag=mypawcare-21'
  },
  {
    id: 'drools-focus-hp',
    name: 'Drools Focus Super Premium Dog Food, All Breed (4kg)',
    brand: 'Drools',
    category: 'food',
    subCategory: 'High Protein',
    petType: 'dog',
    price: '1,049 - 1,649',
    rating: 4.3,
    reviews: 7890,
    image: '/images/products/drools-focus-hp.png',
    badge: 'Top Rated',
    desc: 'Super premium high-protein food with 26% protein. For active & performance dogs.',
    benefits: ['26% crude protein', 'Omega 3 & 6 fatty acids', 'Prebiotics for gut health'],
    affiliateUrl: 'https://www.amazon.in/s?k=Drools+Focus+Super+Premium+Dog+Food+Adult&tag=mypawcare-21'
  },

  // â”€â”€â”€ 7. DOG TREATS (Training Treats, Chew Sticks) â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    id: 'pedigree-meat-jerky',
    name: 'Pedigree Meat Jerky Stix, Grilled Liver (4 x 60g)',
    brand: 'Pedigree',
    category: 'food',
    subCategory: 'Treats & Chew Sticks',
    petType: 'dog',
    price: '339 - 489',
    rating: 4.3,
    reviews: 14650,
    image: '/images/products/pedigree-meat-jerky.png',
    badge: 'Best Seller',
    desc: 'Smoky grilled liver flavor dogs go crazy for. Perfect as training reward or snack.',
    benefits: ['Irresistible smoky flavor', 'Great for training', 'Rich in protein'],
    affiliateUrl: 'https://www.amazon.in/dp/B07QWRLQWV?tag=mypawcare-21'
  },
  {
    id: 'himalaya-healthy-treats',
    name: 'Himalaya Healthy Treats, Puppy Chicken Flavor (4 x 80g)',
    brand: 'Himalaya',
    category: 'food',
    subCategory: 'Treats & Chew Sticks',
    petType: 'dog',
    price: '319 - 469',
    rating: 4.2,
    reviews: 6780,
    image: '/images/products/himalaya-healthy-treats.png',
    badge: 'Top Rated',
    desc: 'Natural chicken treats with no artificial preservatives. Ideal for training puppies.',
    benefits: ['Natural ingredients', 'No preservatives', 'Soft & chewy texture'],
    affiliateUrl: 'https://www.amazon.in/s?k=Himalaya+Healthy+Treats+Puppy+Chicken+Flavor&tag=mypawcare-21'
  },
  {
    id: 'purepet-chew-sticks',
    name: 'Purepet Mutton Flavour Munchy Sticks (400g)',
    brand: 'Purepet',
    category: 'food',
    subCategory: 'Treats & Chew Sticks',
    petType: 'dog',
    price: '149 - 299',
    rating: 4.1,
    reviews: 21340,
    image: '/images/products/purepet-chew-sticks.png',
    badge: 'Best Seller',
    desc: 'Budget-friendly munchy sticks dogs love to chew. Perfect boredom buster & jaw exerciser.',
    benefits: ['Long-lasting chew', 'Strengthens jaw muscles', 'Budget-friendly treat'],
    affiliateUrl: 'https://www.amazon.in/dp/B07S5V9J4L?tag=mypawcare-21'
  },

  // â”€â”€â”€ 8. DOG BISCUITS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    id: 'pedigree-biscrok',
    name: 'Pedigree Biscrok Biscuits, Above 6 Months (500g)',
    brand: 'Pedigree',
    category: 'food',
    subCategory: 'Dog Biscuits',
    petType: 'dog',
    price: '119 - 269',
    rating: 4.3,
    reviews: 18790,
    image: '/images/products/pedigree-biscrok.png',
    badge: 'Best Seller',
    desc: 'Crunchy biscuits in 3 shapes. A tasty & wholesome reward for good behavior.',
    benefits: ['Calcium for strong bones', '3 delicious shapes', 'Perfect training reward'],
    affiliateUrl: 'https://www.amazon.in/dp/B07S9661LC?tag=mypawcare-21'
  },
  {
    id: 'drools-biscuits',
    name: 'Drools Absolute Calcium Biscuits, Dog Supplement (800g)',
    brand: 'Drools',
    category: 'food',
    subCategory: 'Dog Biscuits',
    petType: 'dog',
    price: '239 - 389',
    rating: 4.2,
    reviews: 24560,
    image: '/images/products/drools-calcium-biscuits.jpg',
    badge: 'Amazon Choice',
    desc: 'Calcium-enriched bone-shaped biscuits. Delicious treat that doubles as a bone supplement.',
    benefits: ['Calcium enriched', 'Supports bone health', 'Tasty bone shape'],
    affiliateUrl: 'https://www.amazon.in/dp/B01N79QA99?tag=mypawcare-21'
  },

  // â”€â”€â”€ 9. DENTAL CHEWS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    id: 'pedigree-dentastix',
    name: 'Pedigree Dentastix, Oral Care for Adult Dogs (10 Sticks)',
    brand: 'Pedigree',
    category: 'food',
    subCategory: 'Dental Chews',
    petType: 'dog',
    price: '219 - 369',
    rating: 4.3,
    reviews: 12450,
    image: '/images/products/pedigree-dentastix.png',
    badge: 'Best Seller',
    desc: 'Clinically proven X-shape design reduces plaque & tartar up to 80%. Daily dental care made easy.',
    benefits: ['Reduces tartar up to 80%', 'Freshens breath', 'Vet recommended daily'],
    affiliateUrl: 'https://www.amazon.in/dp/B014PCXPI2?tag=mypawcare-21'
  },
  {
    id: 'pedigree-dentastix-fresh',
    name: 'Pedigree Dentastix Fresh, Green Tea (7 Sticks, Medium)',
    brand: 'Pedigree',
    category: 'food',
    subCategory: 'Dental Chews',
    petType: 'dog',
    price: '149 - 299',
    rating: 4.2,
    reviews: 8900,
    image: '/images/products/pedigree-dentastix-fresh.jpg',
    badge: 'Trending',
    desc: 'Green tea extract for extra fresh breath. Triple-action cleaning for healthier gums.',
    benefits: ['Green tea for freshness', 'Triple-action clean', 'Low fat daily chew'],
    affiliateUrl: 'https://www.amazon.in/s?k=Pedigree+Dentastix+Fresh+Green+Tea+Dog&tag=mypawcare-21'
  },

  // â”€â”€â”€ 10. DOG SUPPLEMENTS (Calcium, Vitamins, Omega-3) â”€â”€â”€â”€â”€
  {
    id: 'drools-calcium-tabs',
    name: 'Drools Absolute Calcium Tablets, Dog Supplement (50 pcs)',
    brand: 'Drools',
    category: 'food',
    subCategory: 'Supplements - Calcium',
    petType: 'dog',
    price: '349 - 499',
    rating: 4.2,
    reviews: 15670,
    image: '/images/products/drools-calcium-tabs.jpg',
    badge: 'Best Seller',
    desc: 'Essential calcium & phosphorus tablets for strong bones and teeth in dogs of all ages.',
    benefits: ['Strengthens bones & teeth', 'Prevents calcium deficiency', 'Easy to feed tablets'],
    affiliateUrl: 'https://www.amazon.in/dp/B01IEXX3G2?tag=mypawcare-21'
  },
  {
    id: 'himalaya-multivit',
    name: 'Himalaya Immunol, Immunity Booster for Dogs (60 Tabs)',
    brand: 'Himalaya',
    category: 'food',
    subCategory: 'Supplements - Multivitamin',
    petType: 'dog',
    price: '219 - 369',
    rating: 4.3,
    reviews: 5430,
    image: '/images/products/himalaya-multivit.jpeg',
    badge: 'Top Rated',
    desc: 'Natural immunity booster with herbal ingredients. Strengthens your dog\'s immune response.',
    benefits: ['Natural herbal formula', 'Boosts immune system', 'Trusted veterinary brand'],
    affiliateUrl: 'https://www.amazon.in/dp/B003V60M3W?tag=mypawcare-21'
  },
  {
    id: 'drools-skin-coat',
    name: 'Drools Absolute Skin & Coat Supplement, Omega 3 (50 Tabs)',
    brand: 'Drools',
    category: 'food',
    subCategory: 'Supplements - Omega-3',
    petType: 'dog',
    price: '399 - 549',
    rating: 4.1,
    reviews: 9870,
    image: '/images/products/drools-skin-coat.png',
    badge: 'Trending',
    desc: 'Omega-3 & biotin tablets for a lustrous coat and healthy skin. Reduces shedding visibly.',
    benefits: ['Rich in Omega-3 fatty acids', 'Reduces excessive shedding', 'Promotes shiny coat'],
    affiliateUrl: 'https://www.amazon.in/dp/B01IEXX58S?tag=mypawcare-21'
  },
  {
    id: 'petvit-multivitamin',
    name: 'Petvit Multivitamin & Multimineral, for Dogs (60 Tabs)',
    brand: 'Petvit',
    category: 'food',
    subCategory: 'Supplements - Multivitamin',
    petType: 'dog',
    price: '299 - 449',
    rating: 4.0,
    reviews: 4120,
    image: '/images/products/petvit-multivitamin.jpg',
    badge: 'Top Rated',
    desc: 'Complete 18-in-1 multivitamin with minerals, biotin & taurine. Daily health insurance for your dog.',
    benefits: ['18 vitamins & minerals', 'Biotin for skin & coat', 'Taurine for heart health'],
    affiliateUrl: 'https://www.amazon.in/dp/B08YJMVVY5?tag=mypawcare-21'
  },

  // ============================================================
  // DOG → GROOMING & HYGIENE — Complete Product Catalog
  // Tracking ID: mypawcare-21
  // All products from amazon.in, 4★+ rated, best-sellers
  // ============================================================

  // ——— 1. DOG SHAMPOO (Anti-Tick, Anti-Fungal, Herbal) ———————
  {
    id: 'wahl-puppy-shampoo',
    name: 'Wahl Puppy Shampoo, Gentle Formula for Puppies (200ml)',
    brand: 'Wahl',
    category: 'grooming',
    subCategory: 'Shampoo - Gentle',
    petType: 'dog',
    price: '249 - 399',
    rating: 4.3,
    reviews: 5840,
    image: '/images/products/wahl-puppy-shampoo.jpg',
    badge: 'Best Seller',
    desc: 'Tear-free gentle formula specially designed for puppies. pH balanced for sensitive puppy skin.',
    benefits: ['Tear-free gentle formula', 'pH balanced for puppies', 'Paraben & alcohol free'],
    affiliateUrl: 'https://www.amazon.in/s?k=Wahl+Puppy+Shampoo+200ml&tag=mypawcare-21'
  },
  {
    id: 'himalaya-erina-plus',
    name: 'Himalaya Erina Plus Coat Cleanser with Conditioner (200ml)',
    brand: 'Himalaya',
    category: 'grooming',
    subCategory: 'Shampoo - Herbal',
    petType: 'dog',
    price: '139 - 289',
    rating: 4.2,
    reviews: 12450,
    image: '/images/products/himalaya-erina-plus.webp',
    badge: 'Best Seller',
    desc: 'Herbal coat cleanser with built-in conditioner. Controls ticks, fleas & lice naturally.',
    benefits: ['Natural herbal ingredients', 'Controls ticks & fleas', 'Built-in conditioner'],
    affiliateUrl: 'https://www.amazon.in/s?k=Himalaya+Erina+Plus+Coat+Cleanser+200ml&tag=mypawcare-21'
  },
  {
    id: 'captain-zack-anti-tick',
    name: 'Captain Zack Anti-Tick & Flea Shampoo for Dogs (200ml)',
    brand: 'Captain Zack',
    category: 'grooming',
    subCategory: 'Shampoo - Anti-Tick',
    petType: 'dog',
    price: '399 - 549',
    rating: 4.1,
    reviews: 3780,
    image: '/images/products/captain-zack-anti-tick.jpg',
    badge: 'Premium',
    desc: 'Powerful anti-tick & flea formula with neem & tea tree oil. Safe for all dog breeds.',
    benefits: ['Kills ticks & fleas on contact', 'Neem & tea tree oil', 'Safe for all breeds'],
    affiliateUrl: 'https://www.amazon.in/s?k=Captain+Zack+Anti+Tick+Flea+Dog+Shampoo&tag=mypawcare-21'
  },
  {
    id: 'wahl-oatmeal-shampoo',
    name: 'Wahl Oatmeal Moisturizing Dog Shampoo (200ml)',
    brand: 'Wahl',
    category: 'grooming',
    subCategory: 'Shampoo - Moisturizing',
    petType: 'dog',
    price: '279 - 429',
    rating: 4.3,
    reviews: 4520,
    image: '/images/products/wahl-oatmeal-shampoo.jpg',
    badge: 'Top Rated',
    desc: 'Oatmeal-infused formula soothes dry & itchy skin. Leaves coat silky smooth & shiny.',
    benefits: ['Soothes dry & itchy skin', 'Oatmeal & coconut extracts', 'Silky smooth coat'],
    affiliateUrl: 'https://www.amazon.in/s?k=Wahl+Oatmeal+Dog+Shampoo+200ml&tag=mypawcare-21'
  },

  // ——— 2. DOG CONDITIONER ————————————————————————————————————
  {
    id: 'wahl-dog-conditioner',
    name: 'Wahl Dog Conditioner, Oatmeal Formula (200ml)',
    brand: 'Wahl',
    category: 'grooming',
    subCategory: 'Conditioner',
    petType: 'dog',
    price: '299 - 449',
    rating: 4.2,
    reviews: 2890,
    image: '/images/products/wahl-dog-conditioner.jpg',
    badge: 'Premium',
    desc: 'Deep conditioning with oatmeal & coconut lime. Detangles matted fur & restores shine.',
    benefits: ['Deep conditioning formula', 'Detangles matted fur', 'Coconut lime fragrance'],
    affiliateUrl: 'https://www.amazon.in/s?k=Wahl+Dog+Conditioner+Oatmeal+200ml&tag=mypawcare-21'
  },
  {
    id: 'beaphar-conditioner',
    name: 'Beaphar Premium Conditioner for Dogs (250ml)',
    brand: 'Beaphar',
    category: 'grooming',
    subCategory: 'Conditioner',
    petType: 'dog',
    price: '449 - 599',
    rating: 4.1,
    reviews: 1560,
    image: '/images/products/beaphar-conditioner.jpg',
    badge: 'Premium',
    desc: 'Premium coat conditioner with macadamia oil & aloe vera. Makes fur soft & manageable.',
    benefits: ['Macadamia oil & aloe vera', 'Reduces tangling & matting', 'Premium European formula'],
    affiliateUrl: 'https://www.amazon.in/s?k=Beaphar+Premium+Conditioner+Dogs+250ml&tag=mypawcare-21'
  },

  // ——— 3. DOG SOAP BARS ——————————————————————————————————————
  {
    id: 'medilogy-dog-soap',
    name: 'Medilogy Biotech Anti-Tick & Flea Dog Soap (75g x 3)',
    brand: 'Medilogy',
    category: 'grooming',
    subCategory: 'Soap Bar',
    petType: 'dog',
    price: '199 - 349',
    rating: 4.0,
    reviews: 3420,
    image: '/images/products/medilogy-dog-soap.webp',
    badge: 'Best Seller',
    desc: 'Natural anti-tick soap bar with neem & turmeric. Budget-friendly 3-pack for regular baths.',
    benefits: ['Natural neem & turmeric', 'Anti-tick & anti-fungal', 'Value pack of 3 bars'],
    affiliateUrl: 'https://www.amazon.in/s?k=dog+soap+bar+anti+tick+neem&tag=mypawcare-21'
  },
  {
    id: 'himalaya-dog-soap',
    name: 'Himalaya Erina EP Dog Soap, Tick & Flea Control (100g)',
    brand: 'Himalaya',
    category: 'grooming',
    subCategory: 'Soap Bar',
    petType: 'dog',
    price: '69 - 149',
    rating: 4.1,
    reviews: 6780,
    image: '/images/products/himalaya-dog-soap.jpg',
    badge: 'Best Seller',
    desc: 'Herbal tick & flea control soap by Himalaya. Gentle on skin, tough on parasites.',
    benefits: ['Herbal ectoparasiticide', 'Gentle on sensitive skin', 'Trusted Himalaya brand'],
    affiliateUrl: 'https://www.amazon.in/s?k=Himalaya+Erina+EP+Dog+Soap&tag=mypawcare-21'
  },

  // ——— 4. TICK & FLEA REMOVAL SHAMPOO ————————————————————————
  {
    id: 'beaphar-flea-shampoo',
    name: 'Beaphar Flea & Tick Dog Shampoo (250ml)',
    brand: 'Beaphar',
    category: 'grooming',
    subCategory: 'Tick & Flea Shampoo',
    petType: 'dog',
    price: '459 - 759',
    rating: 4.2,
    reviews: 4890,
    image: '/images/products/beaphar-flea-shampoo.jpg',
    badge: 'Top Rated',
    desc: 'European-grade anti-flea formula with Margosa extract. Kills fleas on contact & prevents re-infestation.',
    benefits: ['Kills fleas on contact', 'Margosa extract (natural)', 'Prevents re-infestation'],
    affiliateUrl: 'https://www.amazon.in/s?k=Beaphar+Flea+Tick+Dog+Shampoo+250ml&tag=mypawcare-21'
  },
  {
    id: 'arava-tick-shampoo',
    name: 'Arava Natural Medicated Dog Shampoo, Anti-Flea & Tick (400ml)',
    brand: 'Arava',
    category: 'grooming',
    subCategory: 'Tick & Flea Shampoo',
    petType: 'dog',
    price: '699 - 999',
    rating: 4.0,
    reviews: 2340,
    image: '/images/products/arava-tick-shampoo.jpg',
    badge: 'Premium',
    desc: 'Dead Sea minerals-based medicated shampoo. 100% natural botanical formula for tick & flea control.',
    benefits: ['Dead Sea minerals formula', '100% natural botanicals', 'Safe for sensitive skin'],
    affiliateUrl: 'https://www.amazon.in/s?k=Arava+Natural+Medicated+Dog+Shampoo+Anti+Flea+Tick&tag=mypawcare-21'
  },

  // ——— 5. DOG WIPES ——————————————————————————————————————————
  {
    id: 'pawpaya-dog-wipes',
    name: 'Pawpaya Premium Pet Wipes for Dogs & Cats (80 Wipes)',
    brand: 'Pawpaya',
    category: 'grooming',
    subCategory: 'Cleaning Wipes',
    petType: 'dog',
    price: '199 - 349',
    rating: 4.2,
    reviews: 8760,
    image: '/images/products/pawpaya-dog-wipes.jpg',
    badge: 'Best Seller',
    desc: 'Extra thick & large pet wipes with aloe vera. Perfect for paws, face & body cleaning.',
    benefits: ['Extra thick & large size', 'Aloe vera & vitamin E', 'Alcohol & paraben free'],
    affiliateUrl: 'https://www.amazon.in/s?k=Pawpaya+Premium+Pet+Wipes+80&tag=mypawcare-21'
  },
  {
    id: 'basil-pet-wipes',
    name: 'Basil Anti-Bacterial Pet Wipes, Aloe Vera (80 Wipes)',
    brand: 'Basil',
    category: 'grooming',
    subCategory: 'Cleaning Wipes',
    petType: 'dog',
    price: '149 - 299',
    rating: 4.1,
    reviews: 12340,
    image: '/images/products/basil-pet-wipes.jpg',
    badge: 'Amazon Choice',
    desc: 'Anti-bacterial cleaning wipes for daily hygiene. Gentle aloe vera formula for paws & coat.',
    benefits: ['Anti-bacterial formula', 'Gentle aloe vera extract', 'Biodegradable & safe'],
    affiliateUrl: 'https://www.amazon.in/s?k=Basil+Anti+Bacterial+Pet+Wipes+Aloe+Vera+80&tag=mypawcare-21'
  },
  {
    id: 'petkin-ear-wipes',
    name: 'Petkin Pet Ear Wipes for Dogs & Cats (30 Wipes)',
    brand: 'Petkin',
    category: 'grooming',
    subCategory: 'Ear Wipes',
    petType: 'dog',
    price: '309 - 459',
    rating: 4.0,
    reviews: 2450,
    image: '/images/products/petkin-ear-wipes.webp',
    badge: 'Trending',
    desc: 'Specialized ear cleaning wipes that gently remove wax & debris. Prevents ear infections.',
    benefits: ['Gently removes ear wax', 'Prevents ear infections', 'Easy to use disposable'],
    affiliateUrl: 'https://www.amazon.in/s?k=Petkin+Pet+Ear+Wipes+Dogs+30&tag=mypawcare-21'
  },

  // ——— 6. DOG GROOMING KIT (Brush, Comb, Scissors) ———————————
  {
    id: 'slicker-brush-pro',
    name: 'Foodie Puppies Self-Cleaning Slicker Brush for Dogs',
    brand: 'Foodie Puppies',
    category: 'grooming',
    subCategory: 'Grooming Brush',
    petType: 'dog',
    price: '249 - 399',
    rating: 4.1,
    reviews: 15670,
    image: '/images/products/slicker-brush-pro.webp',
    badge: 'Best Seller',
    desc: 'Self-cleaning slicker brush removes loose fur & tangles. One-click cleaning button saves time.',
    benefits: ['Self-cleaning one-click button', 'Removes tangles & loose fur', 'Gentle on skin'],
    affiliateUrl: 'https://www.amazon.in/s?k=Foodie+Puppies+Self+Cleaning+Slicker+Brush+Dog&tag=mypawcare-21'
  },
  {
    id: 'double-sided-comb',
    name: 'Pecute Double Sided Pet Grooming Brush, Dematting Comb',
    brand: 'Pecute',
    category: 'grooming',
    subCategory: 'Grooming Comb',
    petType: 'dog',
    price: '349 - 499',
    rating: 4.2,
    reviews: 7890,
    image: '/images/products/double-sided-comb.jpg',
    badge: 'Top Rated',
    desc: 'Double-sided dematting comb with rounded pins. Removes mats & undercoat without pain.',
    benefits: ['Double-sided design', 'Rounded pins prevent scratching', 'Great for thick coats'],
    affiliateUrl: 'https://www.amazon.in/s?k=Pecute+Double+Sided+Pet+Grooming+Brush+Dematting&tag=mypawcare-21'
  },
  {
    id: 'grooming-kit-7in1',
    name: 'Glendan 7-in-1 Dog Grooming Kit (Brush, Comb, Scissors Set)',
    brand: 'Glendan',
    category: 'grooming',
    subCategory: 'Grooming Kit',
    petType: 'dog',
    price: '499 - 799',
    rating: 4.0,
    reviews: 3450,
    image: '/images/products/grooming-kit-7in1.jpeg',
    badge: 'Trending',
    desc: 'Complete 7-piece grooming set with slicker brush, dematting comb & thinning scissors.',
    benefits: ['7-piece complete kit', 'Professional quality tools', 'Suitable for all breeds'],
    affiliateUrl: 'https://www.amazon.in/s?k=dog+grooming+kit+brush+comb+scissors+7+in+1&tag=mypawcare-21'
  },

  // ——— 7. NAIL CUTTER / GRINDER ——————————————————————————————
  {
    id: 'nail-clipper-pro',
    name: 'Foodie Puppies Professional Dog Nail Clipper with Safety Guard',
    brand: 'Foodie Puppies',
    category: 'grooming',
    subCategory: 'Nail Clipper',
    petType: 'dog',
    price: '149 - 299',
    rating: 4.1,
    reviews: 18920,
    image: '/images/products/nail-clipper-pro.jpg',
    badge: 'Best Seller',
    desc: 'Professional nail clipper with safety guard to prevent over-cutting. Sharp stainless steel blade.',
    benefits: ['Safety guard prevents over-cutting', 'Sharp stainless steel', 'Ergonomic grip handle'],
    affiliateUrl: 'https://www.amazon.in/s?k=Foodie+Puppies+Dog+Nail+Clipper+Safety+Guard&tag=mypawcare-21'
  },
  {
    id: 'nail-grinder-electric',
    name: 'Pecute Electric Dog Nail Grinder, Low Noise Rechargeable',
    brand: 'Pecute',
    category: 'grooming',
    subCategory: 'Nail Grinder',
    petType: 'dog',
    price: '699 - 999',
    rating: 4.0,
    reviews: 4560,
    image: '/images/products/nail-grinder-electric.jpg',
    badge: 'Premium',
    desc: 'Ultra-quiet rechargeable nail grinder with 2-speed settings. Painless & stress-free nail trimming.',
    benefits: ['Ultra-quiet motor', 'USB rechargeable', '2-speed for precision control'],
    affiliateUrl: 'https://www.amazon.in/s?k=Pecute+Electric+Dog+Nail+Grinder+Rechargeable&tag=mypawcare-21'
  },

  // ——— 8. EAR CLEANER ————————————————————————————————————————
  {
    id: 'himalaya-ear-cleaner',
    name: 'Himalaya Ear Cleansing Drops for Dogs & Cats (100ml)',
    brand: 'Himalaya',
    category: 'grooming',
    subCategory: 'Ear Cleaner',
    petType: 'dog',
    price: '119 - 199',
    rating: 4.2,
    reviews: 5670,
    image: '/images/products/himalaya-ear-cleaner.jpg',
    badge: 'Best Seller',
    desc: 'Herbal ear cleansing solution with natural antiseptic properties. Prevents ear infections & removes wax.',
    benefits: ['Natural herbal formula', 'Prevents ear infections', 'Gentle wax removal'],
    affiliateUrl: 'https://www.amazon.in/s?k=Himalaya+Ear+Cleansing+Drops+Dogs+100ml&tag=mypawcare-21'
  },
  {
    id: 'beaphar-ear-cleaner',
    name: 'Beaphar Ear Cleaner for Dogs & Cats (50ml)',
    brand: 'Beaphar',
    category: 'grooming',
    subCategory: 'Ear Cleaner',
    petType: 'dog',
    price: '279 - 429',
    rating: 4.1,
    reviews: 3210,
    image: '/images/products/beaphar-ear-cleaner.jpg',
    badge: 'Top Rated',
    desc: 'European-grade ear cleaning solution. Dissolves wax & prevents bacterial/fungal ear infections.',
    benefits: ['Dissolves ear wax gently', 'Anti-bacterial & anti-fungal', 'European veterinary grade'],
    affiliateUrl: 'https://www.amazon.in/s?k=Beaphar+Ear+Cleaner+Dogs+Cats+50ml&tag=mypawcare-21'
  },

  // ——— 9. DOG PERFUME / DEODORANT ————————————————————————————
  {
    id: 'boltz-dog-perfume',
    name: 'Boltz Dog & Cat Body Perfume Spray, Long Lasting (300ml)',
    brand: 'Boltz',
    category: 'grooming',
    subCategory: 'Perfume / Deodorant',
    petType: 'dog',
    price: '199 - 349',
    rating: 4.0,
    reviews: 9870,
    image: '/images/products/boltz-dog-perfume.jpg',
    badge: 'Best Seller',
    desc: 'Long-lasting body spray with fresh floral fragrance. Eliminates bad odor between baths.',
    benefits: ['Long-lasting fresh scent', 'Eliminates bad odor', 'Safe alcohol-free formula'],
    affiliateUrl: 'https://www.amazon.in/s?k=Boltz+Dog+Cat+Body+Perfume+Spray+300ml&tag=mypawcare-21'
  },
  {
    id: 'wahl-dog-cologne',
    name: 'Wahl Dog Deodorizer Spray, Eucalyptus & Spearmint (236ml)',
    brand: 'Wahl',
    category: 'grooming',
    subCategory: 'Perfume / Deodorant',
    petType: 'dog',
    price: '349 - 499',
    rating: 4.2,
    reviews: 2780,
    image: '/images/products/wahl-dog-cologne.jpg',
    badge: 'Premium',
    desc: 'Professional-grade deodorizer with eucalyptus & spearmint. Refreshes coat between baths.',
    benefits: ['Eucalyptus & spearmint scent', 'Professional groomer quality', 'Conditions while freshening'],
    affiliateUrl: 'https://www.amazon.in/s?k=Wahl+Dog+Deodorizer+Spray+Eucalyptus+Spearmint&tag=mypawcare-21'
  },

  // ============================================================
  // DOG → TOYS & ENTERTAINMENT — Complete Product Catalog
  // Tracking ID: mypawcare-21
  // All products from amazon.in, 4★+ rated, best-sellers
  // ============================================================

  // ——— 1. CHEW TOYS —————————————————————————————————————————
  {
    id: 'fofos-chew-bone',
    name: 'Fofos Durable Chew Bone Toy for Dogs (Large)',
    brand: 'Fofos',
    category: 'toys',
    subCategory: 'Chew Toys',
    petType: 'dog',
    price: '299 - 449',
    rating: 4.2,
    reviews: 3450,
    image: '/images/products/fofos-chew-bone.png',
    badge: 'Best Seller',
    desc: 'Super durable nylon chew bone for aggressive chewers. Keeps dogs busy for hours & cleans teeth.',
    benefits: ['Ultra-durable for aggressive chewers', 'Cleans teeth while chewing', 'Non-toxic & safe material'],
    affiliateUrl: 'https://www.amazon.in/s?k=Fofos+Durable+Chew+Bone+Dog+Toy+Large&tag=mypawcare-21'
  },
  {
    id: 'foodie-puppies-chew',
    name: 'Foodie Puppies Durable Chew Toy for Dogs, Bone Shape',
    brand: 'Foodie Puppies',
    category: 'toys',
    subCategory: 'Chew Toys',
    petType: 'dog',
    price: '149 - 299',
    rating: 4.1,
    reviews: 8920,
    image: '/images/products/foodie-puppies-chew.png',
    badge: 'Amazon Choice',
    desc: 'Budget-friendly chew bone that withstands heavy chewing. Textured surface massages gums.',
    benefits: ['Withstands heavy chewing', 'Textured gum massage', 'Budget-friendly option'],
    affiliateUrl: 'https://www.amazon.in/s?k=Foodie+Puppies+Durable+Chew+Toy+Dog+Bone&tag=mypawcare-21'
  },
  {
    id: 'petstages-dogwood',
    name: 'Petstages Dogwood Stick Chew Toy, Real Wood (Medium)',
    brand: 'Petstages',
    category: 'toys',
    subCategory: 'Chew Toys',
    petType: 'dog',
    price: '449 - 599',
    rating: 4.3,
    reviews: 2780,
    image: '/images/products/petstages-dogwood.jpg',
    badge: 'Premium',
    desc: 'Real wood alternative that satisfies natural chewing instinct. Safer than real sticks — no splinters.',
    benefits: ['Real wood scent & texture', 'No splinters — safe chewing', 'Vet recommended alternative'],
    affiliateUrl: 'https://www.amazon.in/s?k=Petstages+Dogwood+Stick+Chew+Toy+Medium&tag=mypawcare-21'
  },

  // ——— 2. RUBBER TOYS ———————————————————————————————————————
  {
    id: 'kong-classic-red',
    name: 'KONG Classic Dog Toy, Red (Medium)',
    brand: 'KONG',
    category: 'toys',
    subCategory: 'Rubber Toys',
    petType: 'dog',
    price: '699 - 999',
    rating: 4.4,
    reviews: 5670,
    image: '/images/products/kong-classic-red.jpg',
    badge: 'Best Seller',
    desc: 'World\'s #1 dog toy — stuff with treats for hours of fun. Ultra-durable natural rubber.',
    benefits: ['Stuff with treats for enrichment', 'Ultra-durable natural rubber', 'Bounces unpredictably for fun'],
    affiliateUrl: 'https://www.amazon.in/s?k=KONG+Classic+Dog+Toy+Red+Medium&tag=mypawcare-21'
  },
  {
    id: 'goofy-tails-rubber',
    name: 'Goofy Tails Rubber Spike Ball Toy for Dogs',
    brand: 'Goofy Tails',
    category: 'toys',
    subCategory: 'Rubber Toys',
    petType: 'dog',
    price: '199 - 349',
    rating: 4.1,
    reviews: 6340,
    image: '/images/products/goofy-tails-rubber.jpg',
    badge: 'Best Seller',
    desc: 'Spiky rubber ball that massages gums while playing. Perfect for fetch & indoor play.',
    benefits: ['Spike texture massages gums', 'Great for fetch games', 'Durable natural rubber'],
    affiliateUrl: 'https://www.amazon.in/s?k=Goofy+Tails+Rubber+Spike+Ball+Dog+Toy&tag=mypawcare-21'
  },
  {
    id: 'trixie-rubber-toy',
    name: 'Trixie Natural Rubber Dog Toy, Assorted Shapes',
    brand: 'Trixie',
    category: 'toys',
    subCategory: 'Rubber Toys',
    petType: 'dog',
    price: '309 - 459',
    rating: 4.2,
    reviews: 3120,
    image: '/images/products/trixie-rubber-toy.jpg',
    badge: 'Top Rated',
    desc: 'Premium European-made natural rubber toy. Floats in water — perfect for pool & beach play.',
    benefits: ['100% natural rubber', 'Floats in water', 'European quality standard'],
    affiliateUrl: 'https://www.amazon.in/s?k=Trixie+Natural+Rubber+Dog+Toy&tag=mypawcare-21'
  },

  // ——— 3. SQUEAKY TOYS ——————————————————————————————————————
  {
    id: 'foodie-puppies-squeaky',
    name: 'Foodie Puppies Squeaky Plush Toy for Dogs (Assorted)',
    brand: 'Foodie Puppies',
    category: 'toys',
    subCategory: 'Squeaky Toys',
    petType: 'dog',
    price: '149 - 299',
    rating: 4.0,
    reviews: 11230,
    image: '/images/products/foodie-puppies-squeaky.png',
    badge: 'Best Seller',
    desc: 'Cute squeaky plush toy dogs love to carry around. Built-in squeaker for interactive fun.',
    benefits: ['Built-in squeaker sound', 'Soft plush — perfect for cuddling', 'Assorted fun shapes'],
    affiliateUrl: 'https://www.amazon.in/s?k=Foodie+Puppies+Squeaky+Plush+Dog+Toy&tag=mypawcare-21'
  },
  {
    id: 'fofos-squeaky-latex',
    name: 'Fofos Latex Squeaky Dog Toy, Animal Shape',
    brand: 'Fofos',
    category: 'toys',
    subCategory: 'Squeaky Toys',
    petType: 'dog',
    price: '249 - 399',
    rating: 4.2,
    reviews: 4560,
    image: '/images/products/fofos-squeaky-latex.jpg',
    badge: 'Top Rated',
    desc: 'Natural latex squeaky toy in fun animal shapes. Loud squeaker drives dogs crazy with excitement.',
    benefits: ['Natural latex material', 'Loud engaging squeaker', 'Fun animal character designs'],
    affiliateUrl: 'https://www.amazon.in/s?k=Fofos+Latex+Squeaky+Dog+Toy+Animal&tag=mypawcare-21'
  },
  {
    id: 'trixie-squeaky-vinyl',
    name: 'Trixie Vinyl Squeaky Toy for Dogs (Assorted)',
    brand: 'Trixie',
    category: 'toys',
    subCategory: 'Squeaky Toys',
    petType: 'dog',
    price: '209 - 359',
    rating: 4.1,
    reviews: 2890,
    image: '/images/products/trixie-squeaky-vinyl.jpg',
    badge: 'Trending',
    desc: 'German-designed vinyl squeaky toy with fun shapes. Lightweight & perfect for small to medium dogs.',
    benefits: ['German quality design', 'Lightweight for small dogs', 'Bright attractive colors'],
    affiliateUrl: 'https://www.amazon.in/s?k=Trixie+Vinyl+Squeaky+Dog+Toy&tag=mypawcare-21'
  },

  // ——— 4. ROPE TOYS ————————————————————————————————————————
  {
    id: 'foodie-puppies-rope-3pk',
    name: 'Foodie Puppies Cotton Rope Toys for Dogs (Set of 3)',
    brand: 'Foodie Puppies',
    category: 'toys',
    subCategory: 'Rope Toys',
    petType: 'dog',
    price: '199 - 349',
    rating: 4.1,
    reviews: 14560,
    image: '/images/products/foodie-puppies-rope-3pk.jpg',
    badge: 'Best Seller',
    desc: '3-pack cotton rope toys for tug-of-war & fetch. Cleans teeth & strengthens jaw muscles.',
    benefits: ['Value pack of 3 ropes', 'Cleans teeth while playing', '100% natural cotton fiber'],
    affiliateUrl: 'https://www.amazon.in/s?k=Foodie+Puppies+Cotton+Rope+Toys+Dog+Set+3&tag=mypawcare-21'
  },
  {
    id: 'goofy-tails-rope-ball',
    name: 'Goofy Tails Rope Ball Toy for Dogs, Tug & Fetch',
    brand: 'Goofy Tails',
    category: 'toys',
    subCategory: 'Rope Toys',
    petType: 'dog',
    price: '149 - 299',
    rating: 4.0,
    reviews: 5670,
    image: '/images/products/goofy-tails-rope-ball.jpg',
    badge: 'Amazon Choice',
    desc: 'Knotted rope ball perfect for tug-of-war games. Natural cotton fibers act as dental floss.',
    benefits: ['Natural dental floss effect', 'Perfect for tug-of-war', 'Durable knotted design'],
    affiliateUrl: 'https://www.amazon.in/s?k=Goofy+Tails+Rope+Ball+Dog+Toy+Tug&tag=mypawcare-21'
  },
  {
    id: 'fofos-rope-toy-xl',
    name: 'Fofos Extra Large Rope Toy for Dogs, Heavy Duty',
    brand: 'Fofos',
    category: 'toys',
    subCategory: 'Rope Toys',
    petType: 'dog',
    price: '349 - 499',
    rating: 4.2,
    reviews: 2340,
    image: '/images/products/fofos-rope-toy-xl.jpg',
    badge: 'Premium',
    desc: 'Heavy-duty XL rope toy built for large breed dogs. Extra thick braided cotton for durability.',
    benefits: ['Extra thick for large breeds', 'Heavy-duty braided cotton', 'Long-lasting durability'],
    affiliateUrl: 'https://www.amazon.in/s?k=Fofos+Extra+Large+Rope+Toy+Dog+Heavy+Duty&tag=mypawcare-21'
  },

  // ——— 5. INTERACTIVE TOYS (Puzzle Feeders) ————————————————
  {
    id: 'trixie-puzzle-feeder',
    name: 'Trixie Dog Activity Flip Board, Strategy Game (Level 2)',
    brand: 'Trixie',
    category: 'toys',
    subCategory: 'Interactive / Puzzle',
    petType: 'dog',
    price: '699 - 999',
    rating: 4.3,
    reviews: 3450,
    image: '/images/products/trixie-puzzle-feeder.jpg',
    badge: 'Best Seller',
    desc: 'Interactive puzzle feeder that challenges your dog mentally. Reduces boredom & destructive behavior.',
    benefits: ['Mental stimulation for dogs', 'Reduces boredom & anxiety', 'Multiple difficulty levels'],
    affiliateUrl: 'https://www.amazon.in/s?k=Trixie+Dog+Activity+Flip+Board+Strategy+Game&tag=mypawcare-21'
  },
  {
    id: 'kong-wobbler',
    name: 'KONG Wobbler Treat Dispensing Dog Toy (Large)',
    brand: 'KONG',
    category: 'toys',
    subCategory: 'Interactive / Puzzle',
    petType: 'dog',
    price: '1,099 - 1,699',
    rating: 4.3,
    reviews: 2780,
    image: '/images/products/kong-wobbler.jpg',
    badge: 'Premium',
    desc: 'Wobbles & dispenses treats as dog plays. Slows down fast eaters & provides mental exercise.',
    benefits: ['Treat dispensing action', 'Slows down fast eaters', 'Wobble action keeps dogs engaged'],
    affiliateUrl: 'https://www.amazon.in/s?k=KONG+Wobbler+Treat+Dispensing+Dog+Toy+Large&tag=mypawcare-21'
  },
  {
    id: 'foodie-puppies-slow-feeder',
    name: 'Foodie Puppies Slow Feeder Puzzle Toy for Dogs',
    brand: 'Foodie Puppies',
    category: 'toys',
    subCategory: 'Interactive / Puzzle',
    petType: 'dog',
    price: '299 - 449',
    rating: 4.0,
    reviews: 4560,
    image: '/images/products/foodie-puppies-slow-feeder.jpg',
    badge: 'Trending',
    desc: 'Slow feeder puzzle that makes mealtime fun & healthy. Anti-choke design prevents fast eating.',
    benefits: ['Prevents fast eating & bloating', 'Makes mealtime fun', 'Anti-choke maze design'],
    affiliateUrl: 'https://www.amazon.in/s?k=Foodie+Puppies+Slow+Feeder+Puzzle+Dog+Toy&tag=mypawcare-21'
  },

  // ——— 6. BALL LAUNCHERS & FETCH TOYS ————————————————————————
  {
    id: 'chuckit-ball-launcher',
    name: 'Chuckit! Classic Ball Launcher with Tennis Ball (26 inch)',
    brand: 'Chuckit!',
    category: 'toys',
    subCategory: 'Ball Launcher',
    petType: 'dog',
    price: '599 - 899',
    rating: 4.4,
    reviews: 3890,
    image: '/images/products/chuckit-ball-launcher.jpg',
    badge: 'Best Seller',
    desc: 'Throw tennis balls 3x farther with zero effort. Hands-free pickup — no more slobbery hands.',
    benefits: ['3x farther throws effortlessly', 'Hands-free ball pickup', 'Includes 1 tennis ball'],
    affiliateUrl: 'https://www.amazon.in/s?k=Chuckit+Classic+Ball+Launcher+Tennis+Ball&tag=mypawcare-21'
  },
  {
    id: 'foodie-puppies-tennis-3pk',
    name: 'Foodie Puppies Rubber Tennis Balls for Dogs (Pack of 3)',
    brand: 'Foodie Puppies',
    category: 'toys',
    subCategory: 'Ball Launcher',
    petType: 'dog',
    price: '149 - 299',
    rating: 4.1,
    reviews: 9870,
    image: '/images/products/foodie-puppies-tennis-3pk.jpg',
    badge: 'Best Seller',
    desc: 'Bouncy rubber tennis balls perfect for fetch. Extra durable — won\'t split like regular tennis balls.',
    benefits: ['Extra bouncy for fetch', 'More durable than regular balls', 'Pack of 3 — great value'],
    affiliateUrl: 'https://www.amazon.in/s?k=Foodie+Puppies+Rubber+Tennis+Balls+Dogs+Pack+3&tag=mypawcare-21'
  },
  {
    id: 'trixie-fetch-ball',
    name: 'Trixie Natural Rubber Fetch Ball for Dogs (7cm)',
    brand: 'Trixie',
    category: 'toys',
    subCategory: 'Ball Launcher',
    petType: 'dog',
    price: '209 - 359',
    rating: 4.2,
    reviews: 2340,
    image: '/images/products/trixie-fetch-ball.jpg',
    badge: 'Top Rated',
    desc: 'High-bounce natural rubber ball for outdoor fetch. Floats in water for pool & beach games.',
    benefits: ['High-bounce natural rubber', 'Floats in water', 'Perfect 7cm size for dogs'],
    affiliateUrl: 'https://www.amazon.in/s?k=Trixie+Natural+Rubber+Fetch+Ball+Dog+7cm&tag=mypawcare-21'
  },

  // ============================================================
  // DOG → ACCESSORIES — Complete Product Catalog
  // Tracking ID: mypawcare-21
  // ============================================================

  // ——— 1. DOG COLLAR ——————————————————————————————————————————
  {
    id: 'pets-empire-collar',
    name: 'Pets Empire Nylon Adjustable Dog Collar (Medium)',
    brand: 'Pets Empire',
    category: 'accessories',
    subCategory: 'Collar',
    petType: 'dog',
    price: '119 - 199',
    rating: 4.1,
    reviews: 12450,
    image: '/images/products/pets-empire-collar.jpg',
    badge: 'Best Seller',
    desc: 'Durable nylon collar with quick-release buckle. Adjustable fit for medium breed dogs.',
    benefits: ['Quick-release safety buckle', 'Adjustable for perfect fit', 'Durable nylon webbing'],
    affiliateUrl: 'https://www.amazon.in/s?k=Pets+Empire+Nylon+Adjustable+Dog+Collar+Medium&tag=mypawcare-21'
  },
  {
    id: 'trixie-premium-collar',
    name: 'Trixie Premium Dog Collar, Neoprene Padded (M-L)',
    brand: 'Trixie',
    category: 'accessories',
    subCategory: 'Collar',
    petType: 'dog',
    price: '499 - 799',
    rating: 4.3,
    reviews: 3450,
    image: '/images/products/trixie-premium-collar.jpg',
    badge: 'Premium',
    desc: 'Neoprene-padded collar for maximum comfort. Reflective stitching for nighttime visibility.',
    benefits: ['Neoprene padding — no chafing', 'Reflective for night safety', 'European quality design'],
    affiliateUrl: 'https://www.amazon.in/s?k=Trixie+Premium+Dog+Collar+Neoprene+Padded&tag=mypawcare-21'
  },

  // ——— 2. DOG LEASH ——————————————————————————————————————————
  {
    id: 'foodie-puppies-leash',
    name: 'Foodie Puppies Heavy Duty Nylon Dog Leash (5ft)',
    brand: 'Foodie Puppies',
    category: 'accessories',
    subCategory: 'Leash',
    petType: 'dog',
    price: '149 - 299',
    rating: 4.1,
    reviews: 9870,
    image: '/images/products/foodie-puppies-leash.jpg',
    badge: 'Best Seller',
    desc: 'Heavy-duty nylon leash with padded handle. Strong metal clip for secure attachment.',
    benefits: ['Padded comfort handle', 'Strong metal snap hook', '5ft perfect walking length'],
    affiliateUrl: 'https://www.amazon.in/s?k=Foodie+Puppies+Heavy+Duty+Nylon+Dog+Leash+5ft&tag=mypawcare-21'
  },
  {
    id: 'trixie-retractable-leash',
    name: 'Trixie Flexi Retractable Dog Leash (5m)',
    brand: 'Trixie',
    category: 'accessories',
    subCategory: 'Leash',
    petType: 'dog',
    price: '799 - 1,099',
    rating: 4.2,
    reviews: 4560,
    image: '/images/products/trixie-retractable-leash.jpg',
    badge: 'Premium',
    desc: 'Retractable 5-meter leash with one-button lock. Gives dogs freedom while maintaining control.',
    benefits: ['5m retractable length', 'One-button brake & lock', 'Ergonomic soft grip'],
    affiliateUrl: 'https://www.amazon.in/s?k=Trixie+Flexi+Retractable+Dog+Leash+5m&tag=mypawcare-21'
  },

  // ——— 3. DOG HARNESS ————————————————————————————————————————
  {
    id: 'pets-empire-harness',
    name: 'Pets Empire No-Pull Dog Harness, Adjustable (Medium)',
    brand: 'Pets Empire',
    category: 'accessories',
    subCategory: 'Harness',
    petType: 'dog',
    price: '299 - 449',
    rating: 4.1,
    reviews: 7890,
    image: '/images/products/pets-empire-harness.jpg',
    badge: 'Best Seller',
    desc: 'No-pull padded harness distributes pressure evenly. Prevents choking & neck strain.',
    benefits: ['No-pull front clip design', 'Padded for comfort', 'Prevents choking & pulling'],
    affiliateUrl: 'https://www.amazon.in/s?k=Pets+Empire+No+Pull+Dog+Harness+Adjustable+Medium&tag=mypawcare-21'
  },
  {
    id: 'goofy-tails-harness',
    name: 'Goofy Tails Reflective Dog Harness with Handle (Large)',
    brand: 'Goofy Tails',
    category: 'accessories',
    subCategory: 'Harness',
    petType: 'dog',
    price: '499 - 799',
    rating: 4.2,
    reviews: 3450,
    image: '/images/products/goofy-tails-harness.jpg',
    badge: 'Top Rated',
    desc: 'Reflective harness with top handle for quick control. Breathable mesh for hot Indian summers.',
    benefits: ['Reflective strips for safety', 'Top handle for quick control', 'Breathable mesh material'],
    affiliateUrl: 'https://www.amazon.in/s?k=Goofy+Tails+Reflective+Dog+Harness+Handle+Large&tag=mypawcare-21'
  },

  // ——— 4. DOG CLOTHES ————————————————————————————————————————
  {
    id: 'petsnbuds-tshirt',
    name: 'PetsnBuds Cotton Dog T-Shirt, Printed (Medium)',
    brand: 'PetsnBuds',
    category: 'accessories',
    subCategory: 'Clothing',
    petType: 'dog',
    price: '249 - 399',
    rating: 4.0,
    reviews: 5670,
    image: '/images/products/petsnbuds-tshirt.jpg',
    badge: 'Best Seller',
    desc: 'Soft breathable cotton t-shirt for daily wear. Fun printed designs your dog will love.',
    benefits: ['100% breathable cotton', 'Fun printed designs', 'Machine washable'],
    affiliateUrl: 'https://www.amazon.in/s?k=dog+cotton+t-shirt+printed+medium&tag=mypawcare-21'
  },
  {
    id: 'petsnbuds-raincoat',
    name: 'Pets Empire Waterproof Dog Raincoat with Hood (Large)',
    brand: 'Pets Empire',
    category: 'accessories',
    subCategory: 'Clothing',
    petType: 'dog',
    price: '449 - 599',
    rating: 4.1,
    reviews: 4230,
    image: '/images/products/petsnbuds-raincoat.jpg',
    badge: 'Trending',
    desc: 'Waterproof raincoat with reflective strips. Keeps dogs dry during monsoon walks.',
    benefits: ['100% waterproof material', 'Reflective strips for safety', 'Adjustable belly strap'],
    affiliateUrl: 'https://www.amazon.in/s?k=Pets+Empire+Waterproof+Dog+Raincoat+Hood+Large&tag=mypawcare-21'
  },

  // ============================================================
  // DOG → DAILY USE ESSENTIALS — Complete Product Catalog
  // ============================================================

  // ——— 1. DOG BED ————————————————————————————————————————————
  {
    id: 'fluffydream-dog-bed',
    name: 'FluffyDream Orthopedic Dog Bed, Washable (Medium)',
    brand: 'FluffyDream',
    category: 'essentials',
    subCategory: 'Dog Bed',
    petType: 'dog',
    price: '899 - 1,199',
    rating: 4.2,
    reviews: 6780,
    image: '/images/products/fluffydream-dog-bed.jpeg',
    badge: 'Best Seller',
    desc: 'Orthopedic foam bed supports joints & spine. Machine-washable cover for easy cleaning.',
    benefits: ['Orthopedic foam support', 'Machine-washable cover', 'Non-slip bottom'],
    affiliateUrl: 'https://www.amazon.in/s?k=orthopedic+dog+bed+washable+medium&tag=mypawcare-21'
  },
  {
    id: 'pets-empire-bed',
    name: 'Pets Empire Round Plush Dog Bed, Calming (Medium)',
    brand: 'Pets Empire',
    category: 'essentials',
    subCategory: 'Dog Bed',
    petType: 'dog',
    price: '499 - 799',
    rating: 4.1,
    reviews: 8900,
    image: '/images/products/pets-empire-bed.jpg',
    badge: 'Amazon Choice',
    desc: 'Donut-shaped calming bed reduces anxiety. Super soft plush fur for cozy sleeping.',
    benefits: ['Calming donut design', 'Super soft plush material', 'Machine washable'],
    affiliateUrl: 'https://www.amazon.in/s?k=Pets+Empire+Round+Plush+Dog+Bed+Calming+Medium&tag=mypawcare-21'
  },

  // ——— 2. FOOD & WATER BOWLS ————————————————————————————————
  {
    id: 'foodie-puppies-steel-bowl',
    name: 'Foodie Puppies Stainless Steel Dog Bowl with Rubber Base (700ml x 2)',
    brand: 'Foodie Puppies',
    category: 'essentials',
    subCategory: 'Food & Water Bowl',
    petType: 'dog',
    price: '249 - 399',
    rating: 4.2,
    reviews: 14560,
    image: '/images/products/foodie-puppies-steel-bowl.jpg',
    badge: 'Best Seller',
    desc: 'Anti-skid stainless steel bowls — set of 2. Dishwasher safe & rust-proof for daily use.',
    benefits: ['Anti-skid rubber base', 'Rust-proof stainless steel', 'Set of 2 bowls'],
    affiliateUrl: 'https://www.amazon.in/s?k=Foodie+Puppies+Stainless+Steel+Dog+Bowl+Rubber+Base&tag=mypawcare-21'
  },
  {
    id: 'amazonbasics-elevated-bowl',
    name: 'Amazon Basics Elevated Dog Bowl Stand with 2 Bowls',
    brand: 'Amazon Basics',
    category: 'essentials',
    subCategory: 'Food & Water Bowl',
    petType: 'dog',
    price: '699 - 999',
    rating: 4.3,
    reviews: 5670,
    image: '/images/products/amazonbasics-elevated-bowl.jpg',
    badge: 'Premium',
    desc: 'Elevated stand reduces neck strain while eating. Includes 2 stainless steel bowls.',
    benefits: ['Reduces neck & joint strain', 'Elevated ergonomic design', '2 stainless steel bowls included'],
    affiliateUrl: 'https://www.amazon.in/s?k=elevated+dog+bowl+stand+stainless+steel+2+bowls&tag=mypawcare-21'
  },

  // ——— 3. PEE PADS ——————————————————————————————————————————
  {
    id: 'foodie-puppies-pee-pads',
    name: 'Foodie Puppies Super Absorbent Training Pee Pads (50 Pcs)',
    brand: 'Foodie Puppies',
    category: 'essentials',
    subCategory: 'Pee Pads',
    petType: 'dog',
    price: '499 - 799',
    rating: 4.1,
    reviews: 11230,
    image: '/images/products/foodie-puppies-pee-pads.jpeg',
    badge: 'Best Seller',
    desc: '5-layer super absorbent pee pads for puppy training. Leak-proof backing protects floors.',
    benefits: ['5-layer super absorption', 'Leak-proof backing', '50 pcs value pack'],
    affiliateUrl: 'https://www.amazon.in/s?k=Foodie+Puppies+Super+Absorbent+Training+Pee+Pads+50&tag=mypawcare-21'
  },

  // ——— 4. POOP BAGS ——————————————————————————————————————————
  {
    id: 'foodie-puppies-poop-bags',
    name: 'Foodie Puppies Biodegradable Dog Poop Bags (15 Rolls, 225 Bags)',
    brand: 'Foodie Puppies',
    category: 'essentials',
    subCategory: 'Poop Bags',
    petType: 'dog',
    price: '299 - 449',
    rating: 4.0,
    reviews: 6780,
    image: '/images/products/foodie-puppies-poop-bags.png',
    badge: 'Amazon Choice',
    desc: 'Eco-friendly biodegradable poop bags. Extra thick & leak-proof for mess-free cleanup.',
    benefits: ['Biodegradable & eco-friendly', 'Extra thick — no leaks', '225 bags mega value pack'],
    affiliateUrl: 'https://www.amazon.in/s?k=biodegradable+dog+poop+bags+15+rolls&tag=mypawcare-21'
  },

  // ——— 5. DOG CRATE / CAGE ———————————————————————————————————
  {
    id: 'pets-empire-cage',
    name: 'Pets Empire Heavy Duty Dog Cage with Removable Tray (36 inch)',
    brand: 'Pets Empire',
    category: 'essentials',
    subCategory: 'Dog Crate',
    petType: 'dog',
    price: '2,299 - 2,899',
    rating: 4.1,
    reviews: 5670,
    image: '/images/products/pets-empire-cage.jpg',
    badge: 'Best Seller',
    desc: 'Heavy-duty metal cage with double door access. Removable tray for easy cleaning.',
    benefits: ['Double door access', 'Removable cleaning tray', 'Foldable for storage'],
    affiliateUrl: 'https://www.amazon.in/s?k=Pets+Empire+Heavy+Duty+Dog+Cage+Removable+Tray+36&tag=mypawcare-21'
  },

  // ============================================================
  // DOG → TRAVEL & OUTDOOR — Complete Product Catalog
  // ============================================================

  // ——— 1. DOG CARRIER ————————————————————————————————————————
  {
    id: 'pets-empire-carrier',
    name: 'Pets Empire Airline Approved Soft-Sided Dog Carrier (Medium)',
    brand: 'Pets Empire',
    category: 'travel',
    subCategory: 'Dog Carrier',
    petType: 'dog',
    price: '899 - 1,199',
    rating: 4.1,
    reviews: 4560,
    image: '/images/products/pets-empire-carrier.jpg',
    badge: 'Best Seller',
    desc: 'Airline-approved soft carrier with mesh ventilation. Collapsible design for easy storage.',
    benefits: ['Airline approved size', 'Mesh ventilation panels', 'Collapsible & portable'],
    affiliateUrl: 'https://www.amazon.in/s?k=airline+approved+soft+sided+dog+carrier+medium&tag=mypawcare-21'
  },
  {
    id: 'trixie-backpack-carrier',
    name: 'Trixie Pet Backpack Carrier, Front & Back (30x26x33cm)',
    brand: 'Trixie',
    category: 'travel',
    subCategory: 'Dog Carrier',
    petType: 'dog',
    price: '1,699 - 2,299',
    rating: 4.2,
    reviews: 2340,
    image: '/images/products/trixie-backpack-carrier.webp',
    badge: 'Premium',
    desc: 'Hands-free backpack carrier for small dogs. Wear front or back with padded shoulder straps.',
    benefits: ['Front & back carry options', 'Padded shoulder straps', 'Mesh windows for ventilation'],
    affiliateUrl: 'https://www.amazon.in/s?k=Trixie+Pet+Backpack+Carrier+Front+Back&tag=mypawcare-21'
  },

  // ——— 2. CAR SEAT COVER ————————————————————————————————————
  {
    id: 'foodie-puppies-car-cover',
    name: 'Foodie Puppies Waterproof Dog Car Seat Cover (Universal)',
    brand: 'Foodie Puppies',
    category: 'travel',
    subCategory: 'Car Seat Cover',
    petType: 'dog',
    price: '599 - 899',
    rating: 4.1,
    reviews: 6780,
    image: '/images/products/foodie-puppies-car-cover.jpg',
    badge: 'Best Seller',
    desc: 'Waterproof back seat cover protects car interior. Universal fit for all cars & SUVs.',
    benefits: ['100% waterproof protection', 'Universal fit — all cars', 'Non-slip backing'],
    affiliateUrl: 'https://www.amazon.in/s?k=waterproof+dog+car+seat+cover+universal&tag=mypawcare-21'
  },

  // ——— 3. PORTABLE WATER BOTTLE ——————————————————————————————
  {
    id: 'foodie-puppies-water-bottle',
    name: 'Foodie Puppies Portable Dog Water Bottle with Bowl (550ml)',
    brand: 'Foodie Puppies',
    category: 'travel',
    subCategory: 'Portable Water Bottle',
    petType: 'dog',
    price: '299 - 449',
    rating: 4.2,
    reviews: 8900,
    image: '/images/products/foodie-puppies-water-bottle.webp',
    badge: 'Best Seller',
    desc: 'One-touch water dispenser with built-in bowl. Leak-proof design for walks & travel.',
    benefits: ['One-touch dispenser', 'Built-in drinking bowl', 'Leak-proof & BPA-free'],
    affiliateUrl: 'https://www.amazon.in/s?k=Foodie+Puppies+Portable+Dog+Water+Bottle+Bowl+550ml&tag=mypawcare-21'
  },
  {
    id: 'trixie-travel-bowl',
    name: 'Trixie Collapsible Silicone Travel Bowl for Dogs (500ml)',
    brand: 'Trixie',
    category: 'travel',
    subCategory: 'Travel Bowl',
    petType: 'dog',
    price: '209 - 359',
    rating: 4.1,
    reviews: 3450,
    image: '/images/products/trixie-travel-bowl.jpeg',
    badge: 'Top Rated',
    desc: 'Foldable silicone bowl clips to leash or bag. Perfect for on-the-go hydration & feeding.',
    benefits: ['Folds flat for portability', 'Clips to bag or leash', 'Food-grade silicone'],
    affiliateUrl: 'https://www.amazon.in/s?k=Trixie+Collapsible+Silicone+Travel+Bowl+Dog+500ml&tag=mypawcare-21'
  },

  // ============================================================
  // DOG → HEALTH & CARE — Complete Product Catalog
  // ============================================================

  // ——— 1. TICK & FLEA SPRAY ——————————————————————————————————
  {
    id: 'himalaya-tick-spray',
    name: 'Himalaya Erina-EP Tick & Flea Control Spray (100ml)',
    brand: 'Himalaya',
    category: 'health',
    subCategory: 'Tick & Flea Spray',
    petType: 'dog',
    price: '149 - 299',
    rating: 4.1,
    reviews: 7890,
    image: '/images/products/himalaya-tick-spray.png',
    badge: 'Best Seller',
    desc: 'Herbal tick & flea spray with natural extracts. Safe for daily use on dogs & puppies.',
    benefits: ['Natural herbal formula', 'Safe for puppies too', 'Controls ticks, fleas & lice'],
    affiliateUrl: 'https://www.amazon.in/s?k=Himalaya+Erina+EP+Tick+Flea+Control+Spray+100ml&tag=mypawcare-21'
  },
  {
    id: 'beaphar-flea-spray',
    name: 'Beaphar Caniguard Spot-On for Dogs (3 Pipettes)',
    brand: 'Beaphar',
    category: 'health',
    subCategory: 'Tick & Flea Spray',
    petType: 'dog',
    price: '449 - 599',
    rating: 4.2,
    reviews: 4560,
    image: '/images/products/beaphar-flea-spray.jpg',
    badge: 'Top Rated',
    desc: 'Spot-on treatment kills ticks & fleas for 4 weeks. Easy squeeze pipette application.',
    benefits: ['4 weeks protection per pipette', 'Easy squeeze application', '3 pipettes — 12 weeks coverage'],
    affiliateUrl: 'https://www.amazon.in/s?k=Beaphar+Caniguard+Spot+On+Dogs+3+Pipettes&tag=mypawcare-21'
  },

  // ——— 2. DEWORMING ——————————————————————————————————————————
  {
    id: 'drools-dewormer',
    name: 'Drools Absolute Deworming Tablets for Dogs (10 Tabs)',
    brand: 'Drools',
    category: 'health',
    subCategory: 'Deworming',
    petType: 'dog',
    price: '149 - 299',
    rating: 4.1,
    reviews: 8900,
    image: '/images/products/drools-dewormer.jpg',
    badge: 'Best Seller',
    desc: 'Broad-spectrum dewormer effective against all major worms. Easy-to-feed flavored tablets.',
    benefits: ['Kills all major worms', 'Flavored — easy to feed', 'Vet recommended brand'],
    affiliateUrl: 'https://www.amazon.in/s?k=Drools+Absolute+Deworming+Tablets+Dogs+10&tag=mypawcare-21'
  },
  {
    id: 'beaphar-wormer',
    name: 'Beaphar WORMclear Tablets for Dogs (2 Tabs)',
    brand: 'Beaphar',
    category: 'health',
    subCategory: 'Deworming',
    petType: 'dog',
    price: '309 - 459',
    rating: 4.0,
    reviews: 3450,
    image: '/images/products/beaphar-wormer.jpg',
    badge: 'Premium',
    desc: 'European-grade dewormer effective against roundworms & tapeworms. One tablet per treatment.',
    benefits: ['European veterinary grade', 'Single tablet dosing', 'Effective against all worms'],
    affiliateUrl: 'https://www.amazon.in/s?k=Beaphar+WORMclear+Tablets+Dogs&tag=mypawcare-21'
  },

  // ——— 3. JOINT SUPPLEMENTS ——————————————————————————————————
  {
    id: 'drools-joint-tabs',
    name: 'Drools Absolute Joint Health Supplement for Dogs (50 Tabs)',
    brand: 'Drools',
    category: 'health',
    subCategory: 'Joint Supplement',
    petType: 'dog',
    price: '399 - 549',
    rating: 4.2,
    reviews: 6780,
    image: '/images/products/drools-joint-tabs.jpg',
    badge: 'Best Seller',
    desc: 'Glucosamine & chondroitin formula for healthy joints. Ideal for senior & large breed dogs.',
    benefits: ['Glucosamine & chondroitin', 'Supports joint mobility', 'Ideal for senior dogs'],
    affiliateUrl: 'https://www.amazon.in/s?k=Drools+Absolute+Joint+Health+Supplement+Dogs+50&tag=mypawcare-21'
  },
  {
    id: 'himalaya-joint-guard',
    name: 'Himalaya Joint Guard for Dogs, Joint Care (60 Tabs)',
    brand: 'Himalaya',
    category: 'health',
    subCategory: 'Joint Supplement',
    petType: 'dog',
    price: '249 - 399',
    rating: 4.1,
    reviews: 4560,
    image: '/images/products/himalaya-joint-guard.jpg',
    badge: 'Top Rated',
    desc: 'Herbal joint care with Boswellia & Ashwagandha. Natural anti-inflammatory for active dogs.',
    benefits: ['Natural herbal ingredients', 'Anti-inflammatory action', 'Boswellia & Ashwagandha'],
    affiliateUrl: 'https://www.amazon.in/s?k=Himalaya+Joint+Guard+Dogs+Joint+Care+60&tag=mypawcare-21'
  },

  // ——— 4. FIRST AID ——————————————————————————————————————————
  {
    id: 'pet-first-aid-kit',
    name: 'RC Pet First Aid Kit for Dogs & Cats (45 Pieces)',
    brand: 'RC Pet',
    category: 'health',
    subCategory: 'First Aid Kit',
    petType: 'dog',
    price: '599 - 899',
    rating: 4.0,
    reviews: 2340,
    image: '/images/products/pet-first-aid-kit.webp',
    badge: 'Trending',
    desc: 'Complete 45-piece pet first aid kit for emergencies. Includes bandages, antiseptic & tweezers.',
    benefits: ['45-piece complete kit', 'Compact travel-friendly case', 'Essential emergency supplies'],
    affiliateUrl: 'https://www.amazon.in/s?k=pet+first+aid+kit+dogs+cats+45+pieces&tag=mypawcare-21'
  },
  {
    id: 'himalaya-antiseptic-cream',
    name: 'Himalaya Wound Care Spray for Dogs & Cats (75ml)',
    brand: 'Himalaya',
    category: 'health',
    subCategory: 'First Aid',
    petType: 'dog',
    price: '119 - 199',
    rating: 4.2,
    reviews: 5670,
    image: '/images/products/himalaya-antiseptic-cream.png',
    badge: 'Best Seller',
    desc: 'Herbal wound care spray with antiseptic & healing properties. Safe for all pets.',
    benefits: ['Natural antiseptic formula', 'Promotes faster healing', 'No-sting spray application'],
    affiliateUrl: 'https://www.amazon.in/s?k=Himalaya+Wound+Care+Spray+Dogs+Cats+75ml&tag=mypawcare-21'
  },

  // ============================================================
  // 🐱 CAT → FOOD & NUTRITION
  // ============================================================
  { id: 'whiskas-dry-adult', name: 'Whiskas Adult Dry Cat Food, Tuna Flavour (1.2kg)', brand: 'Whiskas', category: 'food', subCategory: 'Dry Cat Food', petType: 'cat', price: '349 - 499', rating: 4.3, reviews: 18450, image: '/images/products/whiskas-dry-adult.jpg', badge: 'Best Seller', desc: 'India\'s most popular dry cat food with real tuna flavor. Complete nutrition for adult cats.', benefits: ['Real tuna flavour cats love', 'Complete balanced nutrition', 'Crunchy for dental health'], affiliateUrl: 'https://www.amazon.in/s?k=Whiskas+Adult+Dry+Cat+Food+Tuna+1.2kg&tag=mypawcare-21' },
  { id: 'royal-canin-cat-adult', name: 'Royal Canin Indoor Adult Dry Cat Food (2kg)', brand: 'Royal Canin', category: 'food', subCategory: 'Dry Cat Food', petType: 'cat', price: '1,399 - 1,999', rating: 4.5, reviews: 8900, image: '/images/products/royal-canin-cat-adult.jpg', badge: 'Premium', desc: 'Vet-recommended indoor formula with reduced calories. Controls hairballs & maintains ideal weight.', benefits: ['Hairball reduction formula', 'Weight management for indoor cats', 'Vet recommended worldwide'], affiliateUrl: 'https://www.amazon.in/s?k=Royal+Canin+Indoor+Adult+Dry+Cat+Food+2kg&tag=mypawcare-21' },
  { id: 'drools-cat-dry', name: 'Drools Adult Dry Cat Food, Ocean Fish (3kg)', brand: 'Drools', category: 'food', subCategory: 'Dry Cat Food', petType: 'cat', price: '499 - 799', rating: 4.2, reviews: 6780, image: '/images/products/drools-cat-dry.jpg', badge: 'Amazon Choice', desc: 'Affordable ocean fish flavored complete cat food. Rich in Omega-3 for healthy skin & coat.', benefits: ['Real ocean fish protein', 'Omega-3 for shiny coat', 'Great value 3kg pack'], affiliateUrl: 'https://www.amazon.in/s?k=Drools+Adult+Dry+Cat+Food+Ocean+Fish+3kg&tag=mypawcare-21' },
  { id: 'meo-persian-cat', name: 'Me-O Persian Cat Food, Dry (1.1kg)', brand: 'Me-O', category: 'food', subCategory: 'Dry Cat Food', petType: 'cat', price: '399 - 549', rating: 4.1, reviews: 5670, image: '/images/products/meo-persian-cat.png', badge: 'Top Rated', desc: 'Specially formulated for Persian cats with hairball control. Supports long coat health.', benefits: ['Persian breed specific', 'Hairball control formula', 'Long coat nourishment'], affiliateUrl: 'https://www.amazon.in/s?k=Me-O+Persian+Cat+Food+Dry+1.1kg&tag=mypawcare-21' },
  { id: 'whiskas-wet-tuna', name: 'Whiskas Wet Cat Food, Tuna in Jelly (85g x 12)', brand: 'Whiskas', category: 'food', subCategory: 'Wet Cat Food', petType: 'cat', price: '449 - 749', rating: 4.3, reviews: 14560, image: '/images/products/whiskas-wet-tuna.png', badge: 'Best Seller', desc: 'Juicy tuna chunks in delicious jelly. Cats go crazy for this — perfect for picky eaters.', benefits: ['Real tuna chunks in jelly', '12-pouch mega value pack', 'Irresistible for picky eaters'], affiliateUrl: 'https://www.amazon.in/s?k=Whiskas+Wet+Cat+Food+Tuna+Jelly+85g+12+pack&tag=mypawcare-21' },
  { id: 'sheba-wet-cat', name: 'Sheba Rich Premium Wet Cat Food, Fish Mix (85g x 12)', brand: 'Sheba', category: 'food', subCategory: 'Wet Cat Food', petType: 'cat', price: '689 - 989', rating: 4.4, reviews: 7890, image: '/images/products/sheba-wet-cat.jpg', badge: 'Premium', desc: 'Premium fish mix wet food in succulent gravy. Restaurant-quality meal for your cat.', benefits: ['Premium fish & seafood mix', 'Rich succulent gravy', 'Individually sealed freshness'], affiliateUrl: 'https://www.amazon.in/s?k=Sheba+Rich+Premium+Wet+Cat+Food+Fish+Mix+85g+12&tag=mypawcare-21' },
  { id: 'whiskas-kitten-food', name: 'Whiskas Kitten Dry Food, Chicken Flavour (1.1kg)', brand: 'Whiskas', category: 'food', subCategory: 'Kitten Food', petType: 'cat', price: '349 - 499', rating: 4.3, reviews: 9870, image: '/images/products/whiskas-kitten-food.jpeg', badge: 'Best Seller', desc: 'Complete kitten nutrition with real chicken. DHA for brain development & calcium for bones.', benefits: ['DHA for brain development', 'Calcium for strong bones', 'Real chicken protein'], affiliateUrl: 'https://www.amazon.in/s?k=Whiskas+Kitten+Dry+Food+Chicken+1.1kg&tag=mypawcare-21' },
  { id: 'royal-canin-kitten', name: 'Royal Canin Kitten Dry Cat Food (2kg)', brand: 'Royal Canin', category: 'food', subCategory: 'Kitten Food', petType: 'cat', price: '1,299 - 1,899', rating: 4.5, reviews: 5670, image: '/images/products/royal-canin-kitten.jpg', badge: 'Premium', desc: 'Vet-recommended kitten formula for 4-12 months. Supports immune system & healthy growth.', benefits: ['Immune system support', 'Digestive health formula', 'Optimal growth nutrition'], affiliateUrl: 'https://www.amazon.in/s?k=Royal+Canin+Kitten+Dry+Cat+Food+2kg&tag=mypawcare-21' },
  { id: 'purepet-cat-treats', name: 'Purepet Cat Treats, Tuna Flavour (30g x 6)', brand: 'Purepet', category: 'food', subCategory: 'Cat Treats', petType: 'cat', price: '149 - 299', rating: 4.1, reviews: 8900, image: '/images/products/purepet-cat-treats.jpg', badge: 'Best Seller', desc: 'Crunchy cat treats perfect for training & rewards. Real tuna flavour cats can\'t resist.', benefits: ['Real tuna flavour', 'Perfect for training rewards', '6-pack value bundle'], affiliateUrl: 'https://www.amazon.in/s?k=Purepet+Cat+Treats+Tuna+30g+6+pack&tag=mypawcare-21' },
  { id: 'temptations-cat-treats', name: 'Temptations Cat Treats, Chicken Flavour (85g)', brand: 'Temptations', category: 'food', subCategory: 'Cat Treats', petType: 'cat', price: '119 - 199', rating: 4.3, reviews: 11230, image: '/images/products/temptations-cat-treats.jpg', badge: 'Amazon Choice', desc: 'Irresistible crunchy outside, soft inside treats. Shake the pack & watch your cat come running.', benefits: ['Crunchy outside, soft inside', 'Under 2 calories per treat', 'Cats come running for it'], affiliateUrl: 'https://www.amazon.in/s?k=Temptations+Cat+Treats+Chicken+85g&tag=mypawcare-21' },
  { id: 'petvit-cat-multivitamin', name: 'Petvit Multivitamin Tablets for Cats (60 Tabs)', brand: 'Petvit', category: 'food', subCategory: 'Cat Supplements', petType: 'cat', price: '299 - 449', rating: 4.1, reviews: 3450, image: '/images/products/petvit-cat-multivitamin.png', badge: 'Top Rated', desc: 'Complete multivitamin with taurine for heart & eye health. Daily nutrition insurance for cats.', benefits: ['Taurine for heart & eyes', '18 essential vitamins', 'Flavored — easy to feed'], affiliateUrl: 'https://www.amazon.in/s?k=Petvit+Multivitamin+Tablets+Cats+60&tag=mypawcare-21' },

  // ============================================================
  // 🐱 CAT → GROOMING & HYGIENE
  // ============================================================
  { id: 'himalaya-cat-shampoo', name: 'Himalaya Erina Plus Coat Cleanser for Cats (200ml)', brand: 'Himalaya', category: 'grooming', subCategory: 'Cat Shampoo', petType: 'cat', price: '139 - 289', rating: 4.2, reviews: 8900, image: '/images/products/himalaya-cat-shampoo.jpg', badge: 'Best Seller', desc: 'Gentle herbal coat cleanser safe for cats. Controls ticks & fleas with natural ingredients.', benefits: ['Herbal — safe for cats', 'Controls ticks & fleas', 'Built-in conditioner'], affiliateUrl: 'https://www.amazon.in/s?k=Himalaya+Erina+Plus+Coat+Cleanser+Cats+200ml&tag=mypawcare-21' },
  { id: 'captain-zack-cat-shampoo', name: 'Captain Zack Cat Shampoo, Gentle & Tearless (200ml)', brand: 'Captain Zack', category: 'grooming', subCategory: 'Cat Shampoo', petType: 'cat', price: '399 - 549', rating: 4.1, reviews: 2780, image: '/images/products/captain-zack-cat-shampoo.jpg', badge: 'Premium', desc: 'Tearless formula specially designed for sensitive cat skin. pH balanced & paraben free.', benefits: ['Tearless gentle formula', 'pH balanced for cats', 'Paraben & sulfate free'], affiliateUrl: 'https://www.amazon.in/s?k=Captain+Zack+Cat+Shampoo+Gentle+Tearless+200ml&tag=mypawcare-21' },
  { id: 'basil-cat-wipes', name: 'Basil Anti-Bacterial Pet Wipes for Cats (80 Wipes)', brand: 'Basil', category: 'grooming', subCategory: 'Cat Wipes', petType: 'cat', price: '149 - 299', rating: 4.1, reviews: 9870, image: '/images/products/basil-cat-wipes.webp', badge: 'Best Seller', desc: 'Gentle anti-bacterial wipes safe for daily cat cleaning. Aloe vera for soft fur.', benefits: ['Gentle aloe vera formula', 'Anti-bacterial cleaning', 'Safe for daily use'], affiliateUrl: 'https://www.amazon.in/s?k=Basil+Anti+Bacterial+Pet+Wipes+Cats+80&tag=mypawcare-21' },
  { id: 'foodie-puppies-cat-brush', name: 'Foodie Puppies Self-Cleaning Slicker Brush for Cats', brand: 'Foodie Puppies', category: 'grooming', subCategory: 'Grooming Brush', petType: 'cat', price: '199 - 349', rating: 4.1, reviews: 7890, image: '/images/products/foodie-puppies-cat-brush.jpg', badge: 'Best Seller', desc: 'Self-cleaning slicker brush removes loose fur & prevents matting. One-click cleaning.', benefits: ['Self-cleaning one-click', 'Removes loose fur & mats', 'Gentle on cat skin'], affiliateUrl: 'https://www.amazon.in/s?k=Foodie+Puppies+Self+Cleaning+Slicker+Brush+Cat&tag=mypawcare-21' },
  { id: 'furminator-cat-deshedding', name: 'FURminator De-Shedding Tool for Cats (Short Hair)', brand: 'FURminator', category: 'grooming', subCategory: 'De-Shedding Tool', petType: 'cat', price: '1,099 - 1,699', rating: 4.4, reviews: 3450, image: '/images/products/furminator-cat-deshedding.jpg', badge: 'Premium', desc: 'Professional de-shedding tool reduces loose hair by 90%. World\'s #1 de-shedding brand.', benefits: ['Reduces shedding by 90%', 'Stainless steel edge', 'FURejector button for easy cleanup'], affiliateUrl: 'https://www.amazon.in/s?k=FURminator+De+Shedding+Tool+Cats+Short+Hair&tag=mypawcare-21' },
  { id: 'foodie-puppies-cat-nail', name: 'Foodie Puppies Professional Cat Nail Clipper', brand: 'Foodie Puppies', category: 'grooming', subCategory: 'Nail Clipper', petType: 'cat', price: '119 - 199', rating: 4.0, reviews: 6780, image: '/images/products/foodie-puppies-cat-nail.png', badge: 'Best Seller', desc: 'Small-sized nail clipper designed for cat claws. Safety guard prevents over-cutting.', benefits: ['Cat-sized precision cutting', 'Safety guard included', 'Sharp stainless steel blade'], affiliateUrl: 'https://www.amazon.in/s?k=Foodie+Puppies+Professional+Cat+Nail+Clipper&tag=mypawcare-21' },
  { id: 'himalaya-cat-ear', name: 'Himalaya Ear Cleansing Drops for Cats (100ml)', brand: 'Himalaya', category: 'grooming', subCategory: 'Ear Cleaner', petType: 'cat', price: '119 - 199', rating: 4.2, reviews: 4560, image: '/images/products/himalaya-cat-ear.webp', badge: 'Top Rated', desc: 'Herbal ear drops that gently dissolve wax & prevent infections. Safe for kittens too.', benefits: ['Herbal antiseptic formula', 'Safe for kittens', 'Prevents ear infections'], affiliateUrl: 'https://www.amazon.in/s?k=Himalaya+Ear+Cleansing+Drops+Cats+100ml&tag=mypawcare-21' }
];

// CAT TOYS, ACCESSORIES, ESSENTIALS, FURNITURE, TRAVEL, HEALTH
const CAT_REMAINING = [
  { id: 'cat-teaser-wand', name: 'Foodie Puppies Interactive Cat Teaser Wand (Set of 5)', brand: 'Foodie Puppies', category: 'toys', subCategory: 'Teaser Toys', petType: 'cat', price: '199 - 349', rating: 4.1, reviews: 11230, image: '/images/products/cat-teaser-wand.jpg', badge: 'Best Seller', desc: '5-piece feather teaser set triggers hunting instinct. Hours of interactive play.', benefits: ['5 interchangeable feathers', 'Triggers hunting instinct', 'Great bonding activity'], affiliateUrl: 'https://www.amazon.in/s?k=cat+teaser+wand+toy+feather+set+5&tag=mypawcare-21' },
  { id: 'cat-laser-toy', name: 'Foodie Puppies LED Laser Pointer Toy for Cats', brand: 'Foodie Puppies', category: 'toys', subCategory: 'Laser Toys', petType: 'cat', price: '119 - 199', rating: 4.0, reviews: 8900, image: '/images/products/cat-laser-toy.jpg', badge: 'Amazon Choice', desc: 'Red LED laser pointer drives cats wild. Perfect for exercise & mental stimulation.', benefits: ['Red laser cats love', 'Promotes exercise', 'Compact & portable'], affiliateUrl: 'https://www.amazon.in/s?k=LED+laser+pointer+toy+cats&tag=mypawcare-21' },
  { id: 'cat-ball-toy-set', name: 'Pets Empire Cat Ball Toys with Bell (Set of 12)', brand: 'Pets Empire', category: 'toys', subCategory: 'Ball Toys', petType: 'cat', price: '149 - 299', rating: 4.1, reviews: 6780, image: '/images/products/cat-ball-toy-set.png', badge: 'Best Seller', desc: 'Colorful jingling balls cats love to bat around. Keeps indoor cats active.', benefits: ['12-piece value set', 'Bell inside each ball', 'Colorful & lightweight'], affiliateUrl: 'https://www.amazon.in/s?k=cat+ball+toys+bell+set+12&tag=mypawcare-21' },
  { id: 'cat-catnip-toy', name: 'Foodie Puppies Catnip Plush Toy for Cats (Set of 3)', brand: 'Foodie Puppies', category: 'toys', subCategory: 'Catnip Toys', petType: 'cat', price: '199 - 349', rating: 4.2, reviews: 5670, image: '/images/products/cat-catnip-toy.jpg', badge: 'Top Rated', desc: 'Premium catnip-filled plush toys. Cats go crazy — roll, flip & play for hours.', benefits: ['Premium catnip filling', 'Soft plush — safe to bite', 'Set of 3 fun shapes'], affiliateUrl: 'https://www.amazon.in/s?k=catnip+plush+toy+cats+set+3&tag=mypawcare-21' },
  { id: 'cat-scratching-toy', name: 'Foodie Puppies Corrugated Cardboard Cat Scratcher', brand: 'Foodie Puppies', category: 'toys', subCategory: 'Scratching Toy', petType: 'cat', price: '249 - 399', rating: 4.0, reviews: 4560, image: '/images/products/cat-scratching-toy.jpg', badge: 'Best Seller', desc: 'Cardboard scratcher satisfies scratching urge. Saves furniture from claws.', benefits: ['Saves furniture', 'Includes free catnip', 'Eco-friendly cardboard'], affiliateUrl: 'https://www.amazon.in/s?k=corrugated+cardboard+cat+scratcher&tag=mypawcare-21' },
  { id: 'cat-collar-bell', name: 'Pets Empire Cat Collar with Bell (Pack of 2)', brand: 'Pets Empire', category: 'accessories', subCategory: 'Cat Collar', petType: 'cat', price: '119 - 199', rating: 4.1, reviews: 9870, image: '/images/products/cat-collar-bell.jpg', badge: 'Best Seller', desc: 'Cute adjustable collars with bells. Breakaway buckle for cat safety.', benefits: ['Breakaway safety buckle', 'Cute bell attached', 'Pack of 2 colors'], affiliateUrl: 'https://www.amazon.in/s?k=cat+collar+bell+adjustable+pack+2&tag=mypawcare-21' },
  { id: 'cat-harness-leash', name: 'Pets Empire Cat Harness & Leash Set', brand: 'Pets Empire', category: 'accessories', subCategory: 'Harness & Leash', petType: 'cat', price: '249 - 399', rating: 4.0, reviews: 5670, image: '/images/products/cat-harness-leash.jpg', badge: 'Top Rated', desc: 'Escape-proof harness with matching leash. Safe outdoor adventures.', benefits: ['Escape-proof design', 'Breathable mesh', 'Leash included'], affiliateUrl: 'https://www.amazon.in/s?k=cat+harness+leash+set+adjustable&tag=mypawcare-21' },
  { id: 'cat-litter-box', name: 'Foodie Puppies Enclosed Cat Litter Box with Scoop', brand: 'Foodie Puppies', category: 'essentials', subCategory: 'Litter Box', petType: 'cat', price: '699 - 999', rating: 4.1, reviews: 7890, image: '/images/products/cat-litter-box.jpg', badge: 'Best Seller', desc: 'Enclosed litter box with odor-trapping lid. Includes free scoop.', benefits: ['Enclosed — traps odor', 'Free scoop included', 'Easy top-entry'], affiliateUrl: 'https://www.amazon.in/s?k=enclosed+cat+litter+box+scoop+large&tag=mypawcare-21' },
  { id: 'drools-cat-litter', name: 'Drools Clumping Cat Litter, Lavender (5kg)', brand: 'Drools', category: 'essentials', subCategory: 'Cat Litter', petType: 'cat', price: '349 - 499', rating: 4.2, reviews: 11230, image: '/images/products/drools-cat-litter.jpg', badge: 'Best Seller', desc: 'Fast-clumping bentonite litter with lavender scent. Superior odor control.', benefits: ['Fast clumping', 'Lavender odor control', '99% dust-free'], affiliateUrl: 'https://www.amazon.in/s?k=Drools+Clumping+Cat+Litter+Lavender+5kg&tag=mypawcare-21' },
  { id: 'purepet-cat-litter', name: 'Purepet Clumping Cat Litter, Lemon (5kg)', brand: 'Purepet', category: 'essentials', subCategory: 'Cat Litter', petType: 'cat', price: '299 - 449', rating: 4.1, reviews: 8900, image: '/images/products/purepet-cat-litter.jpg', badge: 'Amazon Choice', desc: 'Budget-friendly clumping litter with lemon freshness.', benefits: ['Budget-friendly', 'Lemon scented', 'Low dust'], affiliateUrl: 'https://www.amazon.in/s?k=Purepet+Clumping+Cat+Litter+Lemon+5kg&tag=mypawcare-21' },
  { id: 'cat-bed-donut', name: 'Pets Empire Donut Cat Bed, Calming (Medium)', brand: 'Pets Empire', category: 'essentials', subCategory: 'Cat Bed', petType: 'cat', price: '499 - 799', rating: 4.2, reviews: 6780, image: '/images/products/cat-bed-donut.jpg', badge: 'Best Seller', desc: 'Donut-shaped calming bed. Cats love to curl up & feel secure.', benefits: ['Calming raised-edge', 'Super soft faux fur', 'Machine washable'], affiliateUrl: 'https://www.amazon.in/s?k=donut+cat+bed+calming+washable&tag=mypawcare-21' },
  { id: 'cat-bowl-ceramic', name: 'Foodie Puppies Ceramic Elevated Cat Bowl (Set of 2)', brand: 'Foodie Puppies', category: 'essentials', subCategory: 'Food Bowl', petType: 'cat', price: '349 - 499', rating: 4.1, reviews: 5670, image: '/images/products/cat-bowl-ceramic.webp', badge: 'Top Rated', desc: 'Tilted ceramic bowls reduce neck strain. Whisker-friendly design.', benefits: ['Tilted — less neck strain', 'Whisker-friendly', 'Ceramic — easy clean'], affiliateUrl: 'https://www.amazon.in/s?k=ceramic+elevated+cat+bowl+set+2&tag=mypawcare-21' },
  { id: 'cat-scratching-post', name: 'Foodie Puppies Cat Scratching Post with Sisal (60cm)', brand: 'Foodie Puppies', category: 'furniture', subCategory: 'Scratching Post', petType: 'cat', price: '599 - 899', rating: 4.1, reviews: 6780, image: '/images/products/cat-scratching-post.jpg', badge: 'Best Seller', desc: 'Sisal-wrapped post with hanging toy. Saves furniture.', benefits: ['Natural sisal rope', 'Hanging ball toy', 'Sturdy base'], affiliateUrl: 'https://www.amazon.in/s?k=cat+scratching+post+sisal+60cm&tag=mypawcare-21' },
  { id: 'cat-tree-tower', name: 'Pets Empire Multi-Level Cat Tree Tower (120cm)', brand: 'Pets Empire', category: 'furniture', subCategory: 'Cat Tree', petType: 'cat', price: '2,299 - 2,899', rating: 4.2, reviews: 3450, image: '/images/products/cat-tree-tower.jpg', badge: 'Premium', desc: 'Multi-level center with condo & scratching posts. Cat paradise!', benefits: ['Multiple levels', 'Built-in condo', 'Sisal posts'], affiliateUrl: 'https://www.amazon.in/s?k=multi+level+cat+tree+tower+120cm&tag=mypawcare-21' },
  { id: 'cat-window-perch', name: 'Cat Window Perch Hammock with Suction Cups', brand: 'Generic', category: 'furniture', subCategory: 'Window Perch', petType: 'cat', price: '449 - 599', rating: 4.0, reviews: 4560, image: '/images/products/cat-window-perch.jpeg', badge: 'Trending', desc: 'Window perch for bird watching. Holds 15kg.', benefits: ['Strong suction cups', 'No tools needed', 'Cats love it'], affiliateUrl: 'https://www.amazon.in/s?k=cat+window+perch+hammock+suction&tag=mypawcare-21' },
  { id: 'cat-carrier-bag', name: 'Pets Empire Airline Approved Cat Carrier (Medium)', brand: 'Pets Empire', category: 'travel', subCategory: 'Cat Carrier', petType: 'cat', price: '799 - 1,099', rating: 4.1, reviews: 5670, image: '/images/products/cat-carrier-bag.jpg', badge: 'Best Seller', desc: 'Airline-approved carrier with mesh ventilation. Foldable.', benefits: ['Airline approved', 'Mesh ventilation', 'Foldable'], affiliateUrl: 'https://www.amazon.in/s?k=airline+approved+cat+carrier+medium&tag=mypawcare-21' },
  { id: 'cat-backpack-carrier', name: 'Cat Backpack Carrier with Bubble Window', brand: 'Generic', category: 'travel', subCategory: 'Cat Carrier', petType: 'cat', price: '1,099 - 1,699', rating: 4.2, reviews: 3450, image: '/images/products/cat-backpack-carrier.jpg', badge: 'Premium', desc: 'Space capsule backpack with transparent window. Your cat sees the world!', benefits: ['Transparent bubble window', 'Hands-free backpack', 'Ventilation holes'], affiliateUrl: 'https://www.amazon.in/s?k=cat+backpack+carrier+bubble+window&tag=mypawcare-21' },
  { id: 'himalaya-cat-flea', name: 'Himalaya Erina-EP Tick & Flea Spray for Cats (100ml)', brand: 'Himalaya', category: 'health', subCategory: 'Flea Treatment', petType: 'cat', price: '149 - 299', rating: 4.1, reviews: 5670, image: '/images/products/himalaya-cat-flea.jpg', badge: 'Best Seller', desc: 'Herbal tick & flea spray safe for cats.', benefits: ['Herbal — safe', 'Controls ticks & fleas', 'Safe for kittens'], affiliateUrl: 'https://www.amazon.in/s?k=Himalaya+Erina+EP+Tick+Flea+Spray+Cats&tag=mypawcare-21' },
  { id: 'cat-hairball-paste', name: 'Beaphar Malt Paste for Cats, Hairball Remedy (100g)', brand: 'Beaphar', category: 'health', subCategory: 'Hairball Control', petType: 'cat', price: '399 - 549', rating: 4.2, reviews: 4560, image: '/images/products/cat-hairball-paste.png', badge: 'Top Rated', desc: 'Malt paste dissolves hairballs. Cats love the taste.', benefits: ['Prevents hairballs', 'Tasty malt flavor', 'European formula'], affiliateUrl: 'https://www.amazon.in/s?k=Beaphar+Malt+Paste+Cats+Hairball+100g&tag=mypawcare-21' },
  { id: 'drools-cat-dewormer', name: 'Drools Deworming Tablets for Cats (10 Tabs)', brand: 'Drools', category: 'health', subCategory: 'Deworming', petType: 'cat', price: '149 - 299', rating: 4.1, reviews: 6780, image: '/images/products/drools-cat-dewormer.jpg', badge: 'Best Seller', desc: 'Broad-spectrum dewormer. Effective against all worms.', benefits: ['Kills all worms', 'Flavored tablet', 'Vet recommended'], affiliateUrl: 'https://www.amazon.in/s?k=Drools+Deworming+Tablets+Cats+10&tag=mypawcare-21' },
  { id: 'petvit-cat-supplement', name: 'Petvit Skin & Coat Supplement for Cats (60 Tabs)', brand: 'Petvit', category: 'health', subCategory: 'Cat Supplement', petType: 'cat', price: '299 - 449', rating: 4.0, reviews: 3450, image: '/images/products/petvit-cat-supplement.png', badge: 'Trending', desc: 'Omega-3 & biotin for shiny coat. Reduces shedding.', benefits: ['Omega-3 & biotin', 'Reduces shedding', 'Shiny coat'], affiliateUrl: 'https://www.amazon.in/s?k=Petvit+Skin+Coat+Supplement+Cats+60&tag=mypawcare-21' }
];


export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activePet, setActivePet] = useState(searchParams.get('type') || 'dog');
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const type = searchParams.get('type');
    if (type) {
      setActivePet(type);
    } else {
      // Default to user's first pet type if available
      const fetchUserPet = async () => {
        try {
          const pets = await api.getPets();
          if (pets && pets.length > 0) {
            const firstPetType = pets[0].type.toLowerCase();
            if (firstPetType === 'cat' || firstPetType === 'dog') {
              setActivePet(firstPetType);
              setSearchParams({ type: firstPetType });
            }
          }
        } catch (err) {
          console.error("Failed to fetch user pets", err);
        }
      };
      fetchUserPet();
    }
  }, [searchParams, setSearchParams]);

  const currentCategories = activePet === 'dog' ? DOG_CATEGORIES : CAT_CATEGORIES;
  const currentTheme = STORE_THEMES[activePet] || STORE_THEMES.dog;

  const ALL_PRODUCTS = [...CURATED_PRODUCTS, ...CAT_REMAINING
  // MULTI-ANIMAL PRODUCTS
  ,
  { id: 'boltz-bird-food', name: 'Boltz Bird Food for Budgies (1.2 kg)', brand: 'Boltz', category: 'food', subCategory: 'Bird Food', petType: 'bird', price: '299', rating: 4.3, reviews: 12500, image: 'https://m.media-amazon.com/images/I/71u9sJqP64L._AC_SL1500_.jpg', badge: 'Best Seller', desc: 'Premium seed mix tailored for Budgies to boost immunity and maintain healthy feathers.', benefits: ['100% Natural', 'High in vitamins', 'Easily digestible'], affiliateUrl: 'https://www.amazon.in/s?k=Boltz+Bird+Food+for+Budgies+1.2kg&tag=mypawcare-21' },
  { id: 'vitapol-bird-treat', name: 'Vitapol Smakers for Cockatiel (Fruit Flavor)', brand: 'Vitapol', category: 'toys', subCategory: 'Bird Treat', petType: 'bird', price: '399', rating: 4.5, reviews: 3200, image: 'https://m.media-amazon.com/images/I/71G1P6Q2G4L._SL1500_.jpg', badge: 'Amazon Choice', desc: 'Nutritious fruit treat sticks that encourage natural foraging behavior.', benefits: ['Rich in natural fruits', 'Wooden stick included', 'Promotes active foraging'], affiliateUrl: 'https://www.amazon.in/s?k=Vitapol+Smakers+for+Cockatiel&tag=mypawcare-21' },
  { id: 'bird-cage', name: 'Jainsons Pet Products Medium Bird Cage', brand: 'Jainsons', category: 'cages', subCategory: 'Bird Cage', petType: 'bird', price: '899', rating: 4.1, reviews: 1800, image: 'https://m.media-amazon.com/images/I/71gV4X6QfLL._SL1500_.jpg', badge: 'Top Rated', desc: 'Spacious wire cage with feeding bowls and perches.', benefits: ['Anti-rust coating', 'Includes feeding bowls', 'Removable bottom tray'], affiliateUrl: 'https://www.amazon.in/s?k=Jainsons+Pet+Products+Medium+Bird+Cage&tag=mypawcare-21' },
  { id: 'vitapol-rabbit-food', name: 'Vitapol Economic Food for Rabbit (1.2 kg)', brand: 'Vitapol', category: 'food', subCategory: 'Rabbit Pellets', petType: 'rabbit', price: '450', rating: 4.4, reviews: 4100, image: 'https://m.media-amazon.com/images/I/71lR4k5aY6L._SL1500_.jpg', badge: 'Best Seller', desc: 'A balanced everyday diet consisting of high-quality pellets.', benefits: ['High fiber content', 'Helps wear teeth down', 'Enriched with vitamins'], affiliateUrl: 'https://www.amazon.in/s?k=Vitapol+Economic+Food+for+Rabbit+1.2kg&tag=mypawcare-21' },
  { id: 'rabbit-hay', name: 'Boltz Premium Timothy Hay for Rabbits (400g)', brand: 'Boltz', category: 'food', subCategory: 'Rabbit Hay', petType: 'rabbit', price: '399', rating: 4.2, reviews: 2500, image: 'https://m.media-amazon.com/images/I/81xU-aG+q6L._SL1500_.jpg', badge: 'Amazon Choice', desc: 'Sun-cured Timothy hay providing essential roughage.', benefits: ['100% natural hay', 'Prevents obesity', 'High fiber'], affiliateUrl: 'https://www.amazon.in/s?k=Boltz+Premium+Timothy+Hay+for+Rabbits&tag=mypawcare-21' },
  { id: 'taiyo-fish-food', name: 'Taiyo Pluss Discovery Special Fish Food (1 kg)', brand: 'Taiyo', category: 'food', subCategory: 'Fish Food', petType: 'fish', price: '350', rating: 4.2, reviews: 15800, image: 'https://m.media-amazon.com/images/I/61gR21T39NL._SL1000_.jpg', badge: 'Best Seller', desc: 'Highly nutritious daily diet formulated with color-enhancing ingredients.', benefits: ['Does not cloud water', 'Spirulina added', 'Promotes rapid growth'], affiliateUrl: 'https://www.amazon.in/s?k=Taiyo+Pluss+Discovery+Special+Fish+Food+1kg&tag=mypawcare-21' },
  { id: 'sobo-filter', name: 'SOBO WP-1050F Internal Aquarium Filter Pump', brand: 'SOBO', category: 'aquarium', subCategory: 'Filter', petType: 'fish', price: '299', rating: 4.0, reviews: 5500, image: 'https://m.media-amazon.com/images/I/61z+H3P7t1L._SL1500_.jpg', badge: 'Amazon Choice', desc: 'Silent and highly efficient internal water filter.', benefits: ['Mechanical filtration', 'Easy to install', 'Energy efficient'], affiliateUrl: 'https://www.amazon.in/s?k=SOBO+WP-1050F+Internal+Aquarium+Filter&tag=mypawcare-21' },
  { id: 'seachem-prime', name: 'Seachem Prime Water Conditioner (100 ml)', brand: 'Seachem', category: 'aquarium', subCategory: 'Conditioner', petType: 'fish', price: '599', rating: 4.7, reviews: 4200, image: 'https://m.media-amazon.com/images/I/61P1P8N8+7L._SL1500_.jpg', badge: 'Premium', desc: 'Ultimate concentrated conditioner that safely removes chlorine.', benefits: ['Detoxifies ammonia', 'Promotes slime coat', 'Highly concentrated'], affiliateUrl: 'https://www.amazon.in/s?k=Seachem+Prime+Water+Conditioner+100ml&tag=mypawcare-21' },
  { id: 'hamster-food', name: 'Vitapol Economic Food for Hamster (1.2 kg)', brand: 'Vitapol', category: 'food', subCategory: 'Hamster Food', petType: 'hamster', price: '450', rating: 4.4, reviews: 2900, image: 'https://m.media-amazon.com/images/I/71Q3Xq1j8uL._SL1500_.jpg', badge: 'Best Seller', desc: 'Carefully formulated blend of grains and dried veggies.', benefits: ['Complete nutrition', 'Controls tooth growth', 'Natural ingredients'], affiliateUrl: 'https://www.amazon.in/s?k=Vitapol+Economic+Food+for+Hamster&tag=mypawcare-21' },
  { id: 'hamster-wheel', name: 'Savic Hamster Exercise Wheel (Medium)', brand: 'Savic', category: 'cages', subCategory: 'Hamster Wheel', petType: 'hamster', price: '399', rating: 4.0, reviews: 850, image: 'https://m.media-amazon.com/images/I/61H4h4F7R1L._SL1000_.jpg', badge: 'Trending', desc: 'Silent, smooth-spinning exercise wheel.', benefits: ['Solid running surface', 'Whisper-quiet', 'Easily attaches to cage'], affiliateUrl: 'https://www.amazon.in/s?k=Savic+Hamster+Exercise+Wheel&tag=mypawcare-21' },
  { id: 'goat-mineral', name: 'Intas Chelated Agrimin Forte Mineral Mixture (1 kg)', brand: 'Intas', category: 'feed', subCategory: 'Supplement', petType: 'goat', price: '250', rating: 4.3, reviews: 1200, image: 'https://m.media-amazon.com/images/I/71X8k4j3LSL._SL1500_.jpg', badge: 'Best Seller', desc: 'High-quality chelated mineral mixture to improve health.', benefits: ['Enhances fertility', 'Prevents deficiency', 'Improves immunity'], affiliateUrl: 'https://www.amazon.in/s?k=Intas+Chelated+Agrimin+Forte+Mineral+Mixture&tag=mypawcare-21' },
  { id: 'horse-ointment', name: 'Himalaya Himax Ointment for Animal Wound Care (50g)', brand: 'Himalaya', category: 'grooming', subCategory: 'Health', petType: 'horse', price: '100', rating: 4.5, reviews: 4100, image: 'https://m.media-amazon.com/images/I/51wX5C9jLWL._SL1000_.jpg', badge: 'Best Seller', desc: 'Broad-spectrum antifungal herbal ointment.', benefits: ['Fast healing', 'Fly-repellent', 'Herbal formula'], affiliateUrl: 'https://www.amazon.in/s?k=Himalaya+Himax+Ointment+for+Animal+Wound+Care&tag=mypawcare-21' },
  { id: 'horse-brush', name: 'Equine Premium Grooming Brush & Curry Comb Set', brand: 'Equine', category: 'grooming', subCategory: 'Brush', petType: 'horse', price: '899', rating: 4.2, reviews: 300, image: 'https://m.media-amazon.com/images/I/71k4QYjY51L._SL1500_.jpg', badge: 'Premium', desc: 'Comprehensive horse grooming kit.', benefits: ['Removes deep mud', 'Stimulates natural oils', 'Ergonomic grip'], affiliateUrl: 'https://www.amazon.in/s?k=Equine+Premium+Grooming+Brush+Set&tag=mypawcare-21' },
  { id: 'cow-calcium', name: 'Virbac Ostovet Forte Liquid Calcium (5 Liters)', brand: 'Virbac', category: 'feed', subCategory: 'Supplement', petType: 'cow', price: '800', rating: 4.5, reviews: 2800, image: 'https://m.media-amazon.com/images/I/71e9u1j3o1L._SL1500_.jpg', badge: 'Best Seller', desc: 'High-performance liquid calcium to maximize milk yield.', benefits: ['Increases milk production', 'Prevents milk fever', 'Fortified with Vitamin D3'], affiliateUrl: 'https://www.amazon.in/s?k=Virbac+Ostovet+Forte+Liquid+Calcium+5+Liters&tag=mypawcare-21' },
  { id: 'cow-digestion', name: 'Ayurvet Ruchamax Digestion Powder for Cattle (1 kg)', brand: 'Ayurvet', category: 'health', subCategory: 'Digestion', petType: 'cow', price: '350', rating: 4.3, reviews: 1500, image: 'https://m.media-amazon.com/images/I/71Yv3P0xMML._SL1500_.jpg', badge: 'Amazon Choice', desc: 'Natural herbal digestive stimulant.', benefits: ['Treats indigestion', 'Normalizes rumen pH', 'Increases feed intake'], affiliateUrl: 'https://www.amazon.in/s?k=Ayurvet+Ruchamax+Digestion+Powder&tag=mypawcare-21' }
];
  const filteredProducts = ALL_PRODUCTS.filter(p => {
    const matchesPet = p.petType === activePet;
    const matchesCategory = activeCategory === 'all' || p.category === activeCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         p.brand.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesPet && matchesCategory && matchesSearch;
  });

  const handlePetChange = (type) => {
    setActivePet(type);
    setActiveCategory('all');
    setSearchParams({ type });
  };

  return (
    <div className="products-container" style={{ background: '#f8fafc', minHeight: '100vh', paddingBottom: '6rem' }}>
      {/* Premium Hero Section */}
      <div className="store-hero" style={{
        background: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.4)), url('${currentTheme.heroImage}')`,
        backgroundSize: 'cover',
        backgroundPosition: currentTheme.position,
        padding: '3rem 1.5rem',
        color: '#fff',
        textAlign: 'center',
        position: 'relative',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        transition: 'all 0.5s ease'
      }}>
        <h1 style={{ fontSize: '2.8rem', fontWeight: '900', marginBottom: '0.8rem', letterSpacing: '-0.5px' }}>
          PawCare <span style={{ color: '#22c55e' }}>Store</span>
        </h1>
        <p style={{ fontSize: '1.1rem', opacity: 0.9, marginBottom: '2rem', fontWeight: '500' }}>
          Premium essentials for your {activePet === 'dog' ? 'loyal companion' : 'graceful feline'}.
        </p>

        {/* Amazon-style Search Bar */}
        <div style={{ 
          maxWidth: '600px', 
          margin: '0 auto', 
          background: '#fff', 
          borderRadius: '12px', 
          display: 'flex', 
          overflow: 'hidden',
          boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
        }}>
          <div style={{ 
            background: '#f3f4f6', 
            padding: '0 1rem', 
            display: 'flex', 
            alignItems: 'center', 
            color: '#4b5563',
            fontSize: '0.85rem',
            fontWeight: '600',
            borderRight: '1px solid #e5e7eb',
            cursor: 'pointer'
          }}>
            All <FiChevronRight size={14} style={{ marginLeft: '4px' }} />
          </div>
          <input 
            type="text" 
            placeholder={`Search for ${activePet} products...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ 
              flex: 1, 
              border: 'none', 
              padding: '1rem', 
              outline: 'none', 
              fontSize: '1rem',
              color: '#1f2937'
            }} 
          />
          <button style={{ 
            background: '#febd69', 
            border: 'none', 
            padding: '0 1.5rem', 
            display: 'flex', 
            alignItems: 'center', 
            cursor: 'pointer' 
          }}>
            <FiSearch size={20} color="#333" />
          </button>
        </div>
      </div>

      <div style={{ padding: '1.5rem' }}>
        
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
        </div>

        {/* Section Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#1f2937' }}>
            {activePet.toUpperCase()} <span style={{ color: '#22c55e' }}>CATEGORIES</span>
          </h2>
          <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: '600' }}>Browse All</span>
        </div>

        {/* Horizontal Category List */}
        <div style={{ 
          display: 'flex', 
          gap: '1rem', 
          overflowX: 'auto', 
          paddingBottom: '1rem', 
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}>
          <button 
            onClick={() => setActiveCategory('all')}
            style={{
              padding: '1rem 1.5rem',
              borderRadius: '20px',
              border: 'none',
              background: activeCategory === 'all' ? '#1f2937' : '#fff',
              color: activeCategory === 'all' ? '#fff' : '#4b5563',
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              whiteSpace: 'nowrap',
              boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
              cursor: 'pointer'
            }}
          >
            <FiGrid /> All Products
          </button>
          {currentCategories.map(cat => (
            <button 
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              style={{
                padding: '1rem 1.5rem',
                borderRadius: '20px',
                border: 'none',
                background: activeCategory === cat.id ? '#22c55e' : '#fff',
                color: activeCategory === cat.id ? '#fff' : '#4b5563',
                fontWeight: '700',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                whiteSpace: 'nowrap',
                boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
                cursor: 'pointer'
              }}
            >
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>

        {/* Product Grid Area */}
        <div style={{ marginTop: '2rem' }}>
          {filteredProducts.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
              {filteredProducts.map(product => {
                const badgeColors = {
                  'Best Seller': { bg: '#ef4444', text: '#fff' },
                  'Amazon Choice': { bg: '#232f3e', text: '#f5a623' },
                  'Top Rated': { bg: '#3b82f6', text: '#fff' },
                  'Trending': { bg: '#8b5cf6', text: '#fff' },
                  'Premium': { bg: '#f59e0b', text: '#fff' },
                  'Vet Recommended': { bg: '#059669', text: '#fff' }
                };
                const badgeStyle = badgeColors[product.badge] || { bg: '#1f2937', text: '#fff' };
                
                return (
                <div key={product.id} className="premium-product-card" style={{
                  background: '#fff',
                  borderRadius: '28px',
                  padding: '1rem',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.04)',
                  border: '1px solid #f1f5f9',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  flexDirection: 'column'
                }}>
                  <div 
                    onClick={() => window.open(product.affiliateUrl, '_blank')}
                    style={{
                      position: 'relative',
                      height: '220px',
                      borderRadius: '20px',
                      overflow: 'hidden',
                      backgroundColor: '#f8fafc',
                      marginBottom: '1rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <img 
                      src={product.image} 
                      alt={product.name}
                      referrerPolicy="no-referrer"
                      crossOrigin="anonymous"
                      onError={(e) => {
                        e.target.onerror = null; 
                        e.target.src = "https://images.unsplash.com/photo-1589924691106-073b697395a6?w=500&q=80";
                      }}
                      style={{
                        maxWidth: '90%',
                        maxHeight: '90%',
                        objectFit: 'contain',
                        padding: '0.8rem',
                        transition: 'transform 0.5s ease'
                      }}
                    />
                    {product.badge && (
                      <div style={{
                        position: 'absolute',
                        top: '12px',
                        left: '12px',
                        background: badgeStyle.bg,
                        color: badgeStyle.text,
                        padding: '4px 10px',
                        borderRadius: '8px',
                        fontSize: '0.65rem',
                        fontWeight: '800',
                        letterSpacing: '0.3px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                      }}>
                        {product.badge}
                      </div>
                    )}
                  </div>

                  <div style={{ padding: '0 0.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.3rem' }}>
                      <span style={{ fontSize: '0.65rem', fontWeight: '700', color: '#22c55e', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{product.brand}</span>
                      {product.subCategory && (
                        <span style={{ 
                          fontSize: '0.6rem', 
                          fontWeight: '600', 
                          color: '#8b5cf6', 
                          background: '#f5f3ff', 
                          padding: '2px 8px', 
                          borderRadius: '6px' 
                        }}>
                          {product.subCategory}
                        </span>
                      )}
                    </div>
                    
                    <h3 style={{ 
                      fontSize: '0.9rem', 
                      fontWeight: '800', 
                      color: '#1f2937', 
                      marginBottom: '0.3rem',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      lineHeight: '1.4'
                    }}>
                      {product.name}
                    </h3>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <div style={{ display: 'flex', color: '#f59e0b', fontSize: '0.8rem' }}>
                        {'⭐'.repeat(Math.floor(product.rating))}
                        <span style={{ color: '#e2e8f0' }}>{'⭐'.repeat(5 - Math.floor(product.rating))}</span>
                      </div>
                      <span style={{ fontSize: '0.65rem', color: '#64748b', fontWeight: '600' }}>({product.reviews?.toLocaleString()})</span>
                    </div>

                    {product.desc && (
                      <p style={{ 
                        fontSize: '0.75rem', 
                        color: '#64748b', 
                        lineHeight: '1.5', 
                        marginBottom: '0.5rem',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}>
                        {product.desc}
                      </p>
                    )}

                    {product.benefits && (
                      <div style={{ marginBottom: '0.6rem' }}>
                        {product.benefits.slice(0, 3).map((b, i) => (
                          <div key={i} style={{ 
                            fontSize: '0.68rem', 
                            color: '#374151', 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '4px',
                            marginBottom: '2px'
                          }}>
                            <span style={{ color: '#22c55e', fontWeight: '700' }}>✔</span> {b}
                          </div>
                        ))}
                      </div>
                    )}

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: '0.5rem', borderTop: '1px solid #f1f5f9' }}>
                      <div>
                        <span style={{ fontSize: '0.75rem', fontWeight: '600', color: '#64748b', marginRight: '2px' }}>₹</span>
                        <span style={{ fontSize: '1.05rem', fontWeight: '900', color: '#1f2937' }}>{product.price}</span>
                      </div>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(product.affiliateUrl, '_blank');
                        }}
                        style={{
                          padding: '0.65rem 1.2rem',
                          borderRadius: '12px',
                          border: 'none',
                          background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                          color: '#fff',
                          fontWeight: '700',
                          fontSize: '0.78rem',
                          cursor: 'pointer',
                          boxShadow: '0 4px 12px rgba(34, 197, 94, 0.2)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <FiShoppingCart size={13} /> Buy Now
                      </button>
                    </div>
                  </div>
                </div>
              );})}
            </div>
          ) : (
            <div style={{ 
              background: '#fff', 
              borderRadius: '32px', 
              padding: '5rem 2rem', 
              textAlign: 'center',
              border: '2px dashed #e2e8f0'
            }}>
              <div style={{ 
                width: '80px', 
                height: '80px', 
                background: '#f8fafc', 
                borderRadius: '50%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                margin: '0 auto 1.5rem'
              }}>
                <FiBox size={40} color="#94a3b8" />
              </div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#1f2937', marginBottom: '0.5rem' }}>
                {activeCategory === 'all' ? `Coming Soon to ${activePet} Store!` : `${activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)} Products Coming Soon!`}
              </h3>
              <p style={{ color: '#64748b', maxWidth: '400px', margin: '0 auto', lineHeight: '1.6' }}>
                We are carefully hand-picking the best {activePet} products for this section. Please check back later!
              </p>
              <button 
                onClick={() => setActivePet(activePet === 'dog' ? 'cat' : 'dog')}
                style={{
                  marginTop: '2rem',
                  padding: '1rem 2rem',
                  borderRadius: '16px',
                  border: 'none',
                  background: '#1f2937',
                  color: '#fff',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                Switch to {activePet === 'dog' ? 'Cat' : 'Dog'} Store
              </button>
            </div>
          )}
        </div>

        {/* Amazon-style Benefits Footer */}
        <div style={{ 
          marginTop: '4rem', 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '1.5rem',
          padding: '2rem',
          background: '#fff',
          borderRadius: '32px',
          boxShadow: '0 4px 15px rgba(0,0,0,0.02)'
        }}>
          <div style={{ textAlign: 'center' }}>
            <FiTruck size={24} color="#22c55e" style={{ marginBottom: '0.5rem' }} />
            <h4 style={{ fontSize: '1rem', fontWeight: '700', color: '#1f2937' }}>Fast Delivery</h4>
            <p style={{ fontSize: '0.85rem', color: '#64748b' }}>Get your pet essentials delivered in no time.</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <FiHeart size={24} color="#ef4444" style={{ marginBottom: '0.5rem' }} />
            <h4 style={{ fontSize: '1rem', fontWeight: '700', color: '#1f2937' }}>Trusted Brands</h4>
            <p style={{ fontSize: '0.85rem', color: '#64748b' }}>Only the highest quality products for your pets.</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <FiActivity size={24} color="#3b82f6" style={{ marginBottom: '0.5rem' }} />
            <h4 style={{ fontSize: '1rem', fontWeight: '700', color: '#1f2937' }}>Vet Approved</h4>
            <p style={{ fontSize: '0.85rem', color: '#64748b' }}>Items recommended by professional veterinarians.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
