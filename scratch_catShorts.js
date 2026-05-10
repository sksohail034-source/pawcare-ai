import yts from 'yt-search';

const TOPICS = [
  // Month 1: Basics
  { month: 1, title: 'Name Recognition', queries: ['billi ko naam sikhana hindi', 'cat name training hindi shorts', 'billi naam pehchaan hindi'] },
  { month: 1, title: 'Litter Training', queries: ['billi litter box training hindi', 'cat litter training hindi shorts', 'billi ko toilet sikhana hindi'] },
  { month: 1, title: 'Trust Building', queries: ['billi ka bharosa jeetna hindi', 'cat trust building hindi', 'billi se dosti kaise kare hindi'] },
  
  // Month 2: Behavior Setup
  { month: 2, title: 'Scratching Control', queries: ['billi scratching rokna hindi', 'cat scratching furniture hindi', 'billi nokhun control hindi'] },
  { month: 2, title: 'Stop Biting', queries: ['billi kaatna band hindi', 'cat biting stop hindi', 'billi kaatne ki aadat hindi'] },
  { month: 2, title: 'Basic Response Training', queries: ['billi basic training hindi', 'cat response training hindi shorts', 'billi ko sikhana hindi basics'] },
  
  // Month 3: Routine Building
  { month: 3, title: 'Feeding Schedule', queries: ['billi khana schedule hindi', 'cat feeding routine hindi', 'billi ko kab khana de hindi'] },
  { month: 3, title: 'Sleep Routine', queries: ['billi sleep routine hindi', 'cat sleeping schedule hindi', 'billi sone ka time hindi'] },
  { month: 3, title: 'Play Discipline', queries: ['billi play discipline hindi', 'cat play training hindi', 'billi khelna sikhana hindi'] },
  
  // Month 4: Socialization
  { month: 4, title: 'Interaction with Humans', queries: ['billi insano se interaction hindi', 'cat socialization humans hindi', 'billi friendly banana hindi'] },
  { month: 4, title: 'Interaction with Pets', queries: ['billi aur dog dosti hindi', 'cat dog introduction hindi', 'billi dusre pets ke saath hindi'] },
  { month: 4, title: 'New Environment Adjustment', queries: ['billi naye ghar mein hindi', 'cat new home adjustment hindi', 'billi environment adjust hindi'] },
  
  // Month 5: Leash & Outdoor
  { month: 5, title: 'Harness Training', queries: ['billi harness training hindi', 'cat harness leash hindi', 'billi ko patti lagana hindi'] },
  { month: 5, title: 'Walking Practice', queries: ['billi walk training hindi', 'cat walking practice hindi', 'billi ko ghumana hindi'] },
  { month: 5, title: 'Outdoor Safety', queries: ['billi outdoor safety hindi', 'cat outside safety tips hindi', 'billi bahar le jana hindi'] },
  
  // Month 6: Commands Training
  { month: 6, title: 'Come When Called', queries: ['billi bulane par aana hindi', 'cat come command hindi', 'billi ko bulana sikhana hindi'] },
  { month: 6, title: 'Sit Command', queries: ['billi sit command hindi', 'cat sit training hindi', 'billi baitho sikhana hindi'] },
  { month: 6, title: 'High Five Trick', queries: ['billi high five trick hindi', 'cat high five training hindi', 'billi tricks sikhana hindi'] },
  
  // Month 7: Behavior Fixing
  { month: 7, title: 'Aggression Control', queries: ['billi aggression control hindi', 'cat aggressive behavior fix hindi', 'billi gussa control hindi'] },
  { month: 7, title: 'Night Hyperactivity (Zoomies)', queries: ['billi raat ko bhagna hindi', 'cat zoomies night hindi', 'billi raat hyperactive hindi'] },
  { month: 7, title: 'Excessive Meowing', queries: ['billi zyada bolna hindi', 'cat excessive meowing hindi', 'billi meowing band kaise kare hindi'] },
  
  // Month 8: Tricks Training
  { month: 8, title: 'Jump Training', queries: ['billi jump training hindi', 'cat jump trick hindi', 'billi koodna sikhana hindi'] },
  { month: 8, title: 'Target Training', queries: ['billi target training hindi', 'cat target stick training hindi', 'billi target touch hindi'] },
  { month: 8, title: 'Fetch', queries: ['billi fetch sikhana hindi', 'cat fetch training hindi', 'billi ball lana sikhana hindi'] },
  
  // Month 9: Mental Stimulation
  { month: 9, title: 'Puzzle Games', queries: ['billi puzzle games hindi', 'cat puzzle toy hindi', 'billi dimag games hindi'] },
  { month: 9, title: 'Hide & Seek', queries: ['billi hide and seek hindi', 'cat hide seek game hindi', 'billi chupan chupai hindi'] },
  { month: 9, title: 'Hunting Simulation', queries: ['billi hunting game hindi', 'cat hunting simulation hindi', 'billi shikar game hindi'] },
  
  // Month 10: Advanced Training
  { month: 10, title: 'Clicker Training', queries: ['billi clicker training hindi', 'cat clicker training hindi', 'billi clicker sikhana hindi'] },
  { month: 10, title: 'Multi-Step Commands', queries: ['billi multi step commands hindi', 'cat advanced commands hindi', 'billi tricks multiple hindi'] },
  { month: 10, title: 'Reaction Training', queries: ['billi reaction training hindi', 'cat reaction speed training hindi', 'billi reflex training hindi'] },
  
  // Month 11: Lifestyle Training
  { month: 11, title: 'Travel Training', queries: ['billi travel training hindi', 'cat carrier training hindi', 'billi safar sikhana hindi'] },
  { month: 11, title: 'Vet Visit Calmness', queries: ['billi vet visit calm hindi', 'cat vet visit training hindi', 'billi doctor ke paas hindi'] },
  { month: 11, title: 'Grooming Cooperation', queries: ['billi grooming training hindi', 'cat grooming tips hindi', 'billi ki grooming kaise kare hindi'] },
];

