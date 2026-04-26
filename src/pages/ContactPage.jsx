import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, MessageSquare, Phone } from 'lucide-react';

export default function ContactPage() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-main)', padding: '40px 20px' }}>
      <div style={{ maxWidth: 800, margin: '0 auto', background: '#fff', padding: 40, borderRadius: 24, boxShadow: 'var(--shadow-md)' }}>
        <button className="btn btn-ghost" style={{ marginBottom: 24 }} onClick={() => navigate(-1)}>
          <ArrowLeft size={18} /> Back
        </button>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 32, marginBottom: 8 }}>Help Center & Contact Us</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: 32 }}>We're here to help you and your furry friends!</p>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24, marginBottom: 40 }}>
          <div className="card" style={{ padding: 24, textAlign: 'center', background: 'var(--bg-main)' }}>
            <div style={{ width: 48, height: 48, background: 'rgba(34,197,94,0.1)', color: 'var(--primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <Mail size={24} />
            </div>
            <h3 style={{ fontSize: 18, marginBottom: 8 }}>Email Support</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 16 }}>For general queries and billing issues.</p>
            <a href="mailto:support@pawcare.ai" style={{ fontWeight: 600, color: 'var(--primary)' }}>support@pawcare.ai</a>
          </div>
          
          <div className="card" style={{ padding: 24, textAlign: 'center', background: 'var(--bg-main)' }}>
            <div style={{ width: 48, height: 48, background: 'rgba(59,130,246,0.1)', color: '#3b82f6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <MessageSquare size={24} />
            </div>
            <h3 style={{ fontSize: 18, marginBottom: 8 }}>Live Chat</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 16 }}>Chat with our AI bot or a human agent.</p>
            <button className="btn btn-primary btn-sm" onClick={() => navigate('/login')}>Login to Chat</button>
          </div>
          
          <div className="card" style={{ padding: 24, textAlign: 'center', background: 'var(--bg-main)' }}>
            <div style={{ width: 48, height: 48, background: 'rgba(168,85,247,0.1)', color: '#a855f7', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <Phone size={24} />
            </div>
            <h3 style={{ fontSize: 18, marginBottom: 8 }}>Phone Support</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 16 }}>Available for Pro plan subscribers.</p>
            <span style={{ fontSize: 14, color: 'var(--text-light)' }}>Mon-Fri, 9am - 5pm</span>
          </div>
        </div>
        
        <h3 style={{ marginTop: 24, marginBottom: 16 }}>Frequently Asked Questions</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ padding: 16, border: '1px solid var(--border)', borderRadius: 12 }}>
            <h4 style={{ marginBottom: 8 }}>How accurate is the AI scanner?</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Our AI model is trained on thousands of verified vet images and achieves over 92% accuracy. However, it should not replace a professional vet diagnosis.</p>
          </div>
          <div style={{ padding: 16, border: '1px solid var(--border)', borderRadius: 12 }}>
            <h4 style={{ marginBottom: 8 }}>Can I change my subscription plan later?</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Yes, you can upgrade, downgrade, or cancel your subscription at any time from the Subscriptions page in your dashboard.</p>
          </div>
          <div style={{ padding: 16, border: '1px solid var(--border)', borderRadius: 12 }}>
            <h4 style={{ marginBottom: 8 }}>Do you support pets other than dogs and cats?</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Currently, our AI and training models are highly optimized for dogs and cats. We also offer basic profile support for Birds, Rabbits, Guinea Pigs, Hamsters, and Goats.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
