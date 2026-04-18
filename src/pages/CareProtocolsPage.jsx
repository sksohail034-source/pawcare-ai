import { useState } from 'react';
import { Leaf, Droplet, Utensils, Shield, AlertTriangle, CheckCircle } from 'lucide-react';

const protocols = {
  skin: [
    { title: 'Coconut Oil Treatment', description: 'Apply warm coconut oil to dry skin. Leave for 15 mins, then rinse.', icon: '🥥', tags: ['Moisturizing', 'Natural'] },
    { title: 'Aloe Vera Gel', description: 'Apply pure aloe vera gel to irritated skin. Soothes rashes and dryness.', icon: '🌿', tags: ['Cooling', 'Healing'] },
    { title: 'Oatmeal Bath', description: 'Blend oats into powder, mix with warm water. Soothes itchy skin.', icon: '🌾', tags: ['Anti-itch', 'Gentle'] },
  ],
  hygiene: [
    { title: 'Herbal Shampoo', description: 'Use shampoo with neem, rosemary, or lavender. Natural cleansing.', icon: '🧴', tags: ['Natural', 'Antibacterial'] },
    { title: 'Neem-Based Cleaning', description: 'Neem water spray for external cleaning. Fights bacteria.', icon: '🌱', tags: ['Antibacterial', 'Anti-flea'] },
    { title: 'Ear Cleaning', description: 'Use vet-approved ear cleaner. Never use cotton buds deep inside.', icon: '👂', tags: ['Weekly', 'Important'] },
  ],
  nutrition: [
    { title: 'High Protein Diet', description: 'Dogs: chicken, beef, fish. Cats: mostly animal protein.', icon: '🍖', tags: ['Essential', 'Energy'] },
    { title: 'Clean Water Schedule', description: 'Fresh water 2-3 times daily. Clean bowl every day.', icon: '💧', tags: ['Hydration', 'Important'] },
    { title: 'Avoid Harmful Foods', description: 'NO: chocolate, grapes, onions, xylitol, caffeine.', icon: '🚫', tags: ['Safety', 'Critical'] },
  ],
};

const warnings = [
  'Consult a veterinarian for serious issues',
  'Test natural remedies on small area first',
  'Do not overfeed - follow portion guidelines',
  'Never give human medications to pets',
  'Keep all cleaning products out of reach',
  'If allergic reaction occurs, stop immediately',
];

export default function CareProtocolsPage() {
  const [activeTab, setActiveTab] = useState('skin');

  const tabs = [
    { id: 'skin', label: 'Skin & Fur', icon: <Leaf size={18} /> },
    { id: 'hygiene', label: 'Hygiene', icon: <Droplet size={18} /> },
    { id: 'nutrition', label: 'Nutrition', icon: <Utensils size={18} /> },
  ];

  return (
    <div>
      <div className="page-header">
        <h2>🌿 Natural Care Protocols</h2>
        <p>Safe, natural remedies for your pet's wellbeing</p>
      </div>

      <div className="tab-nav" style={{ marginBottom: 24 }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      <div className="card-grid">
        {protocols[activeTab]?.map((item, i) => (
          <div key={i} className="protocol-card animate-in" style={{ animationDelay: `${i * 0.1}s` }}>
            <div className="protocol-icon">{item.icon}</div>
            <h4>{item.title}</h4>
            <p>{item.description}</p>
            <div className="protocol-tags">
              {item.tags.map((tag, j) => (
                <span key={j} className="protocol-tag">{tag}</span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="disclaimer-box" style={{ marginTop: 32 }}>
        <div className="disclaimer-header">
          <AlertTriangle size={20} />
          <span>Important Safety Notes</span>
        </div>
        <ul>
          {warnings.map((warning, i) => (
            <li key={i}>
              <CheckCircle size={14} />
              {warning}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}