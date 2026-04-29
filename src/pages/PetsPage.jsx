import { useState, useEffect } from 'react';
import { api } from '../api';
import { getPetEmoji } from '../utils';
import toast from 'react-hot-toast';

export default function PetsPage() {
  const [pets, setPets] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editPet, setEditPet] = useState(null);
  const [form, setForm] = useState({ name: '', type: 'dog', breed: '', age: '', weight: '', notes: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadPets(); }, []);

  async function loadPets() {
    try {
      const data = await api.getPets();
      const petList = data.pets || [];
      setPets(petList);
      // Backup pets to localStorage (survives DB reset)
      if (petList.length > 0) {
        localStorage.setItem('pawcare_pets_backup', JSON.stringify(petList));
      }
    } catch (err) { toast.error('Failed to load pets'); }
    finally { setLoading(false); }
  }

  function openAdd() {
    setEditPet(null);
    setForm({ name: '', type: 'dog', breed: '', age: '', weight: '', notes: '' });
    setShowModal(true);
  }

  function openEdit(pet) {
    setEditPet(pet);
    setForm({ name: pet.name, type: pet.type, breed: pet.breed || '', age: pet.age || '', weight: pet.weight || '', notes: pet.notes || '' });
    setShowModal(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      if (editPet) {
        await api.updatePet(editPet.id, form);
        toast.success('Pet updated! 🎉');
      } else {
        await api.createPet(form);
        toast.success('Pet added! 🐾');
      }
      setShowModal(false);
      loadPets();
    } catch (err) { toast.error(err.message); }
  }

  async function handleDelete(id) {
    if (!confirm('Are you sure you want to remove this pet?')) return;
    try {
      await api.deletePet(id);
      toast.success('Pet removed');
      loadPets();
    } catch (err) { toast.error(err.message); }
  }

  if (loading) return <div className="loading-container"><div className="spinner"></div><p>Loading pets...</p></div>;

  return (
    <div className="page-container" style={{ padding: '0 16px' }}>
      {/* Premium Hero Section */}
      <div style={{ 
        background: 'linear-gradient(135deg, #22c55e, #16a34a)', 
        color: '#fff', 
        padding: '40px 20px', 
        borderRadius: '0 0 32px 32px',
        margin: '-16px -16px 32px -16px',
        textAlign: 'center',
        position: 'relative',
        boxShadow: '0 10px 30px rgba(34, 197, 94, 0.2)'
      }}>
        <div style={{ marginBottom: 16 }}>
          <div style={{ 
            width: 64, height: 64, background: 'rgba(255,255,255,0.2)', 
            borderRadius: '20px', display: 'flex', alignItems: 'center', 
            justifyContent: 'center', fontSize: 32, margin: '0 auto 12px',
            backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.3)'
          }}>
            🐾
          </div>
          <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8, letterSpacing: '-0.5px' }}>My Pets</h2>
          <p style={{ opacity: 0.9, fontSize: 15, fontWeight: 500 }}>Manage your pet profiles & track well-being</p>
        </div>
        
        <button 
          className="btn" 
          style={{ 
            background: '#fff', color: '#16a34a', fontWeight: '700', 
            padding: '12px 24px', borderRadius: '16px', 
            boxShadow: '0 10px 20px rgba(0,0,0,0.1)', 
            border: 'none', display: 'inline-flex', alignItems: 'center', gap: 8
          }}
          onClick={() => {
            const { subscription, role } = JSON.parse(localStorage.getItem('user') || '{}');
            const maxPets = (subscription === 'pro' || subscription === 'enterprise' || role === 'admin') ? -1 : subscription === 'basic' ? 2 : 1;
            if (maxPets !== -1 && pets.length >= maxPets) {
              toast.error('Pet limit reached! Upgrade your plan.');
              return;
            }
            openAdd();
          }}
        >
          <span style={{ fontSize: 20 }}>+</span> Add New Pet
        </button>
      </div>

      {pets.length === 0 ? (
        <div className="empty-state card" style={{ borderRadius: 24, padding: '48px 24px' }}>
          <div className="empty-icon" style={{ fontSize: 64, marginBottom: 16 }}>🐕</div>
          <h3 style={{ fontSize: 22, fontWeight: 700 }}>No pets profiles yet</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: 24 }}>Add your first furry friend to start tracking their health!</p>
          <button className="btn btn-primary btn-lg" onClick={openAdd}>Create Pet Profile</button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 20, paddingBottom: 100 }}>
          {pets.map(pet => (
            <div 
              key={pet.id}
              className="card animate-in" 
              style={{ 
                padding: '20px', 
                borderRadius: '24px', 
                border: '1px solid rgba(0,0,0,0.05)',
                boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
                display: 'flex',
                gap: 16,
                alignItems: 'center',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <div style={{ 
                width: 70, height: 70, 
                background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)', 
                borderRadius: '18px', display: 'flex', 
                alignItems: 'center', justifyContent: 'center', 
                fontSize: 36, border: '1px solid #bbf7d0'
              }}>
                {getPetEmoji(pet.type)}
              </div>

              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: 19, fontWeight: 700, color: '#111827', marginBottom: 4 }}>{pet.name}</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
                  <span style={{ 
                    fontSize: 11, fontWeight: 700, padding: '3px 10px', 
                    borderRadius: '8px', background: '#f3f4f6', color: '#4b5563',
                    textTransform: 'uppercase'
                  }}>{pet.type}</span>
                  {pet.breed && <span style={{ 
                    fontSize: 11, fontWeight: 600, padding: '3px 10px', 
                    borderRadius: '8px', background: '#e0f2fe', color: '#0284c7'
                  }}>{pet.breed}</span>}
                </div>
                
                <div style={{ display: 'flex', gap: 12, fontSize: 13, color: '#6b7280', fontWeight: 500 }}>
                  {pet.age > 0 && <span>🎂 {pet.age} yrs</span>}
                  {pet.weight > 0 && <span>⚖️ {pet.weight} lbs</span>}
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <button 
                  onClick={() => openEdit(pet)}
                  style={{ 
                    width: 36, height: 36, borderRadius: '12px', background: '#f8fafc',
                    border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', cursor: 'pointer', color: '#64748b'
                  }}
                >
                  ✏️
                </button>
                <button 
                  onClick={() => handleDelete(pet.id)}
                  style={{ 
                    width: 36, height: 36, borderRadius: '12px', background: '#fff1f2',
                    border: '1px solid #fecdd3', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', cursor: 'pointer', color: '#e11d48'
                  }}
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editPet ? 'Edit Pet' : 'Add New Pet'}</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Pet Name *</label>
                <input className="form-input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required placeholder="e.g. Buddy" />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Type *</label>
                  <select className="form-input" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                    <option value="dog">🐕 Dog</option>
                    <option value="cat">🐱 Cat</option>
                    <option value="bird">🐦 Bird</option>
                    <option value="rabbit">🐰 Rabbit</option>
                    <option value="fish">🐟 Fish</option>
                    <option value="hamster">🐹 Hamster</option>
                    <option value="goat">🐐 Goat</option>
                    <option value="horse">🐴 Horse</option>
                    <option value="cow">🐄 Cow</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Breed</label>
                  <input className="form-input" value={form.breed} onChange={e => setForm({ ...form, breed: e.target.value })} placeholder="e.g. Golden Retriever" />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Age (years)</label>
                  <input type="number" className="form-input" value={form.age} onChange={e => setForm({ ...form, age: e.target.value })} placeholder="e.g. 3" min="0" step="0.5" />
                </div>
                <div className="form-group">
                  <label className="form-label">Weight (lbs)</label>
                  <input type="number" className="form-input" value={form.weight} onChange={e => setForm({ ...form, weight: e.target.value })} placeholder="e.g. 25" min="0" step="0.1" />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Notes</label>
                <textarea className="form-input" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="Any special notes about your pet..." rows="3" />
              </div>
              <button type="submit" className="btn btn-primary btn-full">{editPet ? 'Update Pet' : 'Add Pet'}</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
