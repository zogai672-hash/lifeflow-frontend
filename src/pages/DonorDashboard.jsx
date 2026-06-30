import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { getDonations, getRequests, getDonors, updateDonor } from '../services/api';

const DonorDashboard = () => {
  const { user, saveUser, clearUser } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('overview');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [donationHistory, setDonationHistory] = useState([]);
  const [bloodRequests, setBloodRequests] = useState([]);
  const [donorProfile, setDonorProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([
    { id: 1, message: 'Welcome to your LifeFlow donor dashboard!', type: 'info', time: 'Just now' },
    { id: 2, message: 'Urgent request: O+ blood needed at General Hospital Yaounde.', type: 'urgent', time: '5 hours ago' },
  ]);
  const [profileForm, setProfileForm] = useState({
    first_name: '',
    last_name: '',
    blood_type: '',
    phone: '',
    address: '',
  });

  useEffect(function() {
    fetchData();
  }, []);

  const fetchData = function() {
    setLoading(true);
    // Fetch donations
    getDonations()
      .then(function(res) {
        // Filter only this donor's donations if possible
        var all = res.data;
        if (user && user.id) {
          var filtered = all.filter(function(d) { return d.donor === user.id || d.donor_name === user.username; });
          setDonationHistory(filtered.length > 0 ? filtered : all);
        } else {
          setDonationHistory(all);
        }
      })
      .catch(function() { setDonationHistory([]); });

    // Fetch blood requests
    getRequests()
      .then(function(res) { setBloodRequests(res.data); })
      .catch(function() { setBloodRequests([]); });

    // Fetch donor profile
 getDonors()
  .then(function(res) {
    var donors = res.data;
    var match = donors.find(function(d) {
      return d.email === user.email;
    });
    if (match) {
      setDonorProfile(match);
      setProfileForm({
        first_name: match.first_name || '',
        last_name: match.last_name || '',
        emai: match.email || '',
        blood_type: match.blood_type || '',
        phone: match.phone || '',
        email: match.email || '',
        address: match.address || '',
      });
    }
    setLoading(false);
  })
  .catch(function() { setLoading(false); });

  };

  const lastDonation = donationHistory.length > 0 ? donationHistory[0].date || donationHistory[0].donation_date : null;
  const nextEligibleDate = lastDonation
    ? new Date(new Date(lastDonation).setDate(new Date(lastDonation).getDate() + 56)).toDateString()
    : 'Not available';
  const isEligible = lastDonation
    ? new Date() >= new Date(new Date(lastDonation).setDate(new Date(lastDonation).getDate() + 56))
    : true;

  const handleLogout = function() {
    clearUser();
    localStorage.removeItem('lifeflow_user');
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleProfileSave = function() {
  getDonors()
    .then(function(res) {
      var donors = res.data;
      var match = donors.find(function(d) {
        return d.email === user.email;
      });
      if (match) {
        updateDonor(match.id, {
          first_name: profileForm.first_name || match.first_name,
          last_name: profileForm.last_name || match.last_name,
          blood_type: profileForm.blood_type || match.blood_type,
          phone: profileForm.phone || match.phone,
          email: profileForm.email || match.email,
          address: profileForm.address || match.address,
          // Required fields - keep existing values
          date_of_birth: match.date_of_birth,
          location: profileForm.address || match.location,
          weight: match.weight,
        })
        .then(function() {
          alert('Profile updated successfully!');
          setIsEditingProfile(false);
          fetchData();
        })
        .catch(function(err) {
          alert('Failed to update. Check console for details.');
          console.log(err.response?.data);
        });
      }
    });
};

  const dismissNotification = function(id) {
    setNotifications(notifications.filter(function(n) { return n.id !== id; }));
  };

  const navItems = [
    { key: 'overview', label: 'Overview' },
    { key: 'donations', label: 'Donation History' },
    { key: 'requests', label: 'Blood Requests' },
    { key: 'notifications', label: 'Notifications (' + notifications.length + ')' },
    { key: 'profile', label: 'My Profile' },
  ];

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontSize: '18px', color: '#C0392B' }}>
        Loading your dashboard...
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#FFF9F9', fontFamily: 'sans-serif' }}>

      {/* Sidebar */}
      <div style={{ width: '240px', background: '#1A1A1A', display: 'flex', flexDirection: 'column', padding: '24px 0', position: 'fixed', height: '100vh', overflowY: 'auto' }}>
        <div style={{ padding: '0 20px 24px', borderBottom: '1px solid #333' }}>
          <div style={{ fontSize: '22px', fontWeight: '800', color: '#E74C3C', marginBottom: '20px' }}>LifeFlow</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: '#C0392B', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: '700' }}>
              {user?.username?.charAt(0).toUpperCase() || 'D'}
            </div>
            <div>
              <div style={{ color: '#fff', fontWeight: '600', fontSize: '14px' }}>{user?.username || 'Donor'}</div>
              <div style={{ color: '#888', fontSize: '12px' }}>Donor Account</div>
            </div>
          </div>
        </div>

        <nav style={{ padding: '16px 12px', flex: 1 }}>
          {navItems.map(function(item) {
            return (
              <button key={item.key} onClick={function() { setActiveTab(item.key); }}
                style={{ display: 'flex', alignItems: 'center', width: '100%', padding: '12px 16px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '500', marginBottom: '4px', textAlign: 'left', background: activeTab === item.key ? '#C0392B' : 'transparent', color: activeTab === item.key ? '#fff' : '#ccc' }}>
                {item.label}
              </button>
            );
          })}
        </nav>

        <button onClick={handleLogout} style={{ margin: '0 12px', padding: '12px 16px', background: 'transparent', border: '1px solid #C0392B', color: '#E74C3C', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '600' }}>
          Logout
        </button>
      </div>

      {/* Main */}
      <div style={{ marginLeft: '240px', flex: 1, padding: '32px' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#1A1A1A', margin: 0 }}>
            {activeTab === 'overview' && 'Dashboard Overview'}
            {activeTab === 'donations' && 'Donation History'}
            {activeTab === 'requests' && 'Blood Requests'}
            {activeTab === 'notifications' && 'Notifications'}
            {activeTab === 'profile' && 'My Profile'}
          </h2>
          <div style={{ padding: '8px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: '600', background: isEligible ? '#D4EDDA' : '#FFF3CD', color: isEligible ? '#155724' : '#856404' }}>
            {isEligible ? 'Eligible to Donate' : 'Not Yet Eligible'}
          </div>
        </div>

        {/* OVERVIEW */}
        {activeTab === 'overview' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
              {[
                { label: 'Total Donations', value: donationHistory.length },
                { label: 'Blood Type', value: donorProfile?.blood_type || user?.blood_type || 'N/A' },
                { label: 'Next Eligible', value: isEligible ? 'Now' : 'Soon' },
              ].map(function(stat, i) {
                return (
                  <div key={i} style={{ background: '#fff', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', textAlign: 'center' }}>
                    <div style={{ fontSize: '28px', fontWeight: '800', color: '#C0392B' }}>{stat.value}</div>
                    <div style={{ fontSize: '13px', color: '#888', marginTop: '4px' }}>{stat.label}</div>
                  </div>
                );
              })}
            </div>

            <div style={{ display: 'flex', gap: '16px', alignItems: 'center', padding: '20px', borderRadius: '12px', background: isEligible ? '#D4EDDA' : '#FFF3CD', border: '1px solid ' + (isEligible ? '#C3E6CB' : '#FFEEBA'), marginBottom: '24px', color: isEligible ? '#155724' : '#856404' }}>
              <div>
                <div style={{ fontWeight: '700', fontSize: '16px' }}>
                  {isEligible ? 'You are eligible to donate today!' : 'Next eligible donation date'}
                </div>
                <div style={{ fontSize: '14px', marginTop: '4px' }}>
                  {isEligible ? 'Visit your nearest blood bank to make a difference.' : 'You can donate again on: ' + nextEligibleDate}
                </div>
              </div>
            </div>

            <div style={{ background: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: '24px' }}>
              <div style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px' }}>Recent Notifications</div>
              {notifications.slice(0, 2).map(function(n) {
                return (
                  <div key={n.id} style={{ padding: '14px', borderRadius: '8px', marginBottom: '10px', background: n.type === 'urgent' ? '#FFF5F5' : '#F0F4FF', borderLeft: '4px solid ' + (n.type === 'urgent' ? '#C0392B' : '#2980B9') }}>
                    {n.message}
                  </div>
                );
              })}
            </div>

            <div style={{ background: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
              <div style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px' }}>Recent Donations</div>
              {donationHistory.length === 0 ? (
                <div style={{ color: '#888', textAlign: 'center', padding: '24px' }}>No donations recorded yet.</div>
              ) : (
                donationHistory.slice(0, 2).map(function(d) {
                  return (
                    <div key={d.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px', borderRadius: '8px', background: '#FFF9F9', marginBottom: '10px', border: '1px solid #F5E0E0' }}>
                      <div>
                        <div style={{ fontWeight: '600' }}>{d.location || d.hospital_name || 'Blood Bank'}</div>
                        <div style={{ fontSize: '13px', color: '#888' }}>{d.date || d.donation_date}</div>
                      </div>
                      <span style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', background: '#D4EDDA', color: '#155724' }}>{d.status || 'Completed'}</span>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* DONATIONS */}
        {activeTab === 'donations' && (
          <div style={{ background: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            {donationHistory.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '48px', color: '#888' }}>No donation records found.</div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#FFF5F5' }}>
                    {['#', 'Date', 'Location', 'Blood Type', 'Units', 'Status'].map(function(h) {
                      return <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '700', color: '#888', textTransform: 'uppercase' }}>{h}</th>;
                    })}
                  </tr>
                </thead>
                <tbody>
                  {donationHistory.map(function(d, i) {
                    return (
                      <tr key={d.id} style={{ borderBottom: '1px solid #f0e8e8' }}>
                        <td style={{ padding: '14px 16px' }}>{i + 1}</td>
                        <td style={{ padding: '14px 16px' }}>{d.date || d.donation_date}</td>
                        <td style={{ padding: '14px 16px' }}>{d.location || d.hospital_name || 'N/A'}</td>
                        <td style={{ padding: '14px 16px' }}><span style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: '700', background: '#C0392B', color: '#fff' }}>{d.blood_type || donorProfile?.blood_type || 'N/A'}</span></td>
                        <td style={{ padding: '14px 16px' }}>{d.units || d.quantity || 1}</td>
                        <td style={{ padding: '14px 16px' }}><span style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', background: '#D4EDDA', color: '#155724' }}>{d.status || 'Completed'}</span></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* REQUESTS */}
        {activeTab === 'requests' && (
          <div style={{ background: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <p style={{ color: '#666', marginBottom: '16px' }}>Active blood requests from hospitals.</p>
            {bloodRequests.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '48px', color: '#888' }}>No active blood requests at the moment.</div>
            ) : (
              bloodRequests.map(function(r) {
                return (
                  <div key={r.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', borderRadius: '10px', border: '1px solid #F5E0E0', marginBottom: '12px', background: '#FFF9F9' }}>
                    <div>
                      <div style={{ fontWeight: '700', fontSize: '15px' }}>{r.hospital || r.hospital_name || 'Hospital'}</div>
                      <div style={{ fontSize: '13px', color: '#666', marginTop: '4px' }}>
                        {'Posted: ' + (r.date || r.request_date || r.created_at || 'N/A')}
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: '700', background: '#C0392B', color: '#fff' }}>{r.blood_type}</span>
                      <span style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', background: r.urgency === 'urgent' || r.urgency === 'Urgent' ? '#FFF5F5' : '#F0F4FF', color: r.urgency === 'urgent' || r.urgency === 'Urgent' ? '#C0392B' : '#2980B9', border: '1px solid ' + (r.urgency === 'urgent' || r.urgency === 'Urgent' ? '#C0392B' : '#2980B9') }}>
                        {r.urgency || r.priority || 'Normal'}
                      </span>
                      <button style={{ padding: '8px 16px', background: '#C0392B', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}>Respond</button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* NOTIFICATIONS */}
        {activeTab === 'notifications' && (
          <div style={{ background: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            {notifications.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '48px', color: '#888' }}>No notifications at the moment.</div>
            ) : (
              notifications.map(function(n) {
                return (
                  <div key={n.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '14px', borderRadius: '8px', marginBottom: '10px', background: n.type === 'urgent' ? '#FFF5F5' : n.type === 'success' ? '#F0FFF4' : '#F0F4FF', borderLeft: '4px solid ' + (n.type === 'urgent' ? '#C0392B' : n.type === 'success' ? '#27AE60' : '#2980B9') }}>
                    <div>
                      <div style={{ fontWeight: '600' }}>{n.message}</div>
                      <div style={{ fontSize: '12px', color: '#888', marginTop: '4px' }}>{n.time}</div>
                    </div>
                    <button onClick={function() { dismissNotification(n.id); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888', fontSize: '16px' }}>X</button>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* PROFILE */}
        {activeTab === 'profile' && (
          <div style={{ background: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '28px', paddingBottom: '20px', borderBottom: '1px solid #F5E0E0' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#C0392B', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', fontWeight: '800' }}>
                {user?.username?.charAt(0).toUpperCase() || 'D'}
              </div>
              <div>
                <div style={{ fontSize: '22px', fontWeight: '700' }}>{user?.username}</div>
                <div style={{ color: '#888', fontSize: '14px' }}>Donor - LifeFlow</div>
              </div>
              <button onClick={function() { setIsEditingProfile(!isEditingProfile); }} style={{ marginLeft: 'auto', padding: '10px 20px', background: 'transparent', border: '1.5px solid #C0392B', color: '#C0392B', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '14px' }}>
                {isEditingProfile ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>

            {isEditingProfile ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {[
  { label: 'First Name', key: 'first_name', type: 'text' },
  { label: 'Last Name', key: 'last_name', type: 'text' },
  { label: 'Email', key: 'email', type: 'email' },
  { label: 'Phone', key: 'phone', type: 'text' },
  { label: 'Address', key: 'address', type: 'text' },
].map(function(field) {
  return (
    <div key={field.key} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <label style={{ fontSize: '12px', fontWeight: '700', color: '#888', textTransform: 'uppercase' }}>{field.label}</label>
      <input
        type={field.type}
        value={profileForm[field.key] || ''}
        onChange={function(e) {
          setProfileForm(Object.assign({}, profileForm, { [field.key]: e.target.value }));
        }}
        style={{ padding: '12px 16px', border: '1.5px solid #E8DDD6', borderRadius: '8px', fontSize: '14px' }}
      />
    </div>
  );
})}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: '#888', textTransform: 'uppercase' }}>Blood Type</label>
                  <select value={profileForm.blood_type} onChange={function(e) { setProfileForm(Object.assign({}, profileForm, { blood_type: e.target.value })); }} style={{ padding: '12px 16px', border: '1.5px solid #E8DDD6', borderRadius: '8px', fontSize: '14px' }}>
                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(function(bt) {
                      return <option key={bt} value={bt}>{bt}</option>;
                    })}
                  </select>
                </div>
                <button onClick={handleProfileSave} style={{ padding: '14px', background: '#C0392B', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '15px', fontWeight: '700' }}>
                  Save Changes
                </button>
              </div>
            ) : (
              <div>
                {[
                  { label: 'Email', value: donorProfile?.email || user?.email || 'Not set' },
                  { label: 'Blood Type', value: donorProfile?.blood_type || 'Not set' },
                  { label: 'Phone', value: donorProfile?.phone || 'Not set' },
                  { label: 'Address', value: donorProfile?.address || 'Not set' },
                  { label: 'Total Donations', value: donationHistory.length },
                  { label: 'Next Eligible Date', value: nextEligibleDate },
                ].map(function(item, i) {
                  return (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 0', borderBottom: '1px solid #F9F0F0' }}>
                      <span style={{ fontSize: '14px', color: '#888', fontWeight: '500' }}>{item.label}</span>
                      <span style={{ fontSize: '14px', color: '#1A1A1A', fontWeight: '600' }}>{item.value}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default DonorDashboard;