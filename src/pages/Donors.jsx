import React, { useState, useEffect } from 'react';
import { getDonors, deleteDonor, createDonor } from '../services/api';

function Donors() {
  const [donors, setDonors] = useState([]);
  const [search, setSearch] = useState('');
  const [bloodFilter, setBloodFilter] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    first_name: '', last_name: '', blood_type: '',
    date_of_birth: '', phone: '', email: '',
    location: '', weight: '', medical_notes: '',
  });

  useEffect(() => {
    loadDonors();
  }, []);

  const loadDonors = () => {
    getDonors()
      .then(res => setDonors(res.data))
      .catch(err => console.log(err));
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this donor?')) {
      deleteDonor(id).then(() => loadDonors());
    }
  };

  const handleSubmit = () => {
  if (!form.first_name || !form.last_name || !form.blood_type || 
      !form.date_of_birth || !form.phone || !form.email || 
      !form.location || !form.weight) {
    alert('Please fill in all required fields!');
  
    return;
  }

  const donorData = {
    first_name: form.first_name,
    last_name: form.last_name,
    blood_type: form.blood_type,
    date_of_birth: form.date_of_birth,
    phone: form.phone,
    email: form.email,
    location: form.location,
    address: form.location,
    weight: parseFloat(form.weight),
    medical_notes: form.medical_notes || '',
    status: 'active',
  };

  createDonor(donorData)
    .then(() => {
      setShowForm(false);
      setForm({
        first_name: '', last_name: '', blood_type: '',
        date_of_birth: '', phone: '', email: '',
        location: '', weight: '', medical_notes: '',
      });
      loadDonors();
      alert('Donor registered successfully!');
    })
    .catch(function(err) {
  console.log('Error details:', err.response?.data);
  alert('Error: ' + JSON.stringify(err.response?.data));
});
};

  const filtered = donors.filter(d => {
    const matchSearch =
      d.first_name.toLowerCase().includes(search.toLowerCase()) ||
      d.last_name.toLowerCase().includes(search.toLowerCase()) ||
      d.email.toLowerCase().includes(search.toLowerCase());
    const matchBlood = bloodFilter ? d.blood_type === bloodFilter : true;
    return matchSearch && matchBlood;
  });

  return (
    <div style={{ background: '#FDF6F0', minHeight: '100vh', padding: '40px 48px' }}>

      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
        <div>
          <h1 style={styles.title}>Donor Management</h1>
          <p style={styles.sub}>View, add and manage all registered donors</p>
        </div>
        <button style={styles.btnRed} onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ Add New Donor'}
        </button>
      </div>

      {/* ADD DONOR FORM */}
      {showForm && (
        <div style={styles.formCard}>
          <h3 style={{ fontFamily: 'serif', fontSize: '18px', marginBottom: '20px', color: '#C0392B' }}>
            Register New Donor
          </h3>
          <div style={styles.formGrid}>
            {[
              { key: 'first_name', label: 'First Name', type: 'text', placeholder: 'e.g. Kwame' },
              { key: 'last_name', label: 'Last Name', type: 'text', placeholder: 'e.g. Mensah' },
              { key: 'date_of_birth', label: 'Date of Birth', type: 'date', placeholder: '' },
              { key: 'phone', label: 'Phone Number', type: 'text', placeholder: '+233 XX XXX XXXX' },
              { key: 'email', label: 'Email', type: 'email', placeholder: 'donor@email.com' },
              { key: 'location', label: 'Location', type: 'text', placeholder: 'e.g. Accra' },
              { key: 'weight', label: 'Weight (kg)', type: 'number', placeholder: 'e.g. 65' },
            ].map((field, i) => (
              <div key={i} style={styles.formGroup}>
                <label style={styles.label}>{field.label}</label>
                <input
                  style={styles.input}
                  type={field.type}
                  placeholder={field.placeholder}
                  value={form[field.key]}
                  onChange={e => setForm({ ...form, [field.key]: e.target.value })}
                />
              </div>
            ))}

            <div style={styles.formGroup}>
              <label style={styles.label}>Blood Type</label>
              <select
                style={styles.input}
                value={form.blood_type}
                onChange={e => setForm({ ...form, blood_type: e.target.value })}
              >
                <option value="">Select Blood Type</option>
                {['A+','A-','B+','B-','O+','O-','AB+','AB-'].map(bt => (
                  <option key={bt} value={bt}>{bt}</option>
                ))}
              </select>
            </div>

            <div style={{ ...styles.formGroup, gridColumn: '1 / -1' }}>
              <label style={styles.label}>Medical Notes (Optional)</label>
              <textarea
                style={{ ...styles.input, minHeight: '80px', resize: 'vertical' }}
                placeholder="Any relevant medical history..."
                value={form.medical_notes}
                onChange={e => setForm({ ...form, medical_notes: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '20px' }}>
            <button style={styles.btnGhost} onClick={() => setShowForm(false)}>Cancel</button>
            <button style={styles.btnRed} onClick={handleSubmit}>Register Donor</button>
          </div>
        </div>
      )}

      {/* SEARCH & FILTER */}
      <div style={styles.searchBar}>
        <input
          style={styles.searchInput}
          placeholder="Search by name or email..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select
          style={styles.select}
          value={bloodFilter}
          onChange={e => setBloodFilter(e.target.value)}
        >
          <option value="">All Blood Types</option>
          {['A+','A-','B+','B-','O+','O-','AB+','AB-'].map(bt => (
            <option key={bt} value={bt}>{bt}</option>
          ))}
        </select>
      </div>

      {/* DONORS TABLE */}
      <div style={styles.tableCard}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {['Donor', 'Blood Type', 'Phone', 'Location', 'Status', 'Actions'].map((h, i) => (
                <th key={i} style={styles.th}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length > 0 ? filtered.map((donor, i) => (
              <tr key={i} style={{ borderBottom: '1px solid #F3F0ED' }}>
                <td style={styles.td}>
                  <div style={{ fontWeight: '600' }}>{donor.first_name} {donor.last_name}</div>
                  <div style={{ fontSize: '12px', color: '#6B7280' }}>{donor.email}</div>
                </td>
                <td style={styles.td}>
                  <div style={styles.bloodBadge}>{donor.blood_type}</div>
                </td>
                <td style={styles.td}>{donor.phone}</td>
                <td style={styles.td}>{donor.location}</td>
                <td style={styles.td}>
                  <span style={{
                    ...styles.badge,
                    background: donor.status === 'active' ? '#D1FAE5' : '#FEE2E2',
                    color: donor.status === 'active' ? '#065F46' : '#991B1B',
                  }}>
                    {donor.status}
                  </span>
                </td>
                <td style={styles.td}>
                  <button
                    style={styles.btnDelete}
                    onClick={() => handleDelete(donor.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: '#6B7280' }}>
                  No donors found. Add your first donor above!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: '14px', fontSize: '13px', color: '#6B7280' }}>
        Showing {filtered.length} of {donors.length} donors
      </div>


    </div>
  );
}

const styles = {
  title: { fontFamily: 'serif', fontSize: '28px', marginBottom: '6px' },
  sub: { color: '#6B7280', fontSize: '14px' },
  btnRed: { padding: '12px 24px', background: '#C0392B', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' },
  btnGhost: { padding: '12px 24px', background: '#F3F0ED', color: '#1A1A1A', border: '1px solid #E8DDD6', borderRadius: '10px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' },
  btnDelete: { padding: '6px 14px', background: '#FEE2E2', color: '#991B1B', border: 'none', borderRadius: '7px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' },
  formCard: { background: '#fff', border: '1.5px solid #E8DDD6', borderRadius: '16px', padding: '28px', marginBottom: '24px' },
  formGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' },
  formGroup: { display: 'flex', flexDirection: 'column', gap: '7px' },
  label: { fontSize: '12px', fontWeight: '700', letterSpacing: '0.8px', textTransform: 'uppercase', color: '#6B7280' },
  input: { padding: '11px 14px', border: '1.5px solid #E8DDD6', borderRadius: '10px', fontSize: '14px', outline: 'none', fontFamily: 'inherit' },
  searchBar: { display: 'flex', gap: '12px', marginBottom: '20px' },
  searchInput: { flex: 1, padding: '11px 16px', border: '1.5px solid #E8DDD6', borderRadius: '10px', fontSize: '14px', outline: 'none' },
  select: { padding: '11px 16px', border: '1.5px solid #E8DDD6', borderRadius: '10px', fontSize: '14px', outline: 'none', background: '#fff' },
  tableCard: { background: '#fff', border: '1.5px solid #E8DDD6', borderRadius: '16px', overflow: 'hidden' },
  th: { textAlign: 'left', fontSize: '11px', fontWeight: '700', letterSpacing: '1.5px', textTransform: 'uppercase', color: '#6B7280', padding: '14px 16px', borderBottom: '1.5px solid #E8DDD6' },
  td: { padding: '14px 16px', fontSize: '14px', verticalAlign: 'middle' },
  bloodBadge: { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', background: '#C0392B', color: '#fff', borderRadius: '8px', fontWeight: '700', fontSize: '13px' },
  badge: { display: 'inline-block', padding: '4px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: '700' },
};

export default Donors;