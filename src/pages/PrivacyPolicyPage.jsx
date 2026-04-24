import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, Lock, Eye, Trash2, Mail } from 'lucide-react';

export default function PrivacyPolicyPage() {
  const navigate = useNavigate();

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '32px 20px', color: 'var(--text-main)' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
        <button onClick={() => navigate(-1)} style={{
          width: 40, height: 40, borderRadius: '50%', background: 'var(--bg-card)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: '1px solid var(--border)', cursor: 'pointer'
        }}>
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 800 }}>Privacy Policy</h1>
          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Last updated: April 25, 2026</p>
        </div>
      </div>

      {/* Key Points */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: 12, marginBottom: 32
      }}>
        {[
          { icon: <Shield size={20} />, title: 'Data Protected', desc: 'Your data is encrypted & secure' },
          { icon: <Lock size={20} />, title: 'No Selling', desc: 'We never sell your personal data' },
          { icon: <Eye size={20} />, title: 'Transparent', desc: 'Clear about what we collect' },
          { icon: <Trash2 size={20} />, title: 'Your Control', desc: 'Delete your data anytime' },
        ].map((item, i) => (
          <div key={i} style={{
            background: 'var(--bg-card)', borderRadius: 'var(--radius-md)',
            padding: 16, border: '1px solid var(--border)', textAlign: 'center'
          }}>
            <div style={{
              width: 40, height: 40, borderRadius: 10, background: 'rgba(34,197,94,0.1)',
              color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 8px'
            }}>{item.icon}</div>
            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 2 }}>{item.title}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{item.desc}</div>
          </div>
        ))}
      </div>

      {/* Policy Content */}
      <div style={{
        background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)',
        padding: 28, border: '1px solid var(--border)', lineHeight: 1.8
      }}>
        <Section title="1. Introduction">
          Welcome to <strong>PawCare AI</strong> ("we," "our," or "us"). We are committed to protecting
          your personal information and your right to privacy. This Privacy Policy explains what
          information we collect, how we use it, and what rights you have in relation to it.
          By using PawCare AI, you agree to the collection and use of information in accordance with this policy.
        </Section>

        <Section title="2. Information We Collect">
          <SubSection title="2.1 Personal Information">
            When you register and use PawCare AI, we may collect:
            <PolicyList items={[
              'Name, email address, and phone number (for account creation)',
              'Password (stored securely using industry-standard encryption)',
              'Payment information (processed securely via Razorpay — we do not store card details)',
              'Profile preferences and subscription plan details',
            ]} />
          </SubSection>

          <SubSection title="2.2 Pet Information">
            <PolicyList items={[
              'Pet name, type, breed, age, and weight',
              'Pet photos (used for AI analysis — processed securely)',
              'Health records, vaccination history, and medication details',
              'Exercise and routine data',
            ]} />
          </SubSection>

          <SubSection title="2.3 Automatically Collected Information">
            <PolicyList items={[
              'Device information (type, operating system, browser)',
              'Location data (only when you use the Emergency Vet Locator feature, with your permission)',
              'Usage data (pages visited, features used, time spent)',
              'Cookies and similar tracking technologies',
            ]} />
          </SubSection>
        </Section>

        <Section title="3. How We Use Your Information">
          We use the collected information for:
          <PolicyList items={[
            'Providing and maintaining our pet care services',
            'AI-powered pet health analysis and breed identification',
            'Sending vaccination and medication reminders',
            'Personalizing exercise plans and care protocols',
            'Processing payments and managing subscriptions',
            'Improving our services and user experience',
            'Communicating with you about updates and features',
            'Ensuring the security of your account',
          ]} />
        </Section>

        <Section title="4. Third-Party Services">
          We use the following third-party services:
          <PolicyList items={[
            'Razorpay — Payment processing (subject to Razorpay\'s privacy policy)',
            'Google AdSense — Advertising for free-tier users (subject to Google\'s privacy policy)',
            'Google Maps/Nominatim — Location services for Emergency Vet Locator',
            'AI/ML Services — For pet photo analysis and health insights',
          ]} />
          <p style={{ marginTop: 8, fontSize: 14 }}>
            We do not sell, trade, or rent your personal information to third parties. Third-party
            services only receive the minimum data necessary to provide their specific service.
          </p>
        </Section>

        <Section title="5. Data Security">
          We implement industry-standard security measures including:
          <PolicyList items={[
            'Encryption of data in transit (HTTPS/TLS)',
            'Secure password hashing (bcrypt)',
            'JWT-based authentication tokens',
            'Regular security audits and updates',
            'Access controls and data minimization',
          ]} />
        </Section>

        <Section title="6. Your Rights">
          You have the right to:
          <PolicyList items={[
            'Access your personal data at any time through your account',
            'Update or correct your information',
            'Request deletion of your account and all associated data',
            'Opt out of marketing communications',
            'Withdraw consent for location tracking',
            'Export your pet health data',
          ]} />
          <p style={{ marginTop: 8, fontSize: 14 }}>
            To exercise any of these rights, contact us at <strong>support@pawcareai.com</strong>
          </p>
        </Section>

        <Section title="7. Data Retention">
          We retain your personal information only for as long as necessary to provide our services.
          When you delete your account, all associated data is permanently removed from our servers
          within 30 days.
        </Section>

        <Section title="8. Children's Privacy">
          PawCare AI is not intended for children under 13 years of age. We do not knowingly collect
          personal information from children under 13. If we discover that a child under 13 has
          provided us with personal information, we will delete it immediately.
        </Section>

        <Section title="9. Advertising">
          Free-tier users may see advertisements powered by Google AdSense. These ads may use cookies
          and similar technologies to serve relevant content. Pro and Enterprise subscribers enjoy an
          ad-free experience. You can manage your ad preferences through your device settings or
          Google's ad settings page.
        </Section>

        <Section title="10. Changes to This Policy">
          We may update this Privacy Policy from time to time. We will notify you of any significant
          changes by posting the new policy on this page and updating the "Last Updated" date.
          Continued use of PawCare AI after changes constitutes acceptance of the updated policy.
        </Section>

        <Section title="11. Compliance">
          This privacy policy complies with:
          <PolicyList items={[
            'Digital Personal Data Protection (DPDP) Act, 2023 (India)',
            'Information Technology Act, 2000 (India)',
            'Google Play Store Developer Program Policies',
            'General Data Protection Regulation (GDPR) — for EU users',
          ]} />
        </Section>

        <Section title="12. Contact Us">
          <p>If you have any questions about this Privacy Policy, please contact us:</p>
          <div style={{
            background: 'var(--bg-app)', borderRadius: 12, padding: 16, marginTop: 12,
            display: 'flex', alignItems: 'center', gap: 12
          }}>
            <div style={{
              width: 40, height: 40, borderRadius: 10, background: 'rgba(34,197,94,0.1)',
              color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <Mail size={20} />
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>Email Support</div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>support@pawcareai.com</div>
            </div>
          </div>
        </Section>
      </div>

      {/* Footer */}
      <div style={{ textAlign: 'center', padding: '24px 0', fontSize: 12, color: 'var(--text-light)' }}>
        © {new Date().getFullYear()} PawCare AI. All rights reserved.
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <h2 style={{
        fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700,
        marginBottom: 12, color: 'var(--primary-dark)',
        paddingBottom: 8, borderBottom: '1px solid var(--border)'
      }}>{title}</h2>
      <div style={{ fontSize: 14, color: 'var(--text-main)' }}>{children}</div>
    </div>
  );
}

function SubSection({ title, children }) {
  return (
    <div style={{ marginTop: 12, marginBottom: 8 }}>
      <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>{title}</h3>
      {children}
    </div>
  );
}

function PolicyList({ items }) {
  return (
    <ul style={{ paddingLeft: 20, margin: '8px 0' }}>
      {items.map((item, i) => (
        <li key={i} style={{ fontSize: 14, marginBottom: 4, color: 'var(--text-muted)' }}>{item}</li>
      ))}
    </ul>
  );
}
