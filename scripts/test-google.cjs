const google = require('googlethis');

const test = async () => {
  const query = 'site:amazon.in "Wahl Oatmeal Moisturizing Dog Shampoo 200ml"';
  const images = await google.image(query, { safe: false });
  console.log('Results:');
  images.forEach(img => console.log(img.url));
};

test();
