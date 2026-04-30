import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiSearch, FiShoppingCart, FiStar } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { api } from '../api';

const CURATED_PRODUCTS = [
  {
    id: 'd1',
    name: 'Pedigree Adult Dry Dog Food (Chicken & Veg)',
    brand: 'Pedigree',
    category: 'Food',
    petType: 'dog',
    price: '2,450',
    rating: 4.4,
    reviews: 24998,
    image: '/images/products/pedigree.png',
    badge: 'Best Seller',
    desc: '100% complete and balanced nutrition for adult dogs. contains 37 essential nutrients.',
    affiliateUrl: 'https://amzn.to/48vAUSN'
  },
  {
    id: 'd2',
    name: 'Mankind Petstar Adult Dry Dog Food (Salmon)',
    brand: 'Mankind',
    category: 'Food',
    petType: 'dog',
    price: '451',
    rating: 4.2,
    reviews: 19,
    image: '/images/products/mankind.png',
    badge: 'Amazon Choice',
    desc: 'High protein Salmon & Rice flavor. Improves muscle & strength and supports immunity.',
    affiliateUrl: 'https://amzn.to/3QGdUdN'
  },
  {
    id: 'd3',
    name: 'Pedigree Adult Wet Dog Food (Pack of 15)',
    brand: 'Pedigree',
    category: 'Food',
    petType: 'dog',
    price: '628',
    rating: 4.4,
    reviews: 11457,
    image: '/images/products/pedigree.png',
    badge: 'Amazon Choice',
    desc: 'Chicken & Liver chunks in gravy. Complete and balanced meal for adult dogs.',
    affiliateUrl: 'https://amzn.to/4t8RDCV'
  },
  {
    id: 'd4',
    name: 'Orthopedic Memory Foam Pet Bed',
    brand: 'Bedsure',
    category: 'Accessories',
    petType: 'dog',
    price: '4,500',
    rating: 4.8,
    reviews: 12000,
    image: 'https://images.unsplash.com/photo-1591576445756-39bc19383903?w=500&q=80',
    badge: 'Comfort',
    desc: 'Relieves joint pain for older dogs and provides ultimate comfort for all.',
    affiliateUrl: 'https://amzn.to/3T6oYmR'
  },
  {
    id: 'd5',
    name: 'Good Dog Adult Dry Dog Food (Oven Baked)',
    brand: 'Good Dog',
    category: 'Food',
    petType: 'dog',
    price: '6,999',
    rating: 4.5,
    reviews: 127,
    image: '/images/products/good-dog.png',
    badge: 'Premium',
    desc: 'Oven-baked with real chicken & eggs. 28% Protein with Indian Herbs, suitable for all breeds.',
    affiliateUrl: 'https://amzn.to/4n3kc35'
  },
  {
    id: 'd6',
    name: 'Royal Canin Maxi Adult Dog Food (10kg)',
    brand: 'Royal Canin',
    category: 'Food',
    petType: 'dog',
    price: '6,895',
    rating: 4.3,
    reviews: 2497,
    image: '/images/products/royal-canin.png',
    badge: 'Top Choice',
    desc: 'Supports digestive health & bone/joint strength for large adult dogs. Premium quality nutrition.',
    affiliateUrl: 'https://amzn.to/4n6FCwu'
  },
  {
    id: 'd7',
    name: 'Royal Canin Medium Adult Dog Food (1kg)',
    brand: 'Royal Canin',
    category: 'Food',
    petType: 'dog',
    price: '950',
    rating: 4.3,
    reviews: 2344,
    image: '/images/products/royal-canin-medium.png',
    badge: 'Starter Pack',
    desc: 'Provides muscle mass and supports optimal health. Perfect 1kg trial pack for medium breeds.',
    affiliateUrl: 'https://amzn.to/4mYacIm'
  },
  {
    id: 'c1',
    name: 'Whiskas Adult Wet Cat Food (Pack of 12)',
    brand: 'Whiskas',
    category: 'Food',
    petType: 'cat',
    price: '480',
    rating: 4.6,
    reviews: 8500,
    image: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=500&q=80',
    badge: 'Popular',
    desc: 'Delicious tuna in jelly for adult cats. Balanced nutrition for a shiny coat.',
    affiliateUrl: 'https://amzn.to/3T6oYmR'
  },
  {
    id: 'c2',
    name: 'Self-Cleaning Litter Box',
    brand: 'PetSafe',
    category: 'Hygiene',
    petType: 'cat',
    price: '14,999',
    rating: 4.5,
    reviews: 11000,
    image: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=500&q=80',
    badge: 'Premium',
    desc: 'Automated scooping litter box that stays clean for weeks without hassle.',
    affiliateUrl: 'https://amzn.to/3T6oYmR'
  },
  {
    id: 'dg1',
    name: 'Beaphar Dimethicare Shampoo (200ml)',
    brand: 'Beaphar',
    category: 'Grooming',
    petType: 'dog',
    price: '715',
    rating: 4.5,
    reviews: 1200,
    image: 'https://m.media-amazon.com/images/I/61NlB0-U78L._SL1500_.jpg',
    badge: 'Expert Choice',
    desc: 'Professional skin care shampoo for dogs and cats. Prevents parasites.',
    affiliateUrl: 'https://www.amazon.in/dp/B08C8PG7Z8?tag=mypawcare-21'
  },
  {
    id: 'dg2',
    name: 'Depets Self Cleaning Slicker Brush',
    brand: 'Depets',
    category: 'Grooming',
    petType: 'dog',
    price: '149',
    rating: 4.4,
    reviews: 5400,
    image: 'https://m.media-amazon.com/images/I/61M-FpUuBHL._SL1000_.jpg',
    badge: 'Best Seller',
    desc: 'Easy-to-clean grooming tool for shedding and detangling fur.',
    affiliateUrl: 'https://www.amazon.in/dp/B08FJ655HL?tag=mypawcare-21'
  },
  {
    id: 'dg3',
    name: 'HANK LED Dog Nail Trimmer',
    brand: 'HANK',
    category: 'Grooming',
    petType: 'dog',
    price: '449',
    rating: 4.3,
    reviews: 850,
    image: 'https://m.media-amazon.com/images/I/61O2-S0o3jL._SL1500_.jpg',
    badge: 'Safety First',
    desc: 'LED light nail trimmer to prevent over-cutting. Safe for all breeds.',
    affiliateUrl: 'https://www.amazon.in/dp/B08Y8H5Z7R?tag=mypawcare-21'
  },
  {
    id: 'dt1',
    name: 'BarkButler Aly The Gator Plush Toy',
    brand: 'BarkButler',
    category: 'Toys',
    petType: 'dog',
    price: '699',
    rating: 4.6,
    reviews: 2100,
    image: 'https://m.media-amazon.com/images/I/61A8Nf6A0GL._SL1100_.jpg',
    badge: 'Durable',
    desc: 'Premium plush toy with squeaker. Ideal for fetch and moderate chewing.',
    affiliateUrl: 'https://www.amazon.in/dp/B084R4T6Y4?tag=mypawcare-21'
  },
  {
    id: 'dt2',
    name: 'Goofy Tails Rubber Spike Ball',
    brand: 'Goofy Tails',
    category: 'Toys',
    petType: 'dog',
    price: '199',
    rating: 4.2,
    reviews: 1500,
    image: 'https://m.media-amazon.com/images/I/61s8Bv3BqML._SL1000_.jpg',
    badge: 'Dental Care',
    desc: 'Rubber spike ball for dental cleaning and interactive play.',
    affiliateUrl: 'https://www.amazon.in/dp/B077SQY4L9?tag=mypawcare-21'
  },
  {
    id: 'dt3',
    name: 'Rubber Dumbbell Treat Dispensing Toy',
    brand: 'Goofy Tails',
    category: 'Toys',
    petType: 'dog',
    price: '249',
    rating: 4.4,
    reviews: 980,
    image: 'https://m.media-amazon.com/images/I/61L-N+1z2BL._SL1000_.jpg',
    badge: 'Interactive',
    desc: 'Keeps dogs engaged for hours by dispensing treats during play.',
    affiliateUrl: 'https://www.amazon.in/dp/B09BZNMPZ2?tag=mypawcare-21'
  },
  {
    id: 'c1',
    name: 'Whiskas Adult Dry Cat Food (Ocean Fish)',
    brand: 'Whiskas',
    category: 'Food',
    petType: 'cat',
    price: '450',
    rating: 4.6,
    reviews: 12500,
    image: 'https://m.media-amazon.com/images/I/71Y7YkF+AHL._SL1500_.jpg',
    badge: 'Amazon Choice',
    desc: 'Delicious ocean fish flavor. Balanced nutrition for a healthy coat.',
    affiliateUrl: 'https://www.amazon.in/dp/B00HS6SGL8?tag=mypawcare-21'
  },
  {
    id: 'c2',
    name: 'Pet Grooming Glove for Cats & Dogs',
    brand: 'MCP',
    category: 'Grooming',
    petType: 'cat',
    price: '199',
    rating: 4.3,
    reviews: 4500,
    image: 'https://m.media-amazon.com/images/I/71wLp9-PZ2L._SL1500_.jpg',
    badge: 'Best Seller',
    desc: 'Soft silicone brush for gentle massage and shedding hair removal.',
    affiliateUrl: 'https://www.amazon.in/dp/B07675J3Y7?tag=mypawcare-21'
  },
  {
    id: 'c3',
    name: 'Interactive Cat Tree Tower',
    brand: 'Go Pet Club',
    category: 'Toys',
    petType: 'cat',
    price: '3,800',
    rating: 4.7,
    reviews: 3200,
    image: 'https://m.media-amazon.com/images/I/71Xm+QvB8yL._SL1500_.jpg',
    badge: 'Playtime',
    desc: 'Multi-level cat tree with scratching posts and dangling toys.',
    affiliateUrl: 'https://www.amazon.in/dp/B08FJ655HL?tag=mypawcare-21'
  },
  {
    id: 'b1',
    name: 'Boltz Premium Bird Food for Budgies',
    brand: 'Boltz',
    category: 'Food',
    petType: 'bird',
    price: '299',
    rating: 4.5,
    reviews: 2100,
    image: 'https://m.media-amazon.com/images/I/71vUuD0T4BL._SL1500_.jpg',
    badge: 'Nutritious',
    desc: 'High-quality seed mix for budgies and small birds. Supports immunity.',
    affiliateUrl: 'https://www.amazon.in/dp/B07P8J8G9W?tag=mypawcare-21'
  },
  {
    id: 'b2',
    name: 'Colorful Bird Swing with Bells',
    brand: 'Foodie Puppies',
    category: 'Accessories',
    petType: 'bird',
    price: '189',
    rating: 4.4,
    reviews: 1500,
    image: 'https://m.media-amazon.com/images/I/61Bv+4fV6dL._SL1100_.jpg',
    badge: 'Popular',
    desc: 'Handcrafted colorful wooden swing for all small to medium birds.',
    affiliateUrl: 'https://www.amazon.in/dp/B078XG9X8H?tag=mypawcare-21'
  },
  {
    id: 'b3',
    name: 'Bird Intelligence Training Toy',
    brand: 'Sage Square',
    category: 'Toys',
    petType: 'bird',
    price: '349',
    rating: 4.2,
    reviews: 850,
    image: 'https://m.media-amazon.com/images/I/61N+pP0TjPL._SL1000_.jpg',
    badge: 'Fun Time',
    desc: 'Ferris wheel toy to keep your birds mentally active and engaged.',
    affiliateUrl: 'https://www.amazon.in/dp/B07K6QXY5N?tag=mypawcare-21'
  },
];

