import fs from 'fs';
import { dogTraining, catTraining } from './src/trainingData.js';

// Deep clone function isn't strictly necessary if we just mutate, but let's be safe.
function removeShorts(data) {
  for (let m of data) {
    for (let v of m.videos) {
      if (v.shortVideoId) {
        delete v.shortVideoId;
      }
    }
  }
}

removeShorts(dogTraining);
removeShorts(catTraining);

let output = `export const dogTraining = ${JSON.stringify(dogTraining, null, 2)};\n\nexport const catTraining = ${JSON.stringify(catTraining, null, 2)};\n`;
// Clean up the quotes around keys for better readability (like original)
output = output.replace(/"([^"]+)":/g, '$1:').replace(/"/g, "'");

fs.writeFileSync('./src/trainingData.js', output);
console.log('Removed all shortVideoId properties from trainingData.js');
