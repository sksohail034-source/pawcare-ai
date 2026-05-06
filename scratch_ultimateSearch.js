import ytSearch from 'yt-search';
import fs from 'fs';
import { dogTraining, catTraining } from './src/trainingData.js';

const usedIds = new Set();
const sleep = ms => new Promise(r => setTimeout(r, ms));

function isIndian(title, author) {
  const t = title.toLowerCase();
  const a = author ? author.name.toLowerCase() : '';
  const hindiWords = ['kaise', 'sikhaye', 'hindi', 'kare', 'kya', 'hai', 'mein', 'ko', 'training', 'dog ki', 'bhai', 'deshi', 'desi', 'india', 'baadal', 'sharma', 'pet', 'urban', 'namitaology'];
  
  if (/[\u0900-\u097F]/.test(t)) return true;
  for (let w of hindiWords) {
    if (t.includes(w) || a.includes(w)) return true;
  }
  return false;
}

const badWords = ['status', 'funny', 'comedy', 'vs', 'attack', 'worst', 'fail', 'reaction'];

async function searchTopic(topic, animal) {
  let query = `${animal} ${topic} kaise sikhaye shorts`;
  if (topic.includes('Potty')) query = `${animal} potty training hindi shorts`;
  if (topic.includes('Biting')) query = `${animal} katna kaise roke shorts`;
  
  try {
    const r = await ytSearch(query);
    const valid = r.videos.filter(v => 
      v.duration.seconds >= 10 && 
      v.duration.seconds <= 65 && 
      !usedIds.has(v.videoId) &&
      isIndian(v.title, v.author) &&
      !badWords.some(bw => v.title.toLowerCase().includes(bw))
    );

    if (valid.length > 0) {
      usedIds.add(valid[0].videoId);
      console.log(`✅ [${topic}] -> ${valid[0].title}`);
      return valid[0].videoId;
    }
    
    // Fallback search
    const r2 = await ytSearch(`${animal} ${topic} hindi shorts`);
    const valid2 = r2.videos.filter(v => 
      v.duration.seconds >= 10 && 
      v.duration.seconds <= 65 && 
      !usedIds.has(v.videoId) &&
      isIndian(v.title, v.author) &&
      !badWords.some(bw => v.title.toLowerCase().includes(bw))
    );
    
    if (valid2.length > 0) {
      usedIds.add(valid2[0].videoId);
      console.log(`⚠️ [${topic}] Fallback -> ${valid2[0].title}`);
      return valid2[0].videoId;
    }
  } catch (e) {
    console.log(`Error: ${e.message}`);
  }
  
  console.log(`❌ [${topic}] -> No valid Hindi short found`);
  return null;
}

async function run() {
  for (let m of dogTraining) {
    for (let v of m.videos) {
      let cleanTopic = v.title.replace(/Video \d+: /, '').replace(/ \(.+\)/, '');
      const id = await searchTopic(cleanTopic, 'dog');
      v.shortVideoId = id; // could be null
      await sleep(1000);
    }
  }

  for (let m of catTraining) {
    for (let v of m.videos) {
      let cleanTopic = v.title.replace(/Video \d+: /, '').replace(/ \(.+\)/, '');
      const id = await searchTopic(cleanTopic, 'cat');
      v.shortVideoId = id; // could be null
      await sleep(1000);
    }
  }

  let output = `export const dogTraining = ${JSON.stringify(dogTraining, null, 2)};\n\nexport const catTraining = ${JSON.stringify(catTraining, null, 2)};\n`;
  output = output.replace(/"([^"]+)":/g, '$1:').replace(/"/g, "'");
  fs.writeFileSync('./src/trainingData.js', output);
  console.log('✅ Update complete!');
}

run();
