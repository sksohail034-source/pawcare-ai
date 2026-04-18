import { useState, useEffect } from 'react';
import { Bell, Clock, Sun, Moon, Sunset, CheckCircle, XCircle, Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

const defaultRoutines = [
  { id: 'morning-feed', title: 'Morning Feeding', time: '07:00', type: 'morning', enabled: true, icon: '🌅', message: '🐾 Time to feed your pet!' },
  { id: 'morning-groom', title: 'Light Grooming', time: '08:00', type: 'morning', enabled: true, icon: '✨', message: '🚿 Time for light grooming!' },
  { id: 'afternoon-snack', title: 'Afternoon Snack', time: '12:00', type: 'afternoon', enabled: true, icon: '🍖', message: '🦴 Snack time for your pet!' },
  { id: 'afternoon-water', title: 'Hydration Check', time: '14:00', type: 'afternoon', enabled: true, icon: '💧', message: '💧 Don\'t forget water for your pet!' },
  { id: 'evening-walk', title: 'Evening Walk', time: '18:00', type: 'evening', enabled: true, icon: '🚶', message: '🐕 Time for an evening walk!' },
  { id: 'evening-clean', title: 'Evening Cleaning', time: '20:00', type: 'evening', enabled: true, icon: '🧹', message: '🧹 Time for cleaning & care!' },
  { id: 'weekly-bath', title: 'Weekly Bath', time: '10:00', type: 'weekly', enabled: true, icon: '🛁', message: '🛁 Weekly bath time!' },
  { id: 'weekly-nail', title: 'Nail Trimming', time: '11:00', type: 'weekly', enabled: true, icon: '✂️', message: '✂️ Time for nail trimming!' },
];

export default function RoutinePage() {
  const [routines, setRoutines] = useState([]);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingRoutine, setEditingRoutine] = useState(null);
  const [newRoutine, setNewRoutine] = useState({ title: '', time: '08:00', type: 'morning', icon: '🔔', message: '' });
  const [permissionRequested, setPermissionRequested] = useState(false);

  useEffect(() => {
    loadRoutines();
    checkNotificationPermission();
  }, []);

  async function checkNotificationPermission() {
    if ('Notification' in window) {
      setNotificationsEnabled(Notification.permission === 'granted');
    }
  }

  async function requestNotificationPermission() {
    if (!('Notification' in window)) {
      toast.error('Notifications not supported in this browser');
      return;
    }
    
    setPermissionRequested(true);
    const permission = await Notification.requestPermission();
    setNotificationsEnabled(permission === 'granted');
    
    if (permission === 'granted') {
      toast.success('Notifications enabled! 🔔');
      scheduleAllReminders();
    } else {
      toast.error('Notification permission denied');
    }
  }

  function loadRoutines() {
    const saved = localStorage.getItem('pawcare_routines');
    if (saved) {
      setRoutines(JSON.parse(saved));
    } else {
      setRoutines(defaultRoutines);
      saveRoutines(defaultRoutines);
    }
  }

  function saveRoutines(data) {
    localStorage.setItem('pawcare_routines', JSON.stringify(data));
    if (notificationsEnabled) {
      scheduleAllReminders();
    }
  }

  function scheduleAllReminders() {
    if (!notificationsEnabled) return;
    
    routines.filter(r => r.enabled).forEach(routine => {
      scheduleNotification(routine);
    });
  }

  function scheduleNotification(routine) {
    const [hours, minutes] = routine.time.split(':').map(Number);
    const now = new Date();
    const scheduledTime = new Date();
    scheduledTime.setHours(hours, minutes, 0, 0);
    
    if (scheduledTime <= now) {
      scheduledTime.setDate(scheduledTime.getDate() + 1);
    }

    const timeUntil = scheduledTime.getTime() - now.getTime();
    
    setTimeout(() => {
      if (Notification.permission === 'granted') {
        new Notification('🐾 PawCare Reminder', {
          body: routine.message,
          icon: '/favicon.ico',
          vibrate: [200, 100, 200],
          tag: routine.id,
        });
      }
    }, timeUntil);
  }

  function toggleRoutine(id) {
    const updated = routines.map(r => 
      r.id === id ? { ...r, enabled: !r.enabled } : r
    );
    setRoutines(updated);
    saveRoutines(updated);
    toast.success('Routine updated!');
  }

  function deleteRoutine(id) {
    const updated = routines.filter(r => r.id !== id);
    setRoutines(updated);
    saveRoutines(updated);
    toast.success('Routine removed');
  }

  function updateRoutineTime(id, newTime) {
    const updated = routines.map(r => 
      r.id === id ? { ...r, time: newTime } : r
    );
    setRoutines(updated);
    saveRoutines(updated);
  }

  function addRoutine() {
    if (!newRoutine.title) {
      toast.error('Please enter a title');
      return;
    }
    
    const routine = {
      ...newRoutine,
      id: `custom-${Date.now()}`,
      enabled: true,
      message: newRoutine.message || `🐾 Time for ${newRoutine.title}!`,
    };
    
    const updated = [...routines, routine];
    setRoutines(updated);
    saveRoutines(updated);
    setShowAddModal(false);
    setNewRoutine({ title: '', time: '08:00', type: 'morning', icon: '🔔', message: '' });
    toast.success('Routine added!');
  }

  const morningRoutines = routines.filter(r => r.type === 'morning');
  const afternoonRoutines = routines.filter(r => r.type === 'afternoon');
  const eveningRoutines = routines.filter(r => r.type === 'evening');
  const weeklyRoutines = routines.filter(r => r.type === 'weekly');

  const RoutineCard = ({ routine }) => (
    <div className={`routine-card ${routine.enabled ? 'enabled' : ''}`}>
      <div className="routine-icon">{routine.icon}</div>
      <div className="routine-info">
        <h4>{routine.title}</h4>
        <div className="routine-time">
          <Clock size={12} />
          <input 
            type="time" 
            value={routine.time}
            onChange={(e) => updateRoutineTime(routine.id, e.target.value)}
            className="time-input"
          />
        </div>
      </div>
      <button 
        className={`toggle-btn ${routine.enabled ? 'active' : ''}`}
        onClick={() => toggleRoutine(routine.id)}
      >
        {routine.enabled ? <CheckCircle size={20} /> : <XCircle size={20} />}
      </button>
      {routine.id.startsWith('custom') && (
        <button className="delete-btn" onClick={() => deleteRoutine(routine.id)}>
          <Trash2 size={16} />
        </button>
      )}
    </div>
  );

  return (
    <div>
      <div className="page-header">
        <h2>🐾 Smart Routine</h2>
        <p>Personalized schedule with alarm reminders</p>
      </div>

      <div className="card" style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h4 style={{ marginBottom: 4 }}>🔔 Notifications</h4>
            <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
              {notificationsEnabled ? 'Enabled - You\'ll receive reminders' : 'Disabled'}
            </p>
          </div>
          {!notificationsEnabled ? (
            <button className="btn btn-primary" onClick={requestNotificationPermission}>
              Enable
            </button>
          ) : (
            <button className="btn btn-secondary" onClick={() => {
              setNotificationsEnabled(false);
              toast.success('Notifications disabled');
            }}>
              Disable
            </button>
          )}
        </div>
      </div>

      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h3>📅 Daily Schedule</h3>
          <button className="btn btn-primary btn-sm" onClick={() => setShowAddModal(true)}>
            <Plus size={16} /> Add
          </button>
        </div>

        <div className="routine-section">
          <div className="section-header">
            <Sun size={18} />
            <span>Morning</span>
          </div>
          {morningRoutines.map(routine => <RoutineCard key={routine.id} routine={routine} />)}
        </div>

        <div className="routine-section">
          <div className="section-header">
            <Sunset size={18} />
            <span>Afternoon</span>
          </div>
          {afternoonRoutines.map(routine => <RoutineCard key={routine.id} routine={routine} />)}
        </div>

        <div className="routine-section">
          <div className="section-header">
            <Moon size={18} />
            <span>Evening</span>
          </div>
          {eveningRoutines.map(routine => <RoutineCard key={routine.id} routine={routine} />)}
        </div>
      </div>

      <div className="routine-section">
        <div className="section-header">
          <Bell size={18} />
          <span>Weekly Tasks</span>
        </div>
        {weeklyRoutines.map(routine => <RoutineCard key={routine.id} routine={routine} />)}
      </div>

      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3>Add New Routine</h3>
            <div className="form-group">
              <label className="form-label">Title</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="e.g., Morning Walk"
                value={newRoutine.title}
                onChange={e => setNewRoutine({...newRoutine, title: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Time</label>
              <input 
                type="time" 
                className="form-input"
                value={newRoutine.time}
                onChange={e => setNewRoutine({...newRoutine, time: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Type</label>
              <select 
                className="form-input"
                value={newRoutine.type}
                onChange={e => setNewRoutine({...newRoutine, type: e.target.value})}
              >
                <option value="morning">Morning</option>
                <option value="afternoon">Afternoon</option>
                <option value="evening">Evening</option>
                <option value="weekly">Weekly</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Custom Message (optional)</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="🐾 Time for..."
                value={newRoutine.message}
                onChange={e => setNewRoutine({...newRoutine, message: e.target.value})}
              />
            </div>
            <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
              <button className="btn btn-primary" onClick={addRoutine}>Add Routine</button>
              <button className="btn btn-secondary" onClick={() => setShowAddModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}