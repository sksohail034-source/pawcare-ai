import { Router } from 'express';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

const exerciseData = {
  dog: {
    exercises: [
      { name: 'Daily Walks', icon: '🚶', duration: '30-60 min', description: 'Regular walks help maintain cardiovascular health, joint flexibility, and mental stimulation.', frequency: 'Twice daily', image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&h=300&fit=crop' },
      { name: 'Fetch & Retrieve', icon: '🎾', duration: '15-30 min', description: 'Great for burning energy and building the bond between you and your dog.', frequency: 'Daily', image: 'https://images.unsplash.com/photo-1535930749574-1399327ce78f?w=400&h=300&fit=crop' },
      { name: 'Training Sessions', icon: '🏋️', duration: '15-20 min', description: 'Obedience and trick training provides mental stimulation and reinforces good behavior.', frequency: 'Daily', image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=300&fit=crop' },
      { name: 'Dog Park Social', icon: '🐕', duration: '30-45 min', description: 'Socialization with other dogs improves behavior and provides off-leash exercise.', frequency: '2-3x/week', image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400&h=300&fit=crop' }
    ],
    aiTips: { grooming: 'Regular brushing 2-3 times per week. Professional grooming every 6-8 weeks.', accessories: 'Harness, retractable leash, reflective collar, poop bags, portable water bowl.', feeding: 'High-quality kibble or raw diet. Feed twice daily. Fresh water always available.', health: 'Annual vet checkup, dental cleaning, nail trimming every 2-3 weeks.', routine: '7AM walk, 8AM breakfast, 12PM play, 5PM walk, 6PM dinner, 9PM settle.' }
  },
  cat: {
    exercises: [
      { name: 'Interactive Play', icon: '🪶', duration: '15-20 min', description: 'Use feather wands, laser pointers, and interactive toys to engage natural hunting instincts.', frequency: '2-3x daily', image: 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=400&h=300&fit=crop' },
      { name: 'Climbing & Perching', icon: '🧗', duration: 'All day access', description: 'Cat trees and wall shelves provide vertical space for climbing and surveying territory.', frequency: 'Always available', image: 'https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13?w=400&h=300&fit=crop' },
      { name: 'Puzzle Feeders', icon: '🧩', duration: '10-15 min', description: 'Food puzzles stimulate problem-solving skills and slow down fast eaters.', frequency: 'Daily', image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=300&fit=crop' }
    ],
    aiTips: { grooming: 'Brush weekly for short-hair, daily for long-hair. Trim nails every 2 weeks.', accessories: 'Scratching post, cat tree, window perch, self-cleaning litter box.', feeding: 'High-protein wet food preferred. Feed 2-3 small meals. Fresh water fountain.', health: 'Annual checkup, dental care, indoor environment safer, monitor weight.', routine: '7AM breakfast, 9AM play, 12PM nap, 4PM play, 6PM dinner, 8PM cuddle time.' }
  },
  bird: {
    exercises: [
      { name: 'Flight Time', icon: '🕊️', duration: '30-60 min', description: 'Supervised free flight in a safe room. Essential for wing muscle health.', frequency: 'Daily', image: 'https://images.unsplash.com/photo-1444464666168-49d633b86797?w=400&h=300&fit=crop' },
      { name: 'Music Stimulation', icon: '🎵', duration: '15-30 min', description: 'Play varied music. Many birds enjoy singing along and it provides cognitive stimulation.', frequency: 'Daily', image: 'https://images.unsplash.com/photo-1444464666168-49d633b86797?w=400&h=300&fit=crop' },
      { name: 'Foraging Activities', icon: '🔍', duration: '20-30 min', description: 'Hide treats in foraging toys. Mimics natural food-seeking behavior.', frequency: 'Daily', image: 'https://images.unsplash.com/photo-1591608971362-f08b2a75731a?w=400&h=300&fit=crop' },
      { name: 'Perch Hopping', icon: '🪵', duration: '10-15 min', description: 'Various perch sizes and textures exercise feet muscles and prevent bumblefoot.', frequency: 'Always available', image: 'https://images.unsplash.com/photo-1544923408-75c5cef46f14?w=400&h=300&fit=crop' }
    ],
    aiTips: { grooming: 'Mist bathing 2-3 times/week. Nail and beak trimming as needed by avian vet.', accessories: 'Variety of perches, foraging toys, swing, mirror, cuttlebone.', feeding: 'Pellets base, fresh fruits/veggies daily. No avocado, chocolate, or caffeine.', health: 'Annual avian vet visit. Watch for fluffed feathers, lethargy, breathing changes.', routine: '7AM uncover/breakfast, 10AM play, 1PM nap, 4PM flight time, 7PM dinner, 9PM cover.' }
  },
  goat: {
    exercises: [
      { name: 'Grazing Time', icon: '🌿', duration: '4-6 hours', description: 'Free-range grazing provides natural exercise and nutrition from browsing.', frequency: 'Daily', image: 'https://images.unsplash.com/photo-1533318087102-b3ad366ed041?w=400&h=300&fit=crop' },
      { name: 'Climbing Structures', icon: '⛰️', duration: 'All day access', description: 'Goats love climbing. Provide ramps, platforms, and elevated structures.', frequency: 'Always available', image: 'https://images.unsplash.com/photo-1533318087102-b3ad366ed041?w=400&h=300&fit=crop' },
      { name: 'Herd Interaction', icon: '🐐', duration: 'All day', description: 'Goats are social animals. Keep at least 2 together for mental wellbeing.', frequency: 'Always', image: 'https://images.unsplash.com/photo-1533318087102-b3ad366ed041?w=400&h=300&fit=crop' }
    ],
    aiTips: { grooming: 'Brush weekly, trim hooves every 6-8 weeks. Check for parasites regularly.', accessories: 'Climbing platform, mineral block, sturdy fencing, shelter from rain.', feeding: 'Hay (primary), browse, grain supplement. Mineral supplements essential.', health: 'Deworm regularly, annual CDT vaccine, hoof care, watch for bloat.', routine: '6AM hay, 8AM pasture, 12PM shade rest, 4PM grain, 6PM shelter.' }
  },
  hamster: {
    exercises: [
      { name: 'Wheel Running', icon: '🎡', duration: 'Nightly', description: 'Hamsters run for miles every night. A large, solid-surface wheel is essential.', frequency: 'Daily', image: 'https://images.unsplash.com/photo-1425082661705-1834bfd09dca?w=400&h=300&fit=crop' },
      { name: 'Ball Exploration', icon: '⚽', duration: '10-15 min', description: 'Supervised time in an exercise ball provides safe exploration outside the cage.', frequency: '2-3x/week', image: 'https://images.unsplash.com/photo-1425082661705-1834bfd09dca?w=400&h=300&fit=crop' }
    ],
    aiTips: { grooming: 'Sand baths are great. Avoid water baths.', accessories: 'Large exercise wheel, tunnels, chew toys, hideouts.', feeding: 'High-quality pellet mix, fresh veggies occasionally. Avoid sugary treats.', health: 'Check teeth regularly, monitor weight, watch for wet tail.', routine: 'Nightly activity, keep cage clean.' }
  },
  fish: {
    exercises: [
      { name: 'Tank Enrichment', icon: '🏠', duration: 'Ongoing', description: 'Rearrange decorations monthly. Live plants provide exploration opportunities.', frequency: 'Monthly rearrange', image: 'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?w=400&h=300&fit=crop' },
      { name: 'Water Current Activity', icon: '🌊', duration: 'Ongoing', description: 'Adjustable flow filters create currents for fish to swim against, building strength.', frequency: 'Always available', image: 'https://images.unsplash.com/photo-1535591273668-578e31182c4f?w=400&h=300&fit=crop' }
    ],
    aiTips: { grooming: 'No grooming needed. Focus on tank maintenance — weekly 25% water changes.', accessories: 'Quality filter, heater, LED lighting, live plants, hiding spots.', feeding: 'Feed 1-2 times daily, only what they eat in 2-3 minutes. Varied diet.', health: 'Test water parameters weekly. Quarantine new fish. Watch for ich, fin rot.', routine: 'Light on 8AM, feed 9AM, light cycle 10hrs, feed 5PM, lights off 10PM.' }
  },
  rabbit: {
    exercises: [
      { name: 'Tunnel Running', icon: '🕳️', duration: '30-60 min', description: 'Tunnel systems mimic burrows. Rabbits love running through and exploring them.', frequency: 'Daily', image: 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=400&h=300&fit=crop' },
      { name: 'Veggie Chase', icon: '🥕', duration: '15-20 min', description: 'Drag leafy greens for them to chase. Provides exercise and foraging enrichment.', frequency: 'Daily', image: 'https://images.unsplash.com/photo-1452857297128-d9c29adba80b?w=400&h=300&fit=crop' }
    ],
    aiTips: { grooming: 'Brush weekly (daily for long-hair breeds). Trim nails monthly. Never bathe.', accessories: 'Large enclosure, hay rack, tunnel system, chew toys, litter box.', feeding: '80% unlimited timothy hay, fresh leafy greens daily, limited pellets.', health: 'Spay/neuter, annual checkup, dental monitoring, GI stasis awareness.', routine: '7AM hay/greens, 9AM free roam, 12PM rest, 4PM play, 6PM pellets, 8PM settle.' }
  },
  horse: {
    exercises: [
      { name: 'Riding Sessions', icon: '🏇', duration: '30-60 min', description: 'Regular riding maintains fitness, builds muscle, and strengthens the rider-horse bond.', frequency: '3-5x/week', image: 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=400&h=300&fit=crop' },
      { name: 'Turnout Time', icon: '🌿', duration: '4-8 hours', description: 'Pasture turnout allows natural movement, grazing, and socialization.', frequency: 'Daily', image: 'https://images.unsplash.com/photo-1534073828943-f801091bb18c?w=400&h=300&fit=crop' },
      { name: 'Lunging', icon: '🔄', duration: '20-30 min', description: 'Lunging exercises build balance, rhythm, and obedience without a rider.', frequency: '2-3x/week', image: 'https://images.unsplash.com/photo-1558171813-4c088753af8f?w=400&h=300&fit=crop' }
    ],
    aiTips: { grooming: 'Daily grooming: curry comb, body brush, hoof pick. Mane/tail detangling.', accessories: 'Saddle, bridle, halter, lead rope, grooming kit, fly mask, blanket.', feeding: '1.5-2% body weight in forage daily. Grain as needed. Salt block. Fresh water.', health: 'Bi-annual vet/dental, farrier every 6-8 weeks, deworming schedule.', routine: '6AM feed hay, 7AM turnout, 12PM ride/lunge, 4PM groom, 5PM grain, 8PM stall.' }
  },
  cow: {
    exercises: [
      { name: 'Grazing', icon: '🌱', duration: '6-8 hours', description: 'Natural grazing provides exercise through constant gentle movement across pasture.', frequency: 'Daily', image: 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?w=400&h=300&fit=crop' },
      { name: 'Pasture Rotation', icon: '🔄', duration: 'Ongoing', description: 'Moving between pastures encourages walking and prevents overgrazing.', frequency: 'Every 1-2 weeks', image: 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?w=400&h=300&fit=crop' }
    ],
    aiTips: { grooming: 'Brush regularly, especially before milking. Check hooves monthly.', accessories: 'Salt/mineral lick, sturdy fencing, shade structure, water trough.', feeding: 'Pasture primary, hay supplement, grain for dairy cows. Mineral supplements.', health: 'Annual vaccination, hoof trimming, parasite control, mastitis prevention.', routine: '5AM milking (dairy), 6AM pasture, 12PM shade, 4PM supplement, 6PM shelter.' }
  }
};

router.get('/:petType', authenticateToken, (req, res) => {
  const type = req.params.petType.toLowerCase();
  const data = exerciseData[type];
  if (!data) return res.status(404).json({ error: 'Pet type not found' });
  res.json(data);
});

router.get('/', authenticateToken, (req, res) => {
  res.json({ petTypes: Object.keys(exerciseData) });
});

export default router;
