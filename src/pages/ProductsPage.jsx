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
    name: 'Pedigree Adult Wet Dog Food (Chicken & Liver)',
    brand: 'Pedigree',
    category: 'Food',
    petType: 'dog',
    price: '540',
    rating: 4.5,
    reviews: 18500,
    image: '/images/products/pedigree-wet.png',
    badge: 'Popular',
    desc: 'Delicious gravy chunks with chicken and liver. Perfect for mixing with dry food.',
    affiliateUrl: 'https://amzn.to/4cI5dZ5'
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
    image: '/images/products/dog-bed.png',
    badge: 'Comfort',
    desc: 'Relieves joint pain for older dogs and provides ultimate comfort for all.',
    affiliateUrl: 'https://geni.us/dog-bed-placeholder'
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
    id: 'c1',
    name: 'Premium Wet Cat Food Variety Pack',
    brand: 'Fancy Feast',
    category: 'Food',
    petType: 'cat',
    price: '1,250',
    rating: 4.7,
    reviews: 9500,
    image: '/images/products/cat-food.png',
    badge: 'Popular',
    desc: 'Delicious grain-free wet food that even picky cats will love.',
    affiliateUrl: 'https://geni.us/cat-food-placeholder'
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
    image: '/images/products/litter-box.png',
    badge: 'Premium',
    desc: 'Automated scooping litter box that stays clean for weeks without hassle.',
    affiliateUrl: 'https://geni.us/litter-box-placeholder'
  }
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
          {['all', 'dog', 'cat', 'Food', 'Accessories', 'Toys'].map(cat => (
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
