import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';
import toast from 'react-hot-toast';

export default function SupportBotPage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([
    { id: 1, text: 'Hello! I am your PawCare Pro Support Bot 🐾. How can I help you and your pets today?', sender: 'bot' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Block non-pro users
  if (user?.subscription !== 'pro' && user?.role !== 'admin') {
    return (
      <div className="page-container">
        <div className="card" style={{ textAlign: 'center', padding: '40px 20px' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>👑</div>
          <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: 8 }}>Pro Feature</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: 24 }}>The AI Support Bot is exclusively available for Pro users.</p>
          <a href="/subscriptions" className="btn btn-primary btn-lg">Upgrade to Pro</a>
        </div>
      </div>
    );
  }

  async function handleSend(e) {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { id: Date.now(), text: input, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      // Simulate AI response for now
      await new Promise(r => setTimeout(r, 1500));
      const botMsg = { 
        id: Date.now() + 1, 
        text: `Thanks for asking about "${userMsg.text}". As a Pro user, your request is prioritized! For detailed medical advice, always consult your emergency vet, but I'm here for general tips.`, 
        sender: 'bot' 
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      toast.error('Failed to get response');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page-container" style={{ height: 'calc(100vh - 120px)', display: 'flex', flexDirection: 'column' }}>
      <div className="page-header" style={{ marginBottom: 16 }}>
        <h2>👑 Pro Support Bot</h2>
        <p>24/7 Priority AI assistance for you and your pets</p>
      </div>

      <div className="card" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden' }}>
        <div style={{ flex: 1, overflowY: 'auto', padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
          {messages.map((msg) => (
            <div key={msg.id} style={{
              alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
              background: msg.sender === 'user' ? 'var(--primary)' : 'var(--bg-input)',
              color: msg.sender === 'user' ? '#fff' : 'var(--text)',
              padding: '12px 16px',
              borderRadius: 16,
              maxWidth: '80%',
              borderBottomRightRadius: msg.sender === 'user' ? 4 : 16,
              borderBottomLeftRadius: msg.sender === 'bot' ? 4 : 16,
            }}>
              {msg.text}
            </div>
          ))}
          {loading && (
            <div style={{ alignSelf: 'flex-start', background: 'var(--bg-input)', padding: '12px 16px', borderRadius: 16, borderBottomLeftRadius: 4 }}>
              <div className="spinner" style={{ width: 20, height: 20, margin: 0 }}></div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div style={{ padding: 16, borderTop: '1px solid rgba(0,0,0,0.05)' }}>
          <form onSubmit={handleSend} style={{ display: 'flex', gap: 12 }}>
            <input 
              type="text" 
              className="form-input" 
              style={{ flex: 1, marginBottom: 0 }}
              placeholder="Ask anything about your pets..." 
              value={input}
              onChange={e => setInput(e.target.value)}
              disabled={loading}
            />
            <button type="submit" className="btn btn-primary" disabled={loading || !input.trim()}>
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
