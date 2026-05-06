import ytSearch from 'yt-search';

async function s(q) {
  const r = await ytSearch(q);
  console.log(`\n### ${q} ###`);
  r.videos.slice(0, 10).forEach(v => {
    if (v.duration.seconds <= 65) {
      console.log(`- ${v.videoId} | ${v.title} | ${v.duration.timestamp} | ${v.author?.name || 'Unknown'}`);
    }
  });
}

async function run() {
  await s('dog name training hindi shorts');
  await s('apne dog ko naam sikhana shorts');
  
  await s('dog focus eye contact training hindi shorts');
  await s('dog attention training hindi shorts');
  
  await s('dog sit command training hindi shorts');
  await s('dog baithna sikhaye shorts');
}
run();
