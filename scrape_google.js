import axios from 'axios';
import * as cheerio from 'cheerio';

async function gSearch(query) {
  try {
    const res = await axios.get(`https://www.google.com/search?q=${encodeURIComponent(query)}+site:youtube.com/shorts`, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
    });
    const $ = cheerio.load(res.data);
    console.log(`\n### ${query} ###`);
    $('a').each((i, el) => {
      const href = $(el).attr('href');
      if (href && href.includes('youtube.com/shorts/')) {
        const id = href.split('youtube.com/shorts/')[1].split('?')[0].split('&')[0];
        if (id.length === 11) console.log(id);
      }
    });
  } catch (e) {
    console.log('Error');
  }
}

async function run() {
  await gSearch('apne dog ko apna naam kaise sikhaye');
  await gSearch('apne dog ko focus eye contact kaise sikhaye');
  await gSearch('apne dog ko sit down kaise sikhaye');
}
run();
