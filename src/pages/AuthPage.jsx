import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const countryCodes = [
  { code: '+1', country: '🇺🇸', name: 'USA' },
  { code: '+91', country: '🇮🇳', name: 'India' },
  { code: '+44', country: '🇬🇧', name: 'UK' },
  { code: '+61', country: '🇦🇺', name: 'Australia' },
  { code: '+86', country: '🇨🇳', name: 'China' },
  { code: '+49', country: '🇩🇪', name: 'Germany' },
  { code: '+33', country: '🇫🇷', name: 'France' },
  { code: '+81', country: '🇯🇵', name: 'Japan' },
  { code: '+82', country: '🇰🇷', name: 'South Korea' },
  { code: '+971', country: '🇦🇪', name: 'UAE' },
];

export default function AuthPage({ mode = 'login' }) {
  const [isLogin, setIsLogin] = useState(mode === 'login');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [countryCode, setCountryCode] = useState('+1');
  const [loading, setLoading] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);
  const { login, register, forgotPassword } = useAuth();
  const navigate = useNavigate();

  const validatePassword = (pwd) => {
    if (pwd.length < 8) return 'Password must be at least 8 characters';
    if (!/[A-Z]/.test(pwd)) return 'Password must contain an uppercase letter';
    if (!/[a-z]/.test(pwd)) return 'Password must contain a lowercase letter';
    if (!/[0-9]/.test(pwd)) return 'Password must contain a number';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isLogin) {
      const pwdError = validatePassword(password);
      if (pwdError) {
        toast.error(pwdError);
        return;
      }
    }

    setLoading(true);
    try {
      if (isLogin) {
        await login(email, password);
        toast.success('Welcome back! 🐾');
      } else {
        await register(name, email, password, phone, countryCode);
        toast.success('Account created! Welcome to PawCare AI! 🎉');
      }
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!forgotEmail) {
      toast.error('Please enter your email');
      return;
    }
    setForgotLoading(true);
    try {
      await forgotPassword(forgotEmail);
      setForgotSent(true);
      toast.success('Password reset link sent to your email!');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setForgotLoading(false);
    }
  };

  if (showForgotPassword) {
    return (
      <div className="auth-page">
        <div className="auth-container">
          <div className="auth-card">
            <div className="auth-header">
              <span className="logo-icon">🔐</span>
              <h2>Reset Password</h2>
              <p>Enter your email to receive a reset link</p>
            </div>

            {forgotSent ? (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>📧</div>
                <h3>Check Your Email!</h3>
                <p style={{ color: 'var(--text-muted)', marginTop: 8 }}>
                  We've sent a password reset link to<br />
                  <strong>{forgotEmail}</strong>
                </p>
                <button 
                  className="btn btn-primary btn-full" 
                  onClick={() => { setShowForgotPassword(false); setForgotSent(false); }}
                  style={{ marginTop: 24 }}
                >
                  Back to Login
                </button>
              </div>
            ) : (
              <form onSubmit={handleForgotPassword}>
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    className="form-input"
                    placeholder="you@example.com"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={forgotLoading}>
                  {forgotLoading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </form>
            )}

            <div className="auth-toggle">
              Remember your password? <button onClick={() => setShowForgotPassword(false)}>Sign In</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <span className="logo-icon">🐾</span>
            <h2>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
            <p>{isLogin ? 'Sign in to your PawCare account' : 'Start your free 14-day trial today'}</p>
          </div>

          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <select 
                      className="form-input" 
                      style={{ width: '110px', flexShrink: 0 }}
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                    >
                      {countryCodes.map(c => (
                        <option key={c.code} value={c.code}>
                          {c.country} {c.code}
                        </option>
                      ))}
                    </select>
                    <input
                      type="tel"
                      className="form-input"
                      placeholder="1234567890"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      style={{ flex: 1 }}
                    />
                  </div>
                  {!isLogin && phone && phone.length !== 10 && (
                    <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>10 digits required</p>
                  )}
                </div>
              </>
            )}

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-input"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                Password {!isLogin && <span style={{ fontSize: 11, fontWeight: 400, color: 'var(--text-muted)' }}> (min 8 chars, upper, lower, number)</span>}
              </label>
              <input
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={isLogin ? 1 : 8}
              />
            </div>

            {isLogin && (
              <div style={{ textAlign: 'right', marginBottom: 16 }}>
                <button 
                  type="button" 
                  onClick={() => setShowForgotPassword(true)}
                  style={{ color: 'var(--primary)', fontSize: 14, background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  Forgot Password?
                </button>
              </div>
            )}

            <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}>
              {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
            </button>
          </form>

          <div className="auth-toggle">
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <button onClick={() => { setIsLogin(!isLogin); navigate(isLogin ? '/register' : '/login'); }}>
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}