import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function WindForm() {
  const { token, API } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState('formula');
  const [form, setForm] = useState({
    area: '', airDensity: '1.225', velocity: '', cp: '', efficiency: '',
    temperature: '15', altitude: '0', turbulence: '0.1'
  });

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const endpoint = mode === 'ml' ? `${API}/predict/ml-wind` : `${API}/predict/wind`;
      const res = await axios.post(endpoint, form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      navigate('/result', { state: { ...res.data, inputs: form } });
    } catch (err) {
      alert(err.response?.data?.message || 'Error');
    } finally { setLoading(false); }
  };

  return (
    <div>
      <div className="mode-toggle">
        <button className={`mode-btn ${mode === 'formula' ? 'active' : ''}`}
          onClick={() => setMode('formula')} type="button">📐 Formula</button>
        <button className={`mode-btn ${mode === 'ml' ? 'active' : ''}`}
          onClick={() => setMode('ml')} type="button">🧠 ML Model</button>
      </div>

      {mode === 'ml' && (
        <div className="ml-badge" style={{ borderColor: 'rgba(0, 240, 255, 0.2)', background: 'rgba(0, 240, 255, 0.06)' }}>
          <span>🧠</span> Neural Network — trained on 600+ wind turbine data with terrain & atmospheric factors
        </div>
      )}

      <form className="neon-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Rotor Swept Area (m²)</label>
          <input className="neon-input" type="number" name="area" placeholder="e.g. 8000" value={form.area} onChange={handleChange} required />
          <small>Blade swept area of turbine</small>
        </div>
        <div className="form-group">
          <label>Air Density (kg/m³)</label>
          <input className="neon-input" type="number" step="0.001" name="airDensity" placeholder="1.225" value={form.airDensity} onChange={handleChange} required />
          <small>Standard: 1.225 kg/m³</small>
        </div>
        <div className="form-group">
          <label>Wind Speed (m/s)</label>
          <input className="neon-input" type="number" step="0.01" name="velocity" placeholder="e.g. 12" value={form.velocity} onChange={handleChange} required />
          <small>Average wind speed at hub height</small>
        </div>
        <div className="form-group">
          <label>Power Coefficient (Cp)</label>
          <input className="neon-input" type="number" step="0.01" name="cp" placeholder="e.g. 0.4" value={form.cp} onChange={handleChange} required />
          <small>Typical: 0.3 – 0.5 (Betz limit: 0.593)</small>
        </div>
        <div className="form-group">
          <label>Generator Efficiency</label>
          <input className="neon-input" type="number" step="0.01" name="efficiency" placeholder="e.g. 0.9" value={form.efficiency} onChange={handleChange} required />
          <small>Electrical conversion efficiency</small>
        </div>

        {mode === 'ml' && (
          <div className="env-inputs fade-in-up">
            <div className="env-header">🌍 Environmental Factors</div>
            <div className="form-group">
              <label>Temperature (°C)</label>
              <input className="neon-input" type="number" step="0.1" name="temperature" placeholder="15" value={form.temperature} onChange={handleChange} />
              <small>Affects air density and turbine performance</small>
            </div>
            <div className="form-group">
              <label>Altitude (m)</label>
              <input className="neon-input" type="number" name="altitude" placeholder="0" value={form.altitude} onChange={handleChange} />
              <small>Meters above sea level — higher = lower air density</small>
            </div>
            <div className="form-group">
              <label>Turbulence Intensity</label>
              <input className="neon-input" type="number" step="0.01" name="turbulence" placeholder="0.1" value={form.turbulence} onChange={handleChange} />
              <small>0.05 (smooth) – 0.25 (rough terrain)</small>
            </div>
          </div>
        )}

        <button className="neon-btn neon-btn-purple" type="submit" disabled={loading} style={{ marginTop: 12 }}>
          {loading ? <><div className="neon-spinner" /> Calculating...</> :
            mode === 'ml' ? '🧠 ML Predict Wind Energy' : '🌬️ Calculate Wind Energy'}
        </button>
      </form>
    </div>
  );
}
