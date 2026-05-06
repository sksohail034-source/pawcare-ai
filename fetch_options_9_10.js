import ytSearch from 'yt-search';
import fs from 'fs';

const topics = [
  { m: 9, t: 'Shake Hand', q: 'dog shake hand trick training hindi shorts' },
  { m: 9, t: 'Roll Over', q: 'dog roll over trick training hindi shorts' },
  { m: 9, t: 'Spin', q: 'dog spin round trick training hindi shorts' },
  { m: 10, t: 'Alert Training', q: 'dog alert barking guard training hindi shorts' },
  { m: 10, t: 'Territory Awareness', q: 'dog territory guard house training hindi shorts' },
  { m: 10, t: 'Basic Protection', q: 'dog protection guard training hindi shorts' }
];

async function run() {
  let output = '# Hindi Shorts Options (Months 9 & 10)\\n\\n';
  
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
  
  fs.writeFileSync('video_options_9_10.md', output);
  console.log('Done M9-10');
}

run();
