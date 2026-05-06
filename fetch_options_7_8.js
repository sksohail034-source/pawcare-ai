import ytSearch from 'yt-search';
import fs from 'fs';

const topics = [
  { m: 7, t: 'Barking Control', q: 'dog barking stop training hindi shorts' },
  { m: 7, t: 'Jumping on People', q: 'dog jumping stop training hindi shorts' },
  { m: 7, t: 'Separation Anxiety', q: 'dog separation anxiety training hindi shorts' },
  { m: 8, t: 'Off-Leash Training', q: 'dog off leash without leash training hindi shorts' },
  { m: 8, t: 'Distance Commands', q: 'dog distance command training hindi shorts' },
  { m: 8, t: 'Hand Signals', q: 'dog hand signal training hindi shorts' }
];

async function run() {
  let output = '# Hindi Shorts Options (Months 7 & 8)\\n\\n';
  
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
  
  fs.writeFileSync('video_options_7_8.md', output);
  console.log('Done M7-8');
}

run();