export default function ProductsPage() {
  const [searchParams] = useSearchParams();
  const [filter, setFilter] = useState(searchParams.get('type') || 'all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // If no specific type is in URL, try to set it based on user's first pet
    if (!searchParams.get('type')) {
      const fetchUserPet = async () => {
        try {
          const pets = await api.getPets();
          if (pets && pets.length > 0) {
            setFilter(pets[0].type.toLowerCase());
          }
        } catch (err) {
          console.error("Failed to fetch user pets for store personalization", err);
        }
      };
      fetchUserPet();
    }
  }, [searchParams]);

  const filteredProducts = CURATED_PRODUCTS.filter(p => {
    const matchesFilter = filter === 'all' || p.petType === filter || p.category.toLowerCase() === filter.toLowerCase();
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         p.brand.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleBuy = (url, name) => {
    toast.success(`Redirecting to Amazon for ${name}...`, {
      icon: '🛒',
      style: { borderRadius: '12px', background: '#1f2937', color: '#fff' }
    });
    setTimeout(() => {
      window.open(url, '_blank');
    }, 800);
  };

  return (
    <div className="products-container" style={{ paddingBottom: '6rem' }}>
      {/* Hero Banner */}
      <div className="store-hero" style={{
        background: `linear-gradient(rgba(0,0,0,0.65), rgba(0,0,0,0.3)), url('/images/banners/store-hero.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '240px',
        borderRadius: '0 0 32px 32px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '2.5rem 1.5rem',
        color: '#fff',
        boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
      }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', fontWeight: '900', textShadow: '0 2px 10px rgba(0,0,0,0.4)' }}>PawCare Store</h1>
        <p style={{ opacity: 0.95, maxWidth: '300px', fontSize: '1.05rem', lineHeight: '1.4', fontWeight: '500' }}>
          Professional grade essentials, hand-picked for your pet's health.
        </p>
      </div>

      <div style={{ padding: '1.5rem' }}>
        {/* Search Bar */}
        <div style={{ 
          background: '#fff', 
          borderRadius: '16px', 
          padding: '0.8rem 1.2rem', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.8rem',
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
          marginBottom: '1.5rem',
          border: '1px solid #f3f4f6'
        }}>
          <FiSearch style={{ color: '#9ca3af' }} />
          <input 
            type="text" 
            placeholder="Search food, toys, brands..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ border: 'none', outline: 'none', width: '100%', fontSize: '0.95rem' }}
          />
        </div>

        {/* Filter Scroll */}
        <div style={{ display: 'flex', gap: '0.8rem', overflowX: 'auto', paddingBottom: '1.5rem', scrollbarWidth: 'none' }}>
          {['all', 'dog', 'cat', 'bird', 'Food', 'Grooming', 'Accessories', 'Toys'].map(cat => (
            <button 
              key={cat}
              onClick={() => setFilter(cat)}
              style={{
                padding: '0.6rem 1.2rem',
                borderRadius: '12px',
                border: 'none',
                background: filter === cat ? '#22c55e' : '#fff',
                color: filter === cat ? '#fff' : '#4b5563',
                whiteSpace: 'nowrap',
                fontWeight: '600',
                boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
                cursor: 'pointer'
              }}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {filteredProducts.map(product => (
            <div key={product.id} style={{
              background: '#fff',
              borderRadius: '24px',
              overflow: 'hidden',
              boxShadow: '0 8px 20px rgba(0,0,0,0.04)',
              border: '1px solid #f3f4f6',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <div style={{ height: '200px', background: '#f8fafc', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {product.badge && (
                  <span style={{ position: 'absolute', top: '1rem', left: '1rem', background: '#22c55e', color: '#fff', padding: '0.3rem 0.8rem', borderRadius: '8px', fontSize: '0.7rem', fontWeight: 'bold', zIndex: 2 }}>
                    {product.badge.toUpperCase()}
                  </span>
                )}
                <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                     onError={(e) => { e.target.src = 'https://via.placeholder.com/200?text=Pet+Food' }} />
              </div>

              <div style={{ padding: '1.2rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span style={{ color: '#22c55e', fontSize: '0.75rem', fontWeight: 'bold' }}>{product.brand.toUpperCase()}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', color: '#f59e0b', fontSize: '0.85rem' }}>
                    <FiStar fill="#f59e0b" size={14} />
                    <span>{product.rating}</span>
                  </div>
                </div>
                <h3 style={{ fontSize: '1.1rem', color: '#1f2937', marginBottom: '0.5rem', fontWeight: '700', lineHeight: '1.4' }}>{product.name}</h3>
                <p style={{ color: '#6b7280', fontSize: '0.85rem', marginBottom: '1.2rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{product.desc}</p>
                
                <div style={{ marginTop: 'auto' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '1rem' }}>
                    <span style={{ fontSize: '1.5rem', fontWeight: '800', color: '#111827' }}>₹{product.price}</span>
                    <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{product.reviews.toLocaleString()} reviews</span>
                  </div>
                  <button 
                    onClick={() => handleBuy(product.affiliateUrl, product.name)}
                    style={{
                      width: '100%',
                      padding: '1rem',
                      borderRadius: '16px',
                      border: 'none',
                      background: 'linear-gradient(135deg, #FF9900 0%, #FFB74D 100%)',
                      color: '#fff',
                      fontWeight: 'bold',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.6rem',
                      cursor: 'pointer'
                    }}
                  >
                    <FiShoppingCart />
                    Buy on Amazon
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
