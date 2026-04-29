import { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api';
import { subscribeToPush } from '../utils/push';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('pawcare_token'));
  const [loading, setLoading] = useState(true);

  // Sync user data from localStorage backup after DB reset
  const syncUserData = async (serverUser) => {
    const backup = localStorage.getItem('pawcare_user_backup');
    if (!backup) return;

    try {
      const local = JSON.parse(backup);
      const needsRestore = 
        (local.scan_count > (serverUser.scan_count || 0)) ||
        (local.ad_bonus_scans > (serverUser.ad_bonus_scans || 0)) ||
        (['basic', 'pro', 'enterprise'].includes(local.subscription) && serverUser.subscription === 'free');
      
      if (needsRestore) {
        console.log('[Auth Sync] Restoring user data from backup...', { local, server: serverUser });
        const restored = await api.restoreUserData({
          scan_count: local.scan_count || 0,
          ad_bonus_scans: local.ad_bonus_scans || 0,
          subscription: local.subscription || 'free'
        });
        
        // Update user with restored values
        if (restored.success) {
          serverUser.scan_count = restored.scan_count;
          serverUser.ad_bonus_scans = restored.ad_bonus_scans;
          serverUser.subscription = restored.subscription;
          console.log('[Auth Sync] ✅ Data restored successfully');
        }
      }
    } catch (e) {
      console.error('[Auth Sync] Restore failed:', e.message);
    }
  };

  // Save user data backup to localStorage
  const backupUserData = (userData) => {
    if (userData) {
      localStorage.setItem('pawcare_user_backup', JSON.stringify({
        scan_count: userData.scan_count || 0,
        ad_bonus_scans: userData.ad_bonus_scans || 0,
        subscription: userData.subscription || 'free'
      }));
    }
  };

  // Sync pets from localStorage to server after DB reset
  const syncPets = async () => {
    try {
      const serverPets = await api.getPets();
      const serverPetList = serverPets?.pets || serverPets || [];
      const localPets = JSON.parse(localStorage.getItem('pawcare_pets_backup') || '[]');
      
      if (serverPetList.length === 0 && localPets.length > 0) {
        console.log(`[Pet Sync] Server empty, restoring ${localPets.length} pets from backup...`);
        for (const pet of localPets) {
          try {
            await api.createPet(pet);
          } catch (e) {
            console.error('[Pet Sync] Failed:', pet.name, e.message);
          }
        }
        console.log('[Pet Sync] ✅ Pets restored');
      } else if (serverPetList.length > 0) {
        // Backup server pets to localStorage
        localStorage.setItem('pawcare_pets_backup', JSON.stringify(serverPetList));
      }
    } catch (e) {
      console.error('[Pet Sync] Error:', e.message);
    }
  };

  useEffect(() => {
    if (token) {
      api.getMe()
        .then(async (data) => {
          await syncUserData(data.user);
          backupUserData(data.user);
          setUser(data.user);
          subscribeToPush();
          syncPets();
        })
        .catch(() => {
          localStorage.removeItem('pawcare_token');
          setToken(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token]);

  // Step 1 of login — returns OTP requirement
  const loginStep1 = async (email, password) => {
    const data = await api.login({ email, password });
    return data; // { requiresOTP: true, otpId, message, devOTP? }
  };

  // Step 1 of register — returns OTP requirement
  const registerStep1 = async (name, email, password, phone, country_code) => {
    const data = await api.register({ name, email, password, phone, country_code });
    return data; // { requiresOTP: true, otpId, message, devOTP? }
  };

  // Step 2 — verify OTP and complete login/register
  const verifyOTP = async (email, otp) => {
    const data = await api.verifyOTP({ email, otp });
    if (data.token) {
      localStorage.setItem('pawcare_token', data.token);
      setToken(data.token);
      setUser(data.user);
      backupUserData(data.user);
      subscribeToPush();
      return data;
    }
    throw new Error('Verification failed');
  };

  // Legacy login (kept for compatibility — used internally)
  const login = async (email, password) => {
    const data = await api.login({ email, password });
    if (data.token) {
      localStorage.setItem('pawcare_token', data.token);
      setToken(data.token);
      setUser(data.user);
      backupUserData(data.user);
      subscribeToPush();
    }
    return data;
  };

  // Legacy register
  const register = async (name, email, password, phone, country_code) => {
    const data = await api.register({ name, email, password, phone, country_code });
    if (data.token) {
      localStorage.setItem('pawcare_token', data.token);
      setToken(data.token);
      setUser(data.user);
      backupUserData(data.user);
      subscribeToPush();
    }
    return data;
  };

  const logout = () => {
    localStorage.removeItem('pawcare_token');
    setToken(null);
    setUser(null);
  };

  const updateUser = (updates) => {
    setUser(prev => {
      const updated = { ...prev, ...updates };
      backupUserData(updated);
      return updated;
    });
  };

  return (
    <AuthContext.Provider value={{ 
      user, token, loading, 
      login, register, loginStep1, registerStep1, verifyOTP,
      logout, updateUser 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
