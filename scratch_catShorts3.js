import yts from 'yt-search';

// Highly specific training-focused queries for each topic
// Using exact Hindi training phrases that real educators use
const TOPICS = [
  { m:1, t:'Name Recognition', q: ['cat ko naam se bulana sikhaye', 'billi ko apna naam sikhaye training', 'cat name recall training tips'] },
  { m:1, t:'Litter Training', q: ['billi ko litter box training kaise kare', 'cat ko potty training sikhaye', 'kitten litter training step by step'] },
  { m:1, t:'Trust Building', q: ['nayi billi se dosti kaise kare tips', 'cat trust kaise jeete training', 'new kitten bonding tips hindi'] },
  
  { m:2, t:'Scratching Control', q: ['billi furniture scratching kaise rokein', 'cat scratching post use sikhaye', 'cat ko scratching se rokna tips'] },
  { m:2, t:'Stop Biting', q: ['billi kaatna band kaise karein training', 'kitten biting habit kaise rokein', 'cat bite habit stop training tips'] },
  { m:2, t:'Basic Response Training', q: ['cat basic commands sikhana hindi', 'billi ko command follow karna sikhaye', 'cat obedience training hindi'] },
  
  { m:3, t:'Feeding Schedule', q: ['billi ko kab kitna khana dein schedule', 'cat feeding schedule plan hindi', 'kitten diet chart hindi tips'] },
  { m:3, t:'Sleep Routine', q: ['billi ko raat mein sulane ka tarika', 'cat night routine tips hindi', 'billi raat ko shant rakhne tips'] },
  { m:3, t:'Play Discipline', q: ['billi ke saath kaise khelein training', 'cat play routine tips hindi', 'kitten play manners training'] },
  
  { m:4, t:'Interaction with Humans', q: ['billi ko friendly banana tips hindi', 'shy cat socialization training hindi', 'cat human bonding tips'] },
  { m:4, t:'Interaction with Pets', q: ['billi aur dog ko milana tips hindi', 'cat dog introduction step by step', 'multi pet introduction tips hindi'] },
  { m:4, t:'New Environment Adjustment', q: ['nayi billi ghar mein settle kaise kare', 'cat new home adjustment tips', 'kitten first day home tips hindi'] },
  
  { m:5, t:'Harness Training', q: ['billi ko harness lagana sikhaye hindi', 'cat harness training tips hindi', 'billi leash training start'] },
  { m:5, t:'Walking Practice', q: ['billi ko walk sikhana hindi', 'cat outdoor walking tips hindi', 'billi walk training leash'] },
  { m:5, t:'Outdoor Safety', q: ['billi outdoor safety tips hindi', 'cat ko bahar le jana safety', 'billi outdoor precautions hindi'] },
  
  { m:6, t:'Come When Called', q: ['billi ko bulane par aana sikhana', 'cat recall command training hindi', 'billi come command sikhaye'] },
  { m:6, t:'Sit Command', q: ['billi ko sit command sikhana hindi', 'cat sit training trick hindi', 'billi baitho command training'] },
  { m:6, t:'High Five Trick', q: ['billi high five trick sikhana hindi', 'cat shake hand trick hindi', 'billi paw trick training hindi'] },
  
  { m:7, t:'Aggression Control', q: ['billi aggressive behavior fix hindi', 'cat gussa kam karna training', 'aggressive cat handling tips hindi'] },
  { m:7, t:'Night Hyperactivity', q: ['billi raat ko bhagti hai solution', 'cat zoomies night fix hindi', 'billi hyperactive night solution'] },
  { m:7, t:'Excessive Meowing', q: ['billi zyada miyaon karna band kaise', 'cat meowing kaise rokein hindi', 'billi bolna kyun nahi rukti'] },
  
  { m:8, t:'Jump Training', q: ['billi ko jump sikhana trick hindi', 'cat jump training hoop hindi', 'billi tricks jump training'] },
  { m:8, t:'Target Training', q: ['cat target training stick hindi', 'billi target touch training', 'cat follow stick training hindi'] },
  { m:8, t:'Fetch', q: ['billi ko fetch sikhana ball hindi', 'cat fetch trick training hindi', 'billi ball wapas lana sikhaye'] },
  
  { m:9, t:'Puzzle Games', q: ['billi puzzle toy DIY hindi', 'cat brain games mental stimulation', 'billi dimag tez karne games'] },
  { m:9, t:'Hide & Seek', q: ['billi chupan chupai game training', 'cat hide and seek game hindi', 'billi games hide seek'] },
  { m:9, t:'Hunting Simulation', q: ['billi hunting game indoor hindi', 'cat hunting instinct play indoor', 'billi shikar khel indoor'] },
  
  { m:10, t:'Clicker Training', q: ['billi clicker training kaise kare', 'cat clicker training tutorial hindi', 'clicker training cat basics'] },
  { m:10, t:'Multi-Step Commands', q: ['billi advanced tricks training hindi', 'cat multiple tricks combo hindi', 'billi complex commands training'] },
  { m:10, t:'Reaction Training', q: ['cat agility training tricks hindi', 'billi reaction speed game', 'cat agility reflex training'] },
  
  { m:11, t:'Travel Training', q: ['billi travel carrier training hindi', 'cat car travel training tips', 'billi safar preparation tips'] },
  { m:11, t:'Vet Visit Calmness', q: ['billi vet visit calm kaise rakhe', 'cat vet visit training tips hindi', 'billi doctor calm training'] },
  { m:11, t:'Grooming Cooperation', q: ['billi grooming tips hindi training', 'cat grooming brushing nail trim', 'billi bath nail grooming hindi'] },
];

