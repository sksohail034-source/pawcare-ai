import ytSearch from 'yt-search';
import fs from 'fs';

const topics = [
  { m: 1, t: 'Name Recognition', q: 'dog apna naam kaise sikhaye training hindi shorts' },
  { m: 1, t: 'Focus / Eye Contact', q: 'dog eye contact attention training hindi shorts' },
  { m: 1, t: 'Sit Command', q: 'dog ko sit baithna kaise sikhaye hindi shorts' },
  { m: 2, t: 'Sit Improve', q: 'dog sit command improve training hindi shorts' },
  { m: 2, t: 'Stay', q: 'dog ko stay rukna kaise sikhaye hindi shorts' },
  { m: 2, t: 'Come When Called', q: 'dog recall training wapas aana hindi shorts' },
  { m: 3, t: 'Potty Training', q: 'dog potty training hindi shorts' },
  { m: 3, t: 'Crate Training', q: 'dog crate training cage hindi shorts' },
  { m: 3, t: 'Stop Biting', q: 'dog puppy biting stop hindi shorts' }
];

async function run() {
  let output = '# YouTube Shorts Options (Months 1-3)\\n\\n';
  
  for (let topic of topics) {
    console.log(`Searching: ${topic.t}`);
    output += `## Month ${topic.m}: ${topic.t}\\n\\n`;
    
    try {
      const r = await ytSearch(topic.q);
      const shorts = r.videos.filter(v => v.duration.seconds <= 65).slice(0, 3);
      
      shorts.forEach((v, i) => {
        output += `**Option ${i+1}:** [${v.title}](https://youtube.com/shorts/${v.videoId})\\n`;
        output += `- Channel: ${v.author.name} | Views: ${v.views} | Duration: ${v.duration.timestamp}\\n\\n`;
      });
    } catch (e) {
      output += `Error searching\\n\\n`;
    }
  }
  
  fs.writeFileSync('video_options_1_3.md', output);
  console.log('Done M1-3');
}

run();
