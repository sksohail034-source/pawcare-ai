import ytSearch from 'yt-search';

async function searchHindiOnly(topic) {
  const queries = [
    `${topic} कुत्ते को कैसे सिखाएं shorts`,
    `${topic} dog training hindi shorts`,
    `कुत्ते को ${topic} कैसे सिखाएं shorts`,
  ];
  
  for (let q of queries) {
    const r = await ytSearch(q);
    const valid = r.videos.find(v => 
      v.duration.seconds >= 10 && 
      v.duration.seconds <= 65 &&
      /[\u0900-\u097F]/.test(v.title) &&
      !v.title.includes('सबसे घटिया')
    );
    if (valid) {
      console.log(`[${topic}] -> ${valid.videoId} | ${valid.title}`);
      return;
    }
  }
  console.log(`[${topic}] -> No Devanagari short found`);
}

async function run() {
  await searchHindiOnly('बैठना (Sit)');
  await searchHindiOnly('रुकना (Stay)');
  await searchHindiOnly('पास आना (Come)');
  await searchHindiOnly('पॉटी (Potty)');
  await searchHindiOnly('काटना बंद (Stop Biting)');
}
run();
