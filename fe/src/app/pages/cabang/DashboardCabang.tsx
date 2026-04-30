import { useState, useEffect } from 'react';
import { 
  Package, 
  AlertTriangle, 
  Truck, 
  Search, 
  Plus, 
  ShoppingCart,
  ArrowRightLeft,
  RefreshCcw,
  CheckCircle2,
  X,
  Send,
  ArrowDownToLine
} from "lucide-react";
import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';

interface LocalStock {
  id: number;
  name: string;
  sku: string;
  stock: number;
  status: 'Healthy' | 'Low Stock';
  image?: string;
}

interface Distribution {
  id: number;
  status: string;
}

export function DashboardCabang() {
  const [stocks, setStocks] = useState<LocalStock[]>([]);
  const [distributions, setDistributions] = useState<Distribution[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeModal, setActiveModal] = useState<{type: 'request' | 'sale', item: LocalStock} | null>(null);
  const [modalQty, setModalQty] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchLocalData();
    fetchDistributions();
  }, []);

  const fetchLocalData = async () => {
    try {
      const res = await fetch(`/api/inventory?branch_id=${user.branch_id}`);
      const data = await res.json();
      const mapped = data.map((item: any) => ({
        id: item.id,
        name: item.name,
        sku: `SKU-${item.id.toString().padStart(3, '0')}`,
        stock: item.stock,
        status: item.stock < 10 ? 'Low Stock' : 'Healthy',
        image: item.image
      }));
      setStocks(mapped);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDistributions = async () => {
    try {
      const res = await fetch(`/api/distribution?branch_id=${user.branch_id}`);
      const data = await res.json();
      setDistributions(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeModal) return;
    setIsSubmitting(true);

    try {
      if (activeModal.type === 'request') {
        const res = await fetch('/api/distribution', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            branch_id: user.branch_id,
            item_id: activeModal.item.id,
            quantity: modalQty,
            requester_id: user.id,
            action: 'request'
          })
        });
        if (res.ok) {
          fetchDistributions();
          setActiveModal(null);
        }
      } else {
        const res = await fetch('/api/transactions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            item_id: activeModal.item.id,
            type: 'OUT',
            quantity: modalQty,
            reason: 'Penjualan Cabang',
            user_id: user.id,
            branch_id: user.branch_id
          })
        });
        if (res.ok) {
          fetchLocalData();
          setActiveModal(null);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
      setModalQty(1);
    }
  };

  const pendingShipments = distributions.filter(d => d.status === 'pending' || d.status === 'shipped').length;

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-700">
      {/* Header Cabang */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-foreground tracking-tighter uppercase italic">
            CABANG {user.branch_id} - {user.full_name?.split(' ')[0]}: OPERASIONAL
          </h1>
          <p className="text-xs font-bold text-muted-foreground tracking-widest uppercase mt-1">
            Status Gudang Lokal & Kendali Distribusi
          </p>
        </div>
        <div className="flex items-center gap-2">
           <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 font-black px-4 py-1.5 rounded-full text-[10px] uppercase">Online</Badge>
           <Button onClick={() => { fetchLocalData(); fetchDistributions(); }} variant="outline" size="sm" className="rounded-xl border-border h-9 px-4 font-bold text-xs">
              <RefreshCcw size={14} className="mr-2" /> Sinkronisasi
           </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-8 border-border bg-emerald-500 text-white shadow-xl shadow-emerald-500/20 rounded-[2rem] space-y-4">
          <p className="text-xs font-bold uppercase tracking-widest opacity-80">Total Stok Produk</p>
          <p className="text-6xl font-black tracking-tighter">
            {stocks.reduce((acc, curr) => acc + curr.stock, 0).toLocaleString()}
          </p>
        </Card>
        
        <Card className="p-8 border-border bg-amber-500 text-white shadow-xl shadow-amber-500/20 rounded-[2rem] space-y-4">
          <div className="flex justify-between items-start">
             <p className="text-xs font-bold uppercase tracking-widest opacity-80">Stok Rendah (&lt;10)</p>
             <Badge className="bg-white/20 text-white border-none font-black text-[10px]">Action Required</Badge>
          </div>
          <p className="text-6xl font-black tracking-tighter">
            {stocks.filter(s => s.stock < 10).length}
          </p>
        </Card>

        <Card className="p-8 border-border bg-indigo-600 text-white shadow-xl shadow-indigo-600/20 rounded-[2rem] space-y-4">
          <p className="text-xs font-bold uppercase tracking-widest opacity-80">Menunggu Kiriman</p>
          <p className="text-6xl font-black tracking-tighter">
            {pendingShipments} <span className="text-2xl opacity-60">{pendingShipments === 1 ? 'shipment' : 'shipments'}</span>
          </p>
        </Card>
      </div>

      {/* Main Table Card */}
      <Card className="border-border bg-card shadow-2xl rounded-[2.5rem] overflow-hidden">
        <div className="p-8 border-b border-border flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-muted/10">
          <h3 className="text-xl font-black text-foreground uppercase tracking-tight italic">Daftar Stok Lokal</h3>
          <div className="flex gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:min-w-[300px]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <Input className="pl-12 h-12 bg-card border-border rounded-xl font-bold" placeholder="Cari produk..." />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-muted/30 border-b border-border">
                <th className="px-8 py-5 text-[11px] font-black text-muted-foreground uppercase tracking-widest">Foto</th>
                <th className="px-8 py-5 text-[11px] font-black text-muted-foreground uppercase tracking-widest">Nama Produk</th>
                <th className="px-8 py-5 text-[11px] font-black text-muted-foreground uppercase tracking-widest">SKU</th>
                <th className="px-8 py-5 text-[11px] font-black text-muted-foreground uppercase tracking-widest">Stok Saat Ini (Qty)</th>
                <th className="px-8 py-5 text-[11px] font-black text-muted-foreground uppercase tracking-widest">Status</th>
                <th className="px-8 py-5 text-[11px] font-black text-muted-foreground uppercase tracking-widest text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr><td colSpan={6} className="p-20 text-center animate-pulse font-black text-muted-foreground">LOADING STOK...</td></tr>
              ) : stocks.map(item => (
                <tr key={item.id} className="hover:bg-muted/5 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="w-14 h-14 rounded-2xl bg-muted border border-border flex items-center justify-center overflow-hidden">
                      {item.image ? <img src={item.image} className="w-full h-full object-cover" /> : <Package size={24} className="opacity-20" />}
                    </div>
                  </td>
                  <td className="px-8 py-6 font-black text-sm uppercase">{item.name}</td>
                  <td className="px-8 py-6 text-xs font-bold text-muted-foreground">{item.sku}</td>
                  <td className="px-8 py-6 text-lg font-black">{item.stock}</td>
                  <td className="px-8 py-6">
                    <Badge className={`font-black text-[10px] px-4 py-1.5 rounded-full uppercase border ${
                      item.status === 'Healthy' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                    }`}>
                      {item.status}
                    </Badge>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-2">
                       <Button 
                         onClick={() => setActiveModal({type: 'request', item})}
                         variant="outline" size="sm" className="rounded-xl border-emerald-500/50 text-emerald-600 font-black text-[10px] h-9 px-4 uppercase hover:bg-emerald-50"
                       >
                          Minta Stok
                       </Button>
                       <Button 
                         onClick={() => setActiveModal({type: 'sale', item})}
                         variant="outline" size="sm" className="rounded-xl border-primary/50 text-primary font-black text-[10px] h-9 px-4 uppercase hover:bg-primary/5"
                       >
                          Input Jual
                       </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Action Modal */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-300">
          <Card className="w-full max-w-md bg-card border-border shadow-2xl rounded-[2.5rem] overflow-hidden">
            <div className="p-8 border-b border-border bg-muted/20 flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${
                  activeModal.type === 'request' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20'
                }`}>
                  {activeModal.type === 'request' ? <ArrowDownToLine size={24} /> : <ShoppingCart size={24} />}
                </div>
                <div>
                  <h2 className="text-xl font-black text-foreground leading-none uppercase italic">
                    {activeModal.type === 'request' ? 'Request Stok' : 'Input Penjualan'}
                  </h2>
                  <p className="text-[10px] font-bold text-muted-foreground tracking-widest uppercase mt-1">
                    {activeModal.item.name}
                  </p>
                </div>
              </div>
              <button onClick={() => setActiveModal(null)} className="p-2 hover:bg-muted rounded-xl transition-all">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-1">
                  Jumlah (Qty)
                </label>
                <Input 
                  type="number"
                  min={1}
                  max={activeModal.type === 'sale' ? activeModal.item.stock : 999}
                  required 
                  className="h-14 bg-muted/20 border-border font-black text-xl rounded-2xl text-center"
                  value={modalQty}
                  onChange={e => setModalQty(parseInt(e.target.value))}
                />
                {activeModal.type === 'sale' && (
                  <p className="text-[10px] font-bold text-muted-foreground text-center uppercase">
                    Stok Tersedia: {activeModal.item.stock}
                  </p>
                )}
              </div>

              <Button 
                type="submit" 
                disabled={isSubmitting || (activeModal.type === 'sale' && modalQty > activeModal.item.stock)}
                className={`w-full h-14 font-black uppercase text-xs tracking-widest rounded-2xl shadow-xl transition-all active:scale-95 ${
                  activeModal.type === 'request' 
                    ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/20' 
                    : 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-500/20'
                }`}
              >
                {isSubmitting ? 'Processing...' : (activeModal.type === 'request' ? 'Kirim Permintaan' : 'Konfirmasi Jual')}
              </Button>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
