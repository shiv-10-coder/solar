import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function SolarForm() {
  const { token, API } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState('formula'); // 'formula' or 'ml'
  const [form, setForm] = useState({
    area: '', efficiency: '', irradiance: '', pr: '',
    temperature: '25', humidity: '50', cloudCover: '20'
  });

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const endpoint = mode === 'ml' ? `${API}/predict/ml-solar` : `${API}/predict/solar`;
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
        <button
          className={`mode-btn ${mode === 'formula' ? 'active' : ''}`}
          onClick={() => setMode('formula')} type="button"
        >📐 Formula</button>
        <button
          className={`mode-btn ${mode === 'ml' ? 'active' : ''}`}
          onClick={() => setMode('ml')} type="button"
        >🧠 ML Model</button>
      </div>

      {mode === 'ml' && (
        <div className="ml-badge">
          <span>🧠</span> Neural Network Prediction — trained on 600+ real-world data points with environmental factors
        </div>
      )}

      <form className="neon-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Panel Area (m²)</label>
          <input className="neon-input" type="number" name="area" placeholder="e.g. 50" value={form.area} onChange={handleChange} required />
          <small>Total solar panel surface area</small>
        </div>
        <div className="form-group">
          <label>Panel Efficiency</label>
          <input className="neon-input" type="number" step="0.01" name="efficiency" placeholder="e.g. 0.18" value={form.efficiency} onChange={handleChange} required />
          <small>Typical range: 0.15 – 0.22</small>
        </div>
        <div className="form-group">
          <label>Solar Irradiance (kWh/m²/day)</label>
          <input className="neon-input" type="number" step="0.01" name="irradiance" placeholder="e.g. 5.5" value={form.irradiance} onChange={handleChange} required />
          <small>Average sunlight energy per day</small>
        </div>
        <div className="form-group">
          <label>Performance Ratio</label>
          <input className="neon-input" type="number" step="0.01" name="pr" placeholder="e.g. 0.75" value={form.pr} onChange={handleChange} required />
          <small>System loss factor (0.5 – 0.9)</small>
        </div>

        {mode === 'ml' && (
          <div className="env-inputs fade-in-up">
            <div className="env-header">🌍 Environmental Factors</div>
            <div className="form-group">
              <label>Temperature (°C)</label>
              <input className="neon-input" type="number" step="0.1" name="temperature" placeholder="25" value={form.temperature} onChange={handleChange} />
              <small>Ambient temperature — panels lose efficiency above 25°C</small>
            </div>
            <div className="form-group">
              <label>Humidity (%)</label>
              <input className="neon-input" type="number" step="1" name="humidity" placeholder="50" value={form.humidity} onChange={handleChange} />
              <small>Relative humidity — high humidity reduces output</small>
            </div>
            <div className="form-group">
              <label>Cloud Cover (%)</label>
              <input className="neon-input" type="number" step="1" name="cloudCover" placeholder="20" value={form.cloudCover} onChange={handleChange} />
              <small>0% = clear sky, 100% = fully overcast</small>
            </div>
          </div>
        )}

        <button className="neon-btn neon-btn-primary" type="submit" disabled={loading} style={{ marginTop: 12 }}>
          {loading ? <><div className="neon-spinner" /> Calculating...</> :
            mode === 'ml' ? '🧠 ML Predict Solar Energy' : '☀️ Calculate Solar Energy'}
        </button>
      </form>
    </div>
  );
}
