import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';
import { COUNTRIES } from '../utils';
import toast from 'react-hot-toast';

export default function AuthPage({ mode = 'login' }) {
  const [isLogin, setIsLogin] = useState(mode === 'login');
  const [showForgot, setShowForgot] = useState(false);
  const [forgotStep, setForgotStep] = useState(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [countryCode, setCountryCode] = useState('+1');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
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
    } catch (err) { toast.error(err.message); }
    finally { setLoading(false); }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (forgotStep === 1) {
        const data = await api.forgotPassword(email);
        toast.success('Reset code sent! Check console for demo.');
        if (data.code) setResetCode(data.code);
        setForgotStep(2);
      } else {
        await api.resetPassword({ email, code: resetCode, newPassword });
        toast.success('Password reset! Please login.');
        setShowForgot(false);
        setIsLogin(true);
        setForgotStep(1);
      }
    } catch (err) { toast.error(err.message); }
    finally { setLoading(false); }
  };

  if (showForgot) {
    return (
      <div className="auth-page">
        <div className="auth-container">
          <div className="auth-card animate-fade-in">
            <div className="auth-header">
              <span className="logo-icon">🔐</span>
              <h2>{forgotStep === 1 ? 'Forgot Password' : 'Reset Password'}</h2>
              <p>{forgotStep === 1 ? 'Enter your email to get a reset code' : 'Enter the code and new password'}</p>
            </div>
            <form onSubmit={handleForgotPassword}>
              {forgotStep === 1 ? (
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input type="email" className="form-input" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
                </div>
              ) : (
                <>
                  <div className="form-group">
                    <label className="form-label">Reset Code</label>
                    <input type="text" className="form-input" placeholder="Enter 6-digit code" value={resetCode} onChange={e => setResetCode(e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">New Password</label>
                    <input type="password" className="form-input" placeholder="••••••••" value={newPassword} onChange={e => setNewPassword(e.target.value)} required minLength={6} />
                  </div>
                </>
              )}
              <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}>
                {loading ? 'Please wait...' : forgotStep === 1 ? 'Send Reset Code' : 'Reset Password'}
              </button>
            </form>
            <div className="auth-toggle">
              <button onClick={() => { setShowForgot(false); setForgotStep(1); }}>← Back to Login</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card animate-fade-in">
          <div className="auth-header">
            <span className="logo-icon">🐾</span>
            <h2>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
            <p>{isLogin ? 'Sign in to your PawCare account' : 'Start your free plan today'}</p>
          </div>
          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input type="text" className="form-input" placeholder="John Doe" value={name} onChange={e => setName(e.target.value)} required />
              </div>
            )}
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input type="email" className="form-input" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input type="password" className="form-input" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} />
            </div>
            {!isLogin && (
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <div className="phone-input-group">
                  <select className="form-input" value={countryCode} onChange={e => setCountryCode(e.target.value)}>
                    {COUNTRIES.map(c => (
                      <option key={c.code} value={c.code}>{c.flag} {c.code} {c.name}</option>
                    ))}
                  </select>
                  <input type="tel" className="form-input" placeholder="123 456 7890" value={phone} onChange={e => setPhone(e.target.value)} />
                </div>
              </div>
            )}
            <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}>
              {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
            </button>
          </form>
          {isLogin && (
            <div style={{ textAlign: 'center', marginTop: 12 }}>
              <button onClick={() => setShowForgot(true)} style={{ color: 'var(--primary-dark)', fontSize: 13, fontWeight: 500 }}>
                Forgot Password?
              </button>
            </div>
          )}
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
