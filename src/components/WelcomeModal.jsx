import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, PawPrint, Bell, ArrowRight } from 'lucide-react';

export default function WelcomeModal({ onClose }) {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);

  const steps = [
    {
      icon: <Sparkles size={48} style={{ color: 'var(--primary)' }} />,
      title: 'Welcome to PawCare! 🐾',
      desc: 'Your AI-powered companion for smarter, easier pet care.',
    },
    {
      icon: <PawPrint size={48} style={{ color: 'var(--primary)' }} />,
      title: 'Add Your First Pet',
      desc: 'Create a profile to get personalized AI health and care insights.',
    },
    {
      icon: <Bell size={48} style={{ color: 'var(--primary)' }} />,
      title: 'Never Miss a Beat',
      desc: 'We will help you track vaccinations, routines, and exercises.',
    }
  ];

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      onClose();
      navigate('/pets'); // Redirect to add pet
    }
  };

  return (
    <div className="modal-overlay" style={{ zIndex: 9999 }}>
      <div className="modal card" style={{ textAlign: 'center', padding: '40px 24px', maxWidth: 400 }}>
        <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'center' }}>
          <div style={{ background: 'var(--bg-input)', padding: 24, borderRadius: '50%' }}>
            {steps[step].icon}
          </div>
        </div>
        <h2 style={{ fontFamily: 'var(--font-display)', marginBottom: 12 }}>{steps[step].title}</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: 32, lineHeight: 1.5 }}>
          {steps[step].desc}
        </p>
        
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 32 }}>
          {steps.map((_, i) => (
            <div key={i} style={{
              width: i === step ? 24 : 8,
              height: 8,
              borderRadius: 4,
              background: i === step ? 'var(--primary)' : 'var(--border)',
              transition: 'all 0.3s ease'
            }} />
          ))}
        </div>

        <button className="btn btn-primary btn-full btn-lg" onClick={handleNext} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8 }}>
          {step === steps.length - 1 ? "Let's Go!" : 'Next'}
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
}
