import { useLocation, useNavigate, Link } from 'react-router-dom';

export default function Result() {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state) return (
    <div className="page-container">
      <div className="empty-state"><div className="icon">📊</div><p>No prediction data. Go calculate first!</p>
        <Link to="/" className="neon-btn neon-btn-primary" style={{ marginTop: 20 }}>Go to Predictor</Link>
      </div>
    </div>
  );

  const { type, energy, formulaEnergy, unit, inputs, method, modelInfo } = state;
  const isSolar = type === 'solar';
  const isML = method === 'ml';

  const coreLabels = isSolar
    ? { area: 'Panel Area (m²)', efficiency: 'Efficiency', irradiance: 'Irradiance (kWh/m²/day)', pr: 'Performance Ratio' }
    : { area: 'Rotor Area (m²)', airDensity: 'Air Density (kg/m³)', velocity: 'Wind Speed (m/s)', cp: 'Power Coefficient', efficiency: 'Generator Efficiency' };

  const envLabels = isSolar
    ? { temperature: 'Temperature (°C)', humidity: 'Humidity (%)', cloudCover: 'Cloud Cover (%)' }
    : { temperature: 'Temperature (°C)', altitude: 'Altitude (m)', turbulence: 'Turbulence Intensity' };

  return (
    <div className="page-container">
      <div className="result-container fade-in-up">
        <div className="glow-card result-card">
          <div className="result-icon">{isSolar ? '☀️' : '🌬️'}</div>

          {/* Method badge */}
          <div className="method-badge" style={{
            background: isML ? 'rgba(191, 0, 255, 0.12)' : 'rgba(0, 240, 255, 0.08)',
            color: isML ? '#bf00ff' : '#00f0ff',
            border: `1px solid ${isML ? 'rgba(191,0,255,0.3)' : 'rgba(0,240,255,0.2)'}`,
            padding: '6px 16px', borderRadius: 20, fontSize: '0.8rem',
            fontWeight: 600, display: 'inline-block', marginBottom: 12,
            letterSpacing: '1px', textTransform: 'uppercase'
          }}>
            {isML ? '🧠 ML Neural Network' : '📐 Formula Based'}
          </div>

          <h2 style={{ color: 'var(--text-secondary)', fontSize: '1rem', letterSpacing: 1 }}>
            {isSolar ? 'SOLAR ENERGY OUTPUT' : 'WIND ENERGY OUTPUT'}
          </h2>
          <div className={`result-value ${type}`}>{energy.toLocaleString()}</div>
          <div className="result-unit">{unit}</div>

          {/* ML vs Formula Comparison */}
          {isML && formulaEnergy !== undefined && (
            <div className="comparison-box" style={{
              background: 'rgba(0,240,255,0.04)', border: '1px solid rgba(0,240,255,0.12)',
              borderRadius: 'var(--radius-md)', padding: '20px', margin: '20px 0',
              textAlign: 'center'
            }}>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '0.8rem', color: 'var(--text-muted)',
                letterSpacing: 1, marginBottom: 16 }}>⚡ ML vs FORMULA COMPARISON</h3>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 30, flexWrap: 'wrap' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--neon-purple)', marginBottom: 4, fontWeight: 600 }}>🧠 ML Prediction</div>
                  <div style={{ fontSize: '1.6rem', fontFamily: 'var(--font-heading)', fontWeight: 800, color: 'var(--neon-purple)' }}>
                    {energy.toLocaleString()}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', color: 'var(--text-muted)' }}>vs</div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--neon-cyan)', marginBottom: 4, fontWeight: 600 }}>📐 Formula</div>
                  <div style={{ fontSize: '1.6rem', fontFamily: 'var(--font-heading)', fontWeight: 800, color: 'var(--neon-cyan)' }}>
                    {formulaEnergy.toLocaleString()}
                  </div>
                </div>
              </div>
              <div style={{ marginTop: 12, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Difference: <span style={{ color: 'var(--neon-green)', fontWeight: 600 }}>
                  {((energy - formulaEnergy) / formulaEnergy * 100).toFixed(1)}%
                </span>
                {' '}— ML accounts for environmental losses
              </div>
            </div>
          )}

          {/* Model Info */}
          {isML && modelInfo && (
            <div style={{
              background: 'rgba(191,0,255,0.04)', border: '1px solid rgba(191,0,255,0.1)',
              borderRadius: 'var(--radius-sm)', padding: '12px 16px', margin: '0 0 20px',
              fontSize: '0.8rem', color: 'var(--text-muted)'
            }}>
              <strong style={{ color: 'var(--neon-purple)' }}>Model Info:</strong>{' '}
              Architecture: {modelInfo.architecture?.join(' → ')} |{' '}
              Trained on {modelInfo.dataSize} samples |{' '}
              {modelInfo.epochs} epochs | Val Loss: {modelInfo.finalValLoss?.toFixed(6)}
            </div>
          )}

          <div className="result-inputs">
            <h3>Core Parameters</h3>
            {Object.entries(coreLabels).map(([key, label]) => (
              <div className="input-row" key={key}>
                <span>{label}</span>
                <span>{inputs[key]}</span>
              </div>
            ))}
          </div>

          {isML && (
            <div className="result-inputs" style={{ marginTop: 16 }}>
              <h3>🌍 Environmental Factors</h3>
              {Object.entries(envLabels).map(([key, label]) => (
                <div className="input-row" key={key}>
                  <span>{label}</span>
                  <span>{inputs[key]}</span>
                </div>
              ))}
            </div>
          )}

          <div className="result-actions">
            <button className="neon-btn neon-btn-primary" onClick={() => navigate('/')}>Calculate Again</button>
            <button className="neon-btn neon-btn-secondary" onClick={() => navigate('/dashboard')}>View History</button>
          </div>
        </div>
      </div>
    </div>
  );
}
