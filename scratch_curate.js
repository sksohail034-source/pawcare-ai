import ytSearch from 'yt-search';
import fs from 'fs';
import { dogTraining, catTraining } from './src/trainingData.js';

const usedIds = new Set();
const sleep = ms => new Promise(r => setTimeout(r, ms));

async function fetchCuratedShort(animal, topic) {
  // Use specific Hindi trainers in the query to avoid viral garbage
  const trainer = animal === 'dog' ? 'Baadal Sharma OR Urban Pets' : 'cat training tips hindi';
  const query = `${topic} ${trainer} shorts hindi`;

  try {
    const r = await ytSearch(query);
    const validShorts = r.videos.filter(v => 
      v.duration.seconds >= 15 && 
      v.duration.seconds <= 65 && 
      v.views > 10000 && // lowered view count to find actual tutorials instead of viral garbage
      !usedIds.has(v.videoId) &&
      !v.title.toLowerCase().includes('worst') &&
      !v.title.toLowerCase().includes('attack') &&
      !v.title.toLowerCase().includes('vs')
    );

    if (validShorts.length > 0) {
      const best = validShorts[0];
      usedIds.add(best.videoId);
      console.log(`✅ [${animal}] ${topic} -> ${best.title} (${best.views} views, ${best.duration.timestamp})`);
      return best.videoId;
    }
  } catch (e) {
    console.log(`Search error for ${query}`);
  }
  
  console.log(`❌ [${animal}] ${topic} -> No suitable short found`);
  return null;
}

async function main() {
  console.log('Starting CURATED Search for HIGH QUALITY HINDI SHORTS...');
  
  for (let m of dogTraining) {
    for (let v of m.videos) {
      let cleanTopic = v.title.replace(/Video \d+: /, '').replace(/ \(.+\)/, '');
      const id = await fetchCuratedShort('dog', cleanTopic);
      if (id) v.shortVideoId = id;
      await sleep(1500);
    }
  }

  for (let m of catTraining) {
    for (let v of m.videos) {
      let cleanTopic = v.title.replace(/Video \d+: /, '').replace(/ \(.+\)/, '');
      const id = await fetchCuratedShort('cat', cleanTopic);
      if (id) v.shortVideoId = id;
      await sleep(1500);
    }
  }
  
  let output = `export const dogTraining = ${JSON.stringify(dogTraining, null, 2)};\n\nexport const catTraining = ${JSON.stringify(catTraining, null, 2)};\n`;
  output = output.replace(/"([^"]+)":/g, '$1:').replace(/"/g, "'");
  
  fs.writeFileSync('./src/trainingData.js', output);
  console.log('Updated trainingData.js with CURATED shorts!');
}

main();
