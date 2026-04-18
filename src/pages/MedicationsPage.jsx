import { useState, useEffect } from 'react';
import { Pill, Clock, Bell, Plus, Trash2, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { api } from '../api';

export default function MedicationsPage() {
  const [pets, setPets] = useState([]);
  const [selectedPet, setSelectedPet] = useState(null);
  const [medications, setMedications] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newMedication, setNewMedication] = useState({
    name: '',
    dosage: '',
    frequency: 'daily',
    times: ['08:00'],
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    notes: ''
  });

  useEffect(() => {
    loadPets();
    loadMedications();
  }, [selectedPet]);

  async function loadPets() {
    try {
      const data = await api.getPets();
      setPets(data.pets || []);
      if (!selectedPet && data.pets?.length > 0) {
        setSelectedPet(data.pets[0]);
      }
    } catch (err) {
      console.error(err);
    }
  }

  function loadMedications() {
    const saved = localStorage.getItem('pawcare_medications');
    if (saved) {
      const allMeds = JSON.parse(saved);
      if (selectedPet) {
        setMedications(allMeds.filter(m => m.petId === selectedPet.id));
      } else {
        setMedications(allMeds);
      }
    }
  }

  function saveMedications(meds) {
    const saved = localStorage.getItem('pawcare_medications');
    const allMeds = saved ? JSON.parse(saved) : [];
    const otherMeds = allMeds.filter(m => m.petId !== (selectedPet?.id || 'all'));
    
    const updated = [...otherMeds, ...meds];
    localStorage.setItem('pawcare_medications', JSON.stringify(updated));
    setMedications(meds);
  }

  function addMedication() {
    if (!newMedication.name) {
      toast.error('Please enter medication name');
      return;
    }

    const med = {
      id: `med-${Date.now()}`,
      petId: selectedPet?.id || 'all',
      ...newMedication,
      enabled: true,
      createdAt: new Date().toISOString()
    };

    const updated = [...medications, med];
    saveMedications(updated);
    setShowAddModal(false);
    setNewMedication({
      name: '',
      dosage: '',
      frequency: 'daily',
      times: ['08:00'],
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
      notes: ''
    });
    toast.success('Medication added!');
    scheduleMedReminder(med);
  }

  function toggleMedication(id) {
    const updated = medications.map(m => 
      m.id === id ? { ...m, enabled: !m.enabled } : m
    );
    saveMedications(updated);
  }

  function deleteMedication(id) {
    const updated = medications.filter(m => m.id !== id);
    saveMedications(updated);
    toast.success('Medication removed');
  }

  function addTimeSlot() {
    if (newMedication.times.length < 4) {
      setNewMedication({ ...newMedication, times: [...newMedication.times, '12:00'] });
    }
  }

  function updateTimeSlot(index, time) {
    const times = [...newMedication.times];
    times[index] = time;
    setNewMedication({ ...newMedication, times });
  }

  function removeTimeSlot(index) {
    const times = newMedication.times.filter((_, i) => i !== index);
    setNewMedication({ ...newMedication, times });
  }

  function scheduleMedReminder(med) {
    if (!('Notification' in window) || Notification.permission !== 'granted') return;

    med.times.forEach(time => {
      const [hours, minutes] = time.split(':').map(Number);
      const now = new Date();
      const scheduledTime = new Date();
      scheduledTime.setHours(hours, minutes, 0, 0);

      if (scheduledTime <= now) {
        scheduledTime.setDate(scheduledTime.getDate() + 1);
      }

      const timeUntil = scheduledTime.getTime() - now.getTime();

      setTimeout(() => {
        new Notification('💊 Medication Reminder', {
          body: `Time to give ${med.name} to your pet!`,
          icon: '/favicon.ico',
          tag: med.id,
        });
      }, timeUntil);
    });
  }

  const frequencyLabels = {
    daily: 'Daily',
    weekly: 'Weekly',
    twice_daily: 'Twice Daily',
    as_needed: 'As Needed'
  };

  return (
    <div className="page-container">
      <div style={{ marginBottom: 24 }}>
        <h2>💊 Medication Reminders</h2>
        <p style={{ color: 'var(--text-muted)' }}>Track medicines and supplements</p>
      </div>

      {pets.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 13, fontWeight: 600, marginBottom: 8, display: 'block' }}>Select Pet</label>
          <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 8 }}>
            {pets.map(pet => (
              <button
                key={pet.id}
                onClick={() => setSelectedPet(pet)}
                style={{
                  padding: '8px 16px',
                  borderRadius: 20,
                  background: selectedPet?.id === pet.id ? 'var(--primary)' : 'var(--bg-card)',
                  color: selectedPet?.id === pet.id ? 'white' : 'var(--text-main)',
                  border: '1px solid var(--border)',
                  fontWeight: 500,
                  whiteSpace: 'nowrap'
                }}
              >
                {pet.name}
              </button>
            ))}
          </div>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h3>Medications ({medications.length})</h3>
        <button className="btn btn-primary btn-sm" onClick={() => setShowAddModal(true)}>
          <Plus size={16} /> Add
        </button>
      </div>

      {medications.length === 0 && (
        <div className="card" style={{ textAlign: 'center', padding: 40 }}>
          <Pill size={40} style={{ color: 'var(--text-muted)', marginBottom: 16 }} />
          <h3>No medications yet</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: 16 }}>
            Add medications or supplements your pet needs
          </p>
          <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
            Add Medication
          </button>
        </div>
      )}

      {medications.map(med => (
        <div key={med.id} className={`card ${med.enabled ? '' : ''}`} style={{ marginBottom: 12, opacity: med.enabled ? 1 : 0.6 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <Pill size={18} color="var(--primary)" />
                <h4 style={{ fontWeight: 600 }}>{med.name}</h4>
              </div>
              
              {med.dosage && (
                <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 4 }}>
                  Dosage: {med.dosage}
                </p>
              )}
              
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <Clock size={14} style={{ color: 'var(--text-muted)' }} />
                <span style={{ fontSize: 13 }}>{frequencyLabels[med.frequency]}</span>
                {med.times?.length > 0 && (
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                    • {med.times.join(', ')}
                  </span>
                )}
              </div>
              
              {med.notes && (
                <p style={{ fontSize: 12, fontStyle: 'italic', color: 'var(--text-muted)' }}>
                  {med.notes}
                </p>
              )}
            </div>
            
            <div style={{ display: 'flex', gap: 4 }}>
              <button 
                onClick={() => toggleMedication(med.id)}
                style={{ padding: 8 }}
              >
                {med.enabled ? <CheckCircle size={20} color="var(--primary)" /> : <XCircle size={20} style={{ color: 'var(--text-muted)' }} />}
              </button>
              <button 
                onClick={() => deleteMedication(med.id)}
                style={{ padding: 8 }}
              >
                <Trash2 size={18} style={{ color: '#ef4444' }} />
              </button>
            </div>
          </div>
        </div>
      ))}

      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3>Add Medication</h3>
            
            <div className="form-group">
              <label className="form-label">Medication Name *</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="e.g., Heartgard, Apoquel"
                value={newMedication.name}
                onChange={e => setNewMedication({...newMedication, name: e.target.value})}
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Dosage</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="e.g., 1 tablet, 5ml"
                value={newMedication.dosage}
                onChange={e => setNewMedication({...newMedication, dosage: e.target.value})}
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Frequency</label>
              <select 
                className="form-input"
                value={newMedication.frequency}
                onChange={e => setNewMedication({...newMedication, frequency: e.target.value})}
              >
                <option value="daily">Daily</option>
                <option value="twice_daily">Twice Daily</option>
                <option value="weekly">Weekly</option>
                <option value="as_needed">As Needed</option>
              </select>
            </div>
            
            <div className="form-group">
              <label className="form-label">Reminder Times</label>
              {newMedication.times.map((time, idx) => (
                <div key={idx} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                  <input 
                    type="time"
                    className="form-input"
                    value={time}
                    onChange={e => updateTimeSlot(idx, e.target.value)}
                  />
                  {newMedication.times.length > 1 && (
                    <button 
                      onClick={() => removeTimeSlot(idx)}
                      style={{ padding: '0 8px', color: '#ef4444' }}
                    >
                      <XCircle size={18} />
                    </button>
                  )}
                </div>
              ))}
              {newMedication.times.length < 4 && (
                <button 
                  onClick={addTimeSlot}
                  style={{ fontSize: 13, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: 4 }}
                >
                  <Plus size={14} /> Add Time
                </button>
              )}
            </div>
            
            <div className="form-group">
              <label className="form-label">Start Date</label>
              <input 
                type="date"
                className="form-input"
                value={newMedication.startDate}
                onChange={e => setNewMedication({...newMedication, startDate: e.target.value})}
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Notes (optional)</label>
              <textarea 
                className="form-input"
                rows={2}
                placeholder="Special instructions..."
                value={newMedication.notes}
                onChange={e => setNewMedication({...newMedication, notes: e.target.value})}
              />
            </div>
            
            <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
              <button className="btn btn-primary" onClick={addMedication}>Add Medication</button>
              <button className="btn btn-secondary" onClick={() => setShowAddModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}