async function searchTopic(topic) {
  const results = [];
  
  for (const query of topic.queries) {
    try {
      const r = await yts(query);
      // Get videos that look like Shorts (duration <= 60s)
      const shorts = r.videos.filter(v => v.seconds <= 60 && v.seconds >= 10);
      for (const v of shorts) {
        // Avoid duplicates
        if (!results.find(x => x.videoId === v.videoId)) {
          results.push({
            videoId: v.videoId,
            title: v.title,
            channel: v.author?.name || 'Unknown',
            views: v.views,
            ago: v.ago,
            duration: v.timestamp,
            seconds: v.seconds,
            url: `https://youtube.com/shorts/${v.videoId}`
          });
        }
      }
    } catch (err) {
      // skip query errors
    }
  }
  
  // Sort by views descending, take top 3
  results.sort((a, b) => b.views - a.views);
  return results.slice(0, 3);
}

async function main() {
  console.log('🔍 Searching for Hindi Cat Training Shorts...\n');
  
  const allResults = {};
  let currentMonth = 0;
  
  for (const topic of TOPICS) {
    if (topic.month !== currentMonth) {
      currentMonth = topic.month;
      console.log(`\n${'='.repeat(60)}`);
      console.log(`📅 MONTH ${currentMonth}`);
      console.log(`${'='.repeat(60)}`);
    }
    
    console.log(`\n🎯 ${topic.title}`);
    console.log(`${'-'.repeat(40)}`);
    
    const results = await searchTopic(topic);
    
    if (results.length === 0) {
      console.log('  ❌ No Shorts found for this topic');
    } else {
      results.forEach((v, i) => {
        const viewStr = v.views >= 1000000 ? `${(v.views/1000000).toFixed(1)}M` : 
                        v.views >= 1000 ? `${(v.views/1000).toFixed(1)}K` : v.views;
        console.log(`  ${i+1}. "${v.title}"`);
        console.log(`     📺 ${v.channel} | 👀 ${viewStr} views | ⏱️ ${v.duration} | 📆 ${v.ago}`);
        console.log(`     🔗 ${v.url}`);
      });
    }
    
    allResults[`M${topic.month}_${topic.title}`] = results;
  }
  
  // Save to JSON for reference
  const fs = await import('fs');
  fs.writeFileSync('cat_shorts_results.json', JSON.stringify(allResults, null, 2));
  console.log('\n\n✅ Results saved to cat_shorts_results.json');
}

main().catch(console.error);
