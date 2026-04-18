import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Scale, Activity, Plus, Calendar, TrendingUp, TrendingDown } from 'lucide-react';
import toast from 'react-hot-toast';
import { api } from '../api';

export default function HealthChartsPage() {
  const [pets, setPets] = useState([]);
  const [selectedPet, setSelectedPet] = useState(null);
  const [weightRecords, setWeightRecords] = useState([]);
  const [vaccinationRecords, setVaccinationRecords] = useState([]);
  const [showAddWeight, setShowAddWeight] = useState(false);
  const [newWeight, setNewWeight] = useState({ weight: '', date: new Date().toISOString().split('T')[0], notes: '' });

  useEffect(() => {
    loadPets();
    loadRecords();
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

  function loadRecords() {
    if (!selectedPet) return;
    
    const savedWeights = localStorage.getItem(`pawcare_weights_${selectedPet.id}`);
    const savedVaccines = localStorage.getItem(`pawcare_vaccines_${selectedPet.id}`);
    
    setWeightRecords(savedWeights ? JSON.parse(savedWeights) : []);
    setVaccinationRecords(savedVaccines ? JSON.parse(savedVaccines) : []);
  }

  function addWeightRecord() {
    if (!newWeight.weight) {
      toast.error('Please enter weight');
      return;
    }

    const record = {
      id: `weight-${Date.now()}`,
      weight: parseFloat(newWeight.weight),
      date: newWeight.date,
      notes: newWeight.notes,
      createdAt: new Date().toISOString()
    };

    const updated = [...weightRecords, record].sort((a, b) => new Date(a.date) - new Date(b.date));
    localStorage.setItem(`pawcare_weights_${selectedPet.id}`, JSON.stringify(updated));
    setWeightRecords(updated);
    setShowAddWeight(false);
    setNewWeight({ weight: '', date: new Date().toISOString().split('T')[0], notes: '' });
    toast.success('Weight recorded!');
  }

  function getWeightChange() {
    if (weightRecords.length < 2) return null;
    const last = weightRecords[weightRecords.length - 1].weight;
    const prev = weightRecords[weightRecords.length - 2].weight;
    const diff = last - prev;
    return {
      value: diff.toFixed(1),
      direction: diff > 0 ? 'up' : diff < 0 ? 'down' : 'stable'
    };
  }

  function formatDate(date) {
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  const weightChange = getWeightChange();

  const chartData = weightRecords.map(r => ({
    date: formatDate(r.date),
    weight: r.weight,
    fullDate: r.date
  }));

  return (
    <div className="page-container">
      <div style={{ marginBottom: 24 }}>
        <h2>📊 Pet Health Charts</h2>
        <p style={{ color: 'var(--text-muted)' }}>Track weight and health progress</p>
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

      {weightChange && (
        <div className="card" style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Scale size={24} color="var(--primary)" />
              <div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Latest Weight</div>
                <div style={{ fontSize: 20, fontWeight: 700 }}>
                  {weightRecords[weightRecords.length - 1]?.weight} kg
                </div>
              </div>
            </div>
            <div style={{ 
              display: 'flex', alignItems: 'center', gap: 4,
              color: weightChange.direction === 'up' ? '#22c55e' : weightChange.direction === 'down' ? '#ef4444' : 'var(--text-muted)'
            }}>
              {weightChange.direction === 'up' ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
              <span style={{ fontWeight: 600 }}>{weightChange.value > 0 ? '+' : ''}{weightChange.value} kg</span>
            </div>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h3>Weight Progress</h3>
        <button className="btn btn-primary btn-sm" onClick={() => setShowAddWeight(true)}>
          <Plus size={16} /> Record
        </button>
      </div>

      {weightRecords.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: 40 }}>
          <Scale size={40} style={{ color: 'var(--text-muted)', marginBottom: 16 }} />
          <h3>No weight records</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: 16 }}>
            Start tracking your pet's weight
          </p>
          <button className="btn btn-primary" onClick={() => setShowAddWeight(true)}>
            Add First Record
          </button>
        </div>
      ) : (
        <div className="card" style={{ marginBottom: 24 }}>
          <div style={{ height: 200 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12, fill: 'var(--text-muted)' }}
                  axisLine={{ stroke: 'var(--border)' }}
                  tickLine={{ stroke: 'var(--border)' }}
                />
                <YAxis 
                  tick={{ fontSize: 12, fill: 'var(--text-muted)' }}
                  axisLine={{ stroke: 'var(--border)' }}
                  tickLine={{ stroke: 'var(--border)' }}
                  domain={['dataMin - 1', 'dataMax + 1']}
                />
                <Tooltip 
                  contentStyle={{ 
                    background: 'var(--bg-card)', 
                    border: '1px solid var(--border)',
                    borderRadius: 8
                  }}
                  labelStyle={{ fontWeight: 600 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="weight" 
                  stroke="var(--primary)" 
                  strokeWidth={2}
                  dot={{ fill: 'var(--primary)', strokeWidth: 2 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      <h3 style={{ marginBottom: 16 }}>Vaccination History</h3>
      {vaccinationRecords.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: 40 }}>
          <Activity size={40} style={{ color: 'var(--text-muted)', marginBottom: 16 }} />
          <p style={{ color: 'var(--text-muted)' }}>
            No vaccination records yet
          </p>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 8 }}>
            Add vaccinations in the Vaccinations tab to see them here
          </p>
        </div>
      ) : (
        <div>
          {vaccinationRecords.map((vax, idx) => (
            <div key={idx} className="card" style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4 style={{ fontWeight: 600, marginBottom: 4 }}>{vax.name}</h4>
                  <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                    {vax.date} • {vax.vet}
                  </p>
                </div>
                <span style={{ 
                  background: 'var(--bg-app)', 
                  padding: '4px 10px', 
                  borderRadius: 12, 
                  fontSize: 12,
                  color: 'var(--primary-dark)'
                }}>
                  {vax.status || 'Completed'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {showAddWeight && (
        <div className="modal-overlay" onClick={() => setShowAddWeight(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3>Record Weight</h3>
            
            <div className="form-group">
              <label className="form-label">Weight (kg) *</label>
              <input 
                type="number" 
                step="0.1"
                className="form-input" 
                placeholder="e.g., 12.5"
                value={newWeight.weight}
                onChange={e => setNewWeight({...newWeight, weight: e.target.value})}
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Date</label>
              <input 
                type="date"
                className="form-input"
                value={newWeight.date}
                onChange={e => setNewWeight({...newWeight, date: e.target.value})}
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Notes (optional)</label>
              <textarea 
                className="form-input"
                rows={2}
                placeholder="Any notes..."
                value={newWeight.notes}
                onChange={e => setNewWeight({...newWeight, notes: e.target.value})}
              />
            </div>
            
            <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
              <button className="btn btn-primary" onClick={addWeightRecord}>Save Record</button>
              <button className="btn btn-secondary" onClick={() => setShowAddWeight(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}