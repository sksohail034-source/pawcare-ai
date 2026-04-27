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
      if (data && data.routines && data.routines.length > 0) {
        setRoutines(data.routines);
        localStorage.setItem('pawcare_routines', JSON.stringify(data.routines));
      } else {
        const saved = localStorage.getItem('pawcare_routines');
        const initial = saved ? JSON.parse(saved) : defaultRoutines;
        setRoutines(initial);
        localStorage.setItem('pawcare_routines', JSON.stringify(initial));
        
        // Sync defaults to server in background
        initial.forEach(r => api.createRoutine(r).catch(() => {}));
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
      await api.updateRoutine(id, updates);
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
