import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, CheckCircle, Lock, Crown, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { dogTraining, catTraining } from '../trainingData';

const STORAGE_KEY = 'pawcare_training_progress';

function getProgress() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; } catch { return {}; }
}
function saveProgress(p) { localStorage.setItem(STORAGE_KEY, JSON.stringify(p)); }

export default function TrainingPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isPaid = user?.subscription === 'pro' || user?.subscription === 'enterprise' || user?.subscription === 'basic';
  const [pet, setPet] = useState('dog');
  const [month, setMonth] = useState(1);
  const [progress, setProgress] = useState(getProgress());
  const [playingVideo, setPlayingVideo] = useState(null);

  const schedule = pet === 'dog' ? dogTraining : catTraining;
  const current = schedule.find(m => m.month === month);

  const toggleWatched = (videoId) => {
    const key = `${pet}_${month}_${videoId}`;
    const next = { ...progress, [key]: !progress[key] };
    setProgress(next);
    saveProgress(next);
  };

  const isWatched = (videoId) => !!progress[`${pet}_${month}_${videoId}`];

  const getMonthProgress = (m) => {
    const data = schedule.find(s => s.month === m);
    if (!data) return 0;
    const done = data.videos.filter(v => progress[`${pet}_${m}_${v.id}`]).length;
    return Math.round((done / data.videos.length) * 100);
  };

  const totalDone = schedule.reduce((sum, m) => {
    return sum + m.videos.filter(v => progress[`${pet}_${m.month}_${v.id}`]).length;
  }, 0);
  const totalVideos = schedule.reduce((sum, m) => sum + m.videos.length, 0);

  if (!isPaid) {
    return (
      <div className="page-container">
        <div className="page-header">
          <h2 style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            🎬 Training Videos <span className="badge badge-success">Premium</span>
          </h2>
          <p>12-month structured training schedule with expert videos</p>
        </div>
        <div className="card" style={{ textAlign: 'center', padding: 48, marginTop: 24 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>👑</div>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 800, marginBottom: 8 }}>Premium Feature</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: 24, maxWidth: 400, margin: '0 auto 24px' }}>
            The expert training video program is exclusively available on the Basic and Pro plans. Upgrade to unlock step-by-step training for your pet!
          </p>
          <button className="btn btn-primary btn-lg" onClick={() => navigate('/subscriptions')}>
            <Crown size={18} /> Upgrade for Unlimited Access
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h2 style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          🎬 Training Videos
          <span className="badge badge-success">Premium</span>
        </h2>
        <p>12-month structured training schedule with expert videos</p>
      </div>

      {/* Pet Toggle */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        {[
          { key: 'dog', emoji: '🐕', label: 'Dog Training' },
          { key: 'cat', emoji: '🐱', label: 'Cat Training' },
        ].map(p => (
          <button key={p.key} onClick={() => { setPet(p.key); setMonth(1); setPlayingVideo(null); }}
            className={`btn ${pet === p.key ? 'btn-primary' : 'btn-secondary'}`}
            style={{ flex: 1, fontSize: 15, padding: '14px 20px' }}>
            {p.emoji} {p.label}
          </button>
        ))}
      </div>

      {/* Overall Progress */}
      <div className="card" style={{ marginBottom: 24, padding: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <span style={{ fontWeight: 700, fontSize: 14 }}>Overall Progress</span>
          <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{totalDone}/{totalVideos} videos completed</span>
        </div>
        <div style={{ height: 8, background: 'var(--bg-input)', borderRadius: 4, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${(totalDone/totalVideos)*100}%`, background: 'linear-gradient(90deg, var(--primary), var(--primary-light))', borderRadius: 4, transition: 'width 0.5s ease' }} />
        </div>
      </div>

      {/* Month Tabs */}
      <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 8, marginBottom: 24 }}>
        {schedule.map(m => {
          const prog = getMonthProgress(m.month);
          const isActive = month === m.month;
          return (
            <button key={m.month} onClick={() => { setMonth(m.month); setPlayingVideo(null); }}
              style={{
                minWidth: 80, padding: '10px 12px', borderRadius: 'var(--radius-sm)', border: `2px solid ${isActive ? 'var(--primary)' : 'var(--border)'}`,
                background: isActive ? 'rgba(34,197,94,0.08)' : 'var(--bg-card)',
                cursor: 'pointer', textAlign: 'center', flexShrink: 0, position: 'relative',
              }}>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>Month</div>
              <div style={{ fontSize: 20, fontWeight: 800, fontFamily: 'var(--font-display)', color: isActive ? 'var(--primary-dark)' : 'var(--text-main)' }}>{m.month}</div>
              {prog > 0 && <div style={{ height: 3, background: prog === 100 ? 'var(--primary)' : 'var(--warning)', borderRadius: 2, marginTop: 4 }} />}
            </button>
          );
        })}
      </div>

          {/* Current Month Header */}
          <div className="card" style={{ marginBottom: 20, padding: 20, background: 'linear-gradient(135deg, rgba(34,197,94,0.06), rgba(59,130,246,0.04))' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
              <div>
                <div style={{ fontSize: 12, color: 'var(--primary-dark)', fontWeight: 700, marginBottom: 4 }}>
                  MONTH {current?.month} OF 12
                </div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 800, marginBottom: 4 }}>
                  {pet === 'dog' ? '🐕' : '🐱'} {current?.title}
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>{current?.desc}</p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--primary-dark)', fontFamily: 'var(--font-display)' }}>
                  {getMonthProgress(month)}%
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Complete</div>
              </div>
            </div>
            <div style={{ height: 6, background: 'var(--bg-input)', borderRadius: 3, overflow: 'hidden', marginTop: 16 }}>
              <div style={{ height: '100%', width: `${getMonthProgress(month)}%`, background: 'linear-gradient(90deg, var(--primary), var(--primary-light))', borderRadius: 3, transition: 'width 0.5s ease' }} />
            </div>
          </div>

          {/* Video Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {current?.videos.map((video, idx) => (
              <div key={video.id} className="card" style={{ padding: 0, overflow: 'hidden' }}>
                {/* Video Player / Thumbnail */}
                {playingVideo === video.id ? (
                  <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
                    <iframe
                      src={`https://www.youtube.com/embed/${video.id}?autoplay=1&rel=0`}
                      title={video.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                    />
                  </div>
                ) : (
                  <div onClick={() => setPlayingVideo(video.id)}
                    style={{
                      position: 'relative', paddingBottom: '56.25%', height: 0, cursor: 'pointer',
                      background: `url(https://img.youtube.com/vi/${video.id}/hqdefault.jpg) center/cover`,
                    }}>
                    <div style={{
                      position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.3)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <div style={{
                        width: 64, height: 64, borderRadius: '50%', background: 'rgba(255,255,255,0.95)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                      }}>
                        <Play size={28} color="var(--primary-dark)" fill="var(--primary)" />
                      </div>
                    </div>
                    {isWatched(video.id) && (
                      <div style={{ position: 'absolute', top: 8, right: 8, background: 'var(--primary)', color: '#fff', padding: '4px 10px', borderRadius: 'var(--radius-full)', fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
                        <CheckCircle size={12} /> Watched
                      </div>
                    )}
                    <div style={{ position: 'absolute', bottom: 8, right: 8, background: 'rgba(0,0,0,0.8)', color: '#fff', padding: '2px 8px', borderRadius: 4, fontSize: 12, fontWeight: 600 }}>
                      {video.dur}
                    </div>
                  </div>
                )}

                {/* Video Info Bar */}
                <div style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 11, color: 'var(--text-light)', fontWeight: 600, marginBottom: 2 }}>
                      VIDEO {idx + 1} OF {current.videos.length}
                    </div>
                    <h4 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-main)' }}>{video.title}</h4>
                  </div>
                  <button
                    onClick={() => toggleWatched(video.id)}
                    className={`btn btn-sm ${isWatched(video.id) ? 'btn-success' : 'btn-secondary'}`}
                    style={{ whiteSpace: 'nowrap' }}
                  >
                    <CheckCircle size={14} />
                    {isWatched(video.id) ? 'Completed' : 'Mark Done'}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Next Month CTA */}
          {month < 12 && (
            <div style={{ textAlign: 'center', marginTop: 32 }}>
              <button className="btn btn-primary" onClick={() => { setMonth(month + 1); setPlayingVideo(null); window.scrollTo(0, 0); }}>
                Next: Month {month + 1} — {schedule.find(s => s.month === month + 1)?.title}
                <ChevronRight size={18} />
              </button>
            </div>
          )}

          {month === 12 && getMonthProgress(12) === 100 && (
            <div className="card" style={{ textAlign: 'center', padding: 40, marginTop: 24, background: 'linear-gradient(135deg, #dcfce7, #fef9c3)' }}>
              <div style={{ fontSize: 48 }}>🏆</div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 800, marginTop: 8 }}>Training Complete!</h3>
              <p style={{ color: 'var(--text-muted)' }}>Congratulations! You've completed the full 12-month {pet} training program!</p>
            </div>
          )}
    </div>
  );
}
