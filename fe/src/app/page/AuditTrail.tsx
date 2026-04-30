import { useState, useEffect } from 'react';
import { 
  History, 
  User, 
  MapPin, 
  Clock, 
  ArrowUpRight, 
  ArrowDownLeft, 
  RefreshCcw,
  Search,
  Filter,
  ShieldCheck
} from "lucide-react";
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';

interface AuditLog {
  id: number;
  type: 'masuk' | 'keluar' | 'penyesuaian';
  quantity: number;
  reason: string;
  date: string;
  user_name: string;
  branch_name: string;
  item_name: string;
}

export function AuditTrail() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/audit-trail');
      const data = await res.json();
      setLogs(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch audit trail:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs = logs.filter(log => 
    log.item_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.branch_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-4xl font-black text-foreground tracking-tighter uppercase italic flex items-center gap-3">
            <History size={36} className="text-primary" />
            Audit Trail
          </h1>
          <p className="text-xs text-muted-foreground mt-1 font-bold tracking-widest uppercase">
            Log Aktivitas Seluruh Cabang & Transaksi Real-time
          </p>
        </div>
        <div className="flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-xl">
           <ShieldCheck size={18} className="text-emerald-500" />
           <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Sistem Audit Aktif</span>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6 border-border bg-card shadow-sm">
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Total Aktivitas</p>
          <p className="text-3xl font-black text-foreground">{logs.length}</p>
        </Card>
        <Card className="p-6 border-border bg-card shadow-sm border-l-4 border-l-emerald-500">
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Barang Masuk</p>
          <p className="text-3xl font-black text-emerald-500">{logs.filter(l => l.type === 'masuk').length}</p>
        </Card>
        <Card className="p-6 border-border bg-card shadow-sm border-l-4 border-l-rose-500">
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Barang Keluar</p>
          <p className="text-3xl font-black text-rose-500">{logs.filter(l => l.type === 'keluar').length}</p>
        </Card>
        <Card className="p-6 border-border bg-card shadow-sm">
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Cabang Terpantau</p>
          <p className="text-3xl font-black text-primary">4</p>
        </Card>
      </div>

      {/* Filter & Search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <Input 
            className="pl-12 h-12 bg-card border-border rounded-xl font-bold"
            placeholder="Cari user, barang, atau cabang..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button 
          onClick={fetchLogs}
          className="h-12 px-6 bg-muted hover:bg-muted/80 rounded-xl flex items-center gap-2 font-bold transition-all"
        >
          <RefreshCcw size={18} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* Audit Table */}
      <Card className="border-border bg-card shadow-xl rounded-[2.5rem] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-muted/30 border-b border-border">
                <th className="px-8 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Waktu</th>
                <th className="px-8 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Pelaku (User)</th>
                <th className="px-8 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Lokasi/Cabang</th>
                <th className="px-8 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Aktivitas Barang</th>
                <th className="px-8 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Jumlah</th>
                <th className="px-8 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Keterangan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-8 py-20 text-center text-muted-foreground font-black animate-pulse">
                    MENGAMBIL DATA AUDIT...
                  </td>
                </tr>
              ) : filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-8 py-20 text-center text-muted-foreground italic font-bold">
                    Tidak ada log aktivitas yang ditemukan.
                  </td>
                </tr>
              ) : (
                filteredLogs.map(log => (
                  <tr key={log.id} className="hover:bg-muted/5 transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
                        <Clock size={12} />
                        {new Date(log.date).toLocaleString('id-ID')}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-black text-[10px]">
                          {log.user_name?.[0]?.toUpperCase() || 'S'}
                        </div>
                        <span className="font-black text-sm uppercase italic">{log.user_name || 'SYSTEM'}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <Badge variant="outline" className="font-black text-[10px] uppercase tracking-tighter italic border-primary/20 text-primary">
                        <MapPin size={10} className="mr-1" /> {log.branch_name || 'PUSAT'}
                      </Badge>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="font-black text-sm uppercase">{log.item_name}</span>
                        <div className="flex items-center gap-1 mt-1">
                          {log.type === 'masuk' ? (
                            <ArrowDownLeft size={14} className="text-emerald-500" />
                          ) : log.type === 'keluar' ? (
                            <ArrowUpRight size={14} className="text-rose-500" />
                          ) : (
                            <RefreshCcw size={14} className="text-blue-500" />
                          )}
                          <span className={`text-[10px] font-black uppercase ${
                            log.type === 'masuk' ? 'text-emerald-500' : 
                            log.type === 'keluar' ? 'text-rose-500' : 'text-blue-500'
                          }`}>
                            BARANG {log.type}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 font-black text-lg">
                      {log.type === 'keluar' ? '-' : '+'}{log.quantity}
                    </td>
                    <td className="px-8 py-6 text-xs text-muted-foreground font-medium italic">
                      "{log.reason}"
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
