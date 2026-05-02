import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiSearch, FiShoppingCart, FiChevronRight, FiGrid, FiBox, FiActivity, FiTruck, FiHeart, FiTag, FiHome, FiBriefcase } from 'react-icons/fi';
import { GiDogBowl, GiCat, GiComb, GiTennisBall, GiFirstAidKit } from 'react-icons/gi';
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

const STORE_THEMES = {
  dog: {
    heroImage: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=1600&q=80',
    position: 'center 30%'
  },
  cat: {
    heroImage: 'https://images.unsplash.com/photo-1592194996308-7b43878e84a6?w=1600&q=80',
    position: 'center 40%'
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
    price: '818',
    rating: 4.4,
    reviews: 9185,
    image: '/images/products/royal-canin.png',
    badge: 'Vet Recommended',
    desc: 'Supports immune system & digestive health. Specialized formula for small breed puppies with natural defence nutrients.',
    benefits: ['Boosts natural immunity', 'Supports healthy digestion', 'Perfect for small breed puppies'],
    affiliateUrl: 'https://www.amazon.in/dp/B00K5ANK3G?tag=mypawcare-21'
  },
  {
    id: 'drools-puppy-chicken',
    name: 'Drools Puppy Dry Dog Food, Chicken & Egg (3kg)',
    brand: 'Drools',
    category: 'food',
    subCategory: 'Dry Food - Puppy',
    petType: 'dog',
    price: '545',
    rating: 4.3,
    reviews: 52890,
    image: '/images/products/puppy-food.png',
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
    price: '628',
    rating: 4.4,
    reviews: 24999,
    image: '/images/products/pedigree.png',
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
    price: '499',
    rating: 4.3,
    reviews: 78650,
    image: '/images/products/dry-food-generic.png',
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
    price: '2,430',
    rating: 4.5,
    reviews: 11230,
    image: '/images/products/royal-canin-medium.png',
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
    price: '2,180',
    rating: 4.4,
    reviews: 3250,
    image: '/images/products/senior-food.png',
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
    price: '525',
    rating: 4.3,
    reviews: 18540,
    image: '/images/products/wet-food-generic.png',
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
    price: '600',
    rating: 4.3,
    reviews: 9264,
    image: '/images/products/wet-food-generic.png',
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
    price: '1,099',
    rating: 4.2,
    reviews: 5680,
    image: '/images/products/grain-free.png',
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
    price: '1,499',
    rating: 4.2,
    reviews: 3450,
    image: '/images/products/high-protein.png',
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
    price: '1,249',
    rating: 4.3,
    reviews: 7890,
    image: '/images/products/high-protein.png',
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
    price: '380',
    rating: 4.3,
    reviews: 14650,
    image: '/images/products/treats-generic.png',
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
    price: '360',
    rating: 4.2,
    reviews: 6780,
    image: '/images/products/treats-generic.png',
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
    price: '195',
    rating: 4.1,
    reviews: 21340,
    image: '/images/products/treats-generic.png',
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
    price: '165',
    rating: 4.3,
    reviews: 18790,
    image: '/images/products/dog-biscuits.png',
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
    price: '289',
    rating: 4.2,
    reviews: 24560,
    image: '/images/products/dog-biscuits.png',
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
    price: '265',
    rating: 4.3,
    reviews: 12450,
    image: '/images/products/dental-chews.png',
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
    price: '199',
    rating: 4.2,
    reviews: 8900,
    image: '/images/products/dental-chews.png',
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
    price: '399',
    rating: 4.2,
    reviews: 15670,
    image: '/images/products/supplements-generic.png',
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
    price: '265',
    rating: 4.3,
    reviews: 5430,
    image: '/images/products/supplements-generic.png',
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
    price: '449',
    rating: 4.1,
    reviews: 9870,
    image: '/images/products/supplements-generic.png',
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
    price: '349',
    rating: 4.0,
    reviews: 4120,
    image: '/images/products/supplements-generic.png',
    badge: 'Top Rated',
    desc: 'Complete 18-in-1 multivitamin with minerals, biotin & taurine. Daily health insurance for your dog.',
    benefits: ['18 vitamins & minerals', 'Biotin for skin & coat', 'Taurine for heart health'],
    affiliateUrl: 'https://www.amazon.in/dp/B08YJMVVY5?tag=mypawcare-21'
  }
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

  const filteredProducts = CURATED_PRODUCTS.filter(p => {
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
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
          <button 
            onClick={() => handlePetChange('dog')}
            style={{
              flex: 1,
              padding: '1.5rem',
              borderRadius: '24px',
              border: '2px solid',
              borderColor: activePet === 'dog' ? '#22c55e' : 'transparent',
              background: activePet === 'dog' ? '#fff' : '#f1f5f9',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.5rem',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: activePet === 'dog' ? '0 10px 20px rgba(34, 197, 94, 0.1)' : 'none'
            }}
          >
            <GiDogBowl size={32} color={activePet === 'dog' ? '#22c55e' : '#64748b'} />
            <span style={{ fontWeight: '800', color: activePet === 'dog' ? '#1f2937' : '#64748b', fontSize: '1.1rem' }}>DOG STORE</span>
          </button>
          <button 
            onClick={() => handlePetChange('cat')}
            style={{
              flex: 1,
              padding: '1.5rem',
              borderRadius: '24px',
              border: '2px solid',
              borderColor: activePet === 'cat' ? '#22c55e' : 'transparent',
              background: activePet === 'cat' ? '#fff' : '#f1f5f9',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.5rem',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: activePet === 'cat' ? '0 10px 20px rgba(34, 197, 94, 0.1)' : 'none'
            }}
          >
            <GiCat size={32} color={activePet === 'cat' ? '#22c55e' : '#64748b'} />
            <span style={{ fontWeight: '800', color: activePet === 'cat' ? '#1f2937' : '#64748b', fontSize: '1.1rem' }}>CAT STORE</span>
          </button>
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
                        {'â˜…'.repeat(Math.floor(product.rating))}
                        <span style={{ color: '#e2e8f0' }}>{'â˜…'.repeat(5 - Math.floor(product.rating))}</span>
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
                            <span style={{ color: '#22c55e', fontWeight: '700' }}>âœ“</span> {b}
                          </div>
                        ))}
                      </div>
                    )}

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: '0.5rem', borderTop: '1px solid #f1f5f9' }}>
                      <div>
                        <span style={{ fontSize: '0.75rem', fontWeight: '600', color: '#64748b', marginRight: '2px' }}>â‚¹</span>
                        <span style={{ fontSize: '1.3rem', fontWeight: '900', color: '#1f2937' }}>{product.price}</span>
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
