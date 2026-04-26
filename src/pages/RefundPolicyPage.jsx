import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function RefundPolicyPage() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-main)', padding: '40px 20px' }}>
      <div style={{ maxWidth: 800, margin: '0 auto', background: '#fff', padding: 40, borderRadius: 24, boxShadow: 'var(--shadow-md)' }}>
        <button className="btn btn-ghost" style={{ marginBottom: 24 }} onClick={() => navigate(-1)}>
          <ArrowLeft size={18} /> Back
        </button>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 32, marginBottom: 24 }}>Refund & Cancellation Policy</h1>
        <div style={{ lineHeight: 1.8, color: 'var(--text-main)' }}>
          <p><strong>Last Updated: April 2026</strong></p>
          <p>Thank you for subscribing to PawCare AI. We want to ensure you have a transparent experience with our billing and refunds.</p>
          
          <h3 style={{ marginTop: 24, marginBottom: 12 }}>1. Subscription Cancellations</h3>
          <p>You can cancel your subscription at any time. When you cancel, your premium features will remain active until the end of your current billing cycle. We do not charge cancellation fees.</p>
          
          <h3 style={{ marginTop: 24, marginBottom: 12 }}>2. Refund Eligibility</h3>
          <p>We offer a strict 7-day money-back guarantee for your first subscription purchase if you are unsatisfied with the service. To request a refund, please contact our support team within 7 days of your initial purchase.</p>
          
          <h3 style={{ marginTop: 24, marginBottom: 12 }}>3. Non-Refundable Items</h3>
          <p>The following are not eligible for refunds:</p>
          <ul style={{ paddingLeft: 20 }}>
            <li>Subscription renewals (unless canceled prior to the renewal date)</li>
            <li>Partial months of service</li>
            <li>Accounts terminated due to a violation of our Terms of Service</li>
          </ul>
          
          <h3 style={{ marginTop: 24, marginBottom: 12 }}>4. How to Request a Refund</h3>
          <p>To request a refund, please email us at <strong>support@pawcare.ai</strong> with your account details and reason for the request. We aim to process all requests within 3-5 business days.</p>
        </div>
      </div>
    </div>
  );
}
