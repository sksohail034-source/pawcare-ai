import { Router } from 'express';

const router = Router();

const products = [
  {
    id: 'prod_1', name: 'Premium Organic Dog Food', brand: 'NaturePaws', price: 54.99,
    rating: 4.8, reviews: 2341, image: '🦴',
    category: 'food', petType: 'dog',
    description: 'All-natural, grain-free recipe with real chicken and sweet potato. Supports healthy digestion and a shiny coat.',
    affiliateUrl: '#', badge: 'Best Seller'
  },
  {
    id: 'prod_2', name: 'Interactive Smart Ball', brand: 'PetTech', price: 29.99,
    rating: 4.6, reviews: 1892, image: '⚾',
    category: 'toys', petType: 'dog',
    description: 'App-controlled bouncing ball with LED lights. Keeps your dog entertained and active even when you\'re away.',
    affiliateUrl: '#', badge: 'Top Rated'
  },
  {
    id: 'prod_3', name: 'Self-Cleaning Litter Box', brand: 'CleanPaw', price: 149.99,
    rating: 4.7, reviews: 3456, image: '🧹',
    category: 'hygiene', petType: 'cat',
    description: 'Automatic self-cleaning with odor control. WiFi connected with app notifications. Fits cats up to 18 lbs.',
    affiliateUrl: '#', badge: 'Premium'
  },
  {
    id: 'prod_4', name: 'Calming Pet Bed - Donut Style', brand: 'CozyNest', price: 39.99,
    rating: 4.9, reviews: 5678, image: '🛏️',
    category: 'comfort', petType: 'dog',
    description: 'Ultra-soft faux fur with raised rim for security. Machine washable. Available in 3 sizes.',
    affiliateUrl: '#', badge: 'Most Popular'
  },
  {
    id: 'prod_5', name: 'GPS Pet Tracker Collar', brand: 'TrackPet', price: 79.99,
    rating: 4.5, reviews: 1234, image: '📍',
    category: 'safety', petType: 'dog',
    description: 'Real-time GPS tracking with geofence alerts. Waterproof, long battery life. Works across USA & Canada.',
    affiliateUrl: '#', badge: 'Essential'
  },
  {
    id: 'prod_6', name: 'Cat Tree Luxury Tower', brand: 'FelineFort', price: 89.99,
    rating: 4.7, reviews: 2109, image: '🏰',
    category: 'furniture', petType: 'cat',
    description: 'Multi-level cat tree with sisal scratching posts, hammock, and cozy hideaway. Sturdy wooden base.',
    affiliateUrl: '#', badge: 'Premium'
  },
  {
    id: 'prod_7', name: 'Pet Dental Care Kit', brand: 'BrightSmile', price: 24.99,
    rating: 4.4, reviews: 987, image: '🪥',
    category: 'health', petType: 'dog',
    description: 'Complete dental care set with finger brush, enzymatic toothpaste, and dental wipes. Vet recommended.',
    affiliateUrl: '#', badge: 'Vet Approved'
  },
  {
    id: 'prod_8', name: 'Bird Playground Gym', brand: 'AvianJoy', price: 34.99,
    rating: 4.6, reviews: 567, image: '🎪',
    category: 'toys', petType: 'bird',
    description: 'Natural wood perches with hanging toys, ladders, and bells. Perfect for parakeets, cockatiels, and conures.',
    affiliateUrl: '#', badge: 'New'
  },
  {
    id: 'prod_9', name: 'Portable Water Bottle & Bowl', brand: 'HydroPet', price: 18.99,
    rating: 4.8, reviews: 3210, image: '💧',
    category: 'travel', petType: 'dog',
    description: 'Leak-proof design with built-in drinking bowl. BPA-free, holds 20oz. Perfect for walks and travel.',
    affiliateUrl: '#', badge: 'Best Value'
  },
  {
    id: 'prod_10', name: 'Rabbit Hay Feeder & Hideout', brand: 'BunnyBliss', price: 27.99,
    rating: 4.5, reviews: 432, image: '🐰',
    category: 'feeding', petType: 'rabbit',
    description: 'Natural wood hay feeder doubles as a cozy hideout. Encourages natural foraging behavior.',
    affiliateUrl: '#', badge: 'Eco-Friendly'
  },
  {
    id: 'prod_11', name: 'Pet Camera Treat Dispenser', brand: 'PetWatch', price: 119.99,
    rating: 4.7, reviews: 4321, image: '📷',
    category: 'tech', petType: 'dog',
    description: '1080p HD camera with night vision, 2-way audio, and treat tossing. Monitor your pet from anywhere.',
    affiliateUrl: '#', badge: 'Smart Home'
  },
  {
    id: 'prod_12', name: 'Omega-3 Fish Oil Supplement', brand: 'VitaPet', price: 22.99,
    rating: 4.6, reviews: 1876, image: '💊',
    category: 'health', petType: 'dog',
    description: 'Pure wild-caught fish oil for healthy skin, coat, joints, and heart. Easy pump dispenser.',
    affiliateUrl: '#', badge: 'Vet Recommended'
  },
];

// Get all products
router.get('/', (req, res) => {
  const { petType, category } = req.query;
  let filtered = products;

  if (petType) {
    filtered = filtered.filter(p => p.petType === petType.toLowerCase());
  }
  if (category) {
    filtered = filtered.filter(p => p.category === category.toLowerCase());
  }

  res.json({ products: filtered });
});

// Get product categories
router.get('/categories', (req, res) => {
  const categories = [...new Set(products.map(p => p.category))];
  res.json({ categories });
});

export default router;
