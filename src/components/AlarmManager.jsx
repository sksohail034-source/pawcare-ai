import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useRoutines } from '../context/RoutineContext';

export default function AlarmManager() {
  const { routines } = useRoutines();
  const [lastNotified, setLastNotified] = useState({});

  useEffect(() => {
    const checkAlarms = () => {
      if (!routines || routines.length === 0) return;

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
      
      // 1. Show Toast with specific style
      toast(message, {
        icon: routine.icon || '🔔',
        duration: 8000,
        style: {
          border: '2px solid #8b5cf6',
          padding: '20px',
          color: '#111827',
          fontWeight: '800',
          fontSize: '18px',
          borderRadius: '24px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
          background: '#fff'
        },
      });

      // 2. Browser Notification
      if ('Notification' in window && Notification.permission === 'granted') {
        try {
          const notification = new Notification(`🐾 PawCare: ${routine.title}`, {
            body: message,
            icon: '/pwa-192x192.png',
            badge: '/favicon.svg',
            vibrate: [500, 110, 500],
            requireInteraction: true,
            tag: 'pawcare-routine'
          });
          
          notification.onclick = () => {
            window.focus();
            notification.close();
          };
        } catch (e) {
          console.error('Notification error', e);
        }
      }

      // 3. Play Alarm Sound
      try {
        const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
        audio.volume = 0.8;
        audio.play().catch(e => console.log('Audio play blocked by browser', e));
      } catch (e) {
        console.error('Sound error', e);
      }
    };

    // Check every 15 seconds for better precision
    const interval = setInterval(checkAlarms, 15000);
    checkAlarms(); // Initial check

    return () => clearInterval(interval);
  }, [routines, lastNotified]);

  return null;
}
