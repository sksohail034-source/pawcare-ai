import { useState, useEffect } from 'react';
import { api } from '../api';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filter, setFilter] = useState({ petType: '', category: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.getProducts(), api.getProductCategories()])
      .then(([prodData, catData]) => {
        setProducts(prodData.products || []);
        setCategories(catData.categories || []);
      }).catch(console.error).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const params = {};
    if (filter.petType) params.petType = filter.petType;
    if (filter.category) params.category = filter.category;
    api.getProducts(params).then(d => setProducts(d.products || [])).catch(console.error);
  }, [filter]);

  if (loading) return <div className="loading-container"><div className="spinner"></div><p>Loading products...</p></div>;

  return (
    <div>
      <div className="page-header">
        <h2>Recommended Products 🛍️</h2>
        <p>AI-curated product recommendations for your pets</p>
      </div>

      <div className="filter-bar">
        <button className={`filter-chip ${!filter.petType ? 'active' : ''}`} onClick={() => setFilter(f => ({ ...f, petType: '' }))}>All Pets</button>
        {['dog', 'cat', 'bird', 'rabbit'].map(t => (
          <button key={t} className={`filter-chip ${filter.petType === t ? 'active' : ''}`}
            onClick={() => setFilter(f => ({ ...f, petType: f.petType === t ? '' : t }))}>
            {t === 'dog' ? '🐕' : t === 'cat' ? '🐈' : t === 'bird' ? '🦜' : '🐇'} {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
        <span style={{ width: 1, height: 24, background: 'var(--border)', margin: '0 4px' }}></span>
        <button className={`filter-chip ${!filter.category ? 'active' : ''}`} onClick={() => setFilter(f => ({ ...f, category: '' }))}>All Categories</button>
        {categories.map(c => (
          <button key={c} className={`filter-chip ${filter.category === c ? 'active' : ''}`}
            onClick={() => setFilter(f => ({ ...f, category: f.category === c ? '' : c }))}>
            {c.charAt(0).toUpperCase() + c.slice(1)}
          </button>
        ))}
      </div>

      {products.length === 0 ? (
        <div className="empty-state card">
          <div className="empty-icon">🔍</div>
          <h3>No products found</h3>
          <p>Try adjusting your filters</p>
        </div>
      ) : (
        <div className="card-grid-3">
          {products.map((prod, i) => (
            <div className="product-card animate-in" key={prod.id} style={{ animationDelay: `${i * 0.05}s` }}>
              <div className="product-image">
                {prod.image}
                {prod.badge && <span className="product-badge">{prod.badge}</span>}
              </div>
              <div className="product-body">
                <div className="product-brand">{prod.brand}</div>
                <h4>{prod.name}</h4>
                <p>{prod.description}</p>
                <div className="product-meta">
                  <span className="product-price">${prod.price}</span>
                  <span className="product-rating">⭐ {prod.rating} ({prod.reviews.toLocaleString()})</span>
                </div>
                <button className="btn btn-secondary btn-full btn-sm" style={{ marginTop: 12 }}>
                  View Product →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
