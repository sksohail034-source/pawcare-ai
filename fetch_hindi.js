import ytSearch from 'yt-search';

async function s(q) {
  const r = await ytSearch(q);
  console.log(`\n### ${q} ###`);
  r.videos.slice(0, 5).forEach(v => {
    if (v.duration.seconds <= 65) {
      console.log(`${v.videoId} | ${v.title}`);
    }
  });
}

async function run() {
  await s('कुत्ते को अपना नाम कैसे सिखाएं shorts dog training hindi');
  await s('dog ka attention eye contact kaise badhaye training hindi shorts');
  await s('dog ko sit command baithna kaise sikhaye hindi shorts');
}
run();
