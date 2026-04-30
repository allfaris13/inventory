import { useState, useEffect } from 'react';
import { 
  ArrowLeftRight, 
  Plus, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Package, 
  Building2,
  Check,
  X,
  AlertCircle
} from "lucide-react";
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';

interface DistributionRequest {
  id: number;
  branch_name: string;
  item_name: string;
  quantity: number;
  status: string;
  request_date: string;
}

interface InventoryItem {
  id: number;
  name: string;
  stock: number;
}

export function Distribution() {
  const [requests, setRequests] = useState<DistributionRequest[]>([]);
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isSuperAdmin = user.role === 'super_admin';

  // Form state
  const [newRequest, setNewRequest] = useState({
    item_id: 0,
    quantity: 1
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [rRes, iRes] = await Promise.all([
        fetch('/api/distribution'),
        fetch('/api/inventory')
      ]);

      if (!rRes.ok || !iRes.ok) {
        throw new Error('Gagal mengambil data dari server');
      }

      const rData = await rRes.json();
      const iData = await iRes.json();

      setRequests(Array.isArray(rData) ? rData : []);
      setItems(Array.isArray(iData) ? iData : []);
      setError(null);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Terjadi kesalahan saat memuat data');
    } finally {
      setLoading(false);
    }
  };

  const handleRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRequest.item_id) return;
    
    try {
      const res = await fetch('/api/distribution', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newRequest,
          branch_id: user.branch_id,
          requester_id: user.id,
          action: 'request'
        })
      });
      if (res.ok) {
        setIsModalOpen(false);
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleApprove = async (id: number) => {
    try {
      await fetch('/api/distribution', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'approve', request_id: id })
      });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  if (error) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <AlertCircle size={48} className="text-rose-500" />
        <h2 className="text-xl font-bold">Oops! {error}</h2>
        <Button onClick={fetchData} variant="outline">Coba Lagi</Button>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-4xl font-black text-foreground tracking-tighter uppercase italic flex items-center gap-3">
            <ArrowLeftRight size={36} className="text-primary" />
            Distribusi Barang
          </h1>
          <p className="text-xs text-muted-foreground mt-1 font-bold tracking-widest uppercase">
            {isSuperAdmin ? 'Pusat: Approval Permintaan Cabang' : `Cabang: Permintaan Stok ke Pusat`}
          </p>
        </div>
        {!isSuperAdmin && (
          <Button onClick={() => setIsModalOpen(true)} className="bg-primary hover:bg-primary/90 text-white h-12 px-6 rounded-xl font-black uppercase text-xs tracking-widest shadow-xl shadow-primary/20">
            <Plus size={18} className="mr-2" />
            Minta Barang ke Pusat
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card className="border-border bg-card shadow-xl rounded-[2.5rem] overflow-hidden">
          <div className="p-8 border-b border-border bg-muted/10 flex justify-between items-center">
            <h3 className="text-lg font-black text-foreground uppercase tracking-tight">Antrean Distribusi</h3>
            {loading && <Clock className="animate-spin text-primary" size={20} />}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-muted/30 border-b border-border">
                  <th className="px-8 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Dari Cabang</th>
                  <th className="px-8 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Barang</th>
                  <th className="px-8 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest text-center">Jumlah</th>
                  <th className="px-8 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Status</th>
                  <th className="px-8 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Waktu Request</th>
                  {isSuperAdmin && <th className="px-8 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest text-right">Tindakan</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {requests.length === 0 && !loading ? (
                  <tr>
                    <td colSpan={isSuperAdmin ? 6 : 5} className="px-8 py-20 text-center text-muted-foreground font-bold italic">
                      Belum ada antrean distribusi saat ini.
                    </td>
                  </tr>
                ) : (
                  requests.map(req => (
                    <tr key={req.id} className="hover:bg-muted/5 transition-colors group">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2">
                          <Building2 size={14} className="text-muted-foreground" />
                          <span className="font-bold text-sm uppercase">{req.branch_name}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2">
                          <Package size={14} className="text-muted-foreground" />
                          <span className="font-black text-sm">{req.item_name}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-center font-black">{req.quantity}</td>
                      <td className="px-8 py-6">
                        <Badge className={`font-black text-[10px] px-3 py-1 border shadow-sm ${
                          req.status === 'pending' ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' :
                          req.status === 'approved' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                          'bg-rose-500/10 text-rose-500 border-rose-500/20'
                        }`}>
                          {req.status.toUpperCase()}
                        </Badge>
                      </td>
                      <td className="px-8 py-6 text-[11px] text-muted-foreground font-medium">
                        {req.request_date ? new Date(req.request_date).toLocaleString('id-ID') : '-'}
                      </td>
                      {isSuperAdmin && (
                        <td className="px-8 py-6 text-right">
                          {req.status === 'pending' ? (
                            <div className="flex justify-end gap-2">
                              <Button 
                                onClick={() => handleApprove(req.id)} 
                                size="sm" 
                                className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow-lg shadow-emerald-500/20"
                              >
                                <Check size={18} className="mr-1" /> Approve
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-rose-500 hover:bg-rose-500/10 rounded-xl font-bold"
                              >
                                <X size={18} />
                              </Button>
                            </div>
                          ) : (
                            <span className="text-[10px] font-black text-muted-foreground italic uppercase tracking-widest">Selesai</span>
                          )}
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Modal Request */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-300">
          <Card className="w-full max-w-md bg-card border-border shadow-2xl rounded-[2.5rem] overflow-hidden animate-in zoom-in-95 duration-300">
             <div className="p-8 border-b border-border bg-muted/20 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                    <Package size={20} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-foreground uppercase italic tracking-tight">Request Stok</h2>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-0.5">Permintaan barang ke gudang pusat</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)} 
                  className="p-2 hover:bg-muted rounded-xl transition-all"
                >
                  <X />
                </button>
             </div>
             <form onSubmit={handleRequest} className="p-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-1">Pilih Barang Inventaris</label>
                  <select 
                    className="w-full h-12 bg-muted/20 border border-border font-bold rounded-xl px-4 outline-none focus:ring-2 focus:ring-primary appearance-none cursor-pointer"
                    value={newRequest.item_id}
                    onChange={e => setNewRequest({...newRequest, item_id: parseInt(e.target.value)})}
                    required
                  >
                    <option value="">Pilih barang...</option>
                    {items.map(item => (
                      <option key={item.id} value={item.id}>{item.name} (Stok: {item.stock})</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-1">Jumlah Permintaan</label>
                  <Input 
                    type="number"
                    min="1"
                    required
                    className="h-12 bg-muted/20 border-border font-black text-lg rounded-xl"
                    value={newRequest.quantity}
                    onChange={e => setNewRequest({...newRequest, quantity: parseInt(e.target.value)})}
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full h-14 bg-primary hover:bg-primary/90 text-white font-black uppercase text-xs tracking-widest rounded-2xl shadow-xl shadow-primary/20 mt-4 transition-all active:scale-95"
                >
                  Kirim Permintaan Ke Pusat
                </Button>
             </form>
          </Card>
        </div>
      )}
    </div>
  );
}
