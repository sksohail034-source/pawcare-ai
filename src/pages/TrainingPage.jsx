import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, CheckCircle, Lock, Crown, ChevronRight, Target, Activity, Home, Navigation, Users, ArrowDownCircle, ShieldAlert, Command, Star, Shield, Brain, Award, PlayCircle } from 'lucide-react';

const shortsCurriculum = [
  { month: 1, title: 'Foundation', topics: ['Name Recognition', 'Focus / Eye Contact', 'Sit Command'], icon: Target },
  { month: 2, title: 'Basic Commands', topics: ['Sit Improve', 'Stay', 'Come When Called'], icon: Activity },
  { month: 3, title: 'Home Training', topics: ['Potty Training', 'Crate Training', 'Stop Biting'], icon: Home },
  { month: 4, title: 'Leash Training', topics: ['Loose Leash Walking', 'Stop Pulling', 'Walking Discipline'], icon: Navigation },
  { month: 5, title: 'Socialization', topics: ['Meeting Other Dogs', 'Meeting Strangers', 'Public Behavior'], icon: Users },
  { month: 6, title: 'Intermediate Commands', topics: ['Down', 'Leave It', 'Drop It'], icon: ArrowDownCircle },
  { month: 7, title: 'Behavior Correction', topics: ['Barking Control', 'Jumping on People', 'Separation Anxiety'], icon: ShieldAlert },
  { month: 8, title: 'Advanced Control', topics: ['Off-Leash Training', 'Distance Commands', 'Hand Signals'], icon: Command },
  { month: 9, title: 'Tricks', topics: ['Shake Hand', 'Roll Over', 'Spin'], icon: Star },
  { month: 10, title: 'Guard & Alert Basics', topics: ['Alert Training', 'Territory Awareness', 'Basic Protection'], icon: Shield },
  { month: 11, title: 'Fitness & Mental', topics: ['Agility', 'Obstacle Training', 'Brain Games'], icon: Brain },
  { month: 12, title: 'Pro Level', topics: ['Advanced Recall', 'Discipline', 'Real-Life Training'], icon: Award }
];
import { useAuth } from '../context/AuthContext';
import { dogTraining, catTraining } from '../trainingData';

const STORAGE_KEY = 'pawcare_training_progress';

function getProgress() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; } catch { return {}; }
}
function saveProgress(p) { localStorage.setItem(STORAGE_KEY, JSON.stringify(p)); }

