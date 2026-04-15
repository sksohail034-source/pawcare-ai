import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, MoreVertical, MapPin, PhoneCall, MessageCircle } from 'lucide-react';

export default function PetDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock data fetching based on ID. In real app, fetch from API.
  const pet = {
    id,
    name: 'Golden Retriever',
    price: '$162',
    distance: 'Distance (Near 10km)',
    sex: 'Male',
    age: '10 months',
    weight: '4.5kg',
    img: 'https://images.unsplash.com/photo-1552053831-71594a27632d?fit=crop&w=800&h=800',
    owner: {
      name: 'Adam William',
      location: 'Chicago, Us',
      avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?fit=crop&w=100&h=100'
    },
    summary: 'Golden Retrievers are loyal, friendly, smart, and deeply affectionate companions. Known for their beautiful golden coats.'
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5', position: 'relative' }}>
      {/* Top Image & Nav */}
      <div style={{ position: 'relative', height: '55vh' }}>
        <img 
          src={pet.img} 
          alt={pet.name} 
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div style={{ position: 'absolute', top: '24px', width: '100%', padding: '0 24px', display: 'flex', justifyContent: 'space-between' }}>
          <button 
            onClick={() => navigate(-1)}
            style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(0,0,0,0.3)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}
          >
            <ChevronLeft size={24} />
          </button>
          <button 
            style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(0,0,0,0.3)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}
          >
            <MoreVertical size={20} />
          </button>
        </div>
      </div>

      {/* Details Container (Glassmorphism overlap) */}
      <div className="glass-panel" style={{ 
        marginTop: '-40px', position: 'relative', zIndex: 10, padding: '24px', minHeight: '50vh',
        borderTopLeftRadius: '32px', borderTopRightRadius: '32px',
        backgroundColor: 'var(--bg-card)', paddingBottom: '100px'
      }}>
        
        {/* Title & Price */}
        <div className="flex-row justify-between items-center" style={{ marginBottom: '8px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 800 }}>{pet.name}</h2>
          <div style={{ fontWeight: 700, fontSize: '18px' }}>{pet.price}</div>
        </div>
        
        <div className="flex-row items-center gap-2" style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '24px' }}>
          <MapPin size={16} /> {pet.distance}
        </div>

        {/* Tags */}
        <div className="flex-row justify-between" style={{ gap: '12px', marginBottom: '32px' }}>
          {[
            { label: 'Sex', value: pet.sex },
            { label: 'Age', value: pet.age },
            { label: 'Weight', value: pet.weight }
          ].map(tag => (
            <div key={tag.label} style={{ flex: 1, padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', textAlign: 'center', background: 'var(--bg-app)' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>{tag.label}</div>
              <div style={{ fontSize: '14px', fontWeight: 600 }}>{tag.value}</div>
            </div>
          ))}
        </div>

        {/* Contact Owner */}
        <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px' }}>Main Contact</h3>
        <div className="flex-row justify-between items-center" style={{ marginBottom: '32px', background: 'var(--bg-app)', padding: '12px', borderRadius: 'var(--radius-lg)' }}>
          <div className="flex-row gap-3">
            <img src={pet.owner.avatar} alt="Owner" style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }} />
            <div className="flex-col justify-center">
              <span style={{ fontWeight: 700, fontSize: '14px' }}>{pet.owner.name}</span>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}><MapPin size={12}/>{pet.owner.location}</span>
            </div>
          </div>
          <div className="flex-row gap-2">
            <button className="btn-icon" style={{ width: '36px', height: '36px' }}><PhoneCall size={16} /></button>
            <button className="btn-icon" style={{ width: '36px', height: '36px' }}><MessageCircle size={16} /></button>
          </div>
        </div>

        {/* Summary */}
        <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '8px' }}>Summary</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: '1.6' }}>
          {pet.summary}
        </p>

      </div>

      {/* Fixed Bottom CTA */}
      <div style={{ position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: '480px', padding: '16px 24px', background: 'var(--bg-card)', zIndex: 50, borderTop: '1px solid var(--border)' }}>
        <button className="btn btn-primary" style={{ width: '100%' }}>Adopt this pet</button>
      </div>
    </div>
  );
}
