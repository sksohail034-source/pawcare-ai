import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import { getPetEmoji, formatDate, daysUntil } from '../utils';
import toast from 'react-hot-toast';
import { Plus, Syringe, Calendar, AlertTriangle, CheckCircle, Clock, Edit, Trash2, Shield } from 'lucide-react';

const vaccineTypesByPet = {
  dog: [
    { id: 'dhpp', name: 'DHPP (Distemper)', months: 12 },
    { id: 'rabies', name: 'Rabies', months: 12 },
    { id: 'bordetella', name: 'Bordetella (Kennel Cough)', months: 12 },
    { id: 'leptospirosis', name: 'Leptospirosis', months: 12 },
    { id: 'lyme', name: 'Lyme Disease', months: 12 },
    { id: 'corona', name: 'Coronavirus', months: 12 },
  ],
  cat: [
    { id: 'fvr', name: 'FVR (Feline Viral Rhinotracheitis)', months: 12 },
    { id: 'fcv', name: 'FCV (Feline Calicivirus)', months: 12 },
    { id: 'fpv', name: 'FPV (Panleukopenia)', months: 12 },
    { id: 'rabies', name: 'Rabies', months: 12 },
    { id: 'felv', name: 'FeLV (Feline Leukemia)', months: 12 },
  ],
  bird: [
    { id: 'newcastle', name: 'Newcastle Disease', months: 12 },
    { id: 'fowlpox', name: 'Fowl Pox', months: 12 },
    { id: 'polyomaviridae', name: 'Polyomavirus', months: 12 },
  ],
  rabbit: [
    { id: 'myxomatosis', name: 'Myxomatosis', months: 6 },
    { id: 'vhd', name: 'VHD (Viral Hemorrhagic Disease)', months: 12 },
    { id: 'rhv', name: 'RHV (Rabbit Hemorrhagic Disease)', months: 12 },
  ],
  goat: [
    { id: 'enterotoxemia', name: 'Enterotoxemia', months: 6 },
    { id: 'ppr', name: 'PPR', months: 12 },
    { id: 'footrot', name: 'Foot Rot', months: 12 },
  ],
  sheep: [
    { id: 'clostridial', name: 'Clostridial (CD)', months: 6 },
    { id: 'footrot', name: 'Foot Rot', months: 12 },
  ],
  fish: [
    { id: 'khv', name: 'Koi Herpes Virus', months: 12 },
    { id: 'spring', name: 'Spring Viremia', months: 12 },
  ],
  horse: [
    { id: 'equine', name: 'Equine Influenza', months: 12 },
    { id: 'tetanus', name: 'Tetanus', months: 12 },
    { id: 'wb', name: 'West Nile Virus', months: 12 },
    { id: 'equherpes', name: 'Equine Herpes Virus', months: 12 },
  ],
  cow: [
    { id: 'fmd', name: 'Foot & Mouth Disease', months: 6 },
    { id: 'brucellosis', name: 'Brucellosis', months: 12 },
    { id: 'anthrax', name: 'Anthrax', months: 12 },
  ],
  other: [
    { id: 'custom', name: 'Custom Vaccine', months: 12 },
  ],
};

