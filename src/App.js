import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Donors from './pages/Donors';
import Inventory from './pages/Inventory';
import Requests from './pages/Requests';
import Search from './pages/Search';
import DonorDashboard from './pages/DonorDashboard';
import Report from './pages/Report';

// Helper to get current user from localStorage
const getUser = () => JSON.parse(localStorage.getItem('user'));

// Protected Route Component
const PrivateRoute = ({ children, allowedRoles }) => {
  const user = getUser();
  if (!user) return <Navigate to="/login" />;
  if (!allowedRoles.includes(user.role)) return <Navigate to="/unauthorized" />;
  return children;
};

function Footer() {
  return (
    <div style={{
      background: '#1A1A2E',
      padding: '40px 48px',
      textAlign: 'center',
      width: '100%',
      boxSizing: 'border-box',
    }}>
      <div style={{
        fontFamily: 'Georgia, serif',
        fontSize: '24px',
        color: '#fff',
        fontWeight: '700',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px',
        marginBottom: '12px',
      }}>
        <div style={{
          width: '22px', height: '22px',
          background: '#FF4757',
          borderRadius: '50% 50% 50% 0',
          transform: 'rotate(-45deg)',
        }}></div>
        LifeFlow
      </div>
      <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px' }}>
        Blood Donation Management System · Saving Lives Every Day
      </p>
      <p style={{ color: '#888', fontSize: '12px', marginTop: '8px' }}>
        © 2026 LifeFlow. All rights reserved.
      </p>
    </div>
  );
}


function App() {
  return (
    <Router>
      <div style={{ margin: 0, padding: 0, width: '100%', display: 'flex', flexDirection: 'column' }}>
        <Navbar />
        <div style={{ flex: 1 }}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />

            {/* Admin Only */}
            <Route path="/dashboard" element={
              <PrivateRoute allowedRoles={['admin']}>
                <Dashboard />
              </PrivateRoute>
            } />
            <Route path="/donors" element={
              <PrivateRoute allowedRoles={['admin']}>
                <Donors />
              </PrivateRoute>
            } />
            <Route path="/inventory" element={
              <PrivateRoute allowedRoles={['admin', 'hospital']}>
                <Inventory />
              </PrivateRoute>
            } />
            <Route path="/requests" element={
              <PrivateRoute allowedRoles={['admin', 'hospital']}>
                <Requests />
              </PrivateRoute>
            } />
            <Route path="/search" element={
              <PrivateRoute allowedRoles={['admin', 'donor', 'hospital']}>
                <Search />
              </PrivateRoute>
            } />
            <Route path="/report" element={<Report />} />

            {/* Donor Dashboard */}
            <Route path="/donor-dashboard" element={
              <PrivateRoute allowedRoles={['donor']}>
                <DonorDashboard />
              </PrivateRoute>
            } />

            {/* Unauthorized */}
            <Route path="/unauthorized" element={<h2>Access Denied</h2>} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;