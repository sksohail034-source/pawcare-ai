const fs = require('fs');
let code = fs.readFileSync('src/pages/ProductsPage.jsx', 'utf8');
code = code.replace(/https:\/\/m\.media-amazon\.com\/images\/I\/71G1P6Q2G4L\._SL1500_\.jpg/, 'https://images.unsplash.com/photo-1543852786-1cf6624b9987?w=400&q=80');
fs.writeFileSync('src/pages/ProductsPage.jsx', code);
console.log('Fixed vitapol-bird-treat image');
