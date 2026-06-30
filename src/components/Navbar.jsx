import React, { useState }  from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

function Navbar() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;
  const { user, clearUser } = useAuth();
const navigate = useNavigate();
const [showDropdown, setShowDropdown] = useState(false);

const handleLogout = function() {
  clearUser();
  localStorage.removeItem('lifeflow_user');
  navigate('/login');
};

  return (
    <nav style={styles.nav}>
      <div style={styles.logo}>
        <div style={styles.logoDrop}></div>
        LifeFlow
      </div>
      <div style={styles.links}>
        <Link to="/" style={{...styles.link, ...(isActive('/') ? styles.active : {})}}>Home</Link>
        <Link to="/dashboard" style={{...styles.link, ...(isActive('/dashboard') ? styles.active : {})}}>Dashboard</Link>
        <Link to="/donors" style={{...styles.link, ...(isActive('/donors') ? styles.active : {})}}>Donors</Link>
        <Link to="/inventory" style={{...styles.link, ...(isActive('/inventory') ? styles.active : {})}}>Inventory</Link>
        <Link to="/requests" style={{...styles.link, ...(isActive('/requests') ? styles.active : {})}}>Requests</Link>
        <Link to="/search" style={{...styles.link, ...(isActive('/search') ? styles.active : {})}}>Search</Link>
        {user ? (
  <div style={{ position: 'relative' }}>
    <button
      onClick={function() { setShowDropdown(!showDropdown); }}
      style={{ ...styles.link, ...styles.btnRed, border: 'none', cursor: 'pointer' }}
    >
      {user.username || 'Admin'} v
    </button>
    {showDropdown && (
      <div style={{ position: 'absolute', right: 0, top: '40px', background: '#fff', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', minWidth: '140px', zIndex: 999 }}>
        <button
          onClick={handleLogout}
          style={{ display: 'block', width: '100%', padding: '12px 16px', background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer', color: '#C0392B', fontWeight: '600', fontSize: '14px' }}
        >
          Logout
        </button>
      </div>
    )}
  </div>
) : (
  <Link to="/login" style={{...styles.link, ...styles.btnRed}}>Login</Link>
)}
      </div>
    </nav>
  );
}

const styles = {
  nav: { background: '#1A1A1A', padding: '0 48px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px', position: 'sticky', top: 0, zIndex: 100 },
  logo: { fontFamily: 'serif', fontSize: '22px', color: '#fff', display: 'flex', alignItems: 'center', gap: '10px', fontWeight: '700' },
  logoDrop: { width: '24px', height: '24px', background: '#C0392B', borderRadius: '50% 50% 50% 0', transform: 'rotate(-45deg)' },
  links: { display: 'flex', gap: '8px', alignItems: 'center' },
  link: { color: '#ccc', textDecoration: 'none', padding: '6px 14px', borderRadius: '6px', fontSize: '14px', fontWeight: '500' },
  active: { color: '#fff', background: 'rgba(255,255,255,0.1)' },
  btnRed: { background: '#C0392B', color: '#fff', borderRadius: '8px' },
};

export default Navbar;