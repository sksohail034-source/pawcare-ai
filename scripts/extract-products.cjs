const fs = require('fs');
const content = fs.readFileSync('src/pages/ProductsPage.jsx', 'utf8');

// Use a more robust regex to find the array
const startMarker = 'const CURATED_PRODUCTS = [';
const startIndex = content.indexOf(startMarker);
if (startIndex === -1) {
    console.error('Could not find CURATED_PRODUCTS');
    process.exit(1);
}

// Find the matching closing bracket for the array
let depth = 0;
let endIndex = -1;
for (let i = startIndex + startMarker.length - 1; i < content.length; i++) {
    if (content[i] === '[') depth++;
    else if (content[i] === ']') {
        depth--;
        if (depth === 0) {
            endIndex = i;
            break;
        }
    }
}

if (endIndex === -1) {
    console.error('Could not find end of CURATED_PRODUCTS');
    process.exit(1);
}

const productsText = content.substring(startIndex, endIndex + 1);

// Save as a JS file that exports the array
fs.writeFileSync('server/data/products.js', `export const products = ${productsText.replace('const CURATED_PRODUCTS = ', '')};`);
console.log('Successfully extracted products to server/data/products.js');
