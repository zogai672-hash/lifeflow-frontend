import React, { useState, useEffect } from 'react';
import { getDonors, getDonations, getInventory, getRequests } from '../services/api';

function Report() {
  const [donors, setDonors] = useState([]);
  const [donations, setDonations] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    blood_type: 'All',
    region: 'All',
    report_type: 'donors',
  });

  const bloodTypes = ['All', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const regions = ['All', 'Yaounde', 'Douala', 'Bafoussam', 'Bamenda', 'Garoua', 'Maroua', 'Bertoua', 'Ebolowa', 'Buea', 'Ngaoundere'];

  useEffect(function() {
    Promise.all([getDonors(), getDonations(), getInventory(), getRequests()])
      .then(function(results) {
        setDonors(results[0].data);
        setDonations(results[1].data);
        setInventory(results[2].data);
        setRequests(results[3].data);
        setLoading(false);
      })
      .catch(function() { setLoading(false); });
  }, []);

  var filteredData = function() {
    if (filters.report_type === 'donors') {
      return donors.filter(function(d) {
        var btMatch = filters.blood_type === 'All' || d.blood_type === filters.blood_type;
        var regionMatch = filters.region === 'All' || (d.location && d.location.toLowerCase().includes(filters.region.toLowerCase())) || (d.address && d.address.toLowerCase().includes(filters.region.toLowerCase()));
        return btMatch && regionMatch;
      });
    }
    if (filters.report_type === 'donations') {
      return donations.filter(function(d) {
        var btMatch = filters.blood_type === 'All' || d.blood_type === filters.blood_type;
        return btMatch;
      });
    }
    if (filters.report_type === 'inventory') {
      return inventory.filter(function(d) {
        var btMatch = filters.blood_type === 'All' || d.blood_type === filters.blood_type;
        return btMatch;
      });
    }
    if (filters.report_type === 'requests') {
      return requests.filter(function(d) {
        var btMatch = filters.blood_type === 'All' || d.blood_type === filters.blood_type;
        var regionMatch = filters.region === 'All' || (d.hospital && d.hospital.toLowerCase().includes(filters.region.toLowerCase()));
        return btMatch && regionMatch;
      });
    }
    return [];
  };

  var data = filteredData();

  var handlePrint = function() {
    window.print();
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: '#C0392B', fontSize: '18px' }}>
        Loading report data...
      </div>
    );
  }

  return (
    <div style={{ background: '#FDF6F0', minHeight: '100vh', padding: '40px' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
        <div>
          <h1 style={{ fontFamily: 'serif', fontSize: '28px', marginBottom: '6px' }}>Generate Report</h1>
          <p style={{ color: '#6B7280', fontSize: '14px' }}>Filter and export LifeFlow system data</p>
        </div>
        <button onClick={handlePrint} style={{ padding: '12px 24px', background: '#C0392B', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: '600', fontSize: '14px', cursor: 'pointer' }}>
          Print / Export
        </button>
      </div>

      {/* Filters */}
      <div style={{ background: '#fff', border: '1.5px solid #E8DDD6', borderRadius: '16px', padding: '24px', marginBottom: '28px' }}>
        <h2 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px', color: '#1A1A1A' }}>Filters</h2>
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '12px', fontWeight: '700', color: '#888', textTransform: 'uppercase' }}>Report Type</label>
            <select
              value={filters.report_type}
              onChange={function(e) { setFilters(Object.assign({}, filters, { report_type: e.target.value })); }}
              style={{ padding: '10px 16px', border: '1.5px solid #E8DDD6', borderRadius: '8px', fontSize: '14px', minWidth: '160px' }}
            >
              <option value="donors">Donors</option>
              <option value="donations">Donations</option>
              <option value="inventory">Blood Inventory</option>
              <option value="requests">Blood Requests</option>
            </select>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '12px', fontWeight: '700', color: '#888', textTransform: 'uppercase' }}>Blood Type</label>
            <select
              value={filters.blood_type}
              onChange={function(e) { setFilters(Object.assign({}, filters, { blood_type: e.target.value })); }}
              style={{ padding: '10px 16px', border: '1.5px solid #E8DDD6', borderRadius: '8px', fontSize: '14px', minWidth: '120px' }}
            >
              {bloodTypes.map(function(bt) { return <option key={bt} value={bt}>{bt}</option>; })}
            </select>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '12px', fontWeight: '700', color: '#888', textTransform: 'uppercase' }}>Region</label>
            <select
              value={filters.region}
              onChange={function(e) { setFilters(Object.assign({}, filters, { region: e.target.value })); }}
              style={{ padding: '10px 16px', border: '1.5px solid #E8DDD6', borderRadius: '8px', fontSize: '14px', minWidth: '140px' }}
            >
              {regions.map(function(r) { return <option key={r} value={r}>{r}</option>; })}
            </select>
          </div>

        </div>
      </div>

      {/* Summary */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
        <div style={{ background: '#fff', border: '1.5px solid #E8DDD6', borderRadius: '12px', padding: '16px 24px', flex: 1, textAlign: 'center' }}>
          <div style={{ fontSize: '28px', fontWeight: '800', color: '#C0392B' }}>{data.length}</div>
          <div style={{ fontSize: '13px', color: '#888', marginTop: '4px' }}>Total Records</div>
        </div>
        <div style={{ background: '#fff', border: '1.5px solid #E8DDD6', borderRadius: '12px', padding: '16px 24px', flex: 1, textAlign: 'center' }}>
          <div style={{ fontSize: '28px', fontWeight: '800', color: '#C0392B' }}>{filters.blood_type === 'All' ? 'All' : filters.blood_type}</div>
          <div style={{ fontSize: '13px', color: '#888', marginTop: '4px' }}>Blood Type Filter</div>
        </div>
        <div style={{ background: '#fff', border: '1.5px solid #E8DDD6', borderRadius: '12px', padding: '16px 24px', flex: 1, textAlign: 'center' }}>
          <div style={{ fontSize: '28px', fontWeight: '800', color: '#C0392B' }}>{filters.region === 'All' ? 'All' : filters.region}</div>
          <div style={{ fontSize: '13px', color: '#888', marginTop: '4px' }}>Region Filter</div>
        </div>
      </div>

      {/* Table */}
      <div style={{ background: '#fff', border: '1.5px solid #E8DDD6', borderRadius: '16px', padding: '24px' }}>
        <h2 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px', color: '#1A1A1A', textTransform: 'capitalize' }}>
          {filters.report_type} Report
        </h2>

        {data.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px', color: '#888' }}>No records found for the selected filters.</div>
        ) : (

          // DONORS TABLE
          filters.report_type === 'donors' ? (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#FFF5F5' }}>
                  {['#', 'First Name', 'Last Name', 'Blood Type', 'Phone', 'Email', 'Location', 'Status'].map(function(h) {
                    return <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '700', color: '#888', textTransform: 'uppercase' }}>{h}</th>;
                  })}
                </tr>
              </thead>
              <tbody>
                {data.map(function(d, i) {
                  return (
                    <tr key={d.id} style={{ borderBottom: '1px solid #f0e8e8' }}>
                      <td style={{ padding: '12px 16px', fontSize: '14px' }}>{i + 1}</td>
                      <td style={{ padding: '12px 16px', fontSize: '14px' }}>{d.first_name}</td>
                      <td style={{ padding: '12px 16px', fontSize: '14px' }}>{d.last_name}</td>
                      <td style={{ padding: '12px 16px' }}><span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', background: '#C0392B', color: '#fff' }}>{d.blood_type}</span></td>
                      <td style={{ padding: '12px 16px', fontSize: '14px' }}>{d.phone || 'N/A'}</td>
                      <td style={{ padding: '12px 16px', fontSize: '14px' }}>{d.email}</td>
                      <td style={{ padding: '12px 16px', fontSize: '14px' }}>{d.location || d.address || 'N/A'}</td>
                      <td style={{ padding: '12px 16px' }}><span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', background: d.status === 'active' ? '#D4EDDA' : '#FEE2E2', color: d.status === 'active' ? '#155724' : '#991B1B' }}>{d.status}</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

          // DONATIONS TABLE
          ) : filters.report_type === 'donations' ? (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#FFF5F5' }}>
                  {['#', 'Date', 'Donor', 'Blood Type', 'Units', 'Location', 'Status'].map(function(h) {
                    return <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '700', color: '#888', textTransform: 'uppercase' }}>{h}</th>;
                  })}
                </tr>
              </thead>
              <tbody>
                {data.map(function(d, i) {
                  return (
                    <tr key={d.id} style={{ borderBottom: '1px solid #f0e8e8' }}>
                      <td style={{ padding: '12px 16px', fontSize: '14px' }}>{i + 1}</td>
                      <td style={{ padding: '12px 16px', fontSize: '14px' }}>{d.date || d.donation_date}</td>
                      <td style={{ padding: '12px 16px', fontSize: '14px' }}>{d.donor_name || d.donor || 'N/A'}</td>
                      <td style={{ padding: '12px 16px' }}><span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', background: '#C0392B', color: '#fff' }}>{d.blood_type || 'N/A'}</span></td>
                      <td style={{ padding: '12px 16px', fontSize: '14px' }}>{d.units || d.quantity || 1}</td>
                      <td style={{ padding: '12px 16px', fontSize: '14px' }}>{d.location || d.hospital_name || 'N/A'}</td>
                      <td style={{ padding: '12px 16px' }}><span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', background: '#D4EDDA', color: '#155724' }}>{d.status || 'Completed'}</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

          // INVENTORY TABLE
          ) : filters.report_type === 'inventory' ? (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#FFF5F5' }}>
                  {['#', 'Blood Type', 'Units Available', 'Minimum Threshold', 'Status', 'Last Updated'].map(function(h) {
                    return <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '700', color: '#888', textTransform: 'uppercase' }}>{h}</th>;
                  })}
                </tr>
              </thead>
              <tbody>
                {data.map(function(d, i) {
                  var isCritical = d.units_available < d.minimum_threshold;
                  return (
                    <tr key={d.id} style={{ borderBottom: '1px solid #f0e8e8' }}>
                      <td style={{ padding: '12px 16px', fontSize: '14px' }}>{i + 1}</td>
                      <td style={{ padding: '12px 16px' }}><span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '13px', fontWeight: '700', background: '#C0392B', color: '#fff' }}>{d.blood_type}</span></td>
                      <td style={{ padding: '12px 16px', fontSize: '14px', fontWeight: '700' }}>{d.units_available}</td>
                      <td style={{ padding: '12px 16px', fontSize: '14px' }}>{d.minimum_threshold}</td>
                      <td style={{ padding: '12px 16px' }}><span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', background: isCritical ? '#FEE2E2' : '#D1FAE5', color: isCritical ? '#991B1B' : '#065F46' }}>{isCritical ? 'Critical' : 'Good'}</span></td>
                      <td style={{ padding: '12px 16px', fontSize: '14px' }}>{d.last_updated || 'N/A'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

          // REQUESTS TABLE
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#FFF5F5' }}>
                  {['#', 'Hospital', 'Blood Type', 'Units Needed', 'Urgency', 'Status', 'Date'].map(function(h) {
                    return <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '700', color: '#888', textTransform: 'uppercase' }}>{h}</th>;
                  })}
                </tr>
              </thead>
              <tbody>
                {data.map(function(d, i) {
                  return (
                    <tr key={d.id} style={{ borderBottom: '1px solid #f0e8e8' }}>
                      <td style={{ padding: '12px 16px', fontSize: '14px' }}>{i + 1}</td>
                      <td style={{ padding: '12px 16px', fontSize: '14px' }}>{d.hospital || d.hospital_name || 'N/A'}</td>
                      <td style={{ padding: '12px 16px' }}><span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', background: '#C0392B', color: '#fff' }}>{d.blood_type}</span></td>
                      <td style={{ padding: '12px 16px', fontSize: '14px' }}>{d.units_needed || d.quantity || 'N/A'}</td>
                      <td style={{ padding: '12px 16px' }}><span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', background: d.urgency === 'urgent' || d.urgency === 'Urgent' ? '#FEE2E2' : '#F0F4FF', color: d.urgency === 'urgent' || d.urgency === 'Urgent' ? '#991B1B' : '#2980B9' }}>{d.urgency || 'Normal'}</span></td>
                      <td style={{ padding: '12px 16px' }}><span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', background: '#D4EDDA', color: '#155724' }}>{d.status || 'Pending'}</span></td>
                      <td style={{ padding: '12px 16px', fontSize: '14px' }}>{d.date || d.request_date || d.created_at || 'N/A'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )
        )}
      </div>
    </div>
  );
}

export default Report;