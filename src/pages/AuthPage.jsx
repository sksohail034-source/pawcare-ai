import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';
import { COUNTRIES } from '../utils';
import toast from 'react-hot-toast';

function OTPInput({ length = 6, onComplete }) {
  const [values, setValues] = useState(Array(length).fill(''));
  const inputRefs = useRef([]);

  const handleChange = (i, val) => {
    if (!/^\d*$/.test(val)) return;
    const newValues = [...values];
    newValues[i] = val.slice(-1);
    setValues(newValues);
    
    if (val && i < length - 1) {
      inputRefs.current[i + 1]?.focus();
    }
    
    const code = newValues.join('');
    if (code.length === length) {
      onComplete(code);
    }
  };

  const handleKeyDown = (i, e) => {
    if (e.key === 'Backspace' && !values[i] && i > 0) {
      inputRefs.current[i - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
    const newValues = [...values];
    pasted.split('').forEach((char, i) => { newValues[i] = char; });
    setValues(newValues);
    if (pasted.length === length) onComplete(pasted);
    else inputRefs.current[Math.min(pasted.length, length - 1)]?.focus();
  };

  return (
    <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
      {values.map((val, i) => (
        <input
          key={i}
          ref={el => inputRefs.current[i] = el}
          type="tel"
          inputMode="numeric"
          maxLength={1}
          value={val}
          onChange={e => handleChange(i, e.target.value)}
          onKeyDown={e => handleKeyDown(i, e)}
          onPaste={i === 0 ? handlePaste : undefined}
          style={{
            width: 48, height: 56, textAlign: 'center', fontSize: 22, fontWeight: 700,
            borderRadius: 14, border: val ? '2px solid var(--primary)' : '2px solid var(--border)',
            background: val ? 'rgba(34,197,94,0.06)' : 'var(--bg-input)',
            outline: 'none', transition: 'all 0.2s', fontFamily: 'monospace',
            color: 'var(--text-main)'
          }}
          onFocus={e => e.target.style.borderColor = 'var(--primary)'}
          onBlur={e => { if (!val) e.target.style.borderColor = 'var(--border)'; }}
        />
      ))}
    </div>
  );
}

export default function AuthPage({ mode = 'login' }) {
  const [isLogin, setIsLogin] = useState(mode === 'login');
  const [showForgot, setShowForgot] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [forgotStep, setForgotStep] = useState(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [countryCode, setCountryCode] = useState('+1');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [otpTimer, setOtpTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [devOTP, setDevOTP] = useState('');
  const { loginStep1, registerStep1, verifyOTP } = useAuth();
  const navigate = useNavigate();

  // OTP countdown timer
  useEffect(() => {
    if (!showOTP) return;
    setOtpTimer(60);
    setCanResend(false);
    const interval = setInterval(() => {
      setOtpTimer(prev => {
        if (prev <= 1) { clearInterval(interval); setCanResend(true); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [showOTP]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let data;
      if (isLogin) {
        data = await loginStep1(email, password);
      } else {
        data = await registerStep1(name, email, password, phone, countryCode);
      }
      
      if (data.requiresOTP) {
        setShowOTP(true);
        if (data.devOTP) setDevOTP(data.devOTP);
        toast.success('📧 Verification code sent to your email!');
      } else if (data.token) {
        // Direct login for existing users
        toast.success('Welcome back! 🐾');
        navigate('/dashboard');
      }
    } catch (err) { toast.error(err.message); }
    finally { setLoading(false); }
  };

  const handleOTPComplete = async (otp) => {
    setLoading(true);
    try {
      await verifyOTP(email, otp);
      toast.success(isLogin ? 'Welcome back! 🐾' : 'Account created! Welcome to PawCare AI! 🎉');
      navigate('/dashboard');
    } catch (err) { 
      toast.error(err.message || 'Invalid code. Please try again.'); 
    }
    finally { setLoading(false); }
  };

  const handleResendOTP = async () => {
    if (!canResend) return;
    setLoading(true);
    try {
      const data = await api.resendOTP(email);
      setCanResend(false);
      setOtpTimer(60);
      if (data.devOTP) setDevOTP(data.devOTP);
      toast.success('New code sent! 📧');
      // Restart timer
      const interval = setInterval(() => {
        setOtpTimer(prev => {
          if (prev <= 1) { clearInterval(interval); setCanResend(true); return 0; }
          return prev - 1;
        });
      }, 1000);
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

  // OTP Verification Screen
  if (showOTP) {
    return (
      <div className="auth-page">
        <div className="auth-container">
          <div className="auth-card animate-fade-in">
            <div className="auth-header">
              <div style={{ 
                width: 72, height: 72, borderRadius: '50%', margin: '0 auto 16px',
                background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 8px 25px rgba(34,197,94,0.3)'
              }}>
                <span style={{ fontSize: 32 }}>📧</span>
              </div>
              <h2>Verify Your Email</h2>
              <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>
                We sent a 6-digit code to<br/>
                <strong style={{ color: 'var(--primary-dark)' }}>{email}</strong>
              </p>
            </div>
            
            <div style={{ margin: '24px 0' }}>
              <OTPInput length={6} onComplete={handleOTPComplete} />
            </div>

            {devOTP && (
              <div style={{ 
                background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)',
                borderRadius: 12, padding: '10px 16px', marginBottom: 16, textAlign: 'center',
                fontSize: 13
              }}>
                🧪 <strong>Dev Mode OTP:</strong> <span style={{ fontFamily: 'monospace', fontSize: 16, fontWeight: 700, color: '#d97706' }}>{devOTP}</span>
              </div>
            )}

            {loading && (
              <div style={{ textAlign: 'center', marginBottom: 16 }}>
                <div className="spinner" style={{ margin: '0 auto' }}></div>
                <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 8 }}>Verifying...</p>
              </div>
            )}

            <div style={{ textAlign: 'center', marginTop: 20 }}>
              {canResend ? (
                <button 
                  onClick={handleResendOTP} 
                  disabled={loading}
                  style={{ 
                    color: 'var(--primary-dark)', fontWeight: 600, fontSize: 14,
                    background: 'none', border: 'none', cursor: 'pointer'
                  }}
                >
                  🔄 Resend Code
                </button>
              ) : (
                <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                  Resend code in <strong style={{ color: 'var(--primary-dark)' }}>{otpTimer}s</strong>
                </p>
              )}
            </div>

            <div className="auth-toggle" style={{ marginTop: 16 }}>
              <button onClick={() => { setShowOTP(false); setDevOTP(''); }}>← Back to {isLogin ? 'Login' : 'Sign Up'}</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Forgot Password Screen
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

  // Main Login/Register Screen
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
