import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import { getPetEmoji } from '../utils';
import toast from 'react-hot-toast';
import { Plus, Edit, Trash2, Paw, Bone, Bird, Fish, Rabbit, Horse, Cow, Bug, Settings } from 'lucide-react';

const petTypes = [
  { id: 'dog', name: 'Dog', emoji: '🐕', color: '#8B5CF6' },
  { id: 'cat', name: 'Cat', emoji: '🐱', color: '#F59E0B' },
  { id: 'bird', name: 'Bird', emoji: '🐦', color: '#10B981' },
  { id: 'rabbit', name: 'Rabbit', emoji: '🐰', color: '#EC4899' },
  { id: 'fish', name: 'Fish', emoji: '🐟', color: '#06B6D4' },
  { id: 'goat', name: 'Goat', emoji: '🐐', color: '#84CC16' },
  { id: 'sheep', name: 'Sheep', emoji: '🐑', color: '#F97316' },
  { id: 'cow', name: 'Cow', emoji: '🐄', color: '#EF4444' },
  { id: 'horse', name: 'Horse', emoji: '🐴', color: '#6366F1' },
  { id: 'other', name: 'Other', emoji: '🐾', color: '#6B7280' },
];

const breedsByType = {
  dog: ['Labrador', 'Golden Retriever', 'German Shepherd', 'Bulldog', 'Poodle', 'Husky', 'Beagle', 'Pitbull', 'Indian Native', 'Other'],
  cat: ['Persian', 'Maine Coon', 'Siamese', 'Bengal', 'Ragdoll', 'Indian Street Cat', 'Other'],
  bird: ['Parrot', 'Parakeet', 'Cockatiel', 'Canary', 'Pigeon', 'Lovebird', 'Other'],
  rabbit: ['Holland Lop', 'Mini Rex', 'Lionhead', 'Flemish Giant', 'Other'],
  fish: ['Goldfish', 'Betta', 'Guppy', 'Koi', 'Oscar', 'Other'],
  goat: ['Indian Goat', 'Boer', 'Nubian', 'Saanen', 'Other'],
  sheep: ['Merino', 'Dorper', 'Suffolk', 'Local Breed', 'Other'],
  cow: ['Indian Cow', 'Buffalo', 'Holstein', 'Jersey', 'Gir', 'Other'],
  horse: ['Arabian', 'Thoroughbred', 'Quarter Horse', 'Other'],
  other: ['Other'],
};