export default function VaccinationsPage() {
  const [pets, setPets] = useState([]);
  const [selectedPet, setSelectedPet] = useState(null);
  const [vaccinations, setVaccinations] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ 
    vaccine_name: '', 
    vaccine_type: '',
    date_given: new Date().toISOString().split('T')[0], 
    next_due: '', 
    notes: '' 
  });

  useEffect(() => {
    api.getPets().then(d => {
      setPets(d.pets || []);
      if (d.pets?.length > 0) { 
        setSelectedPet(d.pets[0]); 
        loadVacc(d.pets[0].id); 
      }
      else setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  async function loadVacc(petId) {
    setLoading(true);
    try {
      const data = await api.getVaccinations(petId);
      setVaccinations(data.vaccinations || []);
    } catch (err) { 
      console.error(err); 
    } finally { 
      setLoading(false); 
    }
  }

  function selectPet(pet) {
    setSelectedPet(pet);
    loadVacc(pet.id);
  }

  function getStatus(v) {
    if (!v.next_due) return { label: 'Unknown', color: 'var(--text-muted)', icon: Clock };
    const due = new Date(v.next_due);
    const today = new Date();
    const daysLeft = Math.ceil((due - today) / (1000 * 60 * 60 * 24));
    
    if (daysLeft < 0) return { label: 'Overdue', color: '#EF4444', icon: AlertTriangle };
    if (daysLeft < 30) return { label: 'Due Soon', color: '#F59E0B', icon: Clock };
    return { label: 'Up to Date', color: '#10B981', icon: CheckCircle };
  }

  function handleAdd(e) {
    e.preventDefault();
    if (!form.vaccine_name) {
      toast.error('Please select a vaccine');
      return;
    }
    
    const nextDueDate = new Date(form.date_given);
    const vaccine = vaccineTypesByPet[selectedPet?.type]?.find(v => v.id === form.vaccine_type) 
      || vaccineTypesByPet.other[0];
    nextDueDate.setMonth(nextDueDate.getMonth() + vaccine.months);
    form.next_due = nextDueDate.toISOString().split('T')[0];
    
    api.addVaccination({ ...form, pet_id: selectedPet.id }).then(() => {
      toast.success('Vaccination added! 💉');
      setShowModal(false);
      setForm({ vaccine_name: '', vaccine_type: '', date_given: new Date().toISOString().split('T')[0], next_due: '', notes: '' });
      loadVacc(selectedPet.id);
    }).catch(err => toast.error(err.message));
  }

  function handleDelete(id) {
    if (!confirm('Delete this vaccination record?')) return;
    api.deleteVaccination(id).then(() => {
      toast.success('Deleted');
      loadVacc(selectedPet.id);
    }).catch(err => toast.error('Failed to delete'));
  }

  if (loading) return (
    <div className="loading-container">
      <div className="spinner"></div>
      <p>Loading vaccinations...</p>
    </div>
  );

  return (
    <div>
      <div className="page-header">
        <h2>💉 Vaccinations</h2>
        <p>Track your pet's vaccination history and get reminders</p>
      </div>

      {pets.length === 0 ? (
        <div className="empty-state card">
          <div style={{ fontSize: 50 }}>💉</div>
          <h3>Add a pet first</h3>
          <p>You need to add a pet before tracking vaccinations</p>
          <Link to="/pets" className="btn btn-primary" style={{ marginTop: 16 }}>
            Add Pet
          </Link>
        </div>
      ) : (
        <>
          <div className="card" style={{ marginBottom: 24 }}>
            <label className="form-label" style={{ marginBottom: 12 }}>Select Pet</label>
            <div className="pet-selector">
              {pets.map(pet => (
                <button
                  key={pet.id}
                  className={`pet-selector-btn ${selectedPet?.id === pet.id ? 'active' : ''}`}
                  onClick={() => selectPet(pet)}
                >
                  <span style={{ fontSize: 24 }}>{getPetEmoji(pet.type)}</span>
                  <span>{pet.name}</span>
                </button>
              ))}
            </div>
          </div>

          {vaccinations.length === 0 ? (
            <div className="empty-state card">
              <Shield size={48} style={{ marginBottom: 16, color: 'var(--primary)' }} />
              <h3>No vaccinations recorded</h3>
              <p>Add your pet's vaccination records to track reminders</p>
              <button className="btn btn-primary" onClick={() => setShowModal(true)} style={{ marginTop: 16 }}>
                + Add Vaccination
              </button>
            </div>
          ) : (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h3>Vaccination Records</h3>
                <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                  <Plus size={16} /> Add
                </button>
              </div>

              <div className="vaccination-list">
                {vaccinations.map(v => {
                  const status = getStatus(v);
                  const StatusIcon = status.icon;
                  return (
                    <div key={v.id} className="vaccination-card">
                      <div className="vaccination-header">
                        <div className="vaccination-icon">
                          <Syringe size={20} />
                        </div>
                        <div className="vaccination-info">
                          <h4>{v.vaccine_name}</h4>
                          <p>Given: {v.date_given || 'N/A'}</p>
                        </div>
                        <div className="vaccination-status" style={{ background: `${status.color}15`, color: status.color }}>
                          <StatusIcon size={14} />
                          {status.label}
                        </div>
                      </div>
                      {v.next_due && (
                        <div className="vaccination-due">
                          <Calendar size={14} />
                          Next due: {v.next_due}
                        </div>
                      )}
                      {v.notes && <p className="vaccination-notes">{v.notes}</p>}
                      <div className="vaccination-actions">
                        <button className="icon-btn" onClick={() => handleDelete(v.id)}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </>
      )}

      {showModal && selectedPet && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3>➕ Add Vaccination</h3>
            
            <form onSubmit={handleAdd}>
              <div className="form-group">
                <label className="form-label">Vaccine Type *</label>
                <select 
                  className="form-input"
                  value={form.vaccine_type}
                  onChange={e => {
                    const vaccine = vaccineTypesByPet[selectedPet.type]?.find(v => v.id === e.target.value) 
                      || vaccineTypesByPet.other[0];
                    setForm({...form, vaccine_type: e.target.value, vaccine_name: vaccine.name});
                  }}
                  required
                >
                  <option value="">Select vaccine</option>
                  {(vaccineTypesByPet[selectedPet.type] || vaccineTypesByPet.other).map(v => (
                    <option key={v.id} value={v.id}>{v.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Date Given</label>
                <input 
                  type="date" 
                  className="form-input"
                  value={form.date_given}
                  onChange={e => setForm({...form, date_given: e.target.value})}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Notes (optional)</label>
                <textarea 
                  className="form-input"
                  placeholder="Any notes..."
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
                  Add Vaccination
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}