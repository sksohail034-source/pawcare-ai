const fs = require('fs');
let code = fs.readFileSync('src/pages/ProductsPage.jsx', 'utf8');

// Replace literal "\n" strings in the specific problematic line
const targetLine = "export default function ProductsPage() {\\n  const { addToCart, totalItems, setIsCartOpen } = useCart();\\n  const [searchParams, setSearchParams] = useSearchParams();";
const fixedLine = `export default function ProductsPage() {
  const { addToCart, totalItems, setIsCartOpen } = useCart();
  const [searchParams, setSearchParams] = useSearchParams();`;

code = code.replace(targetLine, fixedLine);

fs.writeFileSync('src/pages/ProductsPage.jsx', code);
console.log('Fixed ProductsPage header');
