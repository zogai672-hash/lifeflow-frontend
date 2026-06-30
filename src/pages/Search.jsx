import React, { useState } from 'react';
import { getDonors, getInventory } from '../services/api';

function Search() {
  const [bloodType, setBloodType] = useState('');
  const [location, setLocation] = useState('');
  const [searchFor, setSearchFor] = useState('donors');
  const [donors, setDonors] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSearch = () => {
    setLoading(true);
    setSearched(true);

    if (searchFor === 'donors' || searchFor === 'both') {
      getDonors()
        .then(res => {
          const filtered = res.data.filter(d => {
            const matchBlood = bloodType ? d.blood_type === bloodType : true;
            const matchLocation = location
              ? d.location.toLowerCase().includes(location.toLowerCase())
              : true;
            return matchBlood && matchLocation;
          });
          setDonors(filtered);
          setLoading(false);
        })
        .catch(err => {
          console.log(err);
          setLoading(false);
        });
    }

    if (searchFor === 'blood' || searchFor === 'both') {
      getInventory()
        .then(res => {
          const filtered = bloodType
            ? res.data.filter(i => i.blood_type === bloodType)
            : res.data;
          setInventory(filtered);
          setLoading(false);
        })
        .catch(err => {
          console.log(err);
          setLoading(false);
        });
    }
  };

  const getStatusStyle = (item) => {
    if (item.units_available < item.minimum_threshold)
      return { background: '#FEE2E2', color: '#991B1B', label: 'Critical' };
    if (item.units_available < item.minimum_threshold * 2)
      return { background: '#FEF3C7', color: '#92400E', label: 'Low' };
    return { background: '#D1FAE5', color: '#065F46', label: 'Available' };
  };

  return (
    <div style={{ background: '#FDF6F0', minHeight: '100vh', padding: '40px 48px' }}>

      {/* HEADER */}
      <h1 style={styles.title}>Search Donors & Blood</h1>
      <p style={styles.sub}>Find available donors or blood units by type and location</p>

      {/* SEARCH BOX */}
      <div style={styles.searchBox}>
        <h2 style={{ fontFamily: 'serif', fontSize: '22px', color: '#fff', marginBottom: '24px' }}>
          Find Blood or Donor
        </h2>
        <div style={styles.searchGrid}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Blood Group</label>
            <select
              style={styles.select}
              value={bloodType}
              onChange={e => setBloodType(e.target.value)}
            >
              <option value="">Any Blood Type</option>
              {['A+','A-','B+','B-','O+','O-','AB+','AB-'].map(bt => (
                <option key={bt} value={bt}>{bt}</option>
              ))}
            </select>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Location</label>
            <input
              style={styles.searchInput}
              placeholder="City or Region..."
              value={location}
              onChange={e => setLocation(e.target.value)}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Search For</label>
            <select
              style={styles.select}
              value={searchFor}
              onChange={e => setSearchFor(e.target.value)}
            >
              <option value="donors">Donors</option>
              <option value="blood">Blood Units</option>
              <option value="both">Both</option>
            </select>
          </div>

          <div style={styles.formGroup}>
            <label style={{ ...styles.label, opacity: 0 }}>Search</label>
            <button
              style={styles.btnSearch}
              onClick={handleSearch}
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </div>
      </div>

      {/* RESULTS */}
      {searched && !loading && (
        <div style={styles.resultsGrid}>

          {/* DONOR RESULTS */}
          {(searchFor === 'donors' || searchFor === 'both') && (
            <div style={styles.resultCard}>
              <div style={styles.resultHeader}>
                <h3 style={styles.resultTitle}>
                  Matching Donors
                  <span style={styles.resultCount}> ({donors.length} found)</span>
                </h3>
              </div>

              {donors.length > 0 ? donors.map((donor, i) => (
                <div key={i} style={styles.donorItem}>
                  <div style={styles.bloodBadge}>{donor.blood_type}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '600', fontSize: '15px' }}>
                      {donor.first_name} {donor.last_name}
                    </div>
                    <div style={{ fontSize: '13px', color: '#6B7280', marginTop: '3px' }}>
                      📍 {donor.location} · {donor.phone}
                    </div>
                  </div>
                  <span style={{
                    ...styles.badge,
                    background: donor.status === 'active' ? '#D1FAE5' : '#FEF3C7',
                    color: donor.status === 'active' ? '#065F46' : '#92400E',
                  }}>
                    {donor.status === 'active' ? 'Available' : 'Resting'}
                  </span>
                </div>
              )) : (
                <div style={styles.emptyState}>
                  No donors found matching your search.
                </div>
              )}
            </div>
          )}

          {/* BLOOD UNIT RESULTS */}
          {(searchFor === 'blood' || searchFor === 'both') && (
            <div style={styles.resultCard}>
              <div style={styles.resultHeader}>
                <h3 style={styles.resultTitle}>
                  Blood Units
                  <span style={styles.resultCount}> ({inventory.length} types)</span>
                </h3>
              </div>

              {inventory.length > 0 ? inventory.map((item, i) => {
                const status = getStatusStyle(item);
                return (
                  <div key={i} style={styles.invItem}>
                    <div style={styles.bloodBadge}>{item.blood_type}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: '600', fontSize: '15px' }}>
                        {item.units_available} units available
                      </div>
                      <div style={{ fontSize: '13px', color: '#6B7280', marginTop: '3px' }}>
                        Minimum threshold: {item.minimum_threshold} units
                      </div>
                    </div>
                    <span style={{ ...styles.badge, background: status.background, color: status.color }}>
                      {status.label}
                    </span>
                  </div>
                );
              }) : (
                <div style={styles.emptyState}>
                  No blood units found matching your search.
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* DEFAULT STATE */}
      {!searched && (
        <div style={styles.defaultState}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
          <h3 style={{ fontFamily: 'serif', fontSize: '22px', marginBottom: '8px' }}>
            Search for Donors or Blood
          </h3>
          <p style={{ color: '#6B7280', fontSize: '14px' }}>
            Use the search panel above to find donors or available blood units by type and location.
          </p>
        </div>
      )}


    </div>
  );
}

const styles = {
  title: { fontFamily: 'serif', fontSize: '28px', marginBottom: '6px' },
  sub: { color: '#6B7280', fontSize: '14px', marginBottom: '32px' },
  searchBox: { background: '#1A1A1A', borderRadius: '20px', padding: '36px', marginBottom: '32px' },
  searchGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '16px', alignItems: 'end' },
  formGroup: { display: 'flex', flexDirection: 'column', gap: '8px' },
  label: { fontSize: '12px', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase', color: '#aaa' },
  select: { padding: '13px 16px', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '10px', fontSize: '14px', background: 'rgba(255,255,255,0.08)', color: '#fff', outline: 'none' },
  searchInput: { padding: '13px 16px', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '10px', fontSize: '14px', background: 'rgba(255,255,255,0.08)', color: '#fff', outline: 'none' },
  btnSearch: { padding: '13px 32px', background: '#C0392B', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: '600', cursor: 'pointer' },
  resultsGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' },
  resultCard: { background: '#fff', border: '1.5px solid #E8DDD6', borderRadius: '16px', overflow: 'hidden' },
  resultHeader: { padding: '18px 20px', borderBottom: '1px solid #E8DDD6' },
  resultTitle: { fontFamily: 'serif', fontSize: '18px', fontWeight: '700' },
  resultCount: { fontSize: '14px', color: '#6B7280', fontWeight: '400' },
  donorItem: { display: 'flex', gap: '14px', alignItems: 'center', padding: '14px 20px', borderBottom: '1px solid #F3F0ED' },
  invItem: { display: 'flex', gap: '14px', alignItems: 'center', padding: '14px 20px', borderBottom: '1px solid #F3F0ED' },
  bloodBadge: { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '42px', height: '42px', background: '#C0392B', color: '#fff', borderRadius: '10px', fontWeight: '700', fontSize: '14px', flexShrink: 0 },
  badge: { display: 'inline-block', padding: '4px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: '700', whiteSpace: 'nowrap' },
  emptyState: { padding: '40px', textAlign: 'center', color: '#6B7280', fontSize: '14px' },
  defaultState: { textAlign: 'center', padding: '80px 40px', background: '#fff', borderRadius: '16px', border: '1.5px solid #E8DDD6' },
};

export default Search;