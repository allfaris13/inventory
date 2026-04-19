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
  ArrowDownRight,
  TrendingUp,
  Wallet
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
    <div className="dashboard-wrapper space-y-6 animate-in fade-in duration-500 transition-colors">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold text-foreground tracking-tight">Dasbor</h1>
        <p className="text-muted-foreground font-medium">Ikhtisar real-time operasional gudang</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
        <Card className="p-0 border-border bg-card shadow-sm group">
          <div className="flex justify-between items-start p-6">
            <div className="space-y-2">
              <p className="text-xs font-black text-muted-foreground uppercase tracking-widest">Total Aset</p>
              <h2 className="text-3xl font-black text-foreground tracking-tight">1,847</h2>
              <div className="flex items-center text-emerald-500 text-xs font-black gap-1">
                <TrendingUp size={14} />
                <span>+12%</span>
              </div>
            </div>
            <div className="p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/10 text-indigo-500 group-hover:scale-110 transition-transform">
              <Package size={24} />
            </div>
          </div>
        </Card>

        <Card className="p-0 border-border bg-card shadow-sm group">
          <div className="flex justify-between items-start p-6">
            <div className="space-y-2">
              <p className="text-xs font-black text-muted-foreground uppercase tracking-widest">Stok Rendah</p>
              <h2 className="text-3xl font-black text-rose-500 tracking-tight">24</h2>
              <p className="text-muted-foreground text-[10px] font-black uppercase">Perlu Perhatian</p>
            </div>
            <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/10 text-rose-500 group-hover:scale-110 transition-transform">
              <AlertTriangle size={24} />
            </div>
          </div>
        </Card>

        <Card className="p-0 border-border bg-card shadow-sm group">
          <div className="flex justify-between items-start p-6">
            <div className="space-y-2">
              <p className="text-xs font-black text-muted-foreground uppercase tracking-widest">Pemasukan Dana</p>
              <h2 className="text-3xl font-black text-emerald-500 tracking-tight">Rp 16.85M</h2>
              <div className="flex items-center text-emerald-500 text-xs font-black gap-1">
                <ArrowUpRight size={14} />
                <span>Target Tercapai</span>
              </div>
            </div>
            <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/10 text-emerald-500 group-hover:scale-110 transition-transform">
               <Wallet size={24} />
            </div>
          </div>
        </Card>

        <Card className="p-0 border-border bg-card shadow-sm group">
          <div className="flex justify-between items-start p-6">
            <div className="space-y-2">
              <p className="text-xs font-black text-muted-foreground uppercase tracking-widest">Pengeluaran RAB</p>
              <h2 className="text-3xl font-black text-rose-500 tracking-tight">Rp 15.02M</h2>
              <div className="flex items-center text-rose-500 text-xs font-black gap-1">
                <ArrowDownRight size={14} />
                <span>Dalam Anggaran</span>
              </div>
            </div>
            <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/10 text-rose-500 group-hover:scale-110 transition-transform">
               <ArrowUpRight size={24} />
            </div>
          </div>
        </Card>

        <Card className="p-0 border-border bg-card shadow-sm group">
          <div className="flex justify-between items-start p-6">
            <div className="space-y-2">
              <p className="text-xs font-black text-muted-foreground uppercase tracking-widest">Aktivitas Hari Ini</p>
              <h2 className="text-3xl font-black text-foreground tracking-tight">107</h2>
              <p className="text-muted-foreground text-[10px] font-black uppercase">Transaksi</p>
            </div>
            <div className="p-3 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 text-indigo-500 group-hover:scale-110 transition-transform text-opacity-50">
              <Activity size={24} />
            </div>
          </div>
        </Card>

        <Card className="p-0 border-border bg-card shadow-sm group">
          <div className="flex justify-between items-start p-6">
            <div className="space-y-2">
              <p className="text-xs font-black text-muted-foreground uppercase tracking-widest">Nilai Inventaris</p>
              <h2 className="text-3xl font-black text-foreground tracking-tight">Rp 36M</h2>
              <div className="flex items-center text-emerald-500 text-xs font-black gap-1">
                <ArrowUpRight size={14} />
                <span>+8.5%</span>
              </div>
            </div>
            <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/10 text-emerald-500 group-hover:scale-110 transition-transform">
              <DollarSign size={24} />
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Chart */}
        <Card className="lg:col-span-2 border-border bg-card flex flex-col shadow-sm">
          <div className="p-6 border-b border-border flex flex-col gap-1 bg-muted/10">
            <h3 className="text-xl font-black text-foreground uppercase tracking-tight">Aktivitas Harian</h3>
            <p className="text-xs text-muted-foreground font-bold tracking-widest">TRANSAKSI MASUK VS KELUAR</p>
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
                <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-border" vertical={false} opacity={0.3} />
                <XAxis 
                  dataKey="name" 
                  stroke="currentColor" 
                  className="text-muted-foreground"
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false}
                  dy={10}
                />
                <YAxis 
                  stroke="currentColor" 
                  className="text-muted-foreground"
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false} 
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'var(--card)', 
                    borderColor: 'var(--border)',
                    borderRadius: '12px',
                    color: 'var(--foreground)',
                    fontSize: '11px',
                    fontWeight: 'bold',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                  }}
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
            <div className="flex justify-center gap-8 pb-6 text-[10px] font-black uppercase tracking-[0.2em]">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]"></div>
                  <span className="text-muted-foreground">Masuk</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                  <span className="text-muted-foreground">Keluar</span>
                </div>
            </div>
          </div>
        </Card>

        {/* Critical Alerts */}
        <Card className="border-border bg-card shadow-sm h-full">
          <div className="p-6 border-b border-border flex flex-col gap-1 bg-muted/10">
            <h3 className="text-xl font-black text-foreground uppercase tracking-tight">Peringatan Kritis</h3>
            <p className="text-xs text-muted-foreground font-bold tracking-widest">KOMPONEN STOK RENDAH</p>
          </div>
          <div className="p-6 space-y-7">
            {criticalItems.map((item, idx) => (
              <div key={idx} className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-black text-foreground uppercase">{item.name}</span>
                  <Badge variant={item.status === 'Tinggi' ? 'destructive' : 'secondary'} className="text-[9px] font-black py-0.5 px-2 h-5 tracking-tighter">
                    {item.status.toUpperCase()}
                  </Badge>
                </div>
                <div className="flex justify-between text-[10px] font-bold text-muted-foreground uppercase">
                  <span>Stok: {item.stock}</span>
                  <span>Ambang: {item.limit}</span>
                </div>
                <Progress value={(item.stock / item.limit) * 100} className={`h-2 ${item.status === 'Tinggi' ? '[&>div]:bg-rose-500' : '[&>div]:bg-blue-500'}`} />
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
