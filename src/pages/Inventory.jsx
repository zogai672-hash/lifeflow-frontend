import React, { useState, useEffect } from 'react';
import { getInventory, updateInventory, getDonations } from '../services/api';

function Inventory() {
  const [inventory, setInventory] = useState([]);
  const [donations, setDonations] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editUnits, setEditUnits] = useState('');

  useEffect(() => {
    loadInventory();
    loadDonations();
  }, []);

  const loadInventory = () => {
    getInventory()
      .then(res => setInventory(res.data))
      .catch(err => console.log(err));
  };

  const loadDonations = () => {
    getDonations()
      .then(res => setDonations(res.data))
      .catch(err => console.log(err));
  };

  const handleUpdate = (item) => {
    updateInventory(item.id, {
      ...item,
      units_available: parseInt(editUnits),
    })
      .then(() => {
        setEditingId(null);
        loadInventory();
      })
      .catch(err => console.log(err));
  };

  const getStatusColor = (item) => {
    if (item.units_available < item.minimum_threshold) return '#C0392B';
    if (item.units_available < item.minimum_threshold * 2) return '#F39C12';
    return '#27AE60';
  };

  const getStatusLabel = (item) => {
    if (item.units_available < item.minimum_threshold) return 'Critical';
    if (item.units_available < item.minimum_threshold * 2) return 'Low';
    return 'Good';
  };

  const getBarWidth = (item) => {
    const percent = (item.units_available / (item.minimum_threshold * 5)) * 100;
    return Math.min(percent, 100) + '%';
  };

  return (
    <div style={{ background: '#FDF6F0', minHeight: '100vh', padding: '40px 48px' }}>

      {/* HEADER */}
      <h1 style={styles.title}>Blood Inventory</h1>
      <p style={styles.sub}>Track and update blood stock levels across all types</p>

      {/* INVENTORY CARDS */}
      <div style={styles.invGrid}>
        {inventory.length > 0 ? inventory.map((item, i) => (
          <div key={i} style={{
            ...styles.invCard,
            border: '1.5px solid ' + (item.units_available < item.minimum_threshold ? '#C0392B' : '#E8DDD6'),
            background: item.units_available < item.minimum_threshold ? '#FFF5F5' : '#fff',
          }}>
            {/* Top Row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div style={styles.bloodType}>{item.blood_type}</div>
              <span style={{
                ...styles.badge,
                background: getStatusLabel(item) === 'Good' ? '#D1FAE5' : getStatusLabel(item) === 'Low' ? '#FEF3C7' : '#FEE2E2',
                color: getStatusLabel(item) === 'Good' ? '#065F46' : getStatusLabel(item) === 'Low' ? '#92400E' : '#991B1B',
              }}>
                {getStatusLabel(item)}
              </span>
            </div>

            {/* Units */}
            {editingId === item.id ? (
              <div style={{ marginBottom: '12px' }}>
                <input
                  style={styles.editInput}
                  type="number"
                  value={editUnits}
                  onChange={e => setEditUnits(e.target.value)}
                  autoFocus
                />
              </div>
            ) : (
              <div style={{ marginBottom: '12px' }}>
                <span style={styles.unitNum}>{item.units_available}</span>
                <span style={styles.unitLabel}> units</span>
              </div>
            )}

            {/* Progress Bar */}
            <div style={styles.barBg}>
              <div style={{
                ...styles.barFill,
                width: getBarWidth(item),
                background: getStatusColor(item),
              }}></div>
            </div>

            {/* Min/Max info */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '11px', color: '#6B7280' }}>
              <span>Min: {item.minimum_threshold}</span>
              <span>Last updated: {new Date(item.last_updated).toLocaleDateString()}</span>
            </div>

            {/* Action Buttons */}
            <div style={{ marginTop: '14px' }}>
              {editingId === item.id ? (
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button style={styles.btnSave} onClick={() => handleUpdate(item)}>Save</button>
                  <button style={styles.btnCancel} onClick={() => setEditingId(null)}>Cancel</button>
                </div>
              ) : (
                <button
                  style={styles.btnUpdate}
                  onClick={() => {
                    setEditingId(item.id);
                    setEditUnits(item.units_available);
                  }}
                >
                  Update Stock
                </button>
              )}
            </div>
          </div>
        )) : (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '60px', color: '#6B7280' }}>
            No inventory data found. Add blood types from the Django admin panel first.
          </div>
        )}
      </div>

      {/* DONATION HISTORY */}
      <div style={styles.tableCard}>
        <div style={styles.tableHeader}>
          <h2 style={styles.sectionTitle}>Donation & Issue History</h2>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {['ID', 'Blood Type', 'Units', 'Type', 'Date', 'Notes'].map((h, i) => (
                <th key={i} style={styles.th}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {donations.length > 0 ? donations.map((d, i) => (
              <tr key={i} style={{ borderBottom: '1px solid #F3F0ED' }}>
                <td style={{ ...styles.td, color: '#6B7280', fontSize: '12px' }}>
                  #TXN-{d.id}
                </td>
                <td style={styles.td}>
                  <div style={styles.bloodBadge}>{d.blood_type}</div>
                </td>
                <td style={styles.td}>{d.units}</td>
                <td style={styles.td}>
                  <span style={{
                    ...styles.badge,
                    background: d.transaction_type === 'donation' ? '#D1FAE5' : '#FEE2E2',
                    color: d.transaction_type === 'donation' ? '#065F46' : '#991B1B',
                  }}>
                    {d.transaction_type}
                  </span>
                </td>
                <td style={styles.td}>
                  {new Date(d.date).toLocaleDateString()}
                </td>
                <td style={{ ...styles.td, color: '#6B7280', fontSize: '13px' }}>
                  {d.notes || '--'}
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: '#6B7280' }}>
                  No donation records yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>


    </div>
  );
}

const styles = {
  title: { fontFamily: 'serif', fontSize: '28px', marginBottom: '6px' },
  sub: { color: '#6B7280', fontSize: '14px', marginBottom: '28px' },
  invGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '28px' },
  invCard: { background: '#fff', border: '1.5px solid #E8DDD6', borderRadius: '16px', padding: '20px' },
  bloodType: { fontFamily: 'serif', fontSize: '32px', fontWeight: '900', color: '#C0392B' },
  badge: { display: 'inline-block', padding: '4px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: '700' },
  unitNum: { fontFamily: 'serif', fontSize: '28px', fontWeight: '700', color: '#1A1A1A' },
  unitLabel: { fontSize: '14px', color: '#6B7280' },
  barBg: { height: '6px', background: '#F3F0ED', borderRadius: '3px', overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: '3px', transition: 'width 0.5s ease' },
  editInput: { width: '100%', padding: '10px 14px', border: '1.5px solid #C0392B', borderRadius: '8px', fontSize: '18px', fontWeight: '700', outline: 'none', fontFamily: 'serif' },
  btnUpdate: { width: '100%', padding: '10px', background: '#C0392B', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' },
  btnSave: { flex: 1, padding: '10px', background: '#27AE60', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' },
  btnCancel: { flex: 1, padding: '10px', background: '#F3F0ED', color: '#1A1A1A', border: '1px solid #E8DDD6', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' },
  tableCard: { background: '#fff', border: '1.5px solid #E8DDD6', borderRadius: '16px', overflow: 'hidden' },
  tableHeader: { padding: '20px 24px', borderBottom: '1px solid #E8DDD6' },
  sectionTitle: { fontFamily: 'serif', fontSize: '20px', fontWeight: '700' },
  th: { textAlign: 'left', fontSize: '11px', fontWeight: '700', letterSpacing: '1.5px', textTransform: 'uppercase', color: '#6B7280', padding: '14px 16px', borderBottom: '1.5px solid #E8DDD6' },
  td: { padding: '14px 16px', fontSize: '14px', verticalAlign: 'middle' },
  bloodBadge: { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', background: '#C0392B', color: '#fff', borderRadius: '8px', fontWeight: '700', fontSize: '13px' },
};

export default Inventory;