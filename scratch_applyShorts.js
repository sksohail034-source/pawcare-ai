import fs from 'fs';
import { dogTraining, catTraining } from './src/trainingData.js';

const results = JSON.parse(fs.readFileSync('shorts_results.json', 'utf8'));

dogTraining.forEach(m => {
  m.videos.forEach(v => {
    if (results.dog[v.id]) {
      v.shortVideoId = results.dog[v.id];
    }
  });
});

catTraining.forEach(m => {
  m.videos.forEach(v => {
    if (results.cat[v.id]) {
      v.shortVideoId = results.cat[v.id];
    }
  });
});

let output = `export const dogTraining = ${JSON.stringify(dogTraining, null, 2)};\n\nexport const catTraining = ${JSON.stringify(catTraining, null, 2)};\n`;

// Fix quotes and formatting to look like JS
output = output.replace(/"([^"]+)":/g, '$1:').replace(/"/g, "'");

fs.writeFileSync('./src/trainingData.js', output);
console.log('Applied changes to trainingData.js');
