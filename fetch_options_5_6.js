import ytSearch from 'yt-search';
import fs from 'fs';

const topics = [
  { m: 5, t: 'Meeting Other Dogs', q: 'dog socialization meeting other dogs training hindi shorts' },
  { m: 5, t: 'Meeting Strangers', q: 'dog meeting strangers socialization training hindi shorts' },
  { m: 5, t: 'Public Behavior', q: 'dog public behavior training hindi shorts' },
  { m: 6, t: 'Down Command', q: 'dog down command training hindi shorts' },
  { m: 6, t: 'Leave It Command', q: 'dog leave it ignore training hindi shorts' },
  { m: 6, t: 'Drop It Command', q: 'dog drop it chhod do training hindi shorts' }
];

async function run() {
  let output = '# Hindi Shorts Options (Months 5 & 6)\\n\\n';
  
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
  
  fs.writeFileSync('video_options_5_6.md', output);
  console.log('Done M5-6');
}

run();
