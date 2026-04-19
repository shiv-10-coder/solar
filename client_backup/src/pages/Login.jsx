import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-container">
      <div className="glow-card auth-card fade-in-up">
        <h2 className="neon-text">Welcome Back</h2>
        <p className="auth-subtitle">Login to your EnergyPredict account</p>
        {error && <div className="error-msg">{error}</div>}
        <form className="neon-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input className="neon-input" type="email" placeholder="you@example.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input className="neon-input" type="password" placeholder="••••••••" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
          </div>
          <button className="neon-btn neon-btn-primary" type="submit" disabled={loading} style={{ marginTop: 8 }}>
            {loading ? <><div className="neon-spinner" /> Logging in...</> : 'Login'}
          </button>
        </form>
        <p className="auth-footer">Don't have an account? <Link to="/signup">Sign Up</Link></p>
      </div>
    </div>
  );
}
