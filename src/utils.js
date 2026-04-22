export const PET_TYPES = ['Dog', 'Cat', 'Bird', 'Rabbit', 'Fish', 'Hamster', 'Goat', 'Horse', 'Cow'];

export const petEmojis = {
  dog: '🐕', cat: '🐱', bird: '🐦', rabbit: '🐰', fish: '🐟',
  hamster: '🐹', goat: '🐐', horse: '🐴', cow: '🐄',
};

export const petImages = {
  dog: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=400&fit=crop',
  cat: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=400&fit=crop',
  bird: 'https://images.unsplash.com/photo-1444464666168-49d633b86797?w=400&h=400&fit=crop',
  rabbit: 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=400&h=400&fit=crop',
  fish: 'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?w=400&h=400&fit=crop',
  hamster: 'https://images.unsplash.com/photo-1425082661705-1834bfd09dca?w=400&h=400&fit=crop',
  goat: 'https://images.unsplash.com/photo-1533318087102-b3ad366ed041?w=400&h=400&fit=crop',
  horse: 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=400&h=400&fit=crop',
  cow: 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?w=400&h=400&fit=crop',
};

export function getPetEmoji(type) {
  return petEmojis[type?.toLowerCase()] || '🐾';
}

export const vaccineSchedules = {
  dog: [
    { name: 'Rabies', interval: 365 }, { name: 'DHPP (Distemper)', interval: 365 },
    { name: 'Bordetella', interval: 180 }, { name: 'Leptospirosis', interval: 365 },
    { name: 'Canine Influenza', interval: 365 }, { name: 'Lyme Disease', interval: 365 },
  ],
  cat: [
    { name: 'Rabies', interval: 365 }, { name: 'FVRCP', interval: 365 },
    { name: 'FeLV (Feline Leukemia)', interval: 365 }, { name: 'FIV', interval: 365 },
  ],
  bird: [
    { name: 'Polyomavirus', interval: 365 }, { name: 'Psittacosis Test', interval: 180 },
  ],
  goat: [
    { name: 'CDT (Clostridium)', interval: 365 }, { name: 'Caseous Lymphadenitis', interval: 365 },
    { name: 'Rabies', interval: 365 }, { name: 'Foot Rot Vaccine', interval: 180 },
  ],
  hamster: [
    { name: 'Wellness Checkup', interval: 180 }, { name: 'Dental Exam', interval: 365 },
    { name: 'Parasite Check', interval: 180 },
  ],
  fish: [
    { name: 'Water Quality Test', interval: 30 }, { name: 'Parasite Prevention', interval: 90 },
  ],
  rabbit: [
    { name: 'RHDV2', interval: 365 }, { name: 'Myxomatosis', interval: 365 },
    { name: 'Rabies', interval: 365 },
  ],
  horse: [
    { name: 'Tetanus Toxoid', interval: 365 }, { name: 'West Nile Virus', interval: 365 },
    { name: 'Equine Influenza', interval: 180 }, { name: 'EHV (Rhinopneumonitis)', interval: 180 },
    { name: 'Rabies', interval: 365 },
  ],
  cow: [
    { name: 'Blackleg (Clostridial)', interval: 365 }, { name: 'IBR (Infectious Bovine Rhinotracheitis)', interval: 365 },
    { name: 'BVD (Bovine Viral Diarrhea)', interval: 365 }, { name: 'Brucellosis', interval: 365 },
  ],
};

export function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function daysUntil(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  const now = new Date();
  return Math.ceil((d - now) / (1000 * 60 * 60 * 24));
}

export const COUNTRIES = [
  { code: '+1', name: 'US', flag: '🇺🇸' },
  { code: '+44', name: 'UK', flag: '🇬🇧' },
  { code: '+91', name: 'India', flag: '🇮🇳' },
  { code: '+92', name: 'Pakistan', flag: '🇵🇰' },
  { code: '+971', name: 'UAE', flag: '🇦🇪' },
  { code: '+966', name: 'Saudi Arabia', flag: '🇸🇦' },
  { code: '+49', name: 'Germany', flag: '🇩🇪' },
  { code: '+33', name: 'France', flag: '🇫🇷' },
  { code: '+61', name: 'Australia', flag: '🇦🇺' },
  { code: '+81', name: 'Japan', flag: '🇯🇵' },
  { code: '+86', name: 'China', flag: '🇨🇳' },
  { code: '+82', name: 'South Korea', flag: '🇰🇷' },
  { code: '+55', name: 'Brazil', flag: '🇧🇷' },
  { code: '+7', name: 'Russia', flag: '🇷🇺' },
  { code: '+27', name: 'South Africa', flag: '🇿🇦' },
  { code: '+234', name: 'Nigeria', flag: '🇳🇬' },
  { code: '+20', name: 'Egypt', flag: '🇪🇬' },
  { code: '+60', name: 'Malaysia', flag: '🇲🇾' },
  { code: '+65', name: 'Singapore', flag: '🇸🇬' },
  { code: '+62', name: 'Indonesia', flag: '🇮🇩' },
  { code: '+63', name: 'Philippines', flag: '🇵🇭' },
  { code: '+90', name: 'Turkey', flag: '🇹🇷' },
  { code: '+39', name: 'Italy', flag: '🇮🇹' },
  { code: '+34', name: 'Spain', flag: '🇪🇸' },
  { code: '+52', name: 'Mexico', flag: '🇲🇽' },
  { code: '+1', name: 'Canada', flag: '🇨🇦' },
  { code: '+48', name: 'Poland', flag: '🇵🇱' },
  { code: '+31', name: 'Netherlands', flag: '🇳🇱' },
  { code: '+46', name: 'Sweden', flag: '🇸🇪' },
  { code: '+47', name: 'Norway', flag: '🇳🇴' },
];
