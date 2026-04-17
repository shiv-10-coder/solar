import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">⚡ EnergyPredict</Link>
      <button className="hamburger" onClick={() => setOpen(!open)}>☰</button>
      <div className={`navbar-links ${open ? 'open' : ''}`}>
        <NavLink to="/" end onClick={() => setOpen(false)}>Home</NavLink>
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
