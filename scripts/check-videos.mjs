import { dogTraining, catTraining } from '../src/trainingData.js';
async function check() {
  const all = [...dogTraining, ...catTraining].flatMap(m => m.videos);
  for (let v of all) {
    const res = await fetch('https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=' + v.id);
    if (!res.ok) console.log('Broken:', v.id, v.title);
  }
}
check();
