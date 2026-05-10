import yts from 'yt-search';

// Known Hindi pet training channels
const TRUSTED_CHANNELS = [
  'Chubby Meows', 'Pet India Online', 'Ankit Pet World', 'The Cat Guru',
  'Pet Care Hindi', 'Dr. Vet Hindi', 'Pets and Paws', 'Cat World Hindi',
  'AnimalWised Hindi', 'PetMaster Hindi', 'Indian Pet Care', 'Paws India',
  'Cat Lovers Hindi', 'Vet Dr. Amit', 'Pet Channel Hindi', 'Cuddles & Meow',
  'Cute & Funny Cats', 'Pet Guide India', 'Animal Care Hindi', 'Swasthya Plus Hindi',
  'Rachael Ray Show', 'Jackson Galaxy', 'The Roamer Amit'
];

const TOPICS = [
  // Month 1
  { m: 1, t: 'Name Recognition', q: [
    'billi ko apna naam sikhaye training tips', 'cat naam pehchaan training hindi',
    'kitten name recognition training hindi', 'billi naam bulane par aaye hindi',
    'cat ko naam se bulana sikhana', 'billi training naam hindi tips'
  ]},
  { m: 1, t: 'Litter Training', q: [
    'billi ko litter box mein toilet sikhaye', 'kitten litter training step by step hindi',
    'cat toilet training tips hindi', 'billi litter tray training hindi',
    'billi ko potty kaise sikhaye hindi', 'cat ko toilet train karna hindi'
  ]},
  { m: 1, t: 'Trust Building', q: [
    'nayi billi ka bharosa kaise jeete', 'new cat trust building tips hindi',
    'billi se dosti kaise kare hindi tips', 'cat bonding tips hindi',
    'shy cat trust tips hindi', 'billi pyaar kaise kare hindi'
  ]},
  // Month 2
  { m: 2, t: 'Scratching Control', q: [
    'billi furniture scratch karna kaise rokein hindi', 'cat scratching post training hindi',
    'billi scratching problem solution hindi', 'cat ko scratching se rokna hindi',
    'billi nails scratch furniture hindi tips'
  ]},
  { m: 2, t: 'Stop Biting', q: [
    'billi kaatna kaise band kare training', 'kitten biting habit stop hindi',
    'cat biting problem solution hindi', 'billi haath kaatna band kare',
    'cat bite training tips hindi'
  ]},
  { m: 2, t: 'Basic Response Training', q: [
    'billi basic training commands hindi', 'cat obedience training hindi shorts',
    'billi ko basic commands sikhaye hindi', 'cat training basics hindi tips',
    'billi training tips beginners hindi'
  ]},
  // Month 3
  { m: 3, t: 'Feeding Schedule', q: [
    'billi ko kab aur kitna khana dein hindi', 'cat feeding schedule tips hindi',
    'kitten feeding routine hindi', 'billi ka khana schedule hindi',
    'cat diet plan hindi tips'
  ]},
  { m: 3, t: 'Sleep Routine', q: [
    'billi raat ko kaise sulaye hindi', 'cat sleep training night hindi',
    'billi sleeping schedule tips hindi', 'cat ko raat mein shant karna hindi',
    'billi nighttime routine hindi'
  ]},
  { m: 3, t: 'Play Discipline', q: [
    'billi khelne ka sahi tarika hindi', 'cat play manners training hindi',
    'kitten play discipline hindi', 'billi khelna sikhana discipline hindi',
    'cat playtime rules hindi'
  ]},
  // Month 4
  { m: 4, t: 'Interaction with Humans', q: [
    'billi insano ke saath friendly banana', 'cat human socialization hindi',
    'billi ko logo se milwana hindi', 'shy cat socialization tips hindi',
    'billi ko friendly banana hindi tips'
  ]},
  { m: 4, t: 'Interaction with Pets', q: [
    'billi aur dog milwana hindi', 'cat dog introduction tips hindi',
    'billi dusri billi se milwana hindi', 'new cat old cat introduction hindi',
    'cat multi pet household hindi'
  ]},
  { m: 4, t: 'New Environment Adjustment', q: [
    'billi naye ghar adjustment tips hindi', 'cat new home settling hindi',
    'nayi billi ghar mein kaise settle kare hindi', 'kitten new environment hindi',
    'billi ghar mein adjust hindi tips'
  ]},
  // Month 5
  { m: 5, t: 'Harness Training', q: [
    'billi ko harness lagana sikhaye hindi', 'cat harness training tips hindi',
    'billi leash walking hindi', 'cat harness pehle baar hindi',
    'kitten harness training hindi'
  ]},
  { m: 5, t: 'Walking Practice', q: [
    'billi ko walk pe le jana hindi', 'cat walking outside hindi tips',
    'billi bahar ghumana hindi', 'cat leash walking practice hindi',
    'billi outdoor walk training hindi'
  ]},
  { m: 5, t: 'Outdoor Safety', q: [
    'billi bahar safety tips hindi', 'cat outdoor dangers hindi',
    'billi ko bahar le jane se pehle hindi', 'outdoor cat safety hindi',
    'billi safety tips outside hindi'
  ]},
  // Month 6
  { m: 6, t: 'Come When Called', q: [
    'billi ko bulane par aana sikhana hindi', 'cat recall training hindi',
    'billi come command training hindi', 'cat ko bulane pe aana sikhao hindi',
    'billi aao command hindi'
  ]},
  { m: 6, t: 'Sit Command', q: [
    'billi ko baitho command sikhana hindi', 'cat sit training tips hindi',
    'billi sit command hindi tricks', 'cat obedience sit hindi',
    'billi tricks sit command hindi'
  ]},
  { m: 6, t: 'High Five Trick', q: [
    'billi ko high five sikhana hindi', 'cat high five trick training hindi',
    'billi paw shake trick hindi', 'cat tricks hindi high five',
    'billi tricks training hindi shake hands'
  ]},
  // Month 7
  { m: 7, t: 'Aggression Control', q: [
    'billi ka gussa kaise control kare hindi', 'aggressive cat training hindi',
    'billi aggression fix hindi tips', 'cat anger management hindi',
    'billi ladai jhagda kaise rokein hindi'
  ]},
  { m: 7, t: 'Night Hyperactivity (Zoomies)', q: [
    'billi raat ko pagal hona zoomies hindi', 'cat night hyperactive kaise rokein hindi',
    'billi raat ko bhagti hai solution hindi', 'cat zoomies control hindi',
    'billi night active rokna hindi'
  ]},
  { m: 7, t: 'Excessive Meowing', q: [
    'billi bahut zyada bolti hai solution hindi', 'cat excessive meowing stop hindi',
    'billi meowing problem hindi', 'cat bolna band kaise kare hindi',
    'billi zyada miyaon karna hindi'
  ]},
  // Month 8
  { m: 8, t: 'Jump Training', q: [
    'billi ko jump sikhana hindi', 'cat jump trick training hindi',
    'billi hoop jump training hindi', 'cat jumping tricks hindi',
    'billi koodna training hindi'
  ]},
  { m: 8, t: 'Target Training', q: [
    'billi target training stick hindi', 'cat target touch training hindi',
    'billi target stick follow hindi', 'cat training target hindi tips',
    'billi hand target training hindi'
  ]},
  { m: 8, t: 'Fetch', q: [
    'billi ko fetch sikhana ball lana hindi', 'cat fetch training hindi',
    'billi ball game training hindi', 'cat fetch trick hindi',
    'billi retrieve ball hindi'
  ]},
  // Month 9
  { m: 9, t: 'Puzzle Games', q: [
    'billi puzzle toy games hindi', 'cat puzzle feeder hindi',
    'billi brain games hindi', 'cat mental stimulation toys hindi',
    'billi dimag tez karne wale games hindi'
  ]},
  { m: 9, t: 'Hide & Seek', q: [
    'billi chupan chupai game hindi', 'cat hide and seek play hindi',
    'billi hide seek training hindi', 'cat finding game hindi',
    'billi ka game hide seek hindi'
  ]},
  { m: 9, t: 'Hunting Simulation', q: [
    'billi shikar wala game hindi', 'cat hunting instinct play hindi',
    'billi hunting toys hindi', 'cat prey drive stimulation hindi',
    'billi shikar game indoor hindi'
  ]},
  // Month 10
  { m: 10, t: 'Clicker Training', q: [
    'billi clicker training kaise kare hindi', 'cat clicker training basics hindi',
    'billi clicker se sikhana hindi', 'cat training clicker use hindi',
    'billi clicker conditioning hindi'
  ]},
  { m: 10, t: 'Multi-Step Commands', q: [
    'billi multiple tricks sikhana hindi', 'cat chain tricks training hindi',
    'billi advanced commands hindi', 'cat multi step training hindi',
    'billi combo tricks hindi'
  ]},
  { m: 10, t: 'Reaction Training', q: [
    'billi reflexes training hindi', 'cat reaction speed game hindi',
    'billi reaction test hindi', 'cat agility training hindi',
    'billi speed response training hindi'
  ]},
  // Month 11
  { m: 11, t: 'Travel Training', q: [
    'billi ko travel carrier training hindi', 'cat carrier training tips hindi',
    'billi gaadi mein safar tips hindi', 'cat travel preparation hindi',
    'billi travel anxiety solution hindi'
  ]},
  { m: 11, t: 'Vet Visit Calmness', q: [
    'billi ko vet le jana tips hindi', 'cat vet visit calm training hindi',
    'billi doctor ke paas kaise le jayein hindi', 'cat vet stress reduce hindi',
    'billi vet checkup tips hindi'
  ]},
  { m: 11, t: 'Grooming Cooperation', q: [
    'billi ki grooming kaise kare hindi', 'cat grooming tips hindi shorts',
    'billi combing brushing hindi', 'cat bath grooming hindi',
    'billi nakhun katna grooming hindi'
  ]},
];

