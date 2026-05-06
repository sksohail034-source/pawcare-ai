import ytSearch from 'yt-search';
import fs from 'fs';
import { dogTraining, catTraining } from './src/trainingData.js';

const usedIds = new Set();
const sleep = ms => new Promise(r => setTimeout(r, ms));

// Helper to check if title seems Hindi/Indian
function isHindi(title) {
  const t = title.toLowerCase();
  const hindiWords = ['kaise', 'sikhaye', 'hindi', 'kare', 'kya', 'hai', 'mein', 'ko', 'training', 'dog ki', 'bhai', 'deshi', 'desi', 'india', 'baadal', 'sharma', 'pet', 'urban'];
  // Also check for Devanagari script
  const hasDevanagari = /[\u0900-\u097F]/.test(title);
  if (hasDevanagari) return true;
  for (let w of hindiWords) {
    if (t.includes(w)) return true;
  }
  return false;
}

async function findHindiShort(topic, animal) {
  // Translate some common terms to Hindi for better search
  let query = `${animal} ${topic} kaise sikhaye shorts`;
  if (topic.toLowerCase().includes('potty')) query = `${animal} potty training hindi shorts`;
  if (topic.toLowerCase().includes('bite') || topic.toLowerCase().includes('biting')) query = `${animal} katna kaise band kare shorts`;
  if (topic.toLowerCase().includes('bark')) query = `${animal} bhokna kaise band kare shorts`;
  if (topic.toLowerCase().includes('jump')) query = `${animal} koodna kaise roke shorts`;
  if (topic.toLowerCase().includes('shake')) query = `${animal} shake hand kaise sikhaye shorts`;
  if (topic.toLowerCase().includes('roll')) query = `${animal} roll over training hindi shorts`;
  if (topic.toLowerCase().includes('come')) query = `${animal} paas aana kaise sikhaye shorts`;
  if (topic.toLowerCase().includes('stay')) query = `${animal} rukna stay command hindi shorts`;
  if (topic.toLowerCase().includes('leave')) query = `${animal} leave it chhodna hindi shorts`;

  console.log(`Searching: ${query}`);
  try {
    const r = await ytSearch(query);
    const valid = r.videos.filter(v => 
      v.duration.seconds >= 10 && 
      v.duration.seconds <= 65 && 
      !usedIds.has(v.videoId) &&
      isHindi(v.title) &&
      !v.title.toLowerCase().includes('status') &&
      !v.title.toLowerCase().includes('funny')
    );

    if (valid.length > 0) {
      usedIds.add(valid[0].videoId);
      console.log(`✅ Found: ${valid[0].title}`);
      return valid[0].videoId;
    }

    // Fallback: Just search 'topic hindi shorts'
    const fallbackQuery = `${animal} ${topic} hindi shorts training`;
    const r2 = await ytSearch(fallbackQuery);
    const valid2 = r2.videos.filter(v => 
      v.duration.seconds >= 10 && 
      v.duration.seconds <= 65 && 
      !usedIds.has(v.videoId)
    );
    if (valid2.length > 0) {
      usedIds.add(valid2[0].videoId);
      console.log(`⚠️ Fallback: ${valid2[0].title}`);
      return valid2[0].videoId;
    }

  } catch (e) {
    console.log(`Error on ${topic}`);
  }
  return null;
}

async function processData() {
  for (let m of dogTraining) {
    for (let v of m.videos) {
      let cleanTopic = v.title.replace(/Video \d+: /, '').replace(/ \(.+\)/, '');
      const id = await findHindiShort(cleanTopic, 'dog');
      if (id) v.shortVideoId = id;
      await sleep(1000);
    }
  }

  for (let m of catTraining) {
    for (let v of m.videos) {
      let cleanTopic = v.title.replace(/Video \d+: /, '').replace(/ \(.+\)/, '');
      const id = await findHindiShort(cleanTopic, 'cat');
      if (id) v.shortVideoId = id;
      await sleep(1000);
    }
  }

  let output = `export const dogTraining = ${JSON.stringify(dogTraining, null, 2)};\n\nexport const catTraining = ${JSON.stringify(catTraining, null, 2)};\n`;
  output = output.replace(/"([^"]+)":/g, '$1:').replace(/"/g, "'");
  fs.writeFileSync('./src/trainingData.js', output);
  console.log('✅ Done updating with strict Hindi shorts!');
}

processData();
