import fs from 'fs';

// Read the raw text
let text = fs.readFileSync('./src/trainingData.js', 'utf8');

const updates = [
  // Month 1
  { title: "Video 1: Name Recognition (3 Steps)", id: "vdfMFL5xAeY" },
  { title: "Video 2: Focus Training (Instantly)", id: "zDeL2fAC1q8" },
  { title: "Video 3: Sit Command (Service Dog Method)", id: "j79L5fZTbL8" },
  
  // Month 2
  { title: "Video 1: Sit Duration (Improvement)", id: "HcNEe43RdBs" },
  { title: "Video 2: Stay Command (With Distractions)", id: "OinvGTSzRW8" },
  { title: "Video 3: Come When Called (Recall Basics)", id: "Pa0rTf7Rkpo" }
];

updates.forEach(up => {
  // Find the exact block in dogTraining for this title
  // We're looking for: title: '...'
  // and we want to append shortVideoId right after the dur: '...'
  const regex = new RegExp(`(title:\\s*['"]${up.title.replace(/[.*+?^$\\{\\}()|[\\]\\\\]/g, '\\\\$&')}['"][\\s\\S]*?dur:\\s*['"][^'"]+['"])`, 'g');
  
  text = text.replace(regex, `$1,\\n        shortVideoId: '${up.id}'`);
});

fs.writeFileSync('./src/trainingData.js', text);
console.log("Updated Month 1 & 2 shorts in trainingData.js");