export default function PetsPage() {
  const [pets, setPets] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editPet, setEditPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ 
    name: '', 
    type: 'dog', 
    breed: '', 
    age: '', 
    weight: '', 
    notes: '',
    photo: null 
  });

  useEffect(() => { loadPets(); }, []);

  async function loadPets() {
    try {
      const data = await api.getPets();
      setPets(data.pets || []);
    } catch (err) { 
      console.error(err); 
    } finally { 
      setLoading(false); 
    }
  }

  function openAdd() {
    setEditPet(null);
    setForm({ name: '', type: 'dog', breed: 'Labrador', age: '', weight: '', notes: '', photo: null });
    setShowModal(true);
  }

  function openEdit(pet) {
    setEditPet(pet);
    setForm({ 
      name: pet.name, 
      type: pet.type, 
      breed: pet.breed, 
      age: pet.age, 
      weight: pet.weight, 
      notes: pet.notes, 
      photo: pet.photo 
    });
    setShowModal(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error('Please enter pet name');
      return;
    }
    try {
      if (editPet) {
        await api.updatePet(editPet.id, form);
        toast.success('Pet updated!');
      } else {
        await api.createPet(form);
        toast.success('Pet added!');
      }
      setShowModal(false);
      loadPets();
    } catch (err) { 
      toast.error(err.message); 
    }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this pet?')) return;
    try {
      await api.deletePet(id);
      toast.success('Pet removed');
      loadPets();
    } catch (err) { 
      toast.error('Failed to delete'); 
    }
  }

  if (loading) return (
    <div className="loading-container">
      <div className="spinner"></div>
      <p>Loading your pets...</p>
    </div>
  );

  return (
    <div>
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h2>🐾 My Pets</h2>
            <p style={{ fontSize: 14, color: 'var(--text-muted)', marginTop: 4 }}>
              You have {pets.length} pet{pets.length !== 1 ? 's' : ''} registered
            </p>
          </div>
          <button className="btn btn-primary" onClick={openAdd} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Plus size={18} /> Add Pet
          </button>
        </div>
      </div>

      {pets.length === 0 ? (
        <div className="empty-state card">
          <div style={{ fontSize: 60, marginBottom: 16 }}>🐾</div>
          <h3>No pets yet!</h3>
          <p>Add your first pet to get started with AI-powered care recommendations</p>
          <button className="btn btn-primary" onClick={openAdd} style={{ marginTop: 16 }}>
            + Add Your First Pet
          </button>
        </div>
      ) : (
        <div className="pet-grid">
          {pets.map((pet) => {
            const petType = petTypes.find(t => t.id === pet.type?.toLowerCase()) || petTypes[petTypes.length - 1];
            return (
              <div key={pet.id} className="pet-card">
                <div className="pet-card-header" style={{ background: `linear-gradient(135deg, ${petType.color}20, ${petType.color}05)` }}>
                  <span className="pet-avatar" style={{ background: petType.color }}>
                    {petType.emoji}
                  </span>
                  <div className="pet-card-actions">
                    <button className="icon-btn" onClick={() => openEdit(pet)} title="Edit">
                      <Edit size={16} />
                    </button>
                    <button className="icon-btn icon-btn-danger" onClick={() => handleDelete(pet.id)} title="Delete">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <div className="pet-card-body">
                  <h3>{pet.name}</h3>
                  <p className="pet-breed">{pet.breed || petType.name}</p>
                  <div className="pet-stats">
                    {pet.age > 0 && <span>🎂 {pet.age} years</span>}
                    {pet.weight > 0 && <span>⚖️ {pet.weight} kg</span>}
                  </div>
                  {pet.notes && <p className="pet-notes">{pet-notes}</p>}
                </div>
                <Link to={`/pets/${pet.id}`} className="pet-card-footer">
                  View Full Profile →
                </Link>
              </div>
            );
          })}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3>{editPet ? '✏️ Edit Pet' : '➕ Add New Pet'}</h3>
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Pet Name *</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Enter pet name"
                  value={form.name}
                  onChange={e => setForm({...form, name: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Pet Type *</label>
                <div className="pet-type-selector">
                  {petTypes.map(type => (
                    <button
                      key={type.id}
                      type="button"
                      className={`pet-type-btn ${form.type === type.id ? 'active' : ''}`}
                      onClick={() => setForm({...form, type: type.id, breed: breedsByType[type.id][0]})}
                      style={{ 
                        borderColor: form.type === type.id ? type.color : 'var(--border)',
                        background: form.type === type.id ? `${type.color}15` : 'var(--bg-card)'
                      }}
                    >
                      <span style={{ fontSize: 24 }}>{type.emoji}</span>
                      <span>{type.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Breed</label>
                <select 
                  className="form-input"
                  value={form.breed}
                  onChange={e => setForm({...form, breed: e.target.value})}
                >
                  {breedsByType[form.type]?.map(breed => (
                    <option key={breed} value={breed}>{breed}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="form-group">
                  <label className="form-label">Age (years)</label>
                  <input 
                    type="number" 
                    className="form-input" 
                    placeholder="e.g., 2"
                    value={form.age}
                    onChange={e => setForm({...form, age: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Weight (kg)</label>
                  <input 
                    type="number" 
                    className="form-input" 
                    placeholder="e.g., 10"
                    value={form.weight}
                    onChange={e => setForm({...form, weight: e.target.value})}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Notes</label>
                <textarea 
                  className="form-input" 
                  placeholder="Any special notes about your pet..."
                  value={form.notes}
                  onChange={e => setForm({...form, notes: e.target.value})}
                  rows={3}
                />
              </div>

              <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)} style={{ flex: 1 }}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                  {editPet ? 'Update Pet' : 'Add Pet'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}