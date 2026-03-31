import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { 
  Search, 
  Download, 
  Eye, 
  Filter 
} from 'lucide-react';
import './Inventory.css';

const inventoryItems = [
  { sku: 'LDR-500-A', name: 'Sensor Lidar LDR-500', category: 'Elektronik', stock: 8, maxStock: 50, condition: 'Baru', location: 'Zona A - Rak 12' },
  { sku: 'SM-200-B', name: 'Motor Stepper Industri', category: 'Mekanik', stock: 45, maxStock: 100, condition: 'Baru', location: 'Zona B - Rak 5' },
  { sku: 'ACT-350-C', name: 'Aktuator Pneumatik', category: 'Aktuator', stock: 23, maxStock: 60, condition: 'Rekondisi', location: 'Zona A - Rak 8' },
  { sku: 'BP-3000-D', name: 'Paket Baterai BP-3000', category: 'Baterai', stock: 18, maxStock: 80, condition: 'Baru', location: 'Zona C - Rak 3' },
  { sku: 'CB-X1-E', name: 'Papan Kontrol CB-X1', category: 'Elektronik', stock: 67, maxStock: 120, condition: 'Baru', location: 'Zona B - Rak 15' },
  { sku: 'SV-200-F', name: 'Motor Servo SM-200', category: 'Mekanik', stock: 12, maxStock: 40, condition: 'Dalam Perbaikan', location: 'Zona A - Rak 20' },
  { sku: 'CAM-HD-G', name: 'Modul Kamera HD', category: 'Elektronik', stock: 34, maxStock: 75, condition: 'Baru', location: 'Zona C - Rak 7' },
  { sku: 'GRP-500-H', name: 'Perakit Gripper Robotik', category: 'Mekanik', stock: 29, maxStock: 50, condition: 'Baru', location: 'Zona B - Rak 11' }
];

export function Inventory() {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  
  const filtered = inventoryItems.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getCategoryBadgeClass = (category: string) => {
    switch (category) {
      case 'Elektronik': return 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30';
      case 'Mekanik': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'Aktuator': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'Baterai': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      default: return 'bg-slate-500/20 text-slate-400';
    }
  };

  const getConditionBadgeClass = (condition: string) => {
    switch (condition) {
      case 'Baru': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'Rekondisi': return 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30';
      case 'Dalam Perbaikan': return 'bg-rose-500/20 text-rose-400 border-rose-500/30';
      default: return 'bg-slate-500/20 text-slate-400';
    }
  };

  const lowStockCount = inventoryItems.filter(i => (i.stock / i.maxStock) < 0.25).length;
  const inRepairCount = inventoryItems.filter(i => i.condition === 'Dalam Perbaikan').length;

  return (
    <div className="inventory-wrapper space-y-6 animate-in fade-in duration-500">
      {/* Header with Export Button */}
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-slate-50 tracking-tight">Manajemen Inventaris</h1>
          <p className="text-slate-400 font-medium">Telusuri dan kelola inventaris gudang</p>
        </div>
        <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-all shadow-lg shadow-indigo-500/20">
          <Download size={18} />
          Ekspor Data
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center gap-4 bg-slate-900/50 border border-slate-800 p-3 rounded-xl">
        <div className="flex-1 flex items-center gap-3 px-3">
          <Search size={18} className="text-slate-500" />
          <input 
            type="text" 
            placeholder="Cari berdasarkan SKU atau nama barang..."
            className="bg-transparent border-none outline-none text-slate-200 text-sm w-full font-medium"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="h-6 w-px bg-slate-800"></div>
        <button className="flex items-center gap-2 px-3 text-slate-400 hover:text-slate-200 transition-colors">
          <Filter size={18} />
          <span className="text-sm font-semibold">Semua Kategori</span>
        </button>
      </div>

      {/* Inventory Table Card */}
      <Card className="p-0 border-slate-800/50 overflow-hidden shadow-2xl bg-slate-900/20">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900/60 border-b border-slate-800/50">
                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">SKU</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Nama Barang</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Kategori</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Level Stok</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Kondisi</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Lokasi</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/30">
              {filtered.map(item => {
                const percentage = Math.round((item.stock / item.maxStock) * 100);
                const isCritical = percentage < 25;

                return (
                  <tr key={item.sku} className="group hover:bg-white/[0.03] transition-colors">
                    <td className="px-6 py-5 text-sm font-medium text-slate-500 font-mono">{item.sku}</td>
                    <td className="px-6 py-5 text-sm font-semibold text-slate-100">{item.name}</td>
                    <td className="px-6 py-5 text-sm">
                      <Badge className={`${getCategoryBadgeClass(item.category)} text-[10px] uppercase font-bold py-1 px-3 border`}>
                        {item.category}
                      </Badge>
                    </td>
                    <td className="px-6 py-5 min-w-[180px]">
                      <div className="flex justify-between items-center mb-1.5">
                        <span className={`text-xs font-bold ${isCritical ? 'text-rose-500' : 'text-slate-300'}`}>
                          {item.stock} / {item.maxStock}
                        </span>
                        <span className="text-[10px] font-bold text-slate-500">{percentage}%</span>
                      </div>
                      <Progress 
                        value={percentage} 
                        className={`h-1.5 ${isCritical ? '[&>div]:bg-rose-500' : '[&>div]:bg-indigo-500'}`} 
                      />
                    </td>
                    <td className="px-6 py-5">
                      <Badge className={`${getConditionBadgeClass(item.condition)} text-[10px] font-bold py-1 px-3 border`}>
                        {item.condition}
                      </Badge>
                    </td>
                    <td className="px-6 py-5 text-sm font-medium text-slate-500">{item.location}</td>
                    <td className="px-6 py-5 text-right">
                      <button 
                        onClick={() => navigate(`/inventory/${item.sku}`)}
                        className="inline-flex items-center gap-1.5 text-slate-300 hover:text-white font-semibold text-xs transition-colors"
                      >
                        <Eye size={16} />
                        Lihat
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Summary Stats Bottom */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 border-slate-800/50 bg-slate-900/30 space-y-4">
          <p className="text-sm font-medium text-slate-400">Total Barang</p>
          <p className="text-4xl font-bold text-slate-50">{inventoryItems.length}</p>
        </Card>
        <Card className="p-6 border-slate-800/50 bg-slate-900/30 space-y-4">
          <p className="text-sm font-medium text-slate-400">Barang Stok Rendah</p>
          <p className="text-4xl font-bold text-rose-500">{lowStockCount}</p>
        </Card>
        <Card className="p-6 border-slate-800/50 bg-slate-900/30 space-y-4">
          <p className="text-sm font-medium text-slate-400">Dalam Perbaikan</p>
          <p className="text-4xl font-bold text-slate-50">{inRepairCount}</p>
        </Card>
      </div>
    </div>
  );
}
