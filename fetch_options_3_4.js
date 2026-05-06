import ytSearch from 'yt-search';
import fs from 'fs';

const topics = [
  { m: 3, t: 'Potty Training', q: 'dog potty training toilet hindi shorts' },
  { m: 3, t: 'Crate Training', q: 'dog crate training cage hindi shorts' },
  { m: 3, t: 'Stop Biting', q: 'dog puppy biting stop hindi shorts' },
  { m: 4, t: 'Loose Leash Walking', q: 'dog loose leash walking training hindi shorts' },
  { m: 4, t: 'Stop Pulling', q: 'dog leash pulling stop hindi shorts' },
  { m: 4, t: 'Walking Discipline', q: 'dog walk discipline training hindi shorts' }
];

async function run() {
  let output = '# Hindi Shorts Options (Months 3 & 4)\\n\\n';
  
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
  
  fs.writeFileSync('video_options_3_4.md', output);
  console.log('Done M3-4');
}

run();
