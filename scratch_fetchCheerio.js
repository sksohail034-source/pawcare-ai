async function gSearch(query) {
  try {
    const res = await fetch(`https://www.google.com/search?q=${encodeURIComponent(query)}+site:youtube.com/shorts`, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36' }
    });
    const html = await res.text();
    console.log(`\n### ${query} ###`);
    
    // Extract youtube shorts IDs using regex
    const matches = [...html.matchAll(/youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/g)];
    const uniqueIds = [...new Set(matches.map(m => m[1]))];
    
    console.log(uniqueIds.slice(0, 5));
  } catch (e) {
    console.log('Error', e.message);
  }
}

async function run() {
  await gSearch('apne dog ko apna naam kaise sikhaye hindi training');
  await gSearch('apne dog ka eye contact focus kaise banaye hindi training');
  await gSearch('dog ko sit command baithna kaise sikhaye hindi training');
}
run();
