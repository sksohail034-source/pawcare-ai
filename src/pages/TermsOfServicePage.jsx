import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function TermsOfServicePage() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-main)', padding: '40px 20px' }}>
      <div style={{ maxWidth: 800, margin: '0 auto', background: '#fff', padding: 40, borderRadius: 24, boxShadow: 'var(--shadow-md)' }}>
        <button className="btn btn-ghost" style={{ marginBottom: 24 }} onClick={() => navigate(-1)}>
          <ArrowLeft size={18} /> Back
        </button>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 32, marginBottom: 24 }}>Terms of Service</h1>
        <div style={{ lineHeight: 1.8, color: 'var(--text-main)' }}>
          <p><strong>Last Updated: April 2026</strong></p>
          <p>Welcome to PawCare AI. By using our application, you agree to these Terms of Service. Please read them carefully.</p>
          
          <h3 style={{ marginTop: 24, marginBottom: 12 }}>1. Acceptance of Terms</h3>
          <p>By accessing or using the PawCare AI mobile application or website, you agree to be bound by these terms.</p>
          
          <h3 style={{ marginTop: 24, marginBottom: 12 }}>2. Not a Substitute for Professional Vet Care</h3>
          <p>PawCare AI provides AI-driven insights based on images and data provided by you. <strong>This service is strictly for informational purposes and does not substitute professional veterinary diagnosis, advice, or treatment.</strong> Always consult a qualified veterinarian for serious health concerns.</p>
          
          <h3 style={{ marginTop: 24, marginBottom: 12 }}>3. Subscriptions & Payments</h3>
          <p>We offer Basic and Pro subscription plans. Payments are processed securely via our payment partners (Stripe/Razorpay). Subscriptions automatically renew unless canceled at least 24 hours before the end of the current period.</p>
          
          <h3 style={{ marginTop: 24, marginBottom: 12 }}>4. User Data & Privacy</h3>
          <p>Your privacy is important to us. We handle all pet data, images, and personal information in accordance with our Privacy Policy.</p>
          
          <h3 style={{ marginTop: 24, marginBottom: 12 }}>5. Limitation of Liability</h3>
          <p>PawCare AI and its developers shall not be held liable for any direct, indirect, incidental, or consequential damages resulting from the use or inability to use our services.</p>
        </div>
      </div>
    </div>
  );
}