async function searchTopic(topic) {
  const allResults = [];
  for (const query of topic.q) {
    try {
      const r = await yts(query);
      // Filter for short-duration videos (Shorts are <=60s)
      const shorts = r.videos.filter(v => v.seconds > 0 && v.seconds <= 60);
      for (const v of shorts) {
        if (!allResults.find(x => x.videoId === v.videoId)) {
          allResults.push({
            videoId: v.videoId,
            title: v.title,
            channel: v.author?.name || '?',
            views: v.views,
            ago: v.ago,
            seconds: v.seconds,
            url: `https://youtube.com/shorts/${v.videoId}`
          });
        }
      }
    } catch (e) { /* skip */ }
  }
  // Sort by views
  allResults.sort((a, b) => b.views - a.views);
  return allResults.slice(0, 5); // Get top 5 to have more options
}

async function main() {
  console.log('🔍 Fast Search: Hindi Cat Training Shorts\n');
  const ALL = {};
  let cm = 0;

  for (const t of TOPICS) {
    if (t.m !== cm) { cm = t.m; console.log(`\n== MONTH ${cm} ==`); }
    process.stdout.write(`  ${t.t}... `);
    const res = await searchTopic(t);
    ALL[`M${t.m}_${t.t}`] = res;
    console.log(`${res.length} found`);
  }

  // Save full results
  const fs = await import('fs');
  fs.writeFileSync('cat_shorts_all.json', JSON.stringify(ALL, null, 2));
  console.log('\n✅ Saved to cat_shorts_all.json');

  // Print formatted summary
  console.log('\n\n' + '='.repeat(80));
  console.log('📋 FULL RESULTS - TOP 3 PER TOPIC');
  console.log('='.repeat(80));

  for (const t of TOPICS) {
    if (t.m !== cm || cm === 1) { cm = t.m; console.log(`\n📅 MONTH ${cm}`); console.log('-'.repeat(60)); }
    const key = `M${t.m}_${t.t}`;
    const res = ALL[key] || [];
    console.log(`\n  🎯 ${t.t}`);
    if (res.length === 0) {
      console.log('     ⚠️ No Shorts found');
    } else {
      res.slice(0, 3).forEach((v, i) => {
        const vw = v.views >= 1e6 ? `${(v.views/1e6).toFixed(1)}M` : v.views >= 1e3 ? `${(v.views/1e3).toFixed(0)}K` : v.views;
        console.log(`     ${i+1}. ${v.title}`);
        console.log(`        📺 ${v.channel} | 👀 ${vw} | 📆 ${v.ago} | 🔗 ${v.url}`);
      });
    }
  }
}

main().catch(console.error);
