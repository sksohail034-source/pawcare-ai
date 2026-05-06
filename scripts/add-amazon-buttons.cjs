const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/pages/ProductsPage.jsx');
let code = fs.readFileSync(filePath, 'utf8');

const regex = /<div style=\{\{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: '0\.5rem', borderTop: '1px solid #f1f5f9' \}\}>[\s\S]*?<FiShoppingCart size=\{13\} \/> Buy Now\s*<\/button>\s*<\/div>/g;

const newButtonBlock = `<div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginTop: 'auto', paddingTop: '0.5rem', borderTop: '1px solid #f1f5f9' }}>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: '600', color: '#64748b', marginRight: '2px' }}>₹</span>
                        <span style={{ fontSize: '1.25rem', fontWeight: '900', color: '#B12704' }}>{product.price}</span>
                      </div>
                      
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            toast.success('Added to Cart!');
                          }}
                          style={{
                            width: '100%',
                            padding: '0.65rem',
                            borderRadius: '20px',
                            border: 'none',
                            background: '#ffd814',
                            color: '#0f1111',
                            fontWeight: '600',
                            fontSize: '0.85rem',
                            cursor: 'pointer',
                            boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px'
                          }}
                        >
                          <FiShoppingCart size={15} /> Add to Cart
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(product.affiliateUrl, '_blank');
                          }}
                          style={{
                            width: '100%',
                            padding: '0.65rem',
                            borderRadius: '20px',
                            border: 'none',
                            background: '#ffa41c',
                            color: '#0f1111',
                            fontWeight: '600',
                            fontSize: '0.85rem',
                            cursor: 'pointer',
                            boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '4px'
                          }}
                        >
                          <FiChevronRight size={16} /> Buy Now
                        </button>
                      </div>
                    </div>`;

if (code.match(regex)) {
  code = code.replace(regex, newButtonBlock);
  console.log('Successfully replaced buttons with Amazon style Add to Cart!');
} else {
  console.log('Regex did not match!');
}

fs.writeFileSync(filePath, code);
