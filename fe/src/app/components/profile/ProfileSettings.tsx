import { useState } from 'react';
import { 
  User, 
  Mail, 
  Lock, 
  Camera, 
  ShieldCheck, 
  History, 
  Save
} from "lucide-react";
import './ProfileSettings.css';

export function ProfileSettings() {
  const [saveStatus, setSaveStatus] = useState('');
  const [formData, setFormData] = useState({
    fullName: 'Sarah Mitchell',
    employeeId: 'EMP-ROBO-1029',
    department: 'Manajer Gudang Operasional',
    email: 'sarah.mitchell@robogudang.com',
    phone: '+62 812-3456-7890'
  });

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveStatus('Menyimpan perubahan...');
    setTimeout(() => {
      setSaveStatus('Profil berhasil diperbarui!');
      setTimeout(() => setSaveStatus(''), 3000);
    }, 1200);
  };

  return (
    <div className="profile-settings-container">
      <div className="profile-header">
        <div className="profile-avatar-container">
          <div className="profile-avatar-large">
            <User size={60} />
          </div>
          <button className="avatar-edit-btn" title="Ganti Foto">
            <Camera size={18} />
          </button>
        </div>
        <div className="profile-info-brief">
          <div className="status-badge">Aktif • Sesi Terverifikasi</div>
          <h1>{formData.fullName}</h1>
          <p>{formData.department} • {formData.employeeId}</p>
        </div>
      </div>

      <div className="settings-grid">
        <form onSubmit={handleUpdate} className="settings-card col-span-2">
          <div className="card-title">
            <ShieldCheck size={24} className="text-primary" />
            <span>Informasi Personal</span>
          </div>

          <div className="form-grid-2">
            <div className="form-field">
              <label>Nama Lengkap</label>
              <input 
                type="text" 
                value={formData.fullName} 
                onChange={(e) => setFormData({...formData, fullName: e.target.value})}
              />
            </div>
            <div className="form-field">
              <label>ID Karyawan</label>
              <input 
                type="text" 
                value={formData.employeeId} 
                disabled 
                style={{ opacity: 0.7, background: 'var(--muted)' }}
              />
            </div>
          </div>

          <div className="form-grid-2">
            <div className="form-field">
              <label>Email Korporat</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: '12px', top: '15px', color: 'var(--text-muted)' }} />
                <input 
                  type="email" 
                  value={formData.email} 
                  style={{ paddingLeft: '40px' }}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>
            <div className="form-field">
              <label>No. Telepon Aktif</label>
              <input 
                type="text" 
                value={formData.phone} 
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
              />
            </div>
          </div>

          <div className="card-title" style={{ marginTop: '40px' }}>
            <Lock size={24} className="text-primary" />
            <span>Keamanan Akun</span>
          </div>
          
          <div className="form-grid-2">
            <div className="form-field">
              <label>Ganti Kata Sandi</label>
              <input type="password" placeholder="••••••••" />
            </div>
            <div className="form-field">
              <label>Konfirmasi Kata Sandi Baru</label>
              <input type="password" placeholder="••••••••" />
            </div>
          </div>

          <div className="footer-actions">
            {saveStatus && <span style={{ color: 'var(--primary)', fontWeight: 600, alignSelf: 'center' }}>{saveStatus}</span>}
            <button type="button" className="btn-ghost">Batalkan</button>
            <button type="submit" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Save size={18} />
              Simpan Profil
            </button>
          </div>
        </form>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="stats-card">
            <div className="card-title" style={{ color: 'white', marginBottom: '20px' }}>
              <History size={20} />
              <span>Aktivitas</span>
            </div>
            <div className="stats-item">
              <div className="stats-label">Robot Terakhir Dikalibrasi</div>
              <div className="stats-value">2 Juta Jam</div>
            </div>
            <div className="stats-item">
              <div className="stats-label">Inventory Diselesaikan</div>
              <div className="stats-value">1,240 Item</div>
            </div>
            <div className="stats-item">
              <div className="stats-label">Level Otoritas</div>
              <div className="stats-value" style={{ color: '#00f3ff' }}>SUPER-ADMIN</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
