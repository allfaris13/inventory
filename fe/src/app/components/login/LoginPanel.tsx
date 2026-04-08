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
    
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      // Cek apakah response tipenya JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Server returned non-JSON:', text);
        alert('Server mengalami gangguan. Periksa log Vercel kamu.');
        return;
      }

      const data = await response.json();

      if (response.ok && data.status === 'success') {
        localStorage.setItem('user', JSON.stringify(data.user));
        navigate('/dashboard');
      } else {
        alert(data.message || 'Login gagal. Periksa email dan password kamu.');
      }
    } catch (error) {
      console.error('Network/Client Error:', error);
      alert('Gagal terhubung ke API. Pastikan Vercel sudah benar konfigurasinya.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-hero">
          <img src={roboBg} alt="Robo Warehouse" className="login-hero-img" />
          <div className="login-hero-overlay" />
          
          {/* Asterisk Logo at the top left of the Hero section */}
          <div className="login-logo-asterisk">*</div>

          <div className="login-hero-content">
            <h2>
              Pusat Kendali <br />
              <span style={{ opacity: 0.85 }}>Smart Inventory</span>
            </h2>
            <p style={{ opacity: 0.8, lineHeight: 1.5, fontWeight: 500 }}>
              Optimalkan alur kerja robotik dan manajemen stok gudang kamu dengan presisi tinggi.
            </p>
          </div>
        </div>
        
        <form className="login-form" onSubmit={handleLogin}>
          <div className="login-header">
            <div className="login-form-asterisk">*</div>
            <h1>Masuk ke Akun</h1>
            <p>Silakan masukkan detail akses untuk melanjutkan.</p>
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
