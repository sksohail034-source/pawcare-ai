import { useState, useEffect } from 'react';
import { api } from '../api';
import toast from 'react-hot-toast';

export default function AdModal({ onClose, onReward, title = 'Watch Ad', subtitle = 'Watch this ad to unlock features' }) {
  const [timer, setTimer] = useState(15);
  const [completed, setCompleted] = useState(false);
  const [adId, setAdId] = useState(null);

  useEffect(() => {
    api.startAd().then(d => setAdId(d.adId)).catch(() => {});
    const interval = setInterval(() => {
      setTimer(prev => { if (prev <= 1) { clearInterval(interval); setCompleted(true); return 0; } return prev - 1; });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  async function claimReward() {
    try { 
      const d = await api.completeAd(adId); 
      toast.success(d.message); 
      onReward(); 
    } catch (err) { 
      toast.error(err.message || 'Failed to claim reward'); 
    }
    onClose();
  }

  return (
    <div className="modal-overlay">
      <div className="modal ad-modal" onClick={e => e.stopPropagation()}>
        {!completed ? (
          <>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 20, marginBottom: 8 }}>📺 {title}...</h3>
            <p style={{ color: 'var(--text-muted)' }}>{subtitle}</p>
            <div className="ad-timer">{timer}s</div>
            <div className="ad-progress"><div className="ad-progress-fill" style={{ width: `${((15 - timer) / 15) * 100}%` }}></div></div>
            <div style={{ background: 'var(--bg-input)', borderRadius: 16, padding: 40, margin: '16px 0' }}>
              <p style={{ fontSize: 24 }}>🐾</p><p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 8 }}>Premium pet care awaits...</p>
            </div>
          </>
        ) : (
          <>
            <div style={{ fontSize: 64, marginBottom: 16 }}>🎉</div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 22, marginBottom: 8 }}>Ad Complete!</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: 24 }}>Reward unlocked successfully.</p>
            <button className="btn btn-primary btn-full" onClick={claimReward}>Claim Reward 🐾</button>
          </>
        )}
      </div>
    </div>
  );
}
