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

// This will be populated manually by the user later
const CURATED_PRODUCTS = [
  {
    id: 'rc-mini-puppy',
    name: 'Royal Canin Mini Puppy Dry Dog Food (800g)',
    brand: 'Royal Canin',
    category: 'food',
    petType: 'dog',
    price: '818',
    rating: 4.4,
    reviews: 9185,
    image: 'https://m.media-amazon.com/images/I/61mI-8XfU2L._SL1500_.jpg',
    badge: 'Vet Recommended',
    desc: 'Tailored nutrition for small breed puppies (up to 10 months). Supports immune system and digestive health.',
    affiliateUrl: 'https://amzn.to/4ulalbw'
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
              {filteredProducts.map(product => (
                <div key={product.id} className="premium-product-card" style={{
                  background: '#fff',
                  borderRadius: '28px',
                  padding: '1rem',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.03)',
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
                      background: '#f8fafc',
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
                      style={{
                        maxWidth: '90%',
                        maxHeight: '90%',
                        objectFit: 'contain',
                        padding: '1rem',
                        transition: 'transform 0.5s ease'
                      }}
                    />
                    {product.badge && (
                      <div style={{
                        position: 'absolute',
                        top: '12px',
                        left: '12px',
                        background: '#1f2937',
                        color: '#fff',
                        padding: '4px 10px',
                        borderRadius: '8px',
                        fontSize: '0.7rem',
                        fontWeight: '700'
                      }}>
                        {product.badge}
                      </div>
                    )}
                  </div>

                  <div style={{ padding: '0 0.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.4rem' }}>
                      <span style={{ fontSize: '0.7rem', fontWeight: '700', color: '#22c55e', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{product.brand}</span>
                      <FiHeart size={14} color="#cbd5e1" style={{ cursor: 'pointer' }} />
                    </div>
                    
                    <h3 style={{ 
                      fontSize: '0.95rem', 
                      fontWeight: '800', 
                      color: '#1f2937', 
                      marginBottom: '0.5rem',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      lineHeight: '1.4',
                      height: '2.6rem'
                    }}>
                      {product.name}
                    </h3>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                      <div style={{ display: 'flex', color: '#f59e0b', fontSize: '0.8rem' }}>
                        {'★'.repeat(Math.floor(product.rating))}
                        <span style={{ color: '#e2e8f0' }}>{'★'.repeat(5 - Math.floor(product.rating))}</span>
                      </div>
                      <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: '600' }}>({product.reviews})</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: '0.5rem' }}>
                      <div>
                        <span style={{ fontSize: '0.85rem', fontWeight: '600', color: '#64748b', marginRight: '2px' }}>₹</span>
                        <span style={{ fontSize: '1.3rem', fontWeight: '900', color: '#1f2937' }}>{product.price}</span>
                      </div>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(product.affiliateUrl, '_blank');
                        }}
                        style={{
                          padding: '0.6rem 1rem',
                          borderRadius: '12px',
                          border: 'none',
                          background: '#22c55e',
                          color: '#fff',
                          fontWeight: '700',
                          fontSize: '0.8rem',
                          cursor: 'pointer',
                          boxShadow: '0 4px 12px rgba(34, 197, 94, 0.15)'
                        }}
                      >
                        Buy Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
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
