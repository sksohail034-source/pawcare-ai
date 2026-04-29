import { useState, useEffect } from 'react';
import { api } from '../api';
import toast from 'react-hot-toast';

// Curated Professional Product List (Placeholders for Geniuslinks)
const CURATED_PRODUCTS = [
  // --- DOG ESSENTIALS ---
  {
    id: 'd1',
    name: 'High-Protein Adult Dog Food',
    brand: 'Royal Canin',
    category: 'Food',
    petType: 'dog',
    price: '48.99',
    rating: 4.8,
    reviews: 15200,
    image: '🥣',
    badge: 'Daily Essential',
    desc: 'Nutritionally balanced food for active dogs. Supports bone and coat health.',
    affiliateUrl: 'https://geni.us/dog-food-placeholder'
  },
  {
    id: 'd2',
    name: 'Indestructible Rubber Chew Toy',
    brand: 'KONG',
    category: 'Toys',
    petType: 'dog',
    price: '12.99',
    rating: 4.9,
    reviews: 45000,
    image: '🦴',
    badge: 'Best Seller',
    desc: 'Durable natural rubber toy that satisfies the instinctual need to chew.',
    affiliateUrl: 'https://geni.us/dog-toy-placeholder'
  },
  {
    id: 'd3',
    name: 'Reflective No-Pull Dog Harness',
    brand: 'Rabbitgoo',
    category: 'Accessories',
    petType: 'dog',
    price: '24.50',
    rating: 4.7,
    reviews: 28000,
    image: '🦺',
    badge: 'Top Rated',
    desc: 'Adjustable, comfortable, and safe harness for daily walks and training.',
    affiliateUrl: 'https://geni.us/dog-harness-placeholder'
  },
  {
    id: 'd4',
    name: 'Orthopedic Memory Foam Pet Bed',
    brand: 'Bedsure',
    category: 'Accessories',
    petType: 'dog',
    price: '55.99',
    rating: 4.8,
    reviews: 12000,
    image: '🛏️',
    badge: 'Comfort',
    desc: 'Relieves joint pain for older dogs and provides ultimate comfort for all.',
    affiliateUrl: 'https://geni.us/dog-bed-placeholder'
  },

  // --- CAT ESSENTIALS ---
  {
    id: 'c1',
    name: 'Premium Wet Cat Food Variety Pack',
    brand: 'Fancy Feast',
    category: 'Food',
    petType: 'cat',
    price: '18.50',
    rating: 4.7,
    reviews: 9500,
    image: '🥫',
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
    price: '169.99',
    rating: 4.5,
    reviews: 11000,
    image: '📦',
    badge: 'Premium',
    desc: 'Automated scooping litter box that stays clean for weeks without hassle.',
    affiliateUrl: 'https://geni.us/litter-box-placeholder'
  },
  {
    id: 'c3',
    name: 'Interactive Feather Teaser Toy',
    brand: 'PetFit',
    category: 'Toys',
    petType: 'cat',
    price: '9.99',
    rating: 4.6,
    reviews: 5200,
    image: '🧶',
    badge: 'Fun',
    desc: 'Encourages exercise and mental stimulation for indoor cats.',
    affiliateUrl: 'https://geni.us/cat-toy-placeholder'
  },
  {
    id: 'c4',
    name: 'Cat Tree with Scratching Posts',
    brand: 'Go Pet Club',
    category: 'Accessories',
    petType: 'cat',
    price: '75.00',
    rating: 4.8,
    reviews: 18000,
    image: '🏰',
    badge: 'Value',
    desc: 'Multi-level tower for climbing, scratching, and napping.',
    affiliateUrl: 'https://geni.us/cat-tree-placeholder'
  },

  // --- GROOMING ---
  {
    id: 'g1',
    name: 'Professional Pet Grooming Kit',
    brand: 'Oneisall',
    category: 'Hygiene',
    petType: 'all',
    price: '34.99',
    rating: 4.7,
    reviews: 21000,
    image: '✂️',
    badge: 'Pro Choice',
    desc: 'Low noise, cordless clippers for a stress-free grooming session at home.',
    affiliateUrl: 'https://geni.us/grooming-kit-placeholder'
  },
  {
    id: 'g2',
    name: 'Shedding Brush & Deshedding Tool',
    brand: 'Furminator',
    category: 'Hygiene',
    petType: 'all',
    price: '22.99',
    rating: 4.9,
    reviews: 35000,
    image: '🧹',
    badge: 'Must Have',
    desc: 'Reduces shedding by up to 90%. Essential for long-haired pets.',
    affiliateUrl: 'https://geni.us/brush-placeholder'
  }
];

