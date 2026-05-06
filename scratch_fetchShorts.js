import ytSearch from 'yt-search';
import fs from 'fs';

const dogTraining = [
  { 
    month: 1, 
    videos: [
      { id: 'o2rtu5BBCrA', title: 'Video 1: Name Recognition (3 Steps)', dur: '8 min' },
      { id: 'PHmkK4QA8gI', title: 'Video 2: Focus Training (Instantly)', dur: '10 min' },
      { id: '5kVahj499r8', title: 'Video 3: Sit Command (Service Dog Method)', dur: '11 min' },
    ]
  },
  { 
    month: 2, 
    videos: [
      { id: '3gaGsebCRhs', title: 'Video 1: Sit (Perfecting & Posture)', dur: '11 min' },
      { id: '2MANkW5Dj6w', title: 'Video 2: Stay Command (Avoid Mistakes!)', dur: '12 min' },
      { id: 'xHdiXy2hPCY', title: 'Video 3: Come When Called (Recall)', dur: '13 min' },
    ]
  },
  { 
    month: 3, 
    videos: [
      { id: 'sZTmIMpvHJ8', title: 'Video 1: Potty Train FAST!', dur: '15 min' },
      { id: 'PJlXZhtkZ3E', title: 'Video 2: Ultimate Crate Training', dur: '14 min' },
      { id: 'Qm2E5nldfcQ', title: 'Video 3: Stop Biting Today', dur: '11 min' },
    ]
  },
  { 
    month: 4, 
    videos: [
      { id: 'twktHg0_CKM', title: 'Video 1: Loose Leash Walking', dur: '8 min' },
      { id: 'cR1SDaAvS6Y', title: 'Video 2: Stop Pulling', dur: '9 min' },
      { id: 'grHN_MIexVo', title: 'Video 3: Walking Discipline', dur: '9 min' },
    ]
  },
  { 
    month: 5, 
    videos: [
      { id: 'dn2SL40AktI', title: 'Video 1: Meeting Other Dogs', dur: '8 min' },
      { id: '0KKop8OvzVI', title: 'Video 2: Meeting Strangers', dur: '9 min' },
      { id: 'i3kv4G5Xzv8', title: 'Video 3: Public Behavior', dur: '7 min' },
    ]
  },
  { 
    month: 6, 
    videos: [
      { id: 'DYWTarzD2u4', title: 'Video 1: Down Command', dur: '7 min' },
      { id: 'umt0jF9MHeI', title: 'Video 2: Leave It', dur: '8 min' },
      { id: 'kI52HYbnQX8', title: 'Video 3: Drop It', dur: '9 min' },
    ]
  },
  { 
    month: 7, 
    videos: [
      { id: 'JVFfLJ2qMXo', title: 'Video 1: Excessive Barking Control', dur: '7 min' },
      { id: 'g6PVdqinCUk', title: 'Video 2: Jumping on People', dur: '8 min' },
      { id: '_uInQUHhZaA', title: 'Video 3: Separation Anxiety', dur: '10 min' },
    ]
  },
  { 
    month: 8, 
    videos: [
      { id: '--PXr3edQDo', title: 'Video 1: Off-Leash Training', dur: '8 min' },
      { id: 'dK-VC7xC-OI', title: 'Video 2: Distance Commands', dur: '8 min' },
      { id: 'Y0pamvXAXpA', title: 'Video 3: Hand Signal Training', dur: '9 min' },
    ]
  },
  { 
    month: 9, 
    videos: [
      { id: '8_SpZUTuRgE', title: 'Video 1: Shake Hand', dur: '7 min' },
      { id: 'Ke-6iCZ7jqA', title: 'Video 2: Roll Over', dur: '5 min' },
      { id: '1FUqREededA', title: 'Video 3: Spin Trick', dur: '5 min' },
    ]
  },
  { 
    month: 10, 
    videos: [
      { id: 'CRYSNymBE_A', title: 'Video 1: Alert Training', dur: '8 min' },
      { id: 'zbx1Ywo1gTc', title: 'Video 2: Territory Awareness', dur: '10 min' },
      { id: 'AGoXobRlDaE', title: 'Video 3: Basic Protection', dur: '8 min' },
    ]
  },
  { 
    month: 11, 
    videos: [
      { id: '70q00hAtXpE', title: 'Video 1: Agility Training', dur: '9 min' },
      { id: 'XOvOp_T0cdo', title: 'Video 2: Obstacle Training', dur: '8 min' },
      { id: '_5GrbJkTXKo', title: 'Video 3: Brain Games', dur: '9 min' },
    ]
  },
  { 
    month: 12, 
    videos: [
      { id: '--PXr3edQDo', title: 'Video 1: Advanced Recall', dur: '8 min' },
      { id: 'yZ74wVgoEzY', title: 'Video 2: Discipline Without Treats', dur: '8 min' },
      { id: 'CYf7xuupWnI', title: 'Video 3: Real-Life Situation Training', dur: '9 min' },
    ]
  },
];

