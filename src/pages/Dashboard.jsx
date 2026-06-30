import React, { useState, useEffect } from 'react';
import { getDashboardStats } from '../services/api';

function Dashboard() {
  const [stats, setStats] = useState({
    total_donors: 0,
    total_requests: 0,
    pending_requests: 0,
    critical_requests: 0,
    inventory: [],
  });

  useEffect(() => {
    getDashboardStats()
      .then(res => setStats(res.data))
      .catch(err => console.log(err));
  }, []);

  const cards = [
    { icon: '👥', num: stats.total_donors, label: 'Total Donors', color: '#C0392B' },
    { icon: '🩸', num: stats.inventory.reduce((a, b) => a + b.units_available, 0), label: 'Units in Stock', color: '#27AE60' },
    { icon: '📋', num: stats.pending_requests, label: 'Pending Requests', color: '#2980B9' },
    { icon: '🚨', num: stats.critical_requests, label: 'Critical Requests', color: '#E67E22' },
  ];

  return (
    <div style={{ background: '#FDF6F0', minHeight: '100vh', padding: '40px 48px' }}>

      <div style={styles.pageHeader}>
        <div>
          <h1 style={styles.title}>Admin Dashboard</h1>
          <p style={styles.sub}>Welcome back, Admin. Here is today's overview.</p>
        </div>
      </div>

      {/* STAT CARDS */}
      <div style={styles.cardGrid}>
        {cards.map((c, i) => (
          <div key={i} style={{ ...styles.card, borderTop: '3px solid ' + c.color }}>
            <div style={styles.cardIcon}>{c.icon}</div>
            <div style={styles.cardNum}>{c.num}</div>
            <div style={styles.cardLabel}>{c.label}</div>
          </div>
        ))}
      </div>

      {/* INVENTORY STATUS */}
      <div style={styles.section}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>Blood Inventory Status</h2>
        </div>
        <div style={styles.inventoryGrid}>
          {stats.inventory.length > 0
            ? stats.inventory.map((item, i) => (
                <div key={i} style={{
                  ...styles.invCard,
                  border: item.units_available < item.minimum_threshold
                    ? '1.5px solid #C0392B' : '1.5px solid #E8DDD6',
                  background: item.units_available < item.minimum_threshold
                    ? '#FFF5F5' : '#fff',
                }}>
                  <div style={styles.bloodType}>{item.blood_type}</div>
                  <div style={styles.bloodNum}>{item.units_available}</div>
                  <div style={styles.bloodLabel}>units</div>
                  <div style={{
                    ...styles.statusBadge,
                    background: item.units_available < item.minimum_threshold ? '#FEE2E2' : '#D1FAE5',
                    color: item.units_available < item.minimum_threshold ? '#991B1B' : '#065F46',
                  }}>
                    {item.units_available < item.minimum_threshold ? 'Critical' : 'Good'}
                  </div>
                </div>
              ))
            : ['A+','A-','B+','B-','O+','O-','AB+','AB-'].map((bt, i) => (
                <div key={i} style={styles.invCard}>
                  <div style={styles.bloodType}>{bt}</div>
                  <div style={styles.bloodNum}>--</div>
                  <div style={styles.bloodLabel}>units</div>
                </div>
              ))
          }
        </div>
      </div>

      {/* QUICK ACTIONS */}
      <div style={styles.section}>
        <h2 style={{ ...styles.sectionTitle, marginBottom: '16px' }}>Quick Actions</h2>
        <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
          {[
            { label: 'Add New Donor', link: '/donors', color: '#C0392B' },
            { label: 'Update Inventory', link: '/inventory', color: '#27AE60' },
            { label: 'View Requests', link: '/requests', color: '#2980B9' },
            { label: 'Search Blood', link: '/search', color: '#8E44AD' },
            { label: 'Generate Report', link: '/report', color: '#E67E22'}
          ].map((btn, i) => (
            <a key={i} href={btn.link} style={{
              padding: '12px 24px',
              background: btn.color,
              color: '#fff',
              borderRadius: '10px',
              textDecoration: 'none',
              fontWeight: '600',
              fontSize: '14px',
            }}>
              {btn.label}
            </a>
          ))}
        </div>
      </div>


    </div>
  );
}

const styles = {
  pageHeader: { marginBottom: '28px' },
  title: { fontFamily: 'serif', fontSize: '28px', marginBottom: '6px' },
  sub: { color: '#6B7280', fontSize: '14px' },
  cardGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '18px', marginBottom: '32px' },
  card: { background: '#fff', border: '1.5px solid #E8DDD6', borderRadius: '16px', padding: '24px' },
  cardIcon: { fontSize: '28px', marginBottom: '14px' },
  cardNum: { fontFamily: 'serif', fontSize: '32px', fontWeight: '900', color: '#1A1A1A' },
  cardLabel: { fontSize: '13px', color: '#6B7280', marginTop: '4px', fontWeight: '500' },
  section: { background: '#fff', border: '1.5px solid #E8DDD6', borderRadius: '16px', padding: '28px', marginBottom: '20px' },
  sectionHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  sectionTitle: { fontFamily: 'serif', fontSize: '20px', fontWeight: '700' },
  inventoryGrid: { display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: '12px' },
  invCard: { background: '#fff', border: '1.5px solid #E8DDD6', borderRadius: '12px', padding: '16px', textAlign: 'center' },
  bloodType: { fontFamily: 'serif', fontSize: '22px', fontWeight: '900', color: '#C0392B', marginBottom: '6px' },
  bloodNum: { fontSize: '20px', fontWeight: '700', color: '#1A1A1A' },
  bloodLabel: { fontSize: '11px', color: '#6B7280', marginBottom: '8px' },
  statusBadge: { display: 'inline-block', padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '700' },

  
};



export default Dashboard;