import { useState } from 'react';
import { 
  Bot, 
  Bell, 
  Save, 
  Battery, 
  Package, 
  Ruler, 
  Wifi 
} from "lucide-react";
import './SystemPreferences.css';

export function SystemPreferences() {
  const [autonomous, setAutonomous] = useState(true);
  const [stockThreshold, setStockThreshold] = useState(10);
  const [batteryThreshold, setBatteryThreshold] = useState(20);
  const [unitWeight, setUnitWeight] = useState('kilogram');
  const [unitDimension, setUnitDimension] = useState('cm');
  const [rfidEnabled, setRfidEnabled] = useState(true);
  const [labellerEnabled, setLabellerEnabled] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');

  const handleSave = () => {
    setSaveStatus('Saving changes...');
    setTimeout(() => {
      setSaveStatus('Settings successfully updated!');
      setTimeout(() => setSaveStatus(''), 3000);
    }, 1000);
  };

  return (
    <div className="preferences-container">
      <div className="preferences-header">
        <h1>Preferensi Sistem</h1>
        <p>Kelola konfigurasi robotika, ambang batas gudang, dan integrasi perangkat keras.</p>
      </div>

      <div className="pref-section">
        <div className="pref-section-title">
          <Bot size={22} className="text-primary" />
          <span>Mode Operasional Robotika</span>
        </div>
        
        <div className="pref-row">
          <div className="pref-label-box">
            <h4>Full Autonomous Mode</h4>
            <p>Robot akan menentukan jalur optimal sendiri tanpa bantuan operator.</p>
          </div>
          <div className="pref-control">
            <label className="switch">
              <input 
                type="checkbox" 
                checked={autonomous} 
                onChange={() => setAutonomous(!autonomous)} 
              />
              <span className="slider"></span>
            </label>
          </div>
        </div>

        <div className="pref-row">
          <div className="pref-label-box">
            <h4>Collision Avoidance Sensitivity</h4>
            <p>Atur tingkat sensitivitas sensor dalam menghindari halangan.</p>
          </div>
          <div className="pref-control">
            <select className="pref-select">
              <option>High (Precision)</option>
              <option selected>Medium (Standard)</option>
              <option>Low (Speed Focus)</option>
            </select>
          </div>
        </div>
      </div>

      <div className="pref-section">
        <div className="pref-section-title">
          <Bell size={22} className="text-primary" />
          <span>Notifikasi & Ambang Batas</span>
        </div>
        
        <div className="pref-row">
          <div className="pref-label-box">
            <div className="flex items-center gap-2">
              <Package size={16} />
              <h4>Stok Minimum</h4>
            </div>
            <p>Threshold stok rendah untuk memicu peringatan restock.</p>
          </div>
          <div className="pref-control">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input 
                type="number" 
                className="pref-input" 
                value={stockThreshold} 
                onChange={(e) => setStockThreshold(Number(e.target.value))} 
              />
              <span className="text-sm font-medium">Unit</span>
            </div>
          </div>
        </div>

        <div className="pref-row">
          <div className="pref-label-box">
            <div className="flex items-center gap-2">
              <Battery size={16} />
              <h4>Baterai Kritis Robot</h4>
            </div>
            <p>Persentase baterai minimal sebelum robot kembali ke dock pengisian.</p>
          </div>
          <div className="pref-control">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input 
                type="number" 
                className="pref-input" 
                value={batteryThreshold} 
                onChange={(e) => setBatteryThreshold(Number(e.target.value))} 
              />
              <span className="text-sm font-medium">%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="pref-section">
        <div className="pref-section-title">
          <Ruler size={22} className="text-primary" />
          <span>Satuan & Regional</span>
        </div>
        
        <div className="pref-row">
          <div className="pref-label-box">
            <h4>Sistem Berat</h4>
            <p>Pilih standar pengukuran berat untuk semua item inventaris.</p>
          </div>
          <div className="pref-control">
            <select 
              className="pref-select" 
              value={unitWeight} 
              onChange={(e) => setUnitWeight(e.target.value)}
            >
              <option value="kilogram">Kilogram (kg)</option>
              <option value="pound">Pound (lbs)</option>
              <option value="gram">Gram (g)</option>
            </select>
          </div>
        </div>

        <div className="pref-row">
          <div className="pref-label-box">
            <h4>Sistem Dimensi</h4>
            <p>Pilih standar pengukuran panjang dan lebar area.</p>
          </div>
          <div className="pref-control">
            <select 
              className="pref-select" 
              value={unitDimension} 
              onChange={(e) => setUnitDimension(e.target.value)}
            >
              <option value="cm">Centimeter (cm)</option>
              <option value="m">Meter (m)</option>
              <option value="inch">Inches (in)</option>
            </select>
          </div>
        </div>
      </div>

      <div className="pref-section">
        <div className="pref-section-title">
          <Wifi size={22} className="text-primary" />
          <span>Integrasi Perangkat Keras</span>
        </div>
        
        <div className="pref-row">
          <div className="pref-label-box">
            <h4>RFID Entry Scanner</h4>
            <p>Aktifkan integrasi scanner otomatis di gerbang masuk.</p>
          </div>
          <div className="pref-control">
            <label className="switch">
              <input 
                type="checkbox" 
                checked={rfidEnabled} 
                onChange={() => setRfidEnabled(!rfidEnabled)} 
              />
              <span className="slider"></span>
            </label>
          </div>
        </div>

        <div className="pref-row">
          <div className="pref-label-box">
            <h4>Automatic Label Printer</h4>
            <p>Cetak label secara otomatis saat item baru didaftarkan.</p>
          </div>
          <div className="pref-control">
            <label className="switch">
              <input 
                type="checkbox" 
                checked={labellerEnabled} 
                onChange={() => setLabellerEnabled(!labellerEnabled)} 
              />
              <span className="slider"></span>
            </label>
          </div>
        </div>
      </div>

      <div className="save-bar">
        {saveStatus && <span className="text-sm font-medium mr-4 text-primary">{saveStatus}</span>}
        <button className="btn-primary" onClick={handleSave}>
          <div className="flex items-center gap-2">
            <Save size={18} />
            <span>Simpan Perubahan</span>
          </div>
        </button>
      </div>
    </div>
  );
}
