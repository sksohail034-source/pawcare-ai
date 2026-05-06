import ytSearch from 'yt-search';

async function search(q) {
  const r = await ytSearch(q);
  const best = r.videos.find(v => v.duration.seconds <= 65 && !v.title.toLowerCase().includes('status'));
  console.log(`[${q}] -> ${best?.videoId} | ${best?.title}`);
}

async function run() {
  await search('dog name recall training shorts hindi');
  await search('dog eye contact focus training shorts hindi');
  await search('dog sit command kaise sikhaye shorts hindi');
}

run();
