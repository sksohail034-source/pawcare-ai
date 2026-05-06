import ytSearch from 'yt-search';

async function fetchAndLog(query) {
  const r = await ytSearch(query);
  console.log(`\n### ${query} ###`);
  r.videos.filter(v => v.duration.seconds <= 65).slice(0, 5).forEach(v => {
    console.log(`${v.videoId} | ${v.title} | ${v.duration.timestamp}`);
  });
}

async function run() {
  await fetchAndLog('dog sit command hindi shorts');
  await fetchAndLog('dog stay command hindi shorts');
  await fetchAndLog('dog come when called recall hindi shorts');
  await fetchAndLog('dog potty training hindi shorts');
  await fetchAndLog('dog crate training hindi shorts');
  await fetchAndLog('dog puppy biting katna kaise roke hindi shorts');
}
run();
