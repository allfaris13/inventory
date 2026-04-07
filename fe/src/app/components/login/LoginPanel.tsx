import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPanel.css';
import roboBg from '../../../assets/robo_login_bg.png';

export const LoginPanel: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Kita simulasi loading sebentar
    setTimeout(() => {
      setLoading(false);
      navigate('/dashboard');
    }, 1500);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-hero">
          <img src={roboBg} alt="Robo Warehouse" className="login-hero-img" />
          <div className="login-hero-overlay" />
          
          {/* Asterisk Logo at the top left of the Hero section */}
          <div style={{ position: 'absolute', top: '40px', left: '40px', fontSize: '40px', fontWeight: 'bold', zIndex: 2 }}>
            *
          </div>

          <div className="login-hero-content">
            <h2 style={{ fontSize: '2.4rem', marginBottom: '1.2rem', lineHeight: 1.1, fontWeight: 700 }}>
              Pusat Kendali <br />
              <span style={{ opacity: 0.85 }}>Smart Inventory</span>
            </h2>
            <p style={{ opacity: 0.8, lineHeight: 1.5, fontSize: '1rem', fontWeight: 500 }}>
              Optimalkan alur kerja robotik dan manajemen stok gudang kamu dengan presisi tinggi.
            </p>
          </div>
        </div>
        
        <form className="login-form" onSubmit={handleLogin}>
          <div className="login-header">
            <div style={{ color: '#0066FF', fontSize: '32px', fontWeight: 'bold', marginBottom: '16px' }}>*</div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 700 }}>Masuk ke Akun</h1>
            <p style={{ fontSize: '14px' }}>Silakan masukkan detail akses untuk melanjutkan.</p>
          </div>
          
          <div className="form-group">
            <label>Email Admin / Karyawan</label>
            <input 
              type="email" 
              placeholder="admin@robogudang.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <label style={{ margin: 0 }}>Kata Sandi</label>
              <a href="#" style={{ fontSize: '13px', color: '#0066FF', textDecoration: 'none', fontWeight: 600 }}>Lupa Kata Sandi?</a>
            </div>
            <input 
              type="password" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <button type="submit" className="login-btn" disabled={loading} style={{ marginTop: '20px' }}>
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                Menghubungkan...
              </span>
            ) : 'Masuk ke Dashboard'}
          </button>
          
          <p className="signup-link" style={{ marginTop: '30px' }}>
            Tidak punya akses? <a href="#" style={{ color: '#0066FF' }}>Minta Akses ke Admin IT</a>
          </p>
        </form>
      </div>
    </div>
  );
};
