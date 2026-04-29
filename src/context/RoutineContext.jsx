import { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api';
import toast from 'react-hot-toast';

const RoutineContext = createContext(null);

const defaultRoutines = [
  { id: 'morning-feed', title: 'Morning Feeding', time: '07:00', type: 'morning', enabled: true, icon: '🌅', message: '🐾 Time to feed your pet!' },
  { id: 'morning-groom', title: 'Light Grooming', time: '08:00', type: 'morning', enabled: true, icon: '✨', message: '🚿 Time for light grooming!' },
  { id: 'afternoon-snack', title: 'Afternoon Snack', time: '12:00', type: 'afternoon', enabled: true, icon: '🍖', message: '🦴 Snack time for your pet!' },
  { id: 'afternoon-water', title: 'Hydration Check', time: '14:00', type: 'afternoon', enabled: true, icon: '💧', message: "💧 Don't forget water!" },
  { id: 'evening-walk', title: 'Evening Walk', time: '18:00', type: 'evening', enabled: true, icon: '🚶', message: '🐕 Time for an evening walk!' },
  { id: 'evening-clean', title: 'Evening Cleaning', time: '20:00', type: 'evening', enabled: true, icon: '🧹', message: '🧹 Time for cleaning & care!' },
];

export function RoutineProvider({ children }) {
  const [routines, setRoutines] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadRoutines = async () => {
    try {
      const data = await api.getRoutines();
      const serverRoutines = (data && data.routines) ? data.routines : [];
      const saved = localStorage.getItem('pawcare_routines');
      const localRoutines = saved ? JSON.parse(saved) : defaultRoutines;
      
      console.log(`[Routine Sync] Server: ${serverRoutines.length}, Local: ${localRoutines.length}`);
      
      if (serverRoutines.length > 0) {
        // Server has routines — use them as source of truth
        setRoutines(serverRoutines);
        localStorage.setItem('pawcare_routines', JSON.stringify(serverRoutines));
        
        // Check if local has MORE routines (user added while offline or DB was reset)
        const serverIds = new Set(serverRoutines.map(r => r.id));
        const missingOnServer = localRoutines.filter(r => !serverIds.has(r.id));
        if (missingOnServer.length > 0) {
          console.log(`[Routine Sync] Syncing ${missingOnServer.length} missing routines to server...`);
          let synced = 0;
          for (const r of missingOnServer) {
            try { 
              await api.createRoutine({ ...r, enabled: r.enabled === false ? 0 : 1 }); 
              synced++;
            } catch (e) { 
              console.error('[Routine Sync] Failed:', r.title, e.message); 
            }
          }
          console.log(`[Routine Sync] Synced ${synced}/${missingOnServer.length} missing routines`);
          // Merge and update
          const merged = [...serverRoutines, ...missingOnServer];
          setRoutines(merged);
          localStorage.setItem('pawcare_routines', JSON.stringify(merged));
        }
      } else {
        // Server is empty (DB was reset on deploy) — sync ALL local routines to server
        console.log(`[Routine Sync] ⚠️ Server EMPTY! Syncing ${localRoutines.length} routines from localStorage...`);
        setRoutines(localRoutines);
        localStorage.setItem('pawcare_routines', JSON.stringify(localRoutines));
        
        // Sync each routine to backend (so cron job can find them)
        let syncSuccess = 0;
        let syncFailed = 0;
        for (const r of localRoutines) {
          try { 
            await api.createRoutine({ 
              id: r.id,
              title: r.title,
              type: r.type || 'custom',
              time: r.time,
              enabled: (r.enabled === false || r.enabled === 0) ? 0 : 1
            }); 
            syncSuccess++;
          } catch (e) { 
            syncFailed++;
            console.error('[Routine Sync] ❌ Failed:', r.title, e.message); 
          }
        }
        console.log(`[Routine Sync] ✅ Complete: ${syncSuccess} synced, ${syncFailed} failed`);
        
        // VERIFY: Re-fetch from server to confirm routines are there
        try {
          const verifyData = await api.getRoutines();
          const verifyCount = verifyData?.routines?.length || 0;
          console.log(`[Routine Sync] 🔍 Verification: Server now has ${verifyCount} routines`);
          if (verifyCount > 0) {
            // Update local state with server's version (which has proper IDs)
            setRoutines(verifyData.routines);
            localStorage.setItem('pawcare_routines', JSON.stringify(verifyData.routines));
          }
        } catch (e) {
          console.error('[Routine Sync] Verification failed:', e.message);
        }
      }
    } catch (err) {
      console.error('Failed to load routines', err);
      const saved = localStorage.getItem('pawcare_routines');
      setRoutines(saved ? JSON.parse(saved) : defaultRoutines);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRoutines();
  }, []);

  const refreshRoutines = () => loadRoutines();

  const updateRoutine = async (id, updates) => {
    const updated = routines.map(r => r.id === id ? { ...r, ...updates } : r);
    setRoutines(updated);
    localStorage.setItem('pawcare_routines', JSON.stringify(updated));
    
    try {
      // Send the FULL routine object to backend (not just partial updates)
      // Backend expects: title, time, enabled, type — missing fields become NULL
      const fullRoutine = updated.find(r => r.id === id);
      if (fullRoutine) {
        await api.updateRoutine(id, {
          title: fullRoutine.title,
          time: fullRoutine.time,
          enabled: fullRoutine.enabled,
          type: fullRoutine.type
        });
      }
    } catch (err) {
      console.error('Failed to sync routine update', err);
    }
  };

  const toggleRoutine = async (id, enabled) => {
    const updated = routines.map(r => r.id === id ? { ...r, enabled } : r);
    setRoutines(updated);
    localStorage.setItem('pawcare_routines', JSON.stringify(updated));
    
    try {
      await api.toggleRoutine(id, enabled);
    } catch (err) {
      console.error('Failed to toggle routine', err);
    }
  };

  const addRoutine = async (routine) => {
    try {
      const res = await api.createRoutine(routine);
      const saved = res.routine || { ...routine, enabled: true };
      const updated = [...routines, saved];
      setRoutines(updated);
      localStorage.setItem('pawcare_routines', JSON.stringify(updated));
      return saved;
    } catch (err) {
      const updated = [...routines, routine];
      setRoutines(updated);
      localStorage.setItem('pawcare_routines', JSON.stringify(updated));
      throw err;
    }
  };

  const deleteRoutine = async (id) => {
    const updated = routines.filter(r => r.id !== id);
    setRoutines(updated);
    localStorage.setItem('pawcare_routines', JSON.stringify(updated));
    
    try {
      await api.deleteRoutine(id);
    } catch (err) {
      console.error('Failed to delete routine', err);
    }
  };

  return (
    <RoutineContext.Provider value={{ 
      routines, 
      loading, 
      refreshRoutines, 
      updateRoutine, 
      toggleRoutine, 
      addRoutine, 
      deleteRoutine 
    }}>
      {children}
    </RoutineContext.Provider>
  );
}

export function useRoutines() {
  const context = useContext(RoutineContext);
  if (!context) throw new Error('useRoutines must be used within RoutineProvider');
  return context;
}
