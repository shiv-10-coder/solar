import { useState } from 'react';
import SolarForm from '../components/SolarForm';
import WindForm from '../components/WindForm';

export default function Home() {
  const [tab, setTab] = useState('solar');

  return (
    <div className="page-container">
      <div className="hero-section fade-in-up">
        <h1 className="neon-text">Wind & Solar Energy Prediction</h1>
        <p className="subtitle">Estimate renewable energy output using smart scientific parameters and real-world formulas</p>
      </div>

      <div className="energy-tabs">
        <button className={`energy-tab ${tab === 'solar' ? 'active-solar' : ''}`} onClick={() => setTab('solar')}>
          ☀️ Solar Energy
        </button>
        <button className={`energy-tab ${tab === 'wind' ? 'active-wind' : ''}`} onClick={() => setTab('wind')}>
          🌬️ Wind Energy
        </button>
      </div>

      <div className="prediction-form-container">
        <div className="glow-card" style={{ animationDelay: '0.2s' }}>
          <h2>{tab === 'solar' ? '☀️ Solar Energy Prediction' : '🌬️ Wind Energy Prediction'}</h2>
          {tab === 'solar' ? <SolarForm /> : <WindForm />}
        </div>
      </div>
    </div>
  );
}
