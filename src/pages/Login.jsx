import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser, registerUser } from '../services/api';
import { useAuth } from '../AuthContext';

function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [role, setRole] = useState('donor');
  const [form, setForm] = useState({
    username: '', email: '', password: '', confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { saveUser } = useAuth();

  const handleSubmit = () => {
    setError('');
    setLoading(true);

    if (isRegister) {
      if (form.password !== form.confirmPassword) {
        setError('Passwords do not match');
        setLoading(false);
        return;
      }
      registerUser({
        username: form.username,
        email: form.email,
        password: form.password,
        role: role,
      })
        .then(() => {
          setIsRegister(false);
          setError('');
          alert('Account created! Please login.');
          setLoading(false);
        })
        .catch(err => {
          setError(err.response?.data?.error || 'Registration failed');
          setLoading(false);
        });
    } else {
      loginUser({
        username: form.username,
        password: form.password,
      }).then(res => {
  saveUser(res.data);
  localStorage.setItem('token', res.data.token);
  localStorage.setItem('user', JSON.stringify(res.data));
  if (res.data.role === 'admin') navigate('/dashboard');
  else if (res.data.role === 'donor') navigate('/donor-dashboard');
  else if (res.data.role === 'hospital') navigate('/requests');
  setLoading(false);
})
        .catch(err => {
          setError(err.response?.data?.error || 'Invalid credentials');
          setLoading(false);
        });
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: 'calc(100vh - 64px)' }}>

      {/* LEFT */}
      <div style={styles.left}>
        <div style={styles.tag}>LifeFlow Portal</div>
        <h2 style={styles.h2}>
          {isRegister ? 'Join LifeFlow' : 'Welcome Back'}
        </h2>
        <p style={{ color: '#999', marginTop: '16px', lineHeight: '1.7' }}>
          {isRegister
            ? 'Create an account to start donating and saving lives.'
            : 'Sign in to manage donors, track blood inventory, and handle requests.'}
        </p>
        <div style={{ display: 'flex', gap: '24px', marginTop: '48px' }}>
          {[['1,248','Donors'],['342','Units'],['89','Saved']].map(([num, label], i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'serif', fontSize: '24px', color: '#fff', fontWeight: '900' }}>{num}</div>
              <div style={{ fontSize: '12px', color: '#888', marginTop: '2px' }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT */}
      <div style={styles.right}>
        <h3 style={{ fontFamily: 'serif', fontSize: '28px', marginBottom: '8px' }}>
          {isRegister ? 'Create Account' : 'Sign In'}
        </h3>
        <p style={{ color: '#6B7280', marginBottom: '28px', fontSize: '14px' }}>
          {isRegister ? 'Fill in your details below' : 'Enter your credentials to continue'}
        </p>

        {/* Role Selector */}
        <div style={{ marginBottom: '20px' }}>
          <div style={styles.roleLabel}>I am a</div>
          <div style={{ display: 'flex', gap: '10px' }}>
            {['donor','hospital','admin'].map(r => (
              <button key={r} onClick={() => setRole(r)} style={{
                ...styles.roleBtn,
                border: role === r ? '1.5px solid #C0392B' : '1.5px solid #E8DDD6',
                background: role === r ? '#FFF5F5' : '#fff',
                color: role === r ? '#C0392B' : '#1A1A1A',
              }}>
                {r === 'donor' ? '🩸' : r === 'hospital' ? '🏥' : '⚙️'} {r.charAt(0).toUpperCase() + r.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div style={styles.errorBox}>{error}</div>
        )}

        {/* Form Fields */}
        <div style={styles.formGroup}>
          <label style={styles.label}>Username</label>
          <input
            style={styles.input}
            placeholder="Enter username"
            value={form.username}
            onChange={e => setForm({ ...form, username: e.target.value })}
          />
        </div>

        {isRegister && (
          <div style={styles.formGroup}>
            <label style={styles.label}>Email</label>
            <input
              style={styles.input}
              type="email"
              placeholder="your@email.com"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
            />
          </div>
        )}

        <div style={styles.formGroup}>
          <label style={styles.label}>Password</label>
          <input
            style={styles.input}
            type="password"
            placeholder="••••••••"
            value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
          />
        </div>

        {isRegister && (
          <div style={{ ...styles.formGroup, marginBottom: '24px' }}>
            <label style={styles.label}>Confirm Password</label>
            <input
              style={styles.input}
              type="password"
              placeholder="••••••••"
              value={form.confirmPassword}
              onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
            />
          </div>
        )}

        <button
          style={{ ...styles.btnRed, marginTop: '8px', opacity: loading ? 0.7 : 1 }}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? 'Please wait...' : isRegister ? 'Create Account' : 'Sign In'}
        </button>

        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px', color: '#6B7280' }}>
          {isRegister ? 'Already have an account? ' : 'New user? '}
          <span
            style={{ color: '#C0392B', fontWeight: '600', cursor: 'pointer' }}
            onClick={() => { setIsRegister(!isRegister); setError(''); }}
          >
            {isRegister ? 'Sign In' : 'Create Account'}
          </span>
        </div>
      </div>
    </div>
  );
}

const styles = {
  left: { background: '#1A1A1A', padding: '60px', display: 'flex', flexDirection: 'column', justifyContent: 'center' },
  tag: { display: 'inline-block', background: 'rgba(192,57,43,0.2)', color: '#E74C3C', fontSize: '12px', fontWeight: '600', padding: '6px 14px', borderRadius: '20px', marginBottom: '32px' },
  h2: { fontFamily: 'serif', fontSize: '40px', color: '#fff', lineHeight: '1.2' },
  right: { background: '#FFF9F5', padding: '60px', display: 'flex', flexDirection: 'column', justifyContent: 'center' },
  roleLabel: { fontSize: '12px', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase', color: '#6B7280', marginBottom: '10px' },
  roleBtn: { flex: 1, padding: '10px', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' },
  formGroup: { display: 'flex', flexDirection: 'column', gap: '7px', marginBottom: '16px' },
  label: { fontSize: '12px', fontWeight: '700', letterSpacing: '0.8px', textTransform: 'uppercase', color: '#6B7280' },
  input: { padding: '12px 16px', border: '1.5px solid #E8DDD6', borderRadius: '10px', fontSize: '14px', outline: 'none', background: '#fff' },
  btnRed: { width: '100%', padding: '14px', background: '#C0392B', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: '600', cursor: 'pointer' },
  errorBox: { background: '#FEE2E2', color: '#991B1B', padding: '12px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: '500', marginBottom: '16px' },
};

export default Login;