const catTraining = [
  { 
    month: 1, 
    videos: [
      { id: 'LmK-rqaVKYE', title: 'Video 1: Name Recognition', dur: '5 min' },
      { id: 'njfr-DvmzIo', title: 'Video 2: Litter Training', dur: '5 min' },
      { id: 'yEQBSNG90Lc', title: 'Video 3: Trust Building', dur: '10 min' },
    ]
  },
  { 
    month: 2, 
    videos: [
      { id: 'be5x5u5i09I', title: 'Video 1: Scratching Control', dur: '10 min' },
      { id: '73Rn963gGdQ', title: 'Video 2: Stop Biting', dur: '10 min' },
      { id: 'oX7vgQTK9fo', title: 'Video 3: Basic Response Training', dur: '6 min' },
    ]
  },
  { 
    month: 3, 
    videos: [
      { id: '57OhKuneQeE', title: 'Video 1: Feeding Schedule', dur: '9 min' },
      { id: 'uWVWXDnprNQ', title: 'Video 2: Sleep Routine', dur: '8 min' },
      { id: 'VIcWa0wcFNc', title: 'Video 3: Play Discipline', dur: '9 min' },
    ]
  },
  { 
    month: 4, 
    videos: [
      { id: 'wo-W0UtTbXs', title: 'Video 1: Interaction with Humans', dur: '8 min' },
      { id: '8RQotaLRLRc', title: 'Video 2: Interaction with Pets', dur: '6 min' },
      { id: 'TqRhrC-tPwg', title: 'Video 3: New Environment Adjustment', dur: '9 min' },
    ]
  },
  { 
    month: 5, 
    videos: [
      { id: '6OUz0cyI0Ok', title: 'Video 1: Harness Training', dur: '7 min' },
      { id: 'gnGWApxCGZ8', title: 'Video 2: Walking Practice', dur: '6 min' },
      { id: 'RjvTseSmTP4', title: 'Video 3: Outdoor Safety', dur: '9 min' },
    ]
  },
  { 
    month: 6, 
    videos: [
      { id: 'u23qeh974RI', title: 'Video 1: Come When Called', dur: '6 min' },
      { id: 'D7b7Zvepb4c', title: 'Video 2: Sit Command', dur: '5 min' },
      { id: 'xKaq3OEvp4c', title: 'Video 3: High Five Trick', dur: '7 min' },
    ]
  },
  { 
    month: 7, 
    videos: [
      { id: 'C-qmDbMPb6c', title: 'Video 1: Aggression Control', dur: '6 min' },
      { id: 'uWVWXDnprNQ', title: 'Video 2: Night Hyperactivity', dur: '8 min' },
      { id: 'GNMG1G5FaNU', title: 'Video 3: Excessive Meowing', dur: '9 min' },
    ]
  },
  { 
    month: 8, 
    videos: [
      { id: 'WGZ_0MWC6dg', title: 'Video 1: Jump Training', dur: '6 min' },
      { id: '3JjTLFaRMl0', title: 'Video 2: Target Training', dur: '8 min' },
      { id: 'uK4Zne6mXG8', title: 'Video 3: Fetch', dur: '6 min' },
    ]
  },
  { 
    month: 9, 
    videos: [
      { id: 'PeYAM-ybngI', title: 'Video 1: Puzzle Games', dur: '9 min' },
      { id: 'GBN0Y9sA6W8', title: 'Video 2: Hide & Seek', dur: '5 min' },
      { id: 'KjEf3CdWwyw', title: 'Video 3: Hunting Simulation', dur: '8 min' },
    ]
  },
  { 
    month: 10, 
    videos: [
      { id: 'YxxCqtJ93zU', title: 'Video 1: Clicker Training', dur: '8 min' },
      { id: 'srYbiHDh6mo', title: 'Video 2: Multi-Step Commands', dur: '9 min' },
      { id: 'SSRXzcNuLzk', title: 'Video 3: Reaction Training', dur: '6 min' },
    ]
  },
  { 
    month: 11, 
    videos: [
      { id: 'RjvTseSmTP4', title: 'Video 1: Travel Training', dur: '9 min' },
      { id: 'NdZt9NP7DvY', title: 'Video 2: Vet Visit Calmness', dur: '9 min' },
      { id: '3JjTLFaRMl0', title: 'Video 3: Grooming Cooperation', dur: '8 min' },
    ]
  },
  { 
    month: 12, 
    videos: [
      { id: 'lBAt_Oh9gis', title: 'Video 1: Complex Tricks', dur: '6 min' },
      { id: 'VEhOk3E4d98', title: 'Video 2: Discipline Training', dur: '8 min' },
      { id: 'wo-W0UtTbXs', title: 'Video 3: Smart Interaction', dur: '8 min' },
    ]
  },
];

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function fetchShorts(type, data) {
  let results = {};
  for (let m of data) {
    for (let v of m.videos) {
      let qTitle = v.title.replace(/Video \d+: /, '');
      let query = `#shorts ${type} training ${qTitle} hindi`;
      console.log('Searching:', query);
      try {
        const r = await ytSearch(query);
        const shorts = r.videos.filter(vid => vid.duration.seconds < 120);
        const best = shorts[0] || r.videos[0];
        if (best) {
          results[v.id] = best.videoId;
        } else {
          results[v.id] = 'dQw4w9WgXcQ'; // Fallback
        }
      } catch (e) {
        console.error('Err:', e);
        results[v.id] = 'dQw4w9WgXcQ';
      }
      await sleep(1000); // Respect API rate limits
    }
  }
  return results;
}

async function main() {
  console.log('Fetching dog shorts...');
  const dogResults = await fetchShorts('dog', dogTraining);
  console.log('Fetching cat shorts...');
  const catResults = await fetchShorts('cat', catTraining);
  
  fs.writeFileSync('shorts_results.json', JSON.stringify({dog: dogResults, cat: catResults}, null, 2));
  console.log('Done.');
}

main();
