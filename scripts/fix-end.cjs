const fs = require('fs');
let code = fs.readFileSync('src/pages/ProductsPage.jsx', 'utf8');
code = code.replace(/<\/div>\\n    <\/>\\n  \);\\n\}/g, "</div>\\n    </>\\n  );\\n}");
fs.writeFileSync('src/pages/ProductsPage.jsx', code);
