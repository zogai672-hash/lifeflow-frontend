import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getInventory } from '../services/api';

function Home() {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getInventory()
      .then(res => { setInventory(res.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const getBarWidth = (item) => {
    const max = item.minimum_threshold * 5;
    return Math.min((item.units_available / max) * 100, 100) + '%';
  };

  const getCardColor = (item) => {
    if (item.units_available < item.minimum_threshold)
      return { bg: '#FFF0F0', border: '#FF4757', badge: '#FF4757', text: '#fff' };
    if (item.units_available < item.minimum_threshold * 2)
      return { bg: '#FFF8E7', border: '#FFA502', badge: '#FFA502', text: '#fff' };
    return { bg: '#F0FFF4', border: '#2ED573', badge: '#2ED573', text: '#fff' };
  };

  const defaultBloodTypes = ['A+','A-','B+','B-','O+','O-','AB+','AB-'];

  return (
    <div style={{ background: '#F8FAFF', minHeight: '100vh', fontFamily: 'DM Sans, sans-serif' }}>

      {/* ===== HERO ===== */}
      <div style={styles.hero}>
        {/* Decorative circles */}
        <div style={styles.circle1}></div>
        <div style={styles.circle2}></div>
        <div style={styles.circle3}></div>

        <div style={styles.heroContent}>
          {/* LEFT */}
          <div style={{ position: 'relative', zIndex: 2 }}>
            <div style={styles.heroBadge}>
              <span style={{ fontSize: '16px' }}>🩸</span>
              <span>Blood Donation Management System</span>
            </div>
            <h1 style={styles.heroTitle}>
              Give Blood,
              <br />
              <span style={styles.heroHighlight}>Give Life.</span>
            </h1>
            <p style={styles.heroDesc}>
              Every 2 seconds someone needs blood. LifeFlow connects
              generous donors with hospitals and patients who need it most.
              Join thousands of heroes saving lives every day.
            </p>
            <div style={styles.heroBtns}>
              <button style={styles.btnPrimary} onClick={() => navigate('/login')}>
                🩸 Donate Blood Now
              </button>
              <button style={styles.btnSecondary} onClick={() => navigate('/search')}>
                🔍 Find Blood
              </button>
            </div>

            {/* Mini stats row */}
            <div style={styles.miniStats}>
              {[
                { num: '10,000+', label: 'Lives Saved' },
                { num: '1,248', label: 'Active Donors' },
                { num: '24/7', label: 'Available' },
              ].map((s, i) => (
                <div key={i} style={styles.miniStat}>
                  <div style={styles.miniNum}>{s.num}</div>
                  <div style={styles.miniLabel}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT - Image Cards */}
          <div style={styles.heroRight}>
            {/* Main image */}
            <div style={styles.mainImgCard}>
              <img
                src="https://media.istockphoto.com/id/2154964150/photo/the-concept-of-donation-blood-transfusion.jpg?s=612x612&w=0&k=20&c=EPcXA2NNoTk6vRYRDIwAgXf9UFMKu1K2nlnCzoRtD64="
                alt="Blood donation"
                style={styles.mainImg}
                onError={e => e.target.style.display = 'none'}
              />
              <div style={styles.imgOverlay}>
                <div style={styles.liveTag}>
                  <span style={styles.liveDot}></span>
                  Live Tracking
                </div>
              </div>
            </div>

            {/* Floating card 1 */}
            <div style={styles.floatCard1}>
              <div style={{ fontSize: '28px' }}>❤️</div>
              <div>
                <div style={{ fontWeight: '700', fontSize: '15px', color: '#1A1A2E' }}>342 Units</div>
                <div style={{ fontSize: '12px', color: '#666' }}>In Stock Today</div>
              </div>
            </div>

            {/* Floating card 2 */}
            <div style={styles.floatCard2}>
              <div style={{ fontSize: '24px' }}>🏥</div>
              <div>
                <div style={{ fontWeight: '700', fontSize: '14px', color: '#1A1A2E' }}>12 Hospitals</div>
                <div style={{ fontSize: '11px', color: '#666' }}>Connected</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== WHY DONATE SECTION ===== */}
      <div style={styles.whySection}>
        <div style={styles.sectionBadge}>Why It Matters</div>
        <h2 style={styles.sectionTitle}>Every Drop Makes a Difference</h2>
        <p style={styles.sectionDesc}>
          Blood cannot be manufactured — it can only come from generous donors like you.
        </p>

        <div style={styles.whyGrid}>
          {[
            {
              icon: '🚑',
              title: 'Save Up to 3 Lives',
              desc: 'One donation can save up to three lives. Blood is separated into red cells, platelets, and plasma.',
              color: '#FF6B6B',
              bg: '#FFF0F0',
            },
            {
              icon: '⏱️',
              title: 'Takes 10 Minutes',
              desc: 'The actual donation process takes only 8-10 minutes. The whole appointment is about an hour.',
              color: '#4ECDC4',
              bg: '#F0FFFE',
            },
            {
              icon: '🔄',
              title: 'Replenishes in 56 Days',
              desc: 'Your body replenishes blood within weeks. You can donate whole blood every 56 days.',
              color: '#45B7D1',
              bg: '#F0F8FF',
            },
            {
              icon: '💪',
              title: 'Health Benefits',
              desc: 'Donating blood can reduce iron levels, lower heart disease risk, and reveal hidden health issues.',
              color: '#96CEB4',
              bg: '#F0FFF4',
            },
          ].map((card, i) => (
            <div key={i} style={{ ...styles.whyCard, background: card.bg, borderTop: '4px solid ' + card.color }}>
              <div style={{ ...styles.whyIcon, background: card.color }}>
                {card.icon}
              </div>
              <h3 style={styles.whyTitle}>{card.title}</h3>
              <p style={styles.whyDesc}>{card.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ===== BLOOD INVENTORY ===== */}
      <div style={styles.inventorySection}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ ...styles.sectionBadge, background: 'rgba(255,255,255,0.2)', color: '#fff' }}>
            Live Inventory
          </div>
          <h2 style={{ ...styles.sectionTitle, color: '#fff' }}>
            Current Blood Stock Levels
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.8)', maxWidth: '500px', margin: '0 auto' }}>
            Real-time tracking of available blood units across all types
          </p>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', color: '#fff', padding: '40px' }}>
            Loading inventory...
          </div>
        ) : (
          <div style={styles.bloodGrid}>
            {(inventory.length > 0 ? inventory : defaultBloodTypes.map(bt => ({
              blood_type: bt, units_available: 0, minimum_threshold: 20
            }))).map((item, i) => {
              const colors = getCardColor(item);
              return (
                <div key={i} style={{
                  ...styles.bloodCard,
                  background: colors.bg,
                  border: '2px solid ' + colors.border,
                }}>
                  {/* Blood type */}
                  <div style={{
                    ...styles.bloodTypeBadge,
                    background: colors.border,
                  }}>
                    {item.blood_type}
                  </div>

                  {/* Units */}
                  <div style={styles.bloodUnits}>
                    {item.units_available}
                  </div>
                  <div style={styles.bloodUnitsLabel}>units</div>

                  {/* Status */}
                  {item.units_available < item.minimum_threshold ? (
                    <div style={{ ...styles.stockBadge, background: '#FF4757', color: '#fff' }}>
                      ⚠️ LOW
                    </div>
                  ) : (
                    <div style={{ ...styles.stockBadge, background: '#2ED573', color: '#fff' }}>
                      ✓ OK
                    </div>
                  )}

                  {/* Bar */}
                  <div style={styles.bloodBar}>
                    <div style={{
                      ...styles.bloodFill,
                      width: inventory.length > 0 ? getBarWidth(item) : '0%',
                      background: colors.border,
                    }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: '32px' }}>
          <button
            style={styles.btnInventory}
            onClick={() => navigate('/inventory')}
          >
            View Full Inventory →
          </button>
        </div>
      </div>

      {/* ===== HOW IT WORKS ===== */}
      <div style={styles.howSection}>
        <div style={styles.sectionBadge}>Simple Process</div>
        <h2 style={styles.sectionTitle}>How LifeFlow Works</h2>

        <div style={styles.stepsGrid}>
          {[
            { step: '01', icon: '📝', title: 'Register', desc: 'Create your donor account in minutes. Fill in your details and blood type.', color: '#FF6B6B' },
            { step: '02', icon: '🩸', title: 'Donate', desc: 'Visit a nearby blood bank. The process takes about 10 minutes.', color: '#4ECDC4' },
            { step: '03', icon: '🏥', title: 'Save Lives', desc: 'Your blood is tested, processed, and sent to patients who need it.', color: '#45B7D1' },
            { step: '04', icon: '🔔', title: 'Get Notified', desc: 'Receive updates on when your blood is used and who it helped.', color: '#FFA502' },
          ].map((s, i) => (
            <div key={i} style={styles.stepCard}>
              <div style={{ ...styles.stepNum, color: s.color }}>{s.step}</div>
              <div style={{ ...styles.stepIcon, background: s.color + '20', color: s.color }}>
                {s.icon}
              </div>
              <h3 style={styles.stepTitle}>{s.title}</h3>
              <p style={styles.stepDesc}>{s.desc}</p>
              {i < 3 && <div style={styles.stepArrow}>→</div>}
            </div>
          ))}
        </div>
      </div>

      {/* ===== CTA BANNER ===== */}
      <div style={styles.ctaBanner}>
        <div style={styles.ctaContent}>
          <h2 style={styles.ctaTitle}>Ready to Save a Life Today?</h2>
          <p style={styles.ctaDesc}>
            Join over 1,000 donors who are making a difference in their community.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button style={styles.ctaBtnPrimary} onClick={() => navigate('/login')}>
              🩸 Register as Donor
            </button>
            <button style={styles.ctaBtnSecondary} onClick={() => navigate('/requests')}>
              🏥 Request Blood
            </button>
          </div>
        </div>
      </div>


    </div>
  );
}

const styles = {
  // HERO
  hero: {
    background: 'linear-gradient(135deg, #1A1A2E 0%, #16213E 50%, #0F3460 100%)',
    minHeight: '90vh',
    position: 'relative',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
  },
  circle1: {
    position: 'absolute', top: '-100px', right: '-100px',
    width: '400px', height: '400px',
    background: 'rgba(255, 71, 87, 0.15)',
    borderRadius: '50%',
  },
  circle2: {
    position: 'absolute', bottom: '-150px', left: '-150px',
    width: '500px', height: '500px',
    background: 'rgba(78, 205, 196, 0.1)',
    borderRadius: '50%',
  },
  circle3: {
    position: 'absolute', top: '50%', left: '40%',
    width: '200px', height: '200px',
    background: 'rgba(255, 165, 2, 0.08)',
    borderRadius: '50%',
  },
  heroContent: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '60px',
    alignItems: 'center',
    padding: '80px 48px',
    width: '100%',
    position: 'relative',
    zIndex: 2,
  },
  heroBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    background: 'rgba(255, 71, 87, 0.2)',
    border: '1px solid rgba(255, 71, 87, 0.4)',
    color: '#FF6B6B',
    fontSize: '13px',
    fontWeight: '600',
    padding: '8px 16px',
    borderRadius: '30px',
    marginBottom: '28px',
  },
  heroTitle: {
    fontFamily: 'Georgia, serif',
    fontSize: '64px',
    lineHeight: '1.1',
    color: '#fff',
    marginBottom: '20px',
    fontWeight: '900',
  },
  heroHighlight: {
    background: 'linear-gradient(135deg, #FF6B6B, #FF4757)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  heroDesc: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: '17px',
    lineHeight: '1.8',
    marginBottom: '36px',
    maxWidth: '480px',
  },
  heroBtns: { display: 'flex', gap: '14px', flexWrap: 'wrap', marginBottom: '40px' },
  btnPrimary: {
    padding: '15px 32px',
    background: 'linear-gradient(135deg, #FF6B6B, #FF4757)',
    color: '#fff',
    border: 'none',
    borderRadius: '12px',
    fontSize: '15px',
    fontWeight: '700',
    cursor: 'pointer',
    boxShadow: '0 8px 24px rgba(255,71,87,0.4)',
  },
  btnSecondary: {
    padding: '15px 32px',
    background: 'rgba(255,255,255,0.1)',
    color: '#fff',
    border: '1.5px solid rgba(255,255,255,0.3)',
    borderRadius: '12px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  miniStats: { display: 'flex', gap: '32px' },
  miniStat: { textAlign: 'center' },
  miniNum: { fontFamily: 'Georgia, serif', fontSize: '24px', fontWeight: '900', color: '#fff' },
  miniLabel: { fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginTop: '2px' },

  // HERO RIGHT
  heroRight: { position: 'relative', height: '460px' },
  mainImgCard: {
    width: '100%', height: '100%',
    borderRadius: '24px',
    overflow: 'hidden',
    border: '2px solid rgba(255,255,255,0.1)',
    position: 'relative',
    background: 'linear-gradient(135deg, #FF6B6B22, #4ECDC422)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '80px',
  },
  mainImg: { width: '100%', height: '100%', objectFit: 'cover' },
  imgOverlay: {
    position: 'absolute', bottom: '16px', left: '16px',
  },
  liveTag: {
    display: 'flex', alignItems: 'center', gap: '8px',
    background: 'rgba(0,0,0,0.6)',
    backdropFilter: 'blur(8px)',
    color: '#fff', fontSize: '13px', fontWeight: '600',
    padding: '8px 14px', borderRadius: '20px',
  },
  liveDot: {
    width: '8px', height: '8px',
    background: '#2ED573', borderRadius: '50%',
    display: 'inline-block',
    animation: 'pulse 1.5s infinite',
  },
  floatCard1: {
    position: 'absolute', top: '-16px', right: '-16px',
    background: '#fff',
    borderRadius: '16px',
    padding: '16px 20px',
    display: 'flex', gap: '12px', alignItems: 'center',
    boxShadow: '0 16px 40px rgba(0,0,0,0.2)',
    border: '1px solid rgba(255,255,255,0.8)',
  },
  floatCard2: {
    position: 'absolute', bottom: '30px', right: '-20px',
    background: '#fff',
    borderRadius: '16px',
    padding: '14px 18px',
    display: 'flex', gap: '10px', alignItems: 'center',
    boxShadow: '0 16px 40px rgba(0,0,0,0.2)',
  },

  // WHY SECTION
  whySection: {
    padding: '80px 48px',
    background: '#F8FAFF',
    textAlign: 'center',
  },
  sectionBadge: {
    display: 'inline-block',
    background: '#FF6B6B20',
    color: '#FF4757',
    fontSize: '12px',
    fontWeight: '700',
    letterSpacing: '2px',
    textTransform: 'uppercase',
    padding: '6px 16px',
    borderRadius: '20px',
    marginBottom: '16px',
  },
  sectionTitle: {
    fontFamily: 'Georgia, serif',
    fontSize: '38px',
    color: '#1A1A2E',
    marginBottom: '12px',
    fontWeight: '800',
  },
  sectionDesc: {
    color: '#666',
    fontSize: '16px',
    maxWidth: '500px',
    margin: '0 auto 48px',
    lineHeight: '1.7',
  },
  whyGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '20px',
    maxWidth: '1100px',
    margin: '0 auto',
  },
  whyCard: {
    borderRadius: '20px',
    padding: '32px 24px',
    textAlign: 'left',
    transition: 'transform 0.2s',
  },
  whyIcon: {
    width: '52px', height: '52px',
    borderRadius: '14px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '24px',
    marginBottom: '20px',
    color: '#fff',
  },
  whyTitle: {
    fontFamily: 'Georgia, serif',
    fontSize: '18px',
    fontWeight: '700',
    color: '#1A1A2E',
    marginBottom: '10px',
  },
  whyDesc: { fontSize: '14px', color: '#666', lineHeight: '1.7' },

  // INVENTORY
  inventorySection: {
    padding: '80px 48px',
    background: 'linear-gradient(135deg, #1A1A2E 0%, #0F3460 100%)',
  },
  bloodGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(8, 1fr)',
    gap: '12px',
    maxWidth: '1100px',
    margin: '0 auto',
  },
  bloodCard: {
    borderRadius: '16px',
    padding: '18px 10px',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'transform 0.2s',
  },
  bloodTypeBadge: {
    display: 'inline-flex',
    alignItems: 'center', justifyContent: 'center',
    width: '48px', height: '48px',
    borderRadius: '12px',
    color: '#fff',
    fontFamily: 'Georgia, serif',
    fontSize: '18px',
    fontWeight: '900',
    margin: '0 auto 10px',
  },
  bloodUnits: {
    fontFamily: 'Georgia, serif',
    fontSize: '26px',
    fontWeight: '900',
    color: '#1A1A2E',
  },
  bloodUnitsLabel: { fontSize: '11px', color: '#888', marginBottom: '8px' },
  stockBadge: {
    display: 'inline-block',
    padding: '3px 10px',
    borderRadius: '10px',
    fontSize: '10px',
    fontWeight: '700',
    marginBottom: '10px',
  },
  bloodBar: {
    height: '4px',
    background: 'rgba(0,0,0,0.1)',
    borderRadius: '2px',
    overflow: 'hidden',
  },
  bloodFill: { height: '100%', borderRadius: '2px', transition: 'width 0.6s ease' },
  btnInventory: {
    padding: '14px 32px',
    background: 'rgba(255,255,255,0.1)',
    color: '#fff',
    border: '1.5px solid rgba(255,255,255,0.3)',
    borderRadius: '12px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
  },

  // HOW IT WORKS
  howSection: {
    padding: '80px 48px',
    background: '#fff',
    textAlign: 'center',
  },
  stepsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '20px',
    maxWidth: '1100px',
    margin: '48px auto 0',
    position: 'relative',
  },
  stepCard: {
    padding: '32px 20px',
    border: '1.5px solid #F0F0F0',
    borderRadius: '20px',
    position: 'relative',
    background: '#FAFAFA',
  },
  stepNum: {
    fontFamily: 'Georgia, serif',
    fontSize: '36px',
    fontWeight: '900',
    opacity: 0.3,
    marginBottom: '12px',
  },
  stepIcon: {
    width: '56px', height: '56px',
    borderRadius: '16px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '24px',
    margin: '0 auto 16px',
  },
  stepTitle: {
    fontFamily: 'Georgia, serif',
    fontSize: '18px',
    fontWeight: '700',
    color: '#1A1A2E',
    marginBottom: '10px',
  },
  stepDesc: { fontSize: '13px', color: '#888', lineHeight: '1.7' },
  stepArrow: {
    position: 'absolute',
    right: '-14px', top: '50%',
    transform: 'translateY(-50%)',
    fontSize: '20px',
    color: '#ddd',
    zIndex: 2,
  },

  // CTA
  ctaBanner: {
    background: 'linear-gradient(135deg, #FF6B6B, #FF4757, #C0392B)',
    padding: '80px 48px',
    textAlign: 'center',
  },
  ctaContent: { maxWidth: '600px', margin: '0 auto' },
  ctaTitle: {
    fontFamily: 'Georgia, serif',
    fontSize: '40px',
    color: '#fff',
    marginBottom: '16px',
    fontWeight: '900',
  },
  ctaDesc: { color: 'rgba(255,255,255,0.85)', fontSize: '16px', marginBottom: '36px', lineHeight: '1.7' },
  ctaBtnPrimary: {
    padding: '15px 32px',
    background: '#fff',
    color: '#FF4757',
    border: 'none',
    borderRadius: '12px',
    fontSize: '15px',
    fontWeight: '700',
    cursor: 'pointer',
  },
  ctaBtnSecondary: {
    padding: '15px 32px',
    background: 'rgba(255,255,255,0.15)',
    color: '#fff',
    border: '1.5px solid rgba(255,255,255,0.4)',
    borderRadius: '12px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
  },

  // FOOTER
  footer: {
    background: '#1A1A2E',
    padding: '40px 48px',
    textAlign: 'center',
  },
  
};

export default Home;