async function searchTopic(topic) {
  const allResults = [];

  for (const query of topic.q) {
    try {
      const r = await yts(query);
      const shorts = r.videos.filter(v => {
        if (v.seconds > 60 || v.seconds < 10) return false;
        // Check title/description for cat/billi/kitten relevance
        const titleLower = v.title.toLowerCase();
        const hasCatKeyword = ['cat', 'billi', 'kitten', 'बिल्ली', 'meow', 'feline', 'kitty', 'purrfect'].some(k => titleLower.includes(k));
        // Must be about cats or training
        const hasTrainingKeyword = ['train', 'sikhana', 'sikhaye', 'tips', 'trick', 'how to', 'kaise', 'tutorial', 'guide', 'solution', 'fix', 'stop', 'control', 'सिखाना', 'ट्रेनिंग', 'grooming', 'care', 'diet', 'food', 'litter', 'scratch', 'bite', 'command', 'treat'].some(k => titleLower.includes(k));
        return hasCatKeyword || hasTrainingKeyword;
      });

      for (const v of shorts) {
        if (!allResults.find(x => x.videoId === v.videoId)) {
          allResults.push({
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
    } catch (err) { /* skip */ }
  }

  allResults.sort((a, b) => b.views - a.views);
  return allResults.slice(0, 3);
}

async function main() {
  console.log('🔍 Searching Hindi Cat Training Shorts (Filtered)...\n');
  const allResults = {};
  let curMonth = 0;

  for (const topic of TOPICS) {
    if (topic.m !== curMonth) {
      curMonth = topic.m;
      console.log(`\n${'='.repeat(70)}`);
      console.log(`📅 MONTH ${curMonth}`);
      console.log(`${'='.repeat(70)}`);
    }

    console.log(`\n🎯 ${topic.t}`);
    console.log('-'.repeat(50));

    const results = await searchTopic(topic);
    if (results.length === 0) {
      console.log('  ⚠️ No relevant Hindi training Shorts found');
    } else {
      results.forEach((v, i) => {
        const viewStr = v.views >= 1000000 ? `${(v.views / 1000000).toFixed(1)}M` :
                        v.views >= 1000 ? `${(v.views / 1000).toFixed(1)}K` : `${v.views}`;
        console.log(`  ${i + 1}. "${v.title}"`);
        console.log(`     📺 ${v.channel} | 👀 ${viewStr} views | ⏱️ ${v.duration} | 📆 ${v.ago}`);
        console.log(`     🔗 ${v.url}`);
      });
    }
    allResults[`M${topic.m}_${topic.t}`] = results;
  }

  // Save JSON
  const fs = await import('fs');
  fs.writeFileSync('cat_shorts_results.json', JSON.stringify(allResults, null, 2));
  console.log('\n\n✅ All results saved to cat_shorts_results.json');
}

main().catch(console.error);
