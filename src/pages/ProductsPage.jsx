import { useState, useEffect } from 'react';
import { api } from '../api';
import toast from 'react-hot-toast';

// Curated Professional Product List (Placeholders for Geniuslinks)
const CURATED_PRODUCTS = [
  {
    id: 'p1',
    name: 'Premium Adult Dog Food - High Protein',
    brand: 'Royal Canin',
    category: 'Food',
    petType: 'dog',
    price: '45.99',
    rating: 4.8,
    reviews: 12500,
    image: '🐕',
    badge: 'Best Seller',
    desc: 'Scientifically formulated for adult dogs to support muscle growth and shiny coat.',
    affiliateUrl: 'https://geni.us/example-dog-food' // REPLACE WITH YOUR GENIUSLINK
  },
  {
    id: 'p2',
    name: 'Grain-Free Salmon Cat Food',
    brand: 'Purina One',
    category: 'Food',
    petType: 'cat',
    price: '32.50',
    rating: 4.7,
    reviews: 8400,
    image: '🐱',
    badge: 'Popular',
    desc: 'Real salmon as #1 ingredient. High protein and grain-free for healthy digestion.',
    affiliateUrl: 'https://geni.us/example-cat-food' // REPLACE WITH YOUR GENIUSLINK
  },
  {
    id: 'p3',
    name: 'Automatic Pet Water Fountain',
    brand: 'Veken',
    category: 'Grooming',
    petType: 'all',
    price: '28.99',
    rating: 4.9,
    reviews: 25000,
    image: '⛲',
    badge: 'Top Choice',
    desc: 'Filtered water fountain to keep your pets hydrated with fresh flowing water 24/7.',
    affiliateUrl: 'https://geni.us/example-fountain' // REPLACE WITH YOUR GENIUSLINK
  },
  {
    id: 'p4',
    name: 'Interactive Puzzle Toy for Dogs',
    brand: 'Outward Hound',
    category: 'Toys',
    petType: 'dog',
    price: '19.99',
    rating: 4.6,
    reviews: 15200,
    image: '🎾',
    badge: 'Fun',
    desc: 'Mental stimulation toy that challenges your dog and keeps them entertained.',
    affiliateUrl: 'https://geni.us/example-toy' // REPLACE WITH YOUR GENIUSLINK
  },
  {
    id: 'p5',
    name: 'Organic Hemp Calming Chews',
    brand: 'PetHonesty',
    category: 'Health',
    petType: 'dog',
    price: '38.00',
    rating: 4.8,
    reviews: 5100,
    image: '💊',
    badge: 'Natural',
    desc: 'Supports anxiety relief and joint health for senior dogs or nervous pets.',
    affiliateUrl: 'https://geni.us/example-calming' // REPLACE WITH YOUR GENIUSLINK
  },
  {
    id: 'p6',
    name: 'Multi-Level Cat Tree House',
    brand: 'FEANDREA',
    category: 'Toys',
    petType: 'cat',
    price: '89.99',
    rating: 4.9,
    reviews: 32000,
    image: '🏰',
    badge: 'Must Have',
    desc: 'Sturdy scratching posts and cozy perches for your indoor cat to climb and nap.',
    affiliateUrl: 'https://geni.us/example-cat-tree' // REPLACE WITH YOUR GENIUSLINK
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
