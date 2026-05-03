const https = require('https');
const fs = require('fs');

const fetchHTML = (url) => new Promise((resolve, reject) => {
  https.get(url, { headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.9'
  }}, (res) => {
    if (res.statusCode === 301 || res.statusCode === 302 || res.statusCode === 503) {
      if (res.statusCode === 503) console.log('503 Service Unavailable (Amazon block)');
      if (res.headers.location) return fetchHTML(res.headers.location).then(resolve).catch(reject);
      return resolve('');
    }
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => resolve(data));
  }).on('error', reject);
});

const download = (url, dest) => new Promise((resolve, reject) => {
  https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
    const file = fs.createWriteStream(dest);
    res.pipe(file);
    file.on('finish', () => file.close(resolve));
    file.on('error', reject);
  }).on('error', reject);
});

const fixes = [
  { id: 'himalaya-cat-shampoo.jpg', url: 'https://www.amazon.in/s?k=Himalaya+Erina+Plus+Coat+Cleanser+Cats+200ml' },
  { id: 'drools-cat-dewormer.jpg', url: 'https://www.amazon.in/s?k=Drools+Absolute+Deworming+Tablets+Cats+10+Tabs' },
  { id: 'himalaya-cat-ear.webp', url: 'https://www.amazon.in/s?k=Himalaya+Ear+Cleansing+Drops+100ml+Dogs+Cats' }
];

async function run() {
  for (const item of fixes) {
    try {
      console.log('Fetching search for', item.id);
      const html = await fetchHTML(item.url);
      const match = html.match(/class="s-image"\s+src="([^"]+)"/);
      if (match && match[1]) {
        const imgUrl = match[1];
        console.log('  Found image:', imgUrl);
        await download(imgUrl, 'public/images/products/' + item.id);
        console.log('  Success:', item.id);
      } else {
        console.log('  No image found in HTML. Amazon might be blocking.');
      }
    } catch(e) {
      console.log('  Failed', e.message);
    }
  }
}
run();
