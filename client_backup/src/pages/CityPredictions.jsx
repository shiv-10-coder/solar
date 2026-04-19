import { useParams, useNavigate, Link } from 'react-router-dom';
import cityPresets from '../data/cityPresets';

export default function CityPredictions() {
  const { cityName } = useParams();
  const navigate = useNavigate();

  const city = cityPresets.find(
    c => c.name.toLowerCase() === (cityName || '').toLowerCase()
  );

  if (!city) {
    return (
      <div className="page-container">
        <div className="empty-state">
          <div className="icon">🏙️</div>
          <p>City not found. Choose one from the navbar dropdown.</p>
          <Link to="/" className="neon-btn neon-btn-primary" style={{ marginTop: 20 }}>Go Home</Link>
        </div>
      </div>
    );
  }

  const { solar, wind } = city;

  const solarLabels = {
    area: 'Panel Area (m²)',
    efficiency: 'Efficiency',
    irradiance: 'Irradiance (kWh/m²/day)',
    pr: 'Performance Ratio',
    temperature: 'Temperature (°C)',
    humidity: 'Humidity (%)',
    cloudCover: 'Cloud Cover (%)'
  };

  const windLabels = {
    area: 'Rotor Area (m²)',
    airDensity: 'Air Density (kg/m³)',
    velocity: 'Wind Speed (m/s)',
    cp: 'Power Coefficient',
    efficiency: 'Generator Efficiency',
    temperature: 'Temperature (°C)',
    altitude: 'Altitude (m)',
    turbulence: 'Turbulence Intensity'
  };

  return (
    <div className="page-container">
      <div className="city-predictions-page fade-in-up">
        {/* City Header */}
        <div className="city-header">
          <span className="city-flag">{city.flag}</span>
          <div>
            <h1 className="city-title">{city.name}</h1>
            <p className="city-meta">{city.country} &middot; {city.coordinates}</p>
            <p className="city-climate">{city.climate}</p>
          </div>
        </div>

        {/* Two column cards */}
        <div className="city-cards-grid">
          {/* Solar Card */}
          <div className="glow-card city-energy-card solar-energy-card">
            <div className="city-card-icon">☀️</div>
            <h2 style={{ color: 'var(--neon-yellow)' }}>Solar Energy</h2>
            <div className="city-energy-value solar">{solar.energy.toLocaleString()}</div>
            <div className="city-energy-unit">{solar.unit}</div>

            <div className="city-params">
              <h3>Parameters Used</h3>
              {Object.entries(solarLabels).map(([key, label]) => (
                <div className="input-row" key={key}>
                  <span>{label}</span>
                  <span>{solar.inputs[key]}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Wind Card */}
          <div className="glow-card city-energy-card wind-energy-card">
            <div className="city-card-icon">🌬️</div>
            <h2 style={{ color: 'var(--neon-cyan)' }}>Wind Energy</h2>
            <div className="city-energy-value wind">{wind.energy.toLocaleString()}</div>
            <div className="city-energy-unit">{wind.unit}</div>

            <div className="city-params">
              <h3>Parameters Used</h3>
              {Object.entries(windLabels).map(([key, label]) => (
                <div className="input-row" key={key}>
                  <span>{label}</span>
                  <span>{wind.inputs[key]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Comparison Summary */}
        <div className="glow-card city-comparison-card">
          <h2 style={{ textAlign: 'center' }}>⚡ Energy Comparison — {city.name}</h2>
          <div className="comparison-bars">
            <div className="comp-item">
              <div className="comp-label">☀️ Solar</div>
              <div className="comp-bar-track">
                <div
                  className="comp-bar-fill solar"
                  style={{ width: `${Math.min((solar.energy / 60) * 100, 100)}%` }}
                />
              </div>
              <div className="comp-value solar">{solar.energy} {solar.unit}</div>
            </div>
            <div className="comp-item">
              <div className="comp-label">🌬️ Wind</div>
              <div className="comp-bar-track">
                <div
                  className="comp-bar-fill wind"
                  style={{ width: `${Math.min((wind.energy / 5000) * 100, 100)}%` }}
                />
              </div>
              <div className="comp-value wind">{wind.energy} {wind.unit}</div>
            </div>
          </div>
          <p className="comp-note">
            {solar.energy > 35
              ? `${city.name} has excellent solar potential due to high irradiance.`
              : solar.energy > 25
              ? `${city.name} has moderate solar potential.`
              : `${city.name} has limited solar potential due to cloud cover.`}
            {' '}
            {wind.energy > 2500
              ? `Strong winds make it ideal for wind energy.`
              : wind.energy > 1000
              ? `Wind potential is moderate.`
              : `Wind energy output is relatively low.`}
          </p>
        </div>

        {/* Actions */}
        <div className="city-actions">
          <button className="neon-btn neon-btn-primary" onClick={() => navigate('/')}>
            🔧 Custom Prediction
          </button>
          <button className="neon-btn neon-btn-secondary" onClick={() => navigate(-1)}>
            ← Back
          </button>
        </div>
      </div>
    </div>
  );
}