const getRecommendedGear = (title) => {
  const t = title.toLowerCase();
  if (t.includes('potty') || t.includes('litter')) return { name: 'Premium Training Pads', img: '/images/products/pawpaya-dog-wipes.jpg', link: '/products?category=essentials', price: '₹199' };
  if (t.includes('crate')) return { name: 'Comfort Pet Bed', img: '/images/products/himalaya-healthy-treats.png', link: '/products?category=accessories', price: '₹799' };
  if (t.includes('walk') || t.includes('leash') || t.includes('pulling')) return { name: 'Adjustable Harness', img: '/images/products/captain-zack-anti-tick.jpg', link: '/products?category=accessories', price: '₹549' };
  if (t.includes('bite') || t.includes('chew')) return { name: 'Durable Chew Toy', img: '/images/products/purepet-chew-sticks.png', link: '/products?category=toys', price: '₹299' };
  if (t.includes('grooming') || t.includes('brush')) return { name: 'Slicker Brush Pro', img: '/images/products/slicker-brush-pro.webp', link: '/products?category=grooming', price: '₹249' };
  if (t.includes('health') || t.includes('vet')) return { name: 'Multivitamin Supplements', img: '/images/products/himalaya-multivit.jpeg', link: '/products?category=health', price: '₹219' };
  return { name: 'Training Treats & Rewards', img: '/images/products/pedigree-meat-jerky.png', link: '/products?category=food', price: '₹339' };
};

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

  if (!isPaid && user?.role !== 'admin') {
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

          {/* Milestones & Tasks Section */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16, marginBottom: 24 }}>
            <div className="card" style={{ padding: 20, borderLeft: '4px solid var(--primary)' }}>
              <h4 style={{ fontSize: 16, fontWeight: 800, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                🎯 Monthly Milestones
              </h4>
              <ul style={{ paddingLeft: 20, margin: 0 }}>
                {current?.milestones?.map((m, i) => (
                  <li key={i} style={{ fontSize: 13, color: 'var(--text-main)', marginBottom: 6 }}>{m}</li>
                ))}
              </ul>
            </div>
            <div className="card" style={{ padding: 20, borderLeft: '4px solid #3b82f6' }}>
              <h4 style={{ fontSize: 16, fontWeight: 800, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                📋 Daily Checklist
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {current?.tasks?.map((t, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: 'var(--text-muted)' }}>
                    <div style={{ width: 18, height: 18, borderRadius: 4, border: '2px solid #3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <CheckCircle size={12} color="#3b82f6" />
                    </div>
                    {t}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <h4 style={{ fontFamily: 'var(--font-display)', marginBottom: 16, fontSize: 18, fontWeight: 800 }}>
            🎥 Video Lessons
          </h4>

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
                    </div>
                    <div style={{
                      position: 'absolute', inset: 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <div style={{
                        width: 56, height: 56, borderRadius: '50%', background: 'rgba(255,255,255,0.95)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                      }}>
                        <Play size={24} color="var(--primary-dark)" fill="var(--primary)" />
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

                {/* Affiliate Suggestion Section */}
                {(() => {
                  const gear = getRecommendedGear(video.title);
                  return (
                    <div style={{ padding: '12px 16px', background: 'rgba(59, 130, 246, 0.04)', borderTop: '1px solid rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ background: '#fff', borderRadius: 8, padding: 2, border: '1px solid rgba(0,0,0,0.08)' }}>
                          <img src={gear.img} alt={gear.name} style={{ width: 44, height: 44, borderRadius: 6, objectFit: 'contain' }} />
                        </div>
                        <div>
                          <div style={{ fontSize: 10, fontWeight: 800, color: '#3b82f6', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 2, display: 'flex', alignItems: 'center', gap: 4 }}>
                            <Crown size={10} /> Recommended Gear
                          </div>
                          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-main)' }}>{gear.name}</div>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--text-main)', marginBottom: 4 }}>{gear.price}</div>
                        <button onClick={() => navigate(gear.link)} className="btn btn-sm btn-primary" style={{ fontSize: 11, padding: '4px 12px', height: 'auto', minHeight: 28 }}>
                          Buy Now
                        </button>
                      </div>
                    </div>
                  );
                })()}
              </div>
            ))}
          </div>

          {/* Quick Tips (Hindi Shorts) Section - Netflix Style */}
          <div style={{ marginTop: 40, paddingTop: 24, borderTop: '2px solid var(--border)', margin: '40px -16px 0 -16px' }}>
            <div style={{ padding: '0 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: 8 }}>
                  📱 Quick Tips (Hindi Shorts)
                </h3>
                <p style={{ fontSize: 13, color: 'var(--text-light)', marginTop: 4 }}>Bite-sized visual guides for rapid revision</p>
              </div>
              <div style={{ background: 'var(--bg-input)', padding: '6px 12px', borderRadius: 20, display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-main)' }}>0%</span>
                <div style={{ width: 60, height: 6, background: 'var(--border)', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{ width: '0%', height: '100%', background: 'var(--primary)' }} />
                </div>
              </div>
            </div>

            {/* Horizontal Scroll Container */}
            <div style={{ 
              display: 'flex', overflowX: 'auto', gap: 20, padding: '0 16px 24px 16px', 
              scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch',
              scrollbarWidth: 'none', msOverflowStyle: 'none'
            }}>
              {shortsCurriculum.map((monthData, mIdx) => {
                const Icon = monthData.icon;
                const mData = schedule.find(m => m.month === monthData.month);
                
                return (
                  <div key={monthData.month} style={{ 
                    flex: '0 0 auto', width: '300px', scrollSnapAlign: 'start',
                    background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, overflow: 'hidden',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
                  }}>
                    {/* Month Header */}
                    <div style={{ padding: 16, borderBottom: '1px solid var(--border)', background: 'var(--bg-input)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        <div style={{ width: 28, height: 28, borderRadius: 8, background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-dark)' }}>
                          <Icon size={16} />
                        </div>
                        <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: 0.5 }}>Month {monthData.month}</div>
                      </div>
                      <h4 style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-main)' }}>{monthData.title}</h4>
                    </div>

                    {/* Topics List */}
                    <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 20 }}>
                      {monthData.topics.map((topic, tIdx) => {
                        const shortId = mData?.videos[tIdx]?.shortVideoId;
                        return (
                        <div key={tIdx}>
                          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-main)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                            <div style={{ width: 18, height: 18, borderRadius: '50%', background: 'var(--border)', color: 'var(--text-light)', fontSize: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>{tIdx + 1}</div>
                            {topic}
                          </div>
                          
                          {/* Video or Placeholder */}
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 10, maxWidth: 180, margin: '0 auto', width: '100%' }}>
                            {shortId ? (
                              playingVideo === shortId ? (
                                <div style={{ position: 'relative', paddingBottom: '177.77%', height: 0, borderRadius: 12, overflow: 'hidden' }}>
                                  <iframe
                                    src={`https://www.youtube.com/embed/${shortId}?autoplay=1&rel=0`}
                                    title={`Short`}
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                                  />
                                </div>
                              ) : (
                                <div onClick={() => setPlayingVideo(shortId)}
                                  style={{
                                    position: 'relative', paddingBottom: '177.77%', height: 0, cursor: 'pointer',
                                    background: `url(https://img.youtube.com/vi/${shortId}/hqdefault.jpg) center/cover`,
                                    borderRadius: 12, overflow: 'hidden'
                                  }}>
                                  <div style={{
                                    position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.3)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                  }}>
                                  </div>
                                  <div style={{
                                    position: 'absolute', inset: 0,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                  }}>
                                    <div style={{
                                      width: 48, height: 48, borderRadius: '50%', background: 'rgba(255,255,255,0.95)',
                                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                                      boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                                    }}>
                                      <Play size={20} color="var(--primary-dark)" fill="var(--primary)" />
                                    </div>
                                  </div>
                                </div>
                              )
                            ) : (
                              <div style={{ background: 'var(--bg-input)', borderRadius: 12, paddingBottom: '177%', position: 'relative', overflow: 'hidden', border: '2px dashed var(--border)' }}>
                                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', background: 'rgba(0,0,0,0.02)' }}>
                                  <PlayCircle size={32} style={{ marginBottom: 8, opacity: 0.5 }} />
                                  <span style={{ fontSize: 12, fontWeight: 700 }}>Coming Soon</span>
                                </div>
                              </div>
                            )}
                          </div>
                          
                          {/* Mark as Completed Toggle (Disabled) */}
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 12, padding: '8px 10px', background: 'var(--bg-input)', borderRadius: 8, opacity: 0.6, cursor: 'not-allowed' }}>
                            <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-light)' }}>Mark as Completed</span>
                            <div style={{ width: 32, height: 18, background: 'var(--border)', borderRadius: 16, position: 'relative' }}>
                              <div style={{ width: 14, height: 14, background: '#fff', borderRadius: '50%', position: 'absolute', top: 2, left: 2, boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
                            </div>
                          </div>
                        </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* CSS to hide scrollbar */}
            <style>{`
              div::-webkit-scrollbar { display: none; }
            `}</style>
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
