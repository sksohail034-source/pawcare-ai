const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/pages/ProductsPage.jsx');
let code = fs.readFileSync(filePath, 'utf8');

// 1. Add imports
const importTarget = "import { FiSearch, FiShoppingCart, FiChevronRight";
if (!code.includes('import { useCart }')) {
  code = code.replace(
    importTarget,
    `import { useCart } from '../context/CartContext';\nimport CartDrawer from '../components/CartDrawer';\nimport { FiSearch, FiShoppingCart, FiChevronRight`
  );
}

// 2. Add useCart hook inside the component
const componentStartTarget = "const ProductsPage = () => {";
if (!code.includes('const { addToCart, totalItems, setIsCartOpen } = useCart();')) {
  code = code.replace(
    componentStartTarget,
    `const ProductsPage = () => {\n  const { addToCart, totalItems, setIsCartOpen } = useCart();`
  );
}

// 3. Update the Add to Cart button onClick handler
// Target: toast.success('Added to Cart!');
const addToCartTarget = /toast\.success\('Added to Cart!'\);/g;
if (code.match(addToCartTarget)) {
  code = code.replace(
    addToCartTarget,
    `addToCart(product);\n                            toast.success('Added to Cart!');`
  );
}

// 4. Add CartDrawer and FAB to the return statement
const returnTarget = "return (";
const returnReplacement = `return (
    <>
      <CartDrawer />
      {/* Floating Cart Button */}
      <button
        onClick={() => setIsCartOpen(true)}
        style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          backgroundColor: '#fff',
          color: '#0f1111',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 15px rgba(0,0,0,0.15)',
          border: '1px solid #e2e8f0',
          cursor: 'pointer',
          zIndex: 9998,
          transition: 'transform 0.2s',
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
      >
        <FiShoppingCart size={24} />
        {totalItems > 0 && (
          <div style={{
            position: 'absolute',
            top: '-5px',
            right: '-5px',
            backgroundColor: '#B12704',
            color: 'white',
            borderRadius: '50%',
            width: '24px',
            height: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.8rem',
            fontWeight: 'bold',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
          }}>
            {totalItems}
          </div>
        )}
      </button>`;

if (!code.includes('<CartDrawer />')) {
  code = code.replace(returnTarget, returnReplacement);
  // Also we need to close the fragment at the end.
  // We can just find the last `</div>` before `);`
  const endTarget = /<\/div>\s*\);\s*};/g;
  code = code.replace(endTarget, `</div>\n    </>\n  );\n};`);
}

fs.writeFileSync(filePath, code);
console.log('ProductsPage updated successfully!');
