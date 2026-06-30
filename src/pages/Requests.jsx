import React, { useState, useEffect } from 'react';
import { getRequests, createRequest, updateRequest } from '../services/api';

function Requests() {
  const [requests, setRequests] = useState([]);
  const [filter, setFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    requester_name: '',
    hospital: '',
    blood_type: '',
    units_needed: '',
    priority: 'normal',
    notes: '',
  });

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = () => {
    getRequests()
      .then(res => setRequests(res.data))
      .catch(err => console.log(err));
  };

  const handleSubmit = () => {
    createRequest(form)
      .then(() => {
        setShowForm(false);
        setForm({
          requester_name: '',
          hospital: '',
          blood_type: '',
          units_needed: '',
          priority: 'normal',
          notes: '',
        });
        loadRequests();
      })
      .catch(err => console.log(err));
  };

  const handleStatusUpdate = (id, status) => {
    const request = requests.find(r => r.id === id);
    updateRequest(id, { ...request, status })
      .then(() => loadRequests())
      .catch(err => console.log(err));
  };

  const filtered = requests.filter(r => {
    if (filter === 'all') return true;
    return r.priority === filter || r.status === filter;
  });

  const getPriorityStyle = (priority) => {
    if (priority === 'critical') return { background: '#FEE2E2', color: '#991B1B' };
    if (priority === 'urgent') return { background: '#FEF3C7', color: '#92400E' };
    return { background: '#D1FAE5', color: '#065F46' };
  };

  const getStatusStyle = (status) => {
    if (status === 'pending') return { background: '#FEF3C7', color: '#92400E' };
    if (status === 'processing') return { background: '#DBEAFE', color: '#1E40AF' };
    if (status === 'fulfilled') return { background: '#D1FAE5', color: '#065F46' };
    return { background: '#FEE2E2', color: '#991B1B' };
  };

  const counts = {
    all: requests.length,
    critical: requests.filter(r => r.priority === 'critical').length,
    urgent: requests.filter(r => r.priority === 'urgent').length,
    normal: requests.filter(r => r.priority === 'normal').length,
  };

  return (
    <div style={{ background: '#FDF6F0', minHeight: '100vh', padding: '40px 48px' }}>

      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
        <div>
          <h1 style={styles.title}>Blood Request Management</h1>
          <p style={styles.sub}>Manage hospital and patient blood requests</p>
        </div>
        <button style={styles.btnRed} onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ New Request'}
        </button>
      </div>

      {/* NEW REQUEST FORM */}
      {showForm && (
        <div style={styles.formCard}>
          <h3 style={{ fontFamily: 'serif', fontSize: '18px', marginBottom: '20px', color: '#C0392B' }}>
            Submit Blood Request
          </h3>
          <div style={styles.formGrid}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Requester Name</label>
              <input
                style={styles.input}
                placeholder="e.g. Dr. Mensah"
                value={form.requester_name}
                onChange={e => setForm({ ...form, requester_name: e.target.value })}
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Hospital</label>
              <input
                style={styles.input}
                placeholder="e.g. Korle-Bu Teaching Hospital"
                value={form.hospital}
                onChange={e => setForm({ ...form, hospital: e.target.value })}
              />
            </div>
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
            <div style={styles.formGroup}>
              <label style={styles.label}>Units Needed</label>
              <input
                style={styles.input}
                type="number"
                placeholder="e.g. 2"
                value={form.units_needed}
                onChange={e => setForm({ ...form, units_needed: e.target.value })}
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Priority</label>
              <select
                style={styles.input}
                value={form.priority}
                onChange={e => setForm({ ...form, priority: e.target.value })}
              >
                <option value="normal">Normal</option>
                <option value="urgent">Urgent</option>
                <option value="critical">Critical</option>
              </select>
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Notes (Optional)</label>
              <input
                style={styles.input}
                placeholder="Any additional notes..."
                value={form.notes}
                onChange={e => setForm({ ...form, notes: e.target.value })}
              />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '20px' }}>
            <button style={styles.btnGhost} onClick={() => setShowForm(false)}>Cancel</button>
            <button style={styles.btnRed} onClick={handleSubmit}>Submit Request</button>
          </div>
        </div>
      )}

      {/* FILTER TABS */}
      <div style={styles.filterBar}>
        {[
          { key: 'all', label: 'All', count: counts.all },
          { key: 'critical', label: 'Critical', count: counts.critical },
          { key: 'urgent', label: 'Urgent', count: counts.urgent },
          { key: 'normal', label: 'Normal', count: counts.normal },
        ].map((f, i) => (
          <button
            key={i}
            onClick={() => setFilter(f.key)}
            style={{
              ...styles.filterBtn,
              background: filter === f.key ? '#1A1A1A' : '#fff',
              color: filter === f.key ? '#fff' : '#6B7280',
              border: filter === f.key ? '1.5px solid #1A1A1A' : '1.5px solid #E8DDD6',
            }}
          >
            {f.label} ({f.count})
          </button>
        ))}
      </div>

      {/* REQUESTS TABLE */}
      <div style={styles.tableCard}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {['ID', 'Requester', 'Blood Type', 'Units', 'Priority', 'Status', 'Date', 'Actions'].map((h, i) => (
                <th key={i} style={styles.th}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length > 0 ? filtered.map((req, i) => (
              <tr key={i} style={{ borderBottom: '1px solid #F3F0ED' }}>
                <td style={{ ...styles.td, color: '#6B7280', fontSize: '12px' }}>
                  #R-{req.id}
                </td>
                <td style={styles.td}>
                  <div style={{ fontWeight: '600' }}>{req.hospital}</div>
                  <div style={{ fontSize: '12px', color: '#6B7280' }}>{req.requester_name}</div>
                </td>
                <td style={styles.td}>
                  <div style={styles.bloodBadge}>{req.blood_type}</div>
                </td>
                <td style={styles.td}>{req.units_needed} units</td>
                <td style={styles.td}>
                  <span style={{ ...styles.badge, ...getPriorityStyle(req.priority) }}>
                    {req.priority}
                  </span>
                </td>
                <td style={styles.td}>
                  <span style={{ ...styles.badge, ...getStatusStyle(req.status) }}>
                    {req.status}
                  </span>
                </td>
                <td style={{ ...styles.td, fontSize: '13px', color: '#6B7280' }}>
                  {new Date(req.date_requested).toLocaleDateString()}
                </td>
                <td style={styles.td}>
                  {req.status === 'pending' && (
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button
                        style={styles.btnApprove}
                        onClick={() => handleStatusUpdate(req.id, 'processing')}
                      >
                        Approve
                      </button>
                      <button
                        style={styles.btnReject}
                        onClick={() => handleStatusUpdate(req.id, 'rejected')}
                      >
                        Reject
                      </button>
                    </div>
                  )}
                  {req.status === 'processing' && (
                    <button
                      style={styles.btnApprove}
                      onClick={() => handleStatusUpdate(req.id, 'fulfilled')}
                    >
                      Mark Fulfilled
                    </button>
                  )}
                  {(req.status === 'fulfilled' || req.status === 'rejected') && (
                    <span style={{ fontSize: '12px', color: '#6B7280' }}>Closed</span>
                  )}
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center', padding: '40px', color: '#6B7280' }}>
                  No requests found. Submit a new request above!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: '14px', fontSize: '13px', color: '#6B7280' }}>
        Showing {filtered.length} of {requests.length} requests
      </div>

    

    </div>
  );
}

const styles = {
  title: { fontFamily: 'serif', fontSize: '28px', marginBottom: '6px' },
  sub: { color: '#6B7280', fontSize: '14px' },
  btnRed: { padding: '12px 24px', background: '#C0392B', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' },
  btnGhost: { padding: '12px 24px', background: '#F3F0ED', color: '#1A1A1A', border: '1px solid #E8DDD6', borderRadius: '10px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' },
  btnApprove: { padding: '6px 12px', background: '#D1FAE5', color: '#065F46', border: 'none', borderRadius: '7px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' },
  btnReject: { padding: '6px 12px', background: '#FEE2E2', color: '#991B1B', border: 'none', borderRadius: '7px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' },
  formCard: { background: '#fff', border: '1.5px solid #E8DDD6', borderRadius: '16px', padding: '28px', marginBottom: '24px' },
  formGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' },
  formGroup: { display: 'flex', flexDirection: 'column', gap: '7px' },
  label: { fontSize: '12px', fontWeight: '700', letterSpacing: '0.8px', textTransform: 'uppercase', color: '#6B7280' },
  input: { padding: '11px 14px', border: '1.5px solid #E8DDD6', borderRadius: '10px', fontSize: '14px', outline: 'none', fontFamily: 'inherit' },
  filterBar: { display: 'flex', gap: '8px', marginBottom: '20px' },
  filterBtn: { padding: '8px 18px', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' },
  tableCard: { background: '#fff', border: '1.5px solid #E8DDD6', borderRadius: '16px', overflow: 'hidden' },
  th: { textAlign: 'left', fontSize: '11px', fontWeight: '700', letterSpacing: '1.5px', textTransform: 'uppercase', color: '#6B7280', padding: '14px 16px', borderBottom: '1.5px solid #E8DDD6' },
  td: { padding: '14px 16px', fontSize: '14px', verticalAlign: 'middle' },
  bloodBadge: { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', background: '#C0392B', color: '#fff', borderRadius: '8px', fontWeight: '700', fontSize: '13px' },
  badge: { display: 'inline-block', padding: '4px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: '700' },
};

export default Requests;