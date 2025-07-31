import React, { useEffect } from 'react';

const LandingLogout = () => {
  useEffect(() => {
    // Jangan hapus localStorage di sini, biarkan user yang memilih logout
    // localStorage.removeItem('status');
    // localStorage.removeItem('token'); // jika ada
    // Tambahkan proses logout lain jika perlu
  }, []);

  const handleLogout = () => {
    // Hapus localStorage ketika user klik logout
    localStorage.removeItem('status');
    localStorage.removeItem('token');
    // Gunakan window.location.href untuk hard redirect
    window.location.href = '/v3/auth/login';
  };

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      height: '100vh', 
      background: '#f8f9fa',
      margin: 0,
      padding: 0,
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      zIndex: 9999
    }}>
      <span style={{ fontSize: '1.2rem', color: '#333', marginBottom: '32px', fontWeight: '500', letterSpacing: '1px' }}>Silahkan</span>
      <button
        onClick={handleLogout}
        style={{
          padding: '20px 60px',
          fontSize: '1.5rem',
          background: '#dc3545',
          color: '#fff',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontWeight: 'bold',
          boxShadow: '0 4px 12px rgba(220, 53, 69, 0.3)',
          transition: 'all 0.3s ease'
        }}
        onMouseOver={(e) => {
          e.target.style.background = '#c82333';
          e.target.style.transform = 'translateY(-2px)';
        }}
        onMouseOut={(e) => {
          e.target.style.background = '#dc3545';
          e.target.style.transform = 'translateY(0)';
        }}
      >
        LOGOUT
      </button>
    </div>
  );
};

export default LandingLogout;
