import { useState, useEffect } from 'react';
import { api } from '../api';
import { formatDate } from '../utils';
import { Heart, ShieldCheck, Gift, ArrowRight, Camera } from 'lucide-react';
import toast from 'react-hot-toast';

export default function DonationsPage() {
  const [history, setHistory] = useState([]);
  const [totalDonated, setTotalDonated] = useState(0);

  useEffect(() => {
    api.getDonationHistory()
      .then(histData => {
        setHistory(histData.donations || []);
        setTotalDonated(histData.totalDonated || 0);
      }).catch(console.error);
  }, []);

  // Replace this with your actual Razorpay Payment Link
  const razorpayLink = "https://rzp.io/l/pawcare-support";

  const galleryImages = [
    {
      url: "https://images.pexels.com/photos/35020401/pexels-photo-35020401.jpeg?auto=compress&cs=tinysrgb&w=600&auto=format&fit=crop",
      alt: "Street dog nursing her puppies in India"
    },
    {
      url: "https://images.pexels.com/photos/15295292/pexels-photo-15295292.jpeg?auto=compress&cs=tinysrgb&w=600&auto=format&fit=crop",
      alt: "Feeding stray dogs at Chennai Marina Beach"
    },
    {
      url: "https://images.pexels.com/photos/36090473/pexels-photo-36090473.jpeg?auto=compress&cs=tinysrgb&w=600&auto=format&fit=crop",
      alt: "Feeding a stray cat in Kerala"
    },
    {
      url: "https://images.pexels.com/photos/32513713/pexels-photo-32513713.jpeg?auto=compress&cs=tinysrgb&w=600&auto=format&fit=crop",
      alt: "Kittens feeding on a dusty Indian street"
    }
  ];

  return (
    <div className="page-container">
      <div className="page-header" style={{ textAlign: 'center', marginBottom: 40 }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: 12 }}>
          Support Stray Animals ❤️
        </h1>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', maxWidth: 600, margin: '0 auto' }}>
          Make a real difference in the lives of hungry and homeless stray animals around you.
        </p>
      </div>

      {/* Main Donation Card */}
      <div className="donation-hero-card" style={{
        background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
        borderRadius: '32px',
        padding: '60px 40px',
        color: 'white',
        textAlign: 'center',
        boxShadow: '0 25px 50px -12px rgba(34, 197, 94, 0.4)',
        position: 'relative',
        overflow: 'hidden',
        marginBottom: 60
      }}>
        {/* Decorative Circles */}
        <div style={{ position: 'absolute', top: -100, right: -100, width: 300, height: 300, background: 'rgba(255,255,255,0.1)', borderRadius: '50%' }}></div>
        <div style={{ position: 'absolute', bottom: -50, left: -50, width: 200, height: 200, background: 'rgba(255,255,255,0.05)', borderRadius: '50%' }}></div>

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ 
            width: 80, 
            height: 80, 
            background: 'white', 
            borderRadius: '24px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            margin: '0 auto 24px',
            color: '#22c55e',
            boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
          }}>
            <Heart size={40} fill="currentColor" />
          </div>

          <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: 16 }}>Every Life Matters</h2>
          
          <p style={{ fontSize: '1.1rem', opacity: 0.95, maxWidth: 600, margin: '0 auto 24px', lineHeight: 1.6 }}>
            Every day, thousands of stray dogs and cats sleep hungry on the streets. 
            Your small contribution can provide them food, shelter, and medical care.
          </p>

          <div style={{ 
            background: 'rgba(255,255,255,0.15)', 
            padding: '16px 24px', 
            borderRadius: '16px', 
            display: 'inline-block',
            marginBottom: 32,
            border: '1px solid rgba(255,255,255,0.3)',
            fontStyle: 'italic',
            fontWeight: 500
          }}>
            "Even a small contribution of yours can save an innocent life today." ❤️
          </div>

          <div>
            <a 
              href={razorpayLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn"
              style={{ 
                background: 'white', 
                color: '#16a34a', 
                padding: '18px 48px', 
                borderRadius: '16px', 
                fontSize: '1.2rem', 
                fontWeight: 800,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 12,
                boxShadow: '0 15px 30px rgba(0,0,0,0.15)',
                border: 'none',
                textDecoration: 'none',
                transition: 'transform 0.2s'
              }}
              onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
            >
              👉 Donate Now <ArrowRight size={24} />
            </a>
          </div>

          <p style={{ marginTop: 24, fontSize: '0.9rem', opacity: 0.8, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
            <ShieldCheck size={16} /> 100% of your donation goes towards feeding and protecting stray animals.
          </p>
        </div>
      </div>

      <div className="grid-2" style={{ gap: 32 }}>
        {/* Donation Impact Info */}
        <div className="card" style={{ padding: 32 }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <Gift className="text-primary" /> Where your money goes
          </h3>
          <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <li style={{ display: 'flex', gap: 12 }}>
              <div style={{ color: 'var(--primary)', fontWeight: 800 }}>•</div>
              <div><strong>Nutritious Meals:</strong> Providing daily fresh food to hungry strays.</div>
            </li>
            <li style={{ display: 'flex', gap: 12 }}>
              <div style={{ color: 'var(--primary)', fontWeight: 800 }}>•</div>
              <div><strong>Medical Aid:</strong> Treatment for injured or sick animals on the streets.</div>
            </li>
            <li style={{ display: 'flex', gap: 12 }}>
              <div style={{ color: 'var(--primary)', fontWeight: 800 }}>•</div>
              <div><strong>Winter Shelter:</strong> Warm beds and blankets during harsh cold months.</div>
            </li>
            <li style={{ display: 'flex', gap: 12 }}>
              <div style={{ color: 'var(--primary)', fontWeight: 800 }}>•</div>
              <div><strong>Sterilization:</strong> Helping control the stray population humanely.</div>
            </li>
          </ul>
        </div>

        {/* Total stats if any */}
        {totalDonated > 0 ? (
          <div className="card" style={{ padding: 32, textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ fontSize: 14, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Your Impact</div>
            <div style={{ fontSize: 48, fontWeight: 900, color: 'var(--primary)' }}>₹{totalDonated.toFixed(2)}</div>
            <p style={{ marginTop: 12, color: 'var(--text-muted)' }}>Thank you for your incredible generosity! 🐾</p>
          </div>
        ) : (
          <div className="card" style={{ padding: 32, textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center', background: 'var(--bg-input)' }}>
            <p style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>
              You haven't made any donations yet. Start your journey of kindness today.
            </p>
          </div>
        )}
      </div>

      {/* Real Impact Photo Gallery */}
      <div style={{ marginTop: 60, marginBottom: 40 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '1.5rem' }}>
            <Camera className="text-primary" size={28} /> Our On-Ground Impact
          </h3>
          <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 600 }}>Real stories, real lives saved</span>
        </div>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '20px' 
        }}>
          {galleryImages.map((img, idx) => (
            <div key={idx} style={{ 
              borderRadius: '20px', 
              overflow: 'hidden', 
              boxShadow: '0 10px 25px rgba(0,0,0,0.08)',
              position: 'relative',
              aspectRatio: '4/3',
              background: '#f1f5f9'
            }}>
              <img 
                src={img.url} 
                alt={img.alt} 
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'cover',
                  transition: 'transform 0.3s ease'
                }} 
                onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
              />
              <div style={{
                position: 'absolute',
                bottom: 0, left: 0, right: 0,
                background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
                padding: '20px 15px 15px',
                color: 'white',
                fontSize: '0.9rem',
                fontWeight: 600,
                pointerEvents: 'none'
              }}>
                {img.alt}
              </div>
            </div>
          ))}
        </div>
        <p style={{ textAlign: 'center', marginTop: 24, fontSize: '0.95rem', color: 'var(--text-muted)' }}>
          These are just a few examples of the beautiful souls that receive meals and care daily thanks to contributors like you.
        </p>
      </div>

      {history.length > 0 && (
        <div style={{ marginTop: 60 }}>
          <h3 style={{ marginBottom: 24 }}>Donation History</h3>
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {history.map(d => (
                  <tr key={d.id}>
                    <td>{formatDate(d.created_at)}</td>
                    <td style={{ fontWeight: 700, color: 'var(--primary)' }}>₹{d.amount?.toFixed(2)}</td>
                    <td><span className="badge badge-success">Completed</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
