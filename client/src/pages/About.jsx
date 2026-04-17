export default function About() {
  return (
    <div className="page-container">
      <div className="page-header fade-in-up">
        <h1>About EnergyPredict</h1>
        <p>Smart renewable energy prediction using scientific formulas</p>
      </div>

      <div className="about-grid">
        <div className="glow-card fade-in-up">
          <div className="icon">☀️</div>
          <h2>Solar Energy</h2>
          <p>Uses sunlight to generate electricity via photovoltaic panels. Our predictor calculates daily energy output based on your panel specifications.</p>
          <ul>
            <li>Panel Area (m²)</li>
            <li>Panel Efficiency (15–22%)</li>
            <li>Solar Irradiance (kWh/m²/day)</li>
            <li>Performance Ratio</li>
          </ul>
          <div className="formula-card">
            <code>E = Area × Efficiency × Irradiance × PR</code>
          </div>
        </div>

        <div className="glow-card fade-in-up" style={{ animationDelay: '0.15s' }}>
          <div className="icon">🌬️</div>
          <h2>Wind Energy</h2>
          <p>Uses wind turbines to convert kinetic energy into electricity. Our model uses the standard wind power equation.</p>
          <ul>
            <li>Rotor Swept Area (m²)</li>
            <li>Air Density (kg/m³)</li>
            <li>Wind Speed (m/s)</li>
            <li>Power Coefficient (Cp)</li>
            <li>Generator Efficiency</li>
          </ul>
          <div className="formula-card">
            <code>P = 0.5 × ρ × A × V³ × Cp × η</code>
          </div>
        </div>

        <div className="glow-card fade-in-up" style={{ animationDelay: '0.3s' }}>
          <div className="icon">🎯</div>
          <h2>Our Objective</h2>
          <p>Promote renewable energy adoption by providing accessible, accurate energy prediction tools for students, engineers, and enthusiasts.</p>
          <ul>
            <li>Easy-to-use prediction interface</li>
            <li>Track your calculation history</li>
            <li>Visual analytics dashboard</li>
            <li>Scientific accuracy</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
