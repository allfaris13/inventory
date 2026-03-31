import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { 
  Package, 
  AlertTriangle, 
  Activity, 
  DollarSign, 
  ArrowUpRight,
  TrendingUp
} from 'lucide-react';
import './Dashboard.css';

const chartData = [
  { name: '25 Mar', masuk: 45, keluar: 30 },
  { name: '26 Mar', masuk: 52, keluar: 38 },
  { name: '27 Mar', masuk: 48, keluar: 42 },
  { name: '28 Mar', masuk: 61, keluar: 45 },
  { name: '29 Mar', masuk: 55, keluar: 40 },
  { name: '30 Mar', masuk: 68, keluar: 52 },
  { name: '31 Mar', masuk: 58, keluar: 48 },
];

const criticalItems = [
  { name: 'Sensor Lidar LDR-500', stock: 8, limit: 15, status: 'Tinggi', color: 'text-red-500' },
  { name: 'Motor Servo SM-200', stock: 12, limit: 25, status: 'Tinggi', color: 'text-red-500' },
  { name: 'Paket Baterai BP-3000', stock: 18, limit: 30, status: 'Sedang', color: 'text-blue-500' },
  { name: 'Papan Kontrol CB-X1', stock: 22, limit: 35, status: 'Sedang', color: 'text-blue-500' },
];

export function Dashboard() {
  return (
    <div className="dashboard-wrapper space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold text-slate-50 tracking-tight">Dasbor</h1>
        <p className="text-slate-400 font-medium">Ikhtisar real-time operasional gudang</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-0 border-slate-800/50">
          <div className="flex justify-between items-start p-6">
            <div className="space-y-2">
              <p className="text-sm font-medium text-slate-400">Total Aset</p>
              <h2 className="text-3xl font-bold text-slate-50">1,847</h2>
              <div className="flex items-center text-emerald-400 text-xs font-semibold gap-1">
                <TrendingUp size={14} />
                <span>+12% dari bulan lalu</span>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
              <Package size={24} className="text-indigo-400" />
            </div>
          </div>
        </Card>

        <Card className="p-0 border-slate-800/50">
          <div className="flex justify-between items-start p-6">
            <div className="space-y-2">
              <p className="text-sm font-medium text-slate-400">Peringatan Stok Rendah</p>
              <h2 className="text-3xl font-bold text-rose-500">24</h2>
              <p className="text-slate-500 text-xs font-medium">Perlu perhatian</p>
            </div>
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20">
              <AlertTriangle size={24} className="text-rose-500" />
            </div>
          </div>
        </Card>

        <Card className="p-0 border-slate-800/50">
          <div className="flex justify-between items-start p-6">
            <div className="space-y-2">
              <p className="text-sm font-medium text-slate-400">Aktivitas Hari Ini</p>
              <h2 className="text-3xl font-bold text-slate-50">107</h2>
              <p className="text-slate-500 text-xs font-medium">Transaksi</p>
            </div>
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <Activity size={24} className="text-emerald-400" />
            </div>
          </div>
        </Card>

        <Card className="p-0 border-slate-800/50">
          <div className="flex justify-between items-start p-6">
            <div className="space-y-2">
              <p className="text-sm font-medium text-slate-400">Nilai Inventaris</p>
              <h2 className="text-3xl font-bold text-slate-50">Rp 36M</h2>
              <div className="flex items-center text-emerald-400 text-xs font-semibold gap-1">
                <ArrowUpRight size={14} />
                <span>+8.5% peningkatan nilai</span>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <DollarSign size={24} className="text-emerald-500" />
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Chart */}
        <Card className="lg:col-span-2 border-slate-800/50 flex flex-col">
          <div className="p-6 border-b border-slate-800/50 flex flex-col gap-1">
            <h3 className="text-xl font-bold text-slate-50">Aktivitas Harian</h3>
            <p className="text-sm text-slate-400">Transaksi masuk vs keluar</p>
          </div>
          <div className="px-2 pt-6 flex-1 h-[340px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorMasuk" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorKeluar" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="#64748b" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false}
                  dy={10}
                />
                <YAxis 
                  stroke="#64748b" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#0f172a', 
                    borderColor: '#1e293b',
                    borderRadius: '12px',
                    color: '#f1f5f9'
                  }}
                  itemStyle={{ fontSize: '12px' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="masuk" 
                  stroke="#6366f1" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorMasuk)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="keluar" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorKeluar)" 
                />
              </AreaChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-6 pb-6 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-indigo-500"></div>
                  <span className="text-slate-400">Masuk</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                  <span className="text-slate-400">Keluar</span>
                </div>
            </div>
          </div>
        </Card>

        {/* Critical Alerts */}
        <Card className="border-slate-800/50">
          <div className="p-6 border-b border-slate-800/50 flex flex-col gap-1">
            <h3 className="text-xl font-bold text-slate-50">Peringatan Kritis</h3>
            <p className="text-sm text-slate-400">Komponen stok rendah</p>
          </div>
          <div className="p-6 space-y-6">
            {criticalItems.map((item, idx) => (
              <div key={idx} className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-slate-200">{item.name}</span>
                  <Badge variant={item.status === 'Tinggi' ? 'destructive' : 'secondary'} className="text-[10px] py-0 px-2 h-5">
                    {item.status}
                  </Badge>
                </div>
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Stok: {item.stock}</span>
                  <span>Ambang: {item.limit}</span>
                </div>
                <Progress value={(item.stock / item.limit) * 100} className="h-1.5" />
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
