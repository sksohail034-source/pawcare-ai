import ytSearch from 'yt-search';
import fs from 'fs';
import { dogTraining, catTraining } from './src/trainingData.js';

const usedIds = new Set();
const sleep = ms => new Promise(r => setTimeout(r, ms));

async function fetchBestShort(animal, topic) {
  // Variations of queries to get the best results
  const queries = [
    `${animal} ${topic} training in hindi #shorts`,
    `how to train ${animal} ${topic} hindi shorts`,
    `${animal} ${topic} dog training hindi`
  ];

  let bestVideo = null;

  for (let q of queries) {
    try {
      const r = await ytSearch(q);
      
      // Filter based on user's strict criteria
      const validShorts = r.videos.filter(v => 
        v.duration.seconds >= 10 && 
        v.duration.seconds <= 65 && // slightly relaxed for 60s border
        !usedIds.has(v.videoId)
      );

      // Sort by views descending
      validShorts.sort((a, b) => b.views - a.views);

      // Prefer videos with > 50,000 views
      const highViews = validShorts.find(v => v.views > 50000);
      
      if (highViews) {
        bestVideo = highViews;
        break; // found a great video!
      } else if (validShorts.length > 0 && !bestVideo) {
        // Fallback to highest viewed if no highViews found
        bestVideo = validShorts[0];
      }
    } catch (e) {
      console.log(`Search error for ${q}`);
    }
  }

  if (bestVideo) {
    usedIds.add(bestVideo.videoId);
    console.log(`✅ [${animal}] ${topic} -> ${bestVideo.title} (${bestVideo.views} views, ${bestVideo.duration.timestamp})`);
    return bestVideo.videoId;
  }
  
  console.log(`❌ [${animal}] ${topic} -> No suitable short found`);
  return null;
}

async function processCurriculum(data, animal) {
  for (let month of data) {
    for (let video of month.videos) {
      let cleanTopic = video.title.replace(/Video \d+: /, '').replace(/ \(.+\)/, '');
      const shortId = await fetchBestShort(animal, cleanTopic);
      if (shortId) {
        video.shortVideoId = shortId;
      }
      await sleep(1500); // Prevent YouTube API blocking
    }
  }
}

async function main() {
  console.log('Starting Smart Search for HIGH QUALITY HINDI SHORTS...');
  
  await processCurriculum(dogTraining, 'dog');
  await processCurriculum(catTraining, 'cat');
  
  let output = `export const dogTraining = ${JSON.stringify(dogTraining, null, 2)};\n\nexport const catTraining = ${JSON.stringify(catTraining, null, 2)};\n`;
  output = output.replace(/"([^"]+)":/g, '$1:').replace(/"/g, "'");
  
  fs.writeFileSync('./src/trainingData.js', output);
  console.log('Successfully updated trainingData.js with high quality shorts!');
}

main();
