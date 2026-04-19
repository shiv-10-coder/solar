import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState, useRef, useEffect } from 'react';
import cityPresets from '../data/cityPresets';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [citiesOpen, setCitiesOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => { logout(); navigate('/login'); };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setCitiesOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCitySelect = (cityName) => {
    setCitiesOpen(false);
    setOpen(false);
    navigate(`/city/${cityName.toLowerCase()}`);
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">⚡ EnergyPredict</Link>
      <button className="hamburger" onClick={() => setOpen(!open)}>☰</button>
      <div className={`navbar-links ${open ? 'open' : ''}`}>
        <NavLink to="/" end onClick={() => setOpen(false)}>Home</NavLink>

        {/* Cities Dropdown */}
        <div className="nav-dropdown" ref={dropdownRef}>
          <button
            className={`nav-dropdown-trigger ${citiesOpen ? 'active' : ''}`}
            onClick={() => setCitiesOpen(!citiesOpen)}
            type="button"
          >
            🏙️ Cities
            <span className={`dropdown-arrow ${citiesOpen ? 'open' : ''}`}>▾</span>
          </button>

          {citiesOpen && (
            <div className="nav-dropdown-menu">
              <div className="dropdown-header">Quick City Predictions</div>
              {cityPresets.map(city => (
                <button
                  key={city.name}
                  className="dropdown-city-item"
                  onClick={() => handleCitySelect(city.name)}
                >
                  <span className="dropdown-city-flag">{city.flag}</span>
                  <div className="dropdown-city-info">
                    <span className="dropdown-city-name">{city.name}</span>
                    <span className="dropdown-city-country">{city.country}</span>
                  </div>
                  <div className="dropdown-city-stats">
                    <span className="mini-stat solar">☀️ {city.solar.energy}</span>
                    <span className="mini-stat wind">🌬️ {city.wind.energy}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {user && <NavLink to="/dashboard" onClick={() => setOpen(false)}>Dashboard</NavLink>}
        <NavLink to="/about" onClick={() => setOpen(false)}>About</NavLink>
        <NavLink to="/contact" onClick={() => setOpen(false)}>Contact</NavLink>
        {user ? (
          <div className="navbar-user">
            <span>👤 {user.name}</span>
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
          </div>
        ) : (
          <>
            <NavLink to="/login" onClick={() => setOpen(false)}>Login</NavLink>
            <NavLink to="/signup" onClick={() => setOpen(false)}>Signup</NavLink>
          </>
        )}
      </div>
    </nav>
  );
}
