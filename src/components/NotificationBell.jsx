import { useState, useEffect, useRef } from 'react';
import { Bell, Check, Trash2 } from 'lucide-react';
import { api } from '../api';
import { formatDate } from '../utils';

export default function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const fetchNotifications = async () => {
    try {
      const data = await api.getNotifications();
      setNotifications(data || []);
    } catch (err) {
      console.error('Failed to load notifications', err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => n.is_read === 0).length;

  const handleMarkRead = async (id, e) => {
    e?.stopPropagation();
    try {
      await api.markNotificationRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: 1 } : n));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ position: 'relative' }} ref={dropdownRef}>
      <button 
        className="icon-btn" 
        onClick={() => setShowDropdown(!showDropdown)}
        style={{ position: 'relative' }}
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span style={{
            position: 'absolute',
            top: -2, right: -2,
            background: 'var(--danger)',
            color: 'white',
            fontSize: 10,
            fontWeight: 'bold',
            borderRadius: '50%',
            width: 16, height: 16,
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {showDropdown && (
        <div style={{
          position: 'absolute',
          top: 40, right: 0,
          width: 320,
          background: 'var(--bg-card)',
          borderRadius: 16,
          boxShadow: 'var(--shadow-lg)',
          border: '1px solid var(--border)',
          zIndex: 100,
          overflow: 'hidden'
        }}>
          <div style={{ padding: '16px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: 16 }}>Notifications</h3>
          </div>
          <div style={{ maxHeight: 300, overflowY: 'auto' }}>
            {notifications.length === 0 ? (
              <div style={{ padding: 24, textAlign: 'center', color: 'var(--text-muted)' }}>
                <Bell size={32} style={{ opacity: 0.2, margin: '0 auto 8px' }} />
                <p>No new notifications</p>
              </div>
            ) : (
              notifications.map(n => (
                <div key={n.id} onClick={() => { if (n.is_read === 0) handleMarkRead(n.id); }} style={{
                  padding: 16,
                  borderBottom: '1px solid var(--border)',
                  background: n.is_read === 0 ? 'rgba(16, 185, 129, 0.05)' : 'transparent',
                  cursor: n.is_read === 0 ? 'pointer' : 'default',
                  transition: 'background 0.2s ease'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                    <div style={{ fontWeight: n.is_read === 0 ? 600 : 500, color: 'var(--text)' }}>{n.title}</div>
                    {n.is_read === 0 && (
                      <button className="icon-btn" style={{ padding: 4, margin: -4 }} onClick={(e) => handleMarkRead(n.id, e)}>
                        <Check size={14} color="var(--primary)" />
                      </button>
                    )}
                  </div>
                  <p style={{ margin: '0 0 8px 0', fontSize: 13, color: 'var(--text-muted)' }}>{n.message}</p>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', opacity: 0.7 }}>
                    {formatDate(n.created_at)}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