export default function ProductsPage() {
  const [filter, setFilter] = useState({ petType: '', category: '' });
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState(CURATED_PRODUCTS);

  const filteredProducts = products.filter(p => {
    const petMatch = !filter.petType || p.petType === filter.petType || p.petType === 'all';
    const catMatch = !filter.category || p.category === filter.category;
    return petMatch && catMatch;
  });

  const categories = ['Food', 'Toys', 'Grooming', 'Health'];

  const handleBuyClick = (url, name) => {
    // In a real app, track the click for analytics
    window.open(url, '_blank', 'noopener,noreferrer');
    toast.success(`Redirecting to Amazon for ${name}...`);
  };

  return (
    <div className="page-container" style={{ padding: '0 16px 100px' }}>
      {/* Premium Hero Section */}
      <div style={{ 
        background: 'linear-gradient(135deg, #1e293b, #0f172a)', 
        color: '#fff', 
        padding: '48px 24px', 
        borderRadius: '0 0 32px 32px',
        margin: '-16px -16px 32px -16px',
        textAlign: 'center',
        position: 'relative',
        boxShadow: '0 10px 30px rgba(0,0,0,0.15)'
      }}>
        <h2 style={{ fontSize: 32, fontWeight: 800, marginBottom: 8 }}>Pet Store 🛍️</h2>
        <p style={{ opacity: 0.8, fontSize: 16 }}>Hand-picked professional gear for your pets</p>
        
        {/* Floating Icons Decor */}
        <div style={{ position: 'absolute', right: 20, top: 20, fontSize: 40, opacity: 0.1 }}>🦴</div>
        <div style={{ position: 'absolute', left: 20, bottom: 20, fontSize: 40, opacity: 0.1 }}>🧶</div>
      </div>

      {/* Filter Bar */}
      <div style={{ 
        display: 'flex', gap: 10, overflowX: 'auto', padding: '4px 0 20px', 
        scrollbarWidth: 'none', msOverflowStyle: 'none' 
      }}>
        <button 
          onClick={() => setFilter({ ...filter, petType: '' })}
          style={{ 
            padding: '10px 20px', borderRadius: '14px', border: 'none',
            background: !filter.petType ? 'var(--primary)' : 'white',
            color: !filter.petType ? 'white' : 'var(--text-main)',
            fontWeight: 700, whiteSpace: 'nowrap', boxShadow: '0 4px 10px rgba(0,0,0,0.05)'
          }}
        >
          All Pets
        </button>
        {['dog', 'cat', 'bird'].map(t => (
          <button 
            key={t}
            onClick={() => setFilter({ ...filter, petType: t })}
            style={{ 
              padding: '10px 20px', borderRadius: '14px', border: 'none',
              background: filter.petType === t ? 'var(--primary)' : 'white',
              color: filter.petType === t ? 'white' : 'var(--text-main)',
              fontWeight: 700, whiteSpace: 'nowrap', boxShadow: '0 4px 10px rgba(0,0,0,0.05)'
            }}
          >
            {t === 'dog' ? '🐕 Dog' : t === 'cat' ? '🐈 Cat' : '🦜 Bird'}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 10, overflowX: 'auto', padding: '0 0 32px', scrollbarWidth: 'none' }}>
        <button 
          onClick={() => setFilter({ ...filter, category: '' })}
          style={{ 
            padding: '8px 16px', borderRadius: '12px', border: '1px solid var(--border)',
            background: !filter.category ? '#f8fafc' : 'white',
            fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap'
          }}
        >
          All Categories
        </button>
        {categories.map(c => (
          <button 
            key={c}
            onClick={() => setFilter({ ...filter, category: c })}
            style={{ 
              padding: '8px 16px', borderRadius: '12px', border: '1px solid var(--border)',
              background: filter.category === c ? '#f8fafc' : 'white',
              fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap'
            }}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 24 }}>
        {filteredProducts.map((prod, i) => (
          <div 
            key={prod.id} 
            className="card animate-in" 
            style={{ 
              padding: 0, borderRadius: 28, overflow: 'hidden', border: '1px solid rgba(0,0,0,0.05)',
              display: 'flex', flexDirection: 'column', animationDelay: `${i * 0.1}s`
            }}
          >
            <div style={{ 
              height: 180, background: 'linear-gradient(135deg, #f8fafc, #f1f5f9)', 
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 80,
              position: 'relative'
            }}>
              {prod.image}
              {prod.badge && (
                <span style={{ 
                  position: 'absolute', top: 16, left: 16, background: 'var(--primary)', 
                  color: 'white', padding: '4px 12px', borderRadius: '100px', 
                  fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.5
                }}>
                  {prod.badge}
                </span>
              )}
            </div>
            
            <div style={{ padding: 20 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--primary-dark)', textTransform: 'uppercase', marginBottom: 4 }}>
                {prod.brand}
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 8, color: '#1e293b' }}>{prod.name}</h3>
              <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.5, marginBottom: 16 }}>{prod.description || prod.desc}</p>
              
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <div>
                  <div style={{ fontSize: 24, fontWeight: 800, color: '#1e293b' }}>${prod.price}</div>
                  <div style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600 }}>⭐ {prod.rating} ({prod.reviews.toLocaleString()} reviews)</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: 11, background: '#fef9c3', color: '#854d0e', padding: '4px 8px', borderRadius: '6px', fontWeight: 700 }}>
                    Amazon Choice
                  </span>
                </div>
              </div>

              <button 
                onClick={() => handleBuyClick(prod.affiliateUrl, prod.name)}
                style={{ 
                  width: '100%', background: '#ff9900', color: '#111', 
                  fontWeight: 800, padding: '16px', borderRadius: '18px', border: 'none',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                  boxShadow: '0 4px 15px rgba(255, 153, 0, 0.25)', cursor: 'pointer'
                }}
              >
                <span>🛒</span> Buy on Amazon
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div style={{ fontSize: 60, marginBottom: 16 }}>🔍</div>
          <h3 style={{ fontWeight: 800 }}>No products found</h3>
          <p style={{ color: '#64748b' }}>Try changing your pet type or category filter.</p>
        </div>
      )}
    </div>
  );
}
