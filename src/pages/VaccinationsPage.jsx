import { useState, useEffect } from 'react';
import { api } from '../api';
import { getPetEmoji, formatDate, daysUntil, vaccineSchedules } from '../utils';
import toast from 'react-hot-toast';

export default function VaccinationsPage() {
  const [pets, setPets] = useState([]);
  const [selectedPet, setSelectedPet] = useState(null);
  const [vaccinations, setVaccinations] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingVacc, setEditingVacc] = useState(null);
  const [form, setForm] = useState({ vaccine_name: '', date_given: '', next_due: '', notes: '' });
  const [loading, setLoading] = useState(true);
  const [overdueCount, setOverdueCount] = useState(0);

  useEffect(() => {
    api.getPets().then(d => {
      setPets(d.pets || []);
      if (d.pets?.length > 0) { setSelectedPet(d.pets[0]); loadVacc(d.pets[0].id); }
      else setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  async function loadVacc(petId) {
    setLoading(true);
    try {
      const data = await api.getVaccinations(petId);
      const vaccs = data.vaccinations || [];
      setVaccinations(vaccs);
      const overdue = vaccs.filter(v => v.next_due && new Date(v.next_due) < new Date()).length;
      setOverdueCount(overdue);
    } catch { toast.error('Failed to load vaccinations'); }
    finally { setLoading(false); }
  }

  function selectPet(pet) { setSelectedPet(pet); loadVacc(pet.id); }

  function getVaccStatus(v) {
    if (v.next_due && new Date(v.next_due) < new Date()) return 'overdue';
    if (v.status === 'completed' || v.date_given) return 'completed';
    return 'upcoming';
  }

  function openAdd() {
    setEditingVacc(null);
    setForm({ vaccine_name: '', date_given: '', next_due: '', notes: '' });
    setShowModal(true);
  }

  function openEdit(v) {
    setEditingVacc(v);
    setForm({ vaccine_name: v.vaccine_name, date_given: v.date_given || '', next_due: v.next_due || '', notes: v.notes || '' });
    setShowModal(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      if (editingVacc) {
        await api.updateVaccination(editingVacc.id, form);
        toast.success('Vaccination updated! 💉');
      } else {
        await api.addVaccination({ ...form, pet_id: selectedPet.id });
        toast.success('Vaccination added! 💉');
      }
      setShowModal(false);
      setForm({ vaccine_name: '', date_given: '', next_due: '', notes: '' });
      loadVacc(selectedPet.id);
    } catch (err) { toast.error(err.message); }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this vaccination record?')) return;
    try {
      await api.deleteVaccination(id);
      toast.success('Deleted');
      loadVacc(selectedPet.id);
    } catch (err) { toast.error(err.message); }
  }

  const petType = selectedPet?.type?.toLowerCase() || 'dog';
  const vaccines = vaccineSchedules[petType] || [];

  if (pets.length === 0 && !loading) {
    return (
      <div className="page-container">
        <div className="page-header"><h2>Vaccination Tracker 💉</h2><p>Keep your pets' vaccinations up to date</p></div>
        <div className="empty-state card">
          <div className="empty-icon">🐾</div>
          <h3>Add a pet first</h3>
          <p>You need at least one pet to track vaccinations</p>
          <a href="/pets" className="btn btn-primary">Add Pet</a>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12, marginBottom: 24 }}>
        <div className="page-header" style={{ marginBottom: 0 }}>
          <h2>Vaccination Tracker 💉</h2>
          <p>Keep your pets' vaccinations up to date with reminders</p>
        </div>
        {selectedPet && <button className="btn btn-primary" onClick={openAdd}>➕ Add Vaccination</button>}
      </div>

      {/* Overdue Alert */}
      {overdueCount > 0 && (
        <div className="alert-banner danger">
          ⚠️ <strong>{overdueCount} vaccination{overdueCount > 1 ? 's' : ''} overdue!</strong> Please schedule with your vet.
        </div>
      )}

      {/* Pet Selector */}
      {pets.length > 0 && (
        <div className="filter-bar">
          {pets.map(pet => (
            <button key={pet.id} className={`filter-chip ${selectedPet?.id === pet.id ? 'active' : ''}`} onClick={() => selectPet(pet)}>
              {getPetEmoji(pet.type)} {pet.name}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <div className="loading-container"><div className="spinner"></div><p>Loading vaccinations...</p></div>
      ) : vaccinations.length === 0 ? (
        <div className="empty-state card">
          <div className="empty-icon">💉</div>
          <h3>No vaccinations recorded</h3>
          <p>Start tracking {selectedPet?.name}'s vaccination schedule</p>
          <button className="btn btn-primary" onClick={openAdd}>Add First Vaccination</button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {vaccinations.map(v => {
            const status = getVaccStatus(v);
            const days = daysUntil(v.next_due);
            return (
              <div className="vacc-card" key={v.id} style={status === 'overdue' ? { borderColor: 'var(--danger)', background: '#fef2f2' } : {}}>
                <div className={`vacc-status ${status}`}></div>
                <div className="vacc-info">
                  <h4>{v.vaccine_name}</h4>
                  <div className="vacc-dates">
                    {v.date_given && <span>Given: {formatDate(v.date_given)}</span>}
                    {v.next_due && <span>Next: {formatDate(v.next_due)}</span>}
                    {days !== null && days > 0 && <span className="badge badge-info">{days}d away</span>}
                    {days !== null && days <= 0 && <span className="badge badge-danger">Overdue!</span>}
                  </div>
                  {v.notes && <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>{v.notes}</p>}
                </div>
                <span className={`badge ${status === 'completed' ? 'badge-success' : status === 'overdue' ? 'badge-danger' : 'badge-warning'}`}>
                  {status === 'completed' ? '✅ OK' : status === 'overdue' ? '⚠️ Due' : '🕐 Soon'}
                </span>
                <button className="btn btn-ghost btn-sm" onClick={() => openEdit(v)}>✏️</button>
                <button className="btn btn-ghost btn-sm" onClick={() => handleDelete(v.id)} style={{ color: 'var(--danger)' }}>🗑️</button>
              </div>
            );
          })}
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingVacc ? 'Edit' : 'Add'} Vaccination for {selectedPet?.name}</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>
            {vaccines.length > 0 && (
              <div style={{ marginBottom: 16 }}>
                <label className="form-label">Quick Select ({selectedPet?.type})</label>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {vaccines.map(v => (
                    <button key={v.name} className={`filter-chip ${form.vaccine_name === v.name ? 'active' : ''}`}
                      onClick={() => setForm({ ...form, vaccine_name: v.name })} type="button">{v.name}</button>
                  ))}
                </div>
              </div>
            )}
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Vaccine Name *</label>
                <input className="form-input" value={form.vaccine_name} onChange={e => setForm({ ...form, vaccine_name: e.target.value })} required placeholder="e.g. Rabies" />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Date Given</label>
                  <input type="date" className="form-input" value={form.date_given} onChange={e => setForm({ ...form, date_given: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Next Due Date</label>
                  <input type="date" className="form-input" value={form.next_due} onChange={e => setForm({ ...form, next_due: e.target.value })} />
                  <p style={{ fontSize: 11, color: 'var(--text-light)', marginTop: 4 }}>Auto-calculated if left empty</p>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Notes</label>
                <textarea className="form-input" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="Vet name, batch number, etc." rows="2" />
              </div>
              <button type="submit" className="btn btn-primary btn-full">{editingVacc ? 'Update' : 'Add'} Vaccination</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
