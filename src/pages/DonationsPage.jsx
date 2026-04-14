import { useState, useEffect } from 'react';
import { api } from '../api';
import { formatDate } from '../utils';
import toast from 'react-hot-toast';

export default function DonationsPage() {
  const [orgs, setOrgs] = useState([]);
  const [selectedOrg, setSelectedOrg] = useState(null);
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [history, setHistory] = useState([]);
  const [totalDonated, setTotalDonated] = useState(0);
  const [thankYou, setThankYou] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    Promise.all([api.getOrganizations(), api.getDonationHistory()])
      .then(([orgData, histData]) => {
        setOrgs(orgData.organizations || []);
        setHistory(histData.donations || []);
        setTotalDonated(histData.totalDonated || 0);
      }).catch(console.error);
  }, []);

  async function handleDonate(e) {
    e.preventDefault();
    if (!selectedOrg || !amount) { toast.error('Select an organization and amount'); return; }
    setLoading(true);
    try {
      const data = await api.donate({ amount: parseFloat(amount), organization: selectedOrg.id, message });
      setThankYou(data);
      setTotalDonated(prev => prev + parseFloat(amount));
      setHistory(prev => [data.donation, ...prev]);
      setAmount('');
      setMessage('');
      setSelectedOrg(null);
      toast.success('Thank you for your donation! ❤️');
    } catch (err) { toast.error(err.message); }
    finally { setLoading(false); }
  }

  const presets = [5, 10, 25, 50, 100];

  return (
    <div>
      <div className="page-header">
        <h2>Support Animals ❤️</h2>
        <p>Make a difference in the lives of animals who need it most</p>
      </div>

      {totalDonated > 0 && (
        <div className="donation-total">
          <div className="total-label">Your Total Contributions</div>
          <div className="total-amount">${totalDonated.toFixed(2)}</div>
          <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginTop: 8 }}>
            Thank you for making a difference! 🐾
          </p>
        </div>
      )}

      {thankYou && (
        <div className="card thank-you-message" style={{ marginBottom: 24 }}>
          <div className="emoji">🎉</div>
          <h3>Thank You!</h3>
          <p>{thankYou.thankYouMessage}</p>
          <button className="btn btn-secondary btn-sm" onClick={() => setThankYou(null)} style={{ marginTop: 16 }}>Donate Again</button>
        </div>
      )}

      {!thankYou && (
        <>
          <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: 16 }}>Choose an Organization</h3>
          <div className="card-grid-3" style={{ marginBottom: 32 }}>
            {orgs.map(org => (
              <div key={org.id} className={`org-card ${selectedOrg?.id === org.id ? 'selected' : ''}`} onClick={() => setSelectedOrg(org)}>
                <div className="org-logo">{org.logo}</div>
                <h4>{org.name}</h4>
                <p>{org.description}</p>
                <span className="org-location">📍 {org.location}</span>
              </div>
            ))}
          </div>

          <div className="card" style={{ maxWidth: 500 }}>
            <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: 20 }}>Make a Donation</h3>
            <form onSubmit={handleDonate}>
              <div className="form-group">
                <label className="form-label">Amount</label>
                <div className="amount-presets">
                  {presets.map(p => (
                    <button key={p} type="button" className={`amount-preset ${amount === String(p) ? 'active' : ''}`}
                      onClick={() => setAmount(String(p))}>${p}</button>
                  ))}
                </div>
                <input type="number" className="form-input" value={amount} onChange={e => setAmount(e.target.value)}
                  placeholder="Custom amount" min="1" step="0.01" required />
              </div>
              <div className="form-group">
                <label className="form-label">Message (Optional)</label>
                <textarea className="form-input" value={message} onChange={e => setMessage(e.target.value)}
                  placeholder="Leave a message of support..." rows="2" />
              </div>
              <button type="submit" className="btn btn-accent btn-full btn-lg" disabled={loading || !selectedOrg}>
                {loading ? 'Processing...' : `Donate ${amount ? `$${amount}` : ''} ${selectedOrg ? `to ${selectedOrg.name}` : ''}`}
              </button>
            </form>
          </div>
        </>
      )}

      {history.length > 0 && (
        <div style={{ marginTop: 40 }}>
          <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: 16 }}>Donation History</h3>
          <div className="table-container">
            <table>
              <thead>
                <tr><th>Date</th><th>Organization</th><th>Amount</th><th>Message</th><th>Status</th></tr>
              </thead>
              <tbody>
                {history.map(d => (
                  <tr key={d.id}>
                    <td>{formatDate(d.created_at)}</td>
                    <td><strong>{d.organization}</strong></td>
                    <td style={{ color: 'var(--success)', fontWeight: 700 }}>${d.amount?.toFixed(2)}</td>
                    <td style={{ color: 'var(--text-secondary)' }}>{d.message || '—'}</td>
                    <td><span className="badge badge-success">{d.status}</span></td>
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
