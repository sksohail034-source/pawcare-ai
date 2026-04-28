import { useState, useEffect } from 'react';
import { Bell, Clock, Sun, Moon, Sunset, CheckCircle, XCircle, Plus, Trash2, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import AdModal from '../components/AdModal';
import { useRoutines } from '../context/RoutineContext';
import { formatTime } from '../utils';
import { subscribeToPush } from '../utils/push';

export default function RoutinePage() {
  const { routines, updateRoutine, toggleRoutine, addRoutine, deleteRoutine } = useRoutines();
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newRoutine, setNewRoutine] = useState({ title: '', time: '08:00', type: 'morning', icon: '🔔', message: '' });
  const [showAd, setShowAd] = useState(false);
  const [unlocked, setUnlocked] = useState(sessionStorage.getItem('basic_features_unlocked') === 'true');

  useEffect(() => { 
    checkNotificationPermission(); 
    setIsIOS(/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream);
  }, []);

  function checkNotificationPermission() {
    if ('Notification' in window) setNotificationsEnabled(Notification.permission === 'granted');
  }

  async function requestNotificationPermission() {
    if (!('Notification' in window)) { toast.error('Notifications not supported'); return; }
    
    const permission = await Notification.requestPermission();
    setNotificationsEnabled(permission === 'granted');
    
    if (permission === 'granted') {
      toast.success('Notifications enabled! 🔔');
      await subscribeToPush();
    } else {
      toast.error('Notification permission denied');
    }
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
        padding: '30px 20px', 
        borderRadius: '0 0 32px 32px',
        margin: '-16px -16px 24px -16px', // Adjusted to match mobile padding (16px)
        textAlign: 'center',
        position: 'relative',
        boxShadow: '0 8px 25px rgba(139, 92, 246, 0.2)'
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

      {isIOS && !notificationsEnabled && (
        <div style={{ 
          background: '#fef3c7', border: '1px solid #f59e0b', color: '#92400e',
          padding: '16px', borderRadius: '16px', marginBottom: '24px', fontSize: '14px'
        }}>
          <strong>iPhone User?</strong> To get alarms when locked: 
          <ol style={{ marginTop: 8, paddingLeft: 20 }}>
            <li>Tap the <strong>Share</strong> button (bottom of Safari)</li>
            <li>Select <strong>"Add to Home Screen"</strong></li>
            <li>Open PawCare from your Home Screen</li>
          </ol>
        </div>
      )}

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

      {/* Add Button & Dynamic Date */}
      <div className="flex-row justify-between items-center" style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ 
            background: '#1f2937', color: '#fff', 
            width: 52, height: 52, borderRadius: '12px',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            lineHeight: 1, boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            border: '2px solid #374151'
          }}>
            <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', marginBottom: 2, color: '#9ca3af' }}>{new Date().toLocaleDateString('en-US', { month: 'short' })}</span>
            <span style={{ fontSize: 20, fontWeight: 800 }}>{new Date().getDate()}</span>
          </div>
          <h3 style={{ fontSize: 20, fontWeight: 700, color: '#111827' }}>Daily Schedule</h3>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button 
            className="btn btn-secondary btn-sm" 
            onClick={async () => {
              const loadingToast = toast.loading('Syncing & Testing...');
              try {
                // 1. Ensure Subscription is synced to backend
                await subscribeToPush();
                
                // 2. Show Local Notification (Verification)
                const registration = await navigator.serviceWorker.ready;
                await registration.showNotification('PawCare Test 🔔', {
                  body: 'Phone is synced! Now set an alarm for 2 mins later and lock your screen.',
                  icon: '/pwa-192x192.png',
                  vibrate: [200, 100, 200],
                  requireInteraction: true
                });
                toast.dismiss(loadingToast);
                toast.success('Synced & Test sent! ✅');
              } catch (e) {
                toast.dismiss(loadingToast);
                toast.error('Sync failed: ' + e.message);
              }
            }}
            style={{ padding: '8px 12px', fontSize: 12, background: '#f3f4f6', color: '#374151', border: '1px solid #e5e7eb' }}
          >
            Test
          </button>
          <button className="btn btn-primary btn-sm" onClick={() => setShowAddModal(true)}>
            <Plus size={16} /> Add
          </button>
        </div>
      </div>

      {/* Routine Groups */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {groups.map(g => {
          const items = routines.filter(r => r.type === g.key);
          if (items.length === 0) return null;
          return (
            <div className="routine-section" key={g.key} style={{ animation: 'fadeUp 0.5s ease-out' }}>
              <div className="section-header" style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, color: '#4b5563', fontWeight: 700, fontSize: 16 }}>
                <span style={{ color: 'var(--primary)' }}>{g.icon}</span>
                <span>{g.label}</span>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {items.map(routine => (
                  <div 
                    key={routine.id} 
                    className={`routine-card ${routine.enabled ? 'enabled' : ''}`}
                    style={{
                      background: '#fff',
                      borderRadius: '20px',
                      padding: '12px 14px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      boxShadow: routine.enabled ? '0 8px 16px rgba(0,0,0,0.04)' : 'none',
                      border: routine.enabled ? '1px solid rgba(139, 92, 246, 0.1)' : '1px solid #f3f4f6',
                      opacity: routine.enabled ? 1 : 0.7,
                      transition: 'all 0.3s ease',
                      position: 'relative',
                      overflow: 'hidden',
                      width: '100%',
                      boxSizing: 'border-box'
                    }}
                  >
                    {/* Side border glow for enabled state */}
                    {routine.enabled && (
                      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, background: 'var(--primary)' }} />
                    )}

                    <div style={{ 
                      fontSize: 24, 
                      width: 48, 
                      height: 48, 
                      borderRadius: '12px', 
                      background: '#f9fafb',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '1px solid #f3f4f6',
                      flexShrink: 0
                    }}>
                      {routine.icon || '🔔'}
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h4 style={{ margin: '0 0 4px 0', fontSize: 15, fontWeight: 700, color: '#111827', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{routine.title}</h4>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap' }}>
                        <Clock size={12} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                        <div style={{ position: 'relative' }}>
                          <input 
                            type="time" 
                            value={routine.time} 
                            onChange={e => updateRoutine(routine.id, { time: e.target.value })}
                            style={{ 
                              border: 'none', 
                              background: '#f3f4f6', 
                              padding: '2px 6px', 
                              borderRadius: '6px',
                              fontSize: 12,
                              fontWeight: 600,
                              color: '#374151',
                              cursor: 'pointer'
                            }}
                          />
                        </div>
                        <span style={{ fontSize: 10, color: '#6b7280', fontWeight: 500 }}>
                          ({formatTime(routine.time)})
                        </span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                      {routine.id.startsWith('custom') && (
                        <button 
                          onClick={() => deleteRoutine(routine.id)}
                          style={{ 
                            background: '#fee2e2', color: '#ef4444', border: 'none', 
                            padding: '6px', borderRadius: '10px', cursor: 'pointer'
                          }}
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                      
                      <button 
                        onClick={() => toggleRoutine(routine.id, !routine.enabled)}
                        style={{
                          background: routine.enabled ? 'var(--primary)' : '#e5e7eb',
                          color: '#fff',
                          border: 'none',
                          padding: '8px',
                          borderRadius: '12px',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: routine.enabled ? '0 4px 8px rgba(34, 197, 94, 0.2)' : 'none'
                        }}
                      >
                        {routine.enabled ? <CheckCircle size={20} /> : <XCircle size={20} />}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

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
              <button className="btn btn-primary" onClick={async () => {
                if (!newRoutine.title.trim()) { toast.error('Please enter a title'); return; }
                try {
                  const routineData = {
                    id: `custom-${Date.now()}`,
                    title: newRoutine.title,
                    time: newRoutine.time,
                    type: newRoutine.type,
                    icon: newRoutine.icon || '🔔',
                    message: newRoutine.message || `🐾 Time for ${newRoutine.title}!`,
                    enabled: true
                  };
                  await addRoutine(routineData);
                  setNewRoutine({ title: '', time: '08:00', type: 'morning', icon: '🔔', message: '' });
                  setShowAddModal(false);
                  toast.success('Routine added! 🔔');
                } catch (e) {
                  toast.error('Failed to save routine');
                }
              }}>Add Routine</button>
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