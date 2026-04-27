import { useState, useEffect } from 'react';
import { Bell, Clock, Sun, Moon, Sunset, CheckCircle, XCircle, Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import AdModal from '../components/AdModal';

const defaultRoutines = [
  { id: 'morning-feed', title: 'Morning Feeding', time: '07:00', type: 'morning', enabled: true, icon: '🌅', message: '🐾 Time to feed your pet!' },
  { id: 'morning-groom', title: 'Light Grooming', time: '08:00', type: 'morning', enabled: true, icon: '✨', message: '🚿 Time for light grooming!' },
  { id: 'afternoon-snack', title: 'Afternoon Snack', time: '12:00', type: 'afternoon', enabled: true, icon: '🍖', message: '🦴 Snack time for your pet!' },
  { id: 'afternoon-water', title: 'Hydration Check', time: '14:00', type: 'afternoon', enabled: true, icon: '💧', message: "💧 Don't forget water!" },
  { id: 'evening-walk', title: 'Evening Walk', time: '18:00', type: 'evening', enabled: true, icon: '🚶', message: '🐕 Time for an evening walk!' },
  { id: 'evening-clean', title: 'Evening Cleaning', time: '20:00', type: 'evening', enabled: true, icon: '🧹', message: '🧹 Time for cleaning & care!' },
  { id: 'weekly-bath', title: 'Weekly Bath', time: '10:00', type: 'weekly', enabled: true, icon: '🛁', message: '🛁 Weekly bath time!' },
  { id: 'weekly-nail', title: 'Nail Trimming', time: '11:00', type: 'weekly', enabled: true, icon: '✂️', message: '✂️ Time for nail trimming!' },
];

export default function RoutinePage() {
  const [routines, setRoutines] = useState([]);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newRoutine, setNewRoutine] = useState({ title: '', time: '08:00', type: 'morning', icon: '🔔', message: '' });
  const [showAd, setShowAd] = useState(false);
  const [unlocked, setUnlocked] = useState(sessionStorage.getItem('basic_features_unlocked') === 'true');

  useEffect(() => { loadRoutines(); checkNotificationPermission(); }, []);

  function checkNotificationPermission() {
    if ('Notification' in window) setNotificationsEnabled(Notification.permission === 'granted');
  }

  async function requestNotificationPermission() {
    if (!('Notification' in window)) { toast.error('Notifications not supported'); return; }
    const permission = await Notification.requestPermission();
    setNotificationsEnabled(permission === 'granted');
    if (permission === 'granted') toast.success('Notifications enabled! 🔔');
    else toast.error('Notification permission denied');
  }

  function loadRoutines() {
    const saved = localStorage.getItem('pawcare_routines');
    if (saved) setRoutines(JSON.parse(saved));
    else { setRoutines(defaultRoutines); saveRoutines(defaultRoutines); }
  }

  function saveRoutines(data) { localStorage.setItem('pawcare_routines', JSON.stringify(data)); }

  function toggleRoutine(id) {
    const updated = routines.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r);
    setRoutines(updated); saveRoutines(updated); toast.success('Updated!');
  }

  function deleteRoutine(id) {
    const updated = routines.filter(r => r.id !== id);
    setRoutines(updated); saveRoutines(updated); toast.success('Removed');
  }

  function updateRoutineTime(id, newTime) {
    const updated = routines.map(r => r.id === id ? { ...r, time: newTime } : r);
    setRoutines(updated); saveRoutines(updated);
  }

  function addRoutine() {
    if (!newRoutine.title) { toast.error('Enter a title'); return; }
    const routine = { ...newRoutine, id: `custom-${Date.now()}`, enabled: true, message: newRoutine.message || `🐾 Time for ${newRoutine.title}!` };
    const updated = [...routines, routine];
    setRoutines(updated); saveRoutines(updated);
    setShowAddModal(false);
    setNewRoutine({ title: '', time: '08:00', type: 'morning', icon: '🔔', message: '' });
    toast.success('Routine added!');
  }

  const groups = [
    { key: 'morning', label: 'Morning', icon: <Sun size={18} /> },
    { key: 'afternoon', label: 'Afternoon', icon: <Sunset size={18} /> },
    { key: 'evening', label: 'Evening', icon: <Moon size={18} /> },
    { key: 'weekly', label: 'Weekly Tasks', icon: <Bell size={18} /> },
  ];

  return (
    <div className="page-container" style={{ paddingBottom: 100 }}>
      {/* Premium Hero Header */}
      <div style={{ 
        background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)', 
        color: '#fff', 
        padding: '40px 24px', 
        borderRadius: '0 0 40px 40px',
        margin: '-24px -24px 32px -24px',
        textAlign: 'center',
        position: 'relative',
        boxShadow: '0 10px 30px rgba(139, 92, 246, 0.3)'
      }}>
        <div style={{ marginBottom: 16 }}>
          <div style={{ 
            width: 64, height: 64, borderRadius: '20px', background: 'rgba(255,255,255,0.2)', 
            display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto',
            backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.3)'
          }}>
            <Bell size={32} />
          </div>
        </div>
        <h2 style={{ fontSize: 32, fontWeight: 800, marginBottom: 8, letterSpacing: '-0.5px' }}>Smart Routines</h2>
        <p style={{ opacity: 0.9, fontSize: 16 }}>Automated reminders for your pet's perfect day</p>
        
        <div style={{ 
          marginTop: 24, display: 'inline-flex', alignItems: 'center', gap: 12, 
          background: 'rgba(0,0,0,0.2)', padding: '8px 16px', borderRadius: '50px',
          fontSize: 14, fontWeight: 500
        }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: notificationsEnabled ? '#4ade80' : '#f87171' }}></span>
          Notifications: {notificationsEnabled ? 'Active' : 'Paused'}
          <button 
            onClick={notificationsEnabled ? () => { setNotificationsEnabled(false); toast.success('Muted'); } : requestNotificationPermission}
            style={{ 
              background: '#fff', color: '#8b5cf6', border: 'none', 
              padding: '4px 12px', borderRadius: '20px', fontSize: 12, fontWeight: 700,
              cursor: 'pointer', marginLeft: 4
            }}
          >
            {notificationsEnabled ? 'Mute' : 'Enable'}
          </button>
        </div>
      </div>

      {!unlocked && JSON.parse(localStorage.getItem('user') || '{}').subscription === 'free' && JSON.parse(localStorage.getItem('user') || '{}').role !== 'admin' ? (
        <div className="card" style={{ textAlign: 'center', padding: '40px 20px', borderRadius: 24 }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>🔒</div>
          <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: 8, fontSize: 24 }}>Premium Feature</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: 24, maxWidth: 300, margin: '0 auto 24px' }}>Watch a short ad to unlock Smart Routines for this session, or upgrade to Pro for ad-free access.</p>
          <button className="btn btn-primary btn-lg" onClick={() => setShowAd(true)} style={{ width: '100%', maxWidth: 280 }}>📺 Watch Ad to Unlock</button>
          
          {showAd && <AdModal 
            title="Unlocking Routines" 
            onClose={() => setShowAd(false)} 
            onReward={() => {
              sessionStorage.setItem('basic_features_unlocked', 'true');
              setUnlocked(true);
            }} 
          />}
        </div>
      ) : (
      <>

      {/* Add Button */}
      <div className="flex-row justify-between items-center" style={{ marginBottom: 16 }}>
        <h3>📅 Daily Schedule</h3>
        <button className="btn btn-primary btn-sm" onClick={() => setShowAddModal(true)}>
          <Plus size={16} /> Add
        </button>
      </div>

      {/* Routine Groups */}
      {groups.map(g => {
        const items = routines.filter(r => r.type === g.key);
        if (items.length === 0) return null;
        return (
          <div className="routine-section" key={g.key}>
            <div className="section-header">{g.icon} <span>{g.label}</span></div>
            {items.map(routine => (
              <div className={`routine-card ${routine.enabled ? 'enabled' : ''}`} key={routine.id}>
                <div className="routine-icon">{routine.icon}</div>
                <div className="routine-info">
                  <h4>{routine.title}</h4>
                  <div className="routine-time">
                    <Clock size={12} />
                    <input type="time" value={routine.time} onChange={e => updateRoutineTime(routine.id, e.target.value)} className="time-input" />
                  </div>
                </div>
                <button className={`toggle-btn ${routine.enabled ? 'active' : ''}`} onClick={() => toggleRoutine(routine.id)}>
                  {routine.enabled ? <CheckCircle size={20} /> : <XCircle size={20} />}
                </button>
                {routine.id.startsWith('custom') && (
                  <button className="delete-btn" onClick={() => deleteRoutine(routine.id)}><Trash2 size={16} /></button>
                )}
              </div>
            ))}
          </div>
        );
      })}

      {/* Add Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Add Custom Routine</h3>
              <button className="modal-close" onClick={() => setShowAddModal(false)}>✕</button>
            </div>
            <div className="form-group">
              <label className="form-label">Title *</label>
              <input className="form-input" placeholder="e.g. Evening Walk" value={newRoutine.title} onChange={e => setNewRoutine({...newRoutine, title: e.target.value})} />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Time</label>
                <input type="time" className="form-input" value={newRoutine.time} onChange={e => setNewRoutine({...newRoutine, time: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Type</label>
                <select className="form-input" value={newRoutine.type} onChange={e => setNewRoutine({...newRoutine, type: e.target.value})}>
                  <option value="morning">Morning</option>
                  <option value="afternoon">Afternoon</option>
                  <option value="evening">Evening</option>
                  <option value="weekly">Weekly</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Message (optional)</label>
              <input className="form-input" placeholder="🐾 Time for..." value={newRoutine.message} onChange={e => setNewRoutine({...newRoutine, message: e.target.value})} />
            </div>
            <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
              <button className="btn btn-primary" onClick={addRoutine}>Add Routine</button>
              <button className="btn btn-secondary" onClick={() => setShowAddModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
      </>
      )}
    </div>
  );
}