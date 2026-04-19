import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import EnergyChart from '../components/EnergyChart';

export default function Dashboard() {
  const { token, API } = useAuth();
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API}/predict/history`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setPredictions(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [token, API]);

  const solarCount = predictions.filter(p => p.type === 'solar').length;
  const windCount = predictions.filter(p => p.type === 'wind').length;
  const avgSolar = solarCount ? (predictions.filter(p => p.type === 'solar').reduce((s, p) => s + p.result, 0) / solarCount).toFixed(2) : '0';
  const avgWind = windCount ? (predictions.filter(p => p.type === 'wind').reduce((s, p) => s + p.result, 0) / windCount).toFixed(2) : '0';

  if (loading) return <div className="page-container" style={{ textAlign: 'center', paddingTop: '30vh' }}><div className="neon-spinner" style={{ width: 50, height: 50, margin: '0 auto' }} /></div>;

  return (
    <div className="page-container">
      <div className="page-header fade-in-up">
        <h1>📊 Dashboard</h1>
        <p>Your energy prediction history and analytics</p>
      </div>

      <div className="dashboard-stats fade-in-up">
        <div className="stat-card"><div className="stat-label">Total Predictions</div><div className="stat-value neon-text">{predictions.length}</div></div>
        <div className="stat-card"><div className="stat-label">Solar Predictions</div><div className="stat-value" style={{ color: 'var(--neon-yellow)' }}>{solarCount}</div></div>
        <div className="stat-card"><div className="stat-label">Wind Predictions</div><div className="stat-value" style={{ color: 'var(--neon-cyan)' }}>{windCount}</div></div>
        <div className="stat-card"><div className="stat-label">Avg Solar (kWh)</div><div className="stat-value" style={{ color: 'var(--neon-green)' }}>{avgSolar}</div></div>
      </div>

      {predictions.length > 0 && (
        <div className="chart-container fade-in-up">
          <h3>📈 Prediction Trends</h3>
          <EnergyChart predictions={predictions} />
        </div>
      )}

      <div className="glow-card fade-in-up">
        <h2>🕐 Recent Predictions</h2>
        {predictions.length === 0 ? (
          <div className="empty-state"><p>No predictions yet. Start calculating!</p></div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="history-table">
              <thead><tr><th>Type</th><th>Result</th><th>Unit</th><th>Date</th></tr></thead>
              <tbody>
                {predictions.slice(0, 20).map(p => (
                  <tr key={p._id}>
                    <td><span className={`type-badge ${p.type}`}>{p.type}</span></td>
                    <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{p.result.toLocaleString(undefined, { maximumFractionDigits: 2 })}</td>
                    <td>{p.unit}</td>
                    <td>{new Date(p.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
