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
      setPets(data.pets || []);
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
    <div>
      <div className="hero-section" style={{ 
        background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)', 
        color: 'white', 
        padding: '32px 24px', 
        borderRadius: '24px', 
        marginBottom: '32px',
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        boxShadow: '0 20px 40px rgba(34, 197, 94, 0.2)',
        marginTop: '16px'
      }}>
        <div>
          <h2 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
            My Pets 🐾
          </h2>
          <p style={{ opacity: 0.9, fontSize: '15px', margin: 0 }}>Manage your pet profiles and track their well-being</p>
        </div>
        <button 
          className="btn" 
          style={{ background: 'white', color: 'var(--primary)', fontWeight: 'bold', padding: '12px 24px', borderRadius: '12px', boxShadow: '0 8px 16px rgba(0,0,0,0.1)', border: 'none' }}
          onClick={() => {
            const { subscription, role } = JSON.parse(localStorage.getItem('user') || '{}');
            const maxPets = (subscription === 'pro' || subscription === 'enterprise' || role === 'admin') ? -1 : subscription === 'basic' ? 2 : 1;
            if (maxPets !== -1 && pets.length >= maxPets) {
              toast.error('Pet limit reached! Upgrade your plan to add more pets.');
              return;
            }
            openAdd();
          }}
        >
          ➕ Add Pet
        </button>
      </div>

      {pets.length === 0 ? (
        <div className="empty-state card">
          <div className="empty-icon">🐾</div>
          <h3>No pets yet</h3>
          <p>Add your first furry friend to get started</p>
          <button className="btn btn-primary" onClick={openAdd}>Add Your First Pet</button>
        </div>
      ) : (
        <div className="card-grid">
          {pets.map(pet => (
            <div className="pet-card" key={pet.id}>
              <div className={`pet-card-image ${pet.type?.toLowerCase()}`}>
                {getPetEmoji(pet.type)}
              </div>
              <div className="pet-card-body">
                <h3>{pet.name}</h3>
                <span className="badge badge-primary">{pet.type}</span>
                <div className="pet-card-info">
                  {pet.breed && <span>🏷️ {pet.breed}</span>}
                  {pet.age > 0 && <span>📅 {pet.age} yrs</span>}
                  {pet.weight > 0 && <span>⚖️ {pet.weight} lbs</span>}
                </div>
                {pet.notes && <p style={{ marginTop: 8, fontSize: 13, color: 'var(--text-secondary)' }}>{pet.notes}</p>}
                <div className="pet-card-actions">
                  <button className="btn btn-secondary btn-sm" onClick={() => openEdit(pet)}>✏️ Edit</button>
                  <button className="btn btn-ghost btn-sm" onClick={() => handleDelete(pet.id)} style={{ color: 'var(--danger)' }}>🗑️ Delete</button>
                </div>
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
