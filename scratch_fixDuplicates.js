import ytSearch from 'yt-search';
import fs from 'fs';

// Read the current trainingData.js
// It's a JS module, so we'll import it, modify it, and write it back.
import { dogTraining, catTraining } from './src/trainingData.js';

const usedIds = new Set();
const sleep = ms => new Promise(r => setTimeout(r, ms));

async function fixDuplicates(data, type) {
  for (let m of data) {
    for (let v of m.videos) {
      if (!v.shortVideoId) continue;
      
      if (usedIds.has(v.shortVideoId)) {
        // Find a new one
        let qTitle = v.title.replace(/Video \d+: /, '');
        let query = `#shorts ${type} training ${qTitle} hindi`;
        console.log(`Fixing duplicate for ${v.title}: ${query}`);
        try {
          const r = await ytSearch(query);
          const shorts = r.videos.filter(vid => vid.duration.seconds < 120);
          
          let found = false;
          for (let short of shorts) {
            if (!usedIds.has(short.videoId)) {
              console.log(`Found new ID: ${short.videoId}`);
              v.shortVideoId = short.videoId;
              usedIds.add(short.videoId);
              found = true;
              break;
            }
          }
          if (!found) {
             // If really no unique short, just pick the 3rd result of general search
             const fallback = r.videos.find(vid => !usedIds.has(vid.videoId));
             if (fallback) {
               v.shortVideoId = fallback.videoId;
               usedIds.add(fallback.videoId);
             }
          }
        } catch (e) {
          console.error(e);
        }
        await sleep(1500); // respect rate limits
      } else {
        usedIds.add(v.shortVideoId);
      }
    }
  }
}

async function main() {
  await fixDuplicates(dogTraining, 'dog');
  await fixDuplicates(catTraining, 'cat');
  
  let output = `export const dogTraining = ${JSON.stringify(dogTraining, null, 2)};\n\nexport const catTraining = ${JSON.stringify(catTraining, null, 2)};\n`;
  output = output.replace(/"([^"]+)":/g, '$1:').replace(/"/g, "'");
  
  fs.writeFileSync('./src/trainingData.js', output);
  console.log('Fixed duplicates in trainingData.js');
}

main();
