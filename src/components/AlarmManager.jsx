import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export default function AlarmManager() {
  const [lastNotified, setLastNotified] = useState({});

  useEffect(() => {
    const checkAlarms = () => {
      const saved = localStorage.getItem('pawcare_routines');
      if (!saved) return;

      const routines = JSON.parse(saved);
      const now = new Date();
      const currentHHmm = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      const today = now.toDateString();

      routines.forEach(routine => {
        if (routine.enabled && routine.time === currentHHmm) {
          const notificationKey = `${routine.id}-${today}-${currentHHmm}`;
          
          if (!lastNotified[notificationKey]) {
            // Trigger Alarm
            triggerAlarm(routine);
            
            // Mark as notified for this specific minute
            setLastNotified(prev => ({ ...prev, [notificationKey]: true }));
          }
        }
      });
    };

    const triggerAlarm = (routine) => {
      const message = routine.message || `🐾 Time for ${routine.title}!`;
      
      // 1. Show Toast
      toast(message, {
        icon: routine.icon || '🔔',
        duration: 6000,
        style: {
          border: '2px solid var(--primary)',
          padding: '16px',
          color: 'var(--text-main)',
          fontWeight: 'bold',
          fontSize: '16px'
        },
      });

      // 2. Browser Notification
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('PawCare Routine Reminder', {
          body: message,
          icon: '/pwa-192x192.png' // Use app icon if available
        });
      }

      // 3. Optional: Play Sound
      try {
        const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
        audio.play().catch(e => console.log('Audio play failed', e));
      } catch (e) {
        console.error('Sound error', e);
      }
    };

    // Check every 30 seconds to be precise
    const interval = setInterval(checkAlarms, 30000);
    checkAlarms(); // Initial check

    return () => clearInterval(interval);
  }, [lastNotified]);

  return null; // Background component
}
