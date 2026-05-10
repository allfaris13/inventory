import { useState, useEffect } from 'react';
import { 
  Package, 
  Search, 
  ShoppingCart,
  RefreshCcw,
  X,
  ArrowDownToLine,
  BarChart3,
  MapPin,
  Sparkles,
  CheckCircle
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
}

interface Distribution {
  id: number;
  status: string;
}

export function DashboardCabang() {
  const [stocks, setStocks] = useState<LocalStock[]>([]);
  const [distributions, setDistributions] = useState<Distribution[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
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
        status: item.stock < 10 ? 'Low Stock' : 'Healthy'
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
          alert("Permintaan distribusi terkirim ke Pusat!");
        }
      } else {
        const res = await fetch('/api/transactions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            item_id: activeModal.item.id,
            type: 'OUT',
            quantity: modalQty,
            reason: 'Pengurangan Operasional Cabang',
            user_id: user.id,
            branch_id: user.branch_id
          })
        });
        if (res.ok) {
          fetchLocalData();
          setActiveModal(null);
          alert("Stok cabang berhasil diperbarui!");
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
      setModalQty(1);
    }
  };

  const pendingShipments = distributions.filter(d => d.status === 'pending').length;
  const totalItems = stocks.reduce((acc, curr) => acc + curr.stock, 0);
  const lowStockCount = stocks.filter(s => s.status === 'Low Stock').length;

  const filteredStocks = stocks.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#88b04b]"></div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      {/* Premium Header: Matcha Themed */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#7c9a42] via-[#88b04b] to-[#62852d] p-8 text-white shadow-2xl shadow-[#88b04b]/30">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-lime-200/20 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
             <div className="flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full w-fit text-xs font-bold border border-white/30">
                <MapPin size={14} />
                Cabang ID: {user.branch_id || '-'}
             </div>
             <h1 className="text-4xl md:text-5xl font-black tracking-tight italic uppercase">
               Dashboard Cabang
             </h1>
             <p className="opacity-90 font-medium text-lg max-w-xl">
               Halo, <span className="font-bold underline decoration-lime-300">{user.full_name}</span>. Selamat datang kembali di portal kendali stok wilayah Anda.
             </p>
          </div>
          <div className="flex gap-3">
             <Button 
               onClick={() => { fetchLocalData(); fetchDistributions(); }} 
               className="bg-white/15 hover:bg-white/25 text-white border border-white/20 rounded-2xl h-14 px-6 backdrop-blur-md font-bold shadow-xl transition-all active:scale-95"
             >
                <RefreshCcw size={18} className="mr-2" />
                Sinkronisasi Data
             </Button>
          </div>
        </div>
      </div> 

      {/* Visual Statistics - Modern Glassmorphic style */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <Card className="relative overflow-hidden group p-6 border-none bg-white dark:bg-neutral-900 shadow-xl ring-1 ring-black/5 rounded-[2rem] transition-all hover:-translate-y-1">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
               <Package size={80} className="text-[#88b04b]" />
            </div>
            <p className="text-xs font-black text-muted-foreground tracking-widest uppercase">Total Stok Anda</p>
            <div className="mt-4 flex items-end gap-2">
               <h3 className="text-5xl font-black tracking-tighter text-foreground">{totalItems.toLocaleString()}</h3>
               <span className="text-sm font-bold text-[#88b04b] mb-2">Unit</span>
            </div>
            <div className="h-1.5 bg-muted rounded-full mt-6 overflow-hidden">
               <div className="h-full bg-gradient-to-r from-[#88b04b] to-[#a1c862] w-full rounded-full" />
            </div>
         </Card>

         <Card className="relative overflow-hidden group p-6 border-none bg-white dark:bg-neutral-900 shadow-xl ring-1 ring-black/5 rounded-[2rem] transition-all hover:-translate-y-1">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
               <ArrowDownToLine size={80} className="text-orange-500" />
            </div>
            <p className="text-xs font-black text-muted-foreground tracking-widest uppercase">Antrean Request Pusat</p>
            <div className="mt-4 flex items-end gap-2">
               <h3 className="text-5xl font-black tracking-tighter text-foreground">{pendingShipments}</h3>
               <span className="text-sm font-bold text-orange-500 mb-2">Menunggu</span>
            </div>
            <div className="h-1.5 bg-muted rounded-full mt-6 overflow-hidden">
               <div className="h-full bg-orange-400 rounded-full transition-all duration-1000" style={{ width: `${(pendingShipments/5)*100}%` }} />
            </div>
         </Card>

         <Card className="relative overflow-hidden group p-6 border-none bg-white dark:bg-neutral-900 shadow-xl ring-1 ring-black/5 rounded-[2rem] transition-all hover:-translate-y-1">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
               <Sparkles size={80} className="text-rose-500" />
            </div>
            <p className="text-xs font-black text-muted-foreground tracking-widest uppercase">Barang Kritis (Low)</p>
            <div className="mt-4 flex items-end gap-2">
               <h3 className={`text-5xl font-black tracking-tighter ${lowStockCount > 0 ? 'text-rose-500' : 'text-emerald-500'}`}>{lowStockCount}</h3>
               <span className="text-sm font-bold text-muted-foreground mb-2">Item</span>
            </div>
            <div className={`mt-4 py-1.5 px-3 rounded-xl inline-flex items-center gap-1.5 text-xs font-bold ${lowStockCount > 0 ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'}`}>
               {lowStockCount > 0 ? <X size={14} /> : <CheckCircle size={14} />}
               {lowStockCount > 0 ? 'Perlu Restock Segera' : 'Semua Aman'}
            </div>
         </Card>
      </div>

      {/* Main Management Grid */}
      <div className="space-y-6">
         <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-3">
               <div className="p-2.5 bg-[#88b04b] text-white rounded-2xl shadow-lg shadow-[#88b04b]/30">
                  <BarChart3 size={24} />
               </div>
               <div>
                  <h2 className="text-2xl font-black text-foreground tracking-tight">Daftar Inventaris Lokal</h2>
                  <p className="text-sm text-muted-foreground font-medium">Kelola sisa stok fisik yang tersedia di cabang Anda.</p>
               </div>
            </div>
            
            <div className="relative w-full md:w-80">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
               <Input 
                  placeholder="Cari nama item..."
                  className="pl-12 h-12 rounded-2xl bg-white dark:bg-neutral-900 border-border shadow-sm focus:ring-2 focus:ring-[#88b04b]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
               />
            </div>
         </div>

         <Card className="border-none shadow-2xl bg-white dark:bg-neutral-900 rounded-[2.5rem] overflow-hidden ring-1 ring-black/5">
            <div className="overflow-x-auto">
               <table className="w-full text-left border-collapse">
                  <thead className="bg-muted/40 border-b border-border">
                     <tr>
                        <th className="px-8 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Identitas Item</th>
                        <th className="px-8 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Sisa Stok</th>
                        <th className="px-8 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Kesehatan</th>
                        <th className="px-8 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest text-right">Kendali Cepat</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                     {filteredStocks.length === 0 ? (
                        <tr>
                           <td colSpan={4} className="px-8 py-20 text-center text-muted-foreground italic font-bold">Tidak ada data produk ditemukan.</td>
                        </tr>
                     ) : (
                        filteredStocks.map(item => (
                           <tr key={item.id} className="hover:bg-muted/20 transition-colors group">
                              <td className="px-8 py-6">
                                 <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-xl bg-[#88b04b]/10 text-[#88b04b] flex items-center justify-center border border-[#88b04b]/20 transition-transform group-hover:scale-110">
                                       <Package size={24} />
                                    </div>
                                    <div>
                                       <p className="font-black text-foreground text-base tracking-tight">{item.name}</p>
                                       <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">{item.sku}</p>
                                    </div>
                                 </div>
                              </td>
                              <td className="px-8 py-6">
                                 <span className={`text-2xl font-black tracking-tighter ${item.stock < 10 ? 'text-rose-500' : 'text-foreground'}`}>
                                    {item.stock}
                                 </span>
                                 <span className="text-xs font-bold text-muted-foreground ml-1">Unit</span>
                              </td>
                              <td className="px-8 py-6">
                                 <Badge className={`font-black text-[10px] px-3 py-1 rounded-full uppercase border-none ${
                                    item.status === 'Healthy' 
                                    ? 'bg-[#88b04b]/15 text-[#6b8c3a]' 
                                    : 'bg-rose-100 text-rose-600'
                                 }`}>
                                    {item.status}
                                 </Badge>
                              </td>
                              <td className="px-8 py-6">
                                 <div className="flex justify-end gap-3 opacity-80 group-hover:opacity-100 transition-all">
                                    <Button 
                                       onClick={() => setActiveModal({ type: 'request', item })}
                                       className="h-10 bg-white dark:bg-neutral-800 hover:bg-[#88b04b] hover:text-white text-foreground border border-border shadow-sm rounded-xl font-bold text-xs transition-all"
                                    >
                                       <ArrowDownToLine size={14} className="mr-1.5" /> Request Pusat
                                    </Button>
                                    <Button 
                                       onClick={() => setActiveModal({ type: 'sale', item })}
                                       disabled={item.stock === 0}
                                       className="h-10 bg-foreground dark:bg-neutral-700 hover:bg-neutral-800 text-white rounded-xl font-bold text-xs shadow-md shadow-black/10 transition-all"
                                    >
                                       <ShoppingCart size={14} className="mr-1.5" /> Keluar/Jual
                                    </Button>
                                 </div>
                              </td>
                           </tr>
                        ))
                     )}
                  </tbody>
               </table>
            </div>
         </Card>
      </div>

      {/* Action Modal (Contextual Dialog) */}
      {activeModal && (
         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-md animate-in fade-in duration-300">
            <Card className="w-full max-w-md bg-card border-border shadow-2xl rounded-[2.5rem] overflow-hidden animate-in zoom-in-95 duration-300">
               <div className={`p-6 border-b border-border text-white flex justify-between items-center ${activeModal.type === 'request' ? 'bg-[#88b04b]' : 'bg-neutral-900'}`}>
                  <div className="flex items-center gap-3">
                     {activeModal.type === 'request' ? <ArrowDownToLine size={24} /> : <ShoppingCart size={24} />}
                     <h3 className="text-xl font-black uppercase italic tracking-tight">
                        {activeModal.type === 'request' ? 'Request Stok Pusat' : 'Catat Pengurangan'}
                     </h3>
                  </div>
                  <button onClick={() => setActiveModal(null)} className="p-2 bg-white/10 hover:bg-white/20 rounded-xl"><X size={18} /></button>
               </div>
               
               <form onSubmit={handleSubmit} className="p-8 space-y-6">
                  <div>
                     <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Nama Produk</p>
                     <p className="text-xl font-black text-foreground mt-1">{activeModal.item.name}</p>
                     <p className="text-xs font-bold text-[#88b04b] mt-0.5">Stok Cabang Saat Ini: {activeModal.item.stock}</p>
                  </div>

                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Jumlah Unit</label>
                     <Input 
                        type="number" min={1} max={activeModal.type === 'sale' ? activeModal.item.stock : undefined}
                        className="h-14 font-black text-2xl text-center bg-muted/30 border-border rounded-2xl focus:ring-2 focus:ring-[#88b04b]"
                        value={modalQty}
                        onChange={(e) => setModalQty(parseInt(e.target.value) || 1)}
                        required
                     />
                  </div>

                  <Button 
                     type="submit" 
                     disabled={isSubmitting}
                     className={`w-full h-14 font-black text-white text-base uppercase tracking-widest shadow-xl rounded-2xl active:scale-95 transition-all ${
                        activeModal.type === 'request' ? 'bg-[#88b04b] hover:bg-[#759a3e] shadow-[#88b04b]/30' : 'bg-neutral-900 hover:bg-neutral-800 shadow-black/30'
                     }`}
                  >
                     {isSubmitting ? 'Memproses...' : 'Konfirmasi Eksekusi'}
                  </Button>
               </form>
            </Card>
         </div>
      )}
    </div>
  );
}
