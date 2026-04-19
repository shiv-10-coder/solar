import { useState } from 'react';
import axios from 'axios';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true); setStatus('');
    try {
      await axios.post('/api/contact', form);
      setStatus('success');
      setForm({ name: '', email: '', message: '' });
    } catch {
      setStatus('error');
    } finally { setLoading(false); }
  };

  return (
    <div className="page-container">
      <div className="page-header fade-in-up">
        <h1>Contact Us</h1>
        <p>Have questions or feedback? We'd love to hear from you!</p>
      </div>

      <div className="prediction-form-container">
        <div className="glow-card fade-in-up">
          {status === 'success' && <div className="success-msg">✅ Message sent successfully!</div>}
          {status === 'error' && <div className="error-msg">❌ Failed to send. Try again.</div>}
          <form className="neon-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Your Name</label>
              <input className="neon-input" type="text" placeholder="John Doe" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input className="neon-input" type="email" placeholder="you@example.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Message</label>
              <textarea className="neon-input" placeholder="Your message..." value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} required />
            </div>
            <button className="neon-btn neon-btn-primary" type="submit" disabled={loading} style={{ marginTop: 8 }}>
              {loading ? <><div className="neon-spinner" /> Sending...</> : '📨 Send Message'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
