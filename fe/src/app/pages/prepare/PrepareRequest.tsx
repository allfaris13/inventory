import { useState, useEffect } from 'react';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { Send, Package, Clock, CheckCircle2, XCircle } from 'lucide-react';

export function PrepareRequest() {
  const [inventoryList, setInventoryList] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ itemId: '', quantity: '' });

  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const requesterId = user?.id;

  const fetchData = async () => {
    try {
      const [invRes, reqRes] = await Promise.all([
        fetch('/api/inventory'),
        fetch(`/api/prepare/requests?requester_id=${requesterId}`)
      ]);
      const invData = await invRes.json();
      const reqData = await reqRes.json();
      setInventoryList(invData || []);
      setRequests(reqData || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [requesterId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.itemId || !form.quantity) return;

    setLoading(true);
    try {
      const res = await fetch('/api/prepare/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          item_id: parseInt(form.itemId),
          quantity: parseInt(form.quantity),
          requester_id: requesterId
        })
      });
      if (res.ok) {
        setForm({ itemId: '', quantity: '' });
        fetchData();
        alert("Permintaan berhasil dikirim ke Super Admin!");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-black text-foreground tracking-tight flex items-center gap-3">
          <div className="p-2 bg-purple-600 rounded-xl text-white">
             <Package size={24} />
          </div>
          Permintaan Barang ke Pusat
        </h1>
        <p className="text-muted-foreground font-medium">Ajukan pengambilan barang dari gudang utama untuk operasional.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Request Form */}
        <div className="lg:col-span-1">
          <Card className="p-6 border-none shadow-xl bg-white dark:bg-neutral-900 ring-1 ring-purple-500/10 sticky top-24">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-foreground">
              <Send size={18} className="text-purple-600" />
              Buat Request Baru
            </h3>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-muted-foreground tracking-wider">Pilih Barang</label>
                <select 
                  value={form.itemId}
                  onChange={(e) => setForm({...form, itemId: e.target.value})}
                  className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 text-foreground focus:ring-2 focus:ring-purple-500 transition-all outline-none appearance-none"
                  required
                >
                  <option value="">-- Pilih Item di Gudang Pusat --</option>
                  {inventoryList.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name} (Stok Pusat: {item.stock})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-muted-foreground tracking-wider">Jumlah Dibutuhkan</label>
                <Input 
                  type="number" 
                  min="1" 
                  placeholder="Contoh: 10"
                  value={form.quantity}
                  onChange={(e) => setForm({...form, quantity: e.target.value})}
                  className="rounded-xl border-border bg-muted/50 focus-visible:ring-purple-600"
                  required
                />
              </div>

              <Button 
                type="submit" 
                disabled={loading}
                className="w-full h-12 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-lg shadow-purple-600/20 group transition-all"
              >
                {loading ? 'Mengirim...' : (
                  <span className="flex items-center gap-2">
                    Kirim Permintaan 
                    <Send size={16} className="group-hover:translate-x-1 transition-transform" />
                  </span>
                )}
              </Button>
            </form>
          </Card>
        </div>

        {/* History Table */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-xl font-black tracking-tight flex items-center gap-2">
            <Clock size={20} className="text-purple-600" />
            Riwayat Permintaan Anda
          </h3>
          <Card className="border-none shadow-xl overflow-hidden ring-1 ring-purple-500/10 bg-white dark:bg-neutral-900">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-muted/50 border-b border-border">
                  <tr>
                    <th className="p-4 text-xs font-black uppercase text-muted-foreground">Tanggal</th>
                    <th className="p-4 text-xs font-black uppercase text-muted-foreground">Barang</th>
                    <th className="p-4 text-xs font-black uppercase text-muted-foreground">Qty</th>
                    <th className="p-4 text-xs font-black uppercase text-muted-foreground">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {requests.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="p-8 text-center text-muted-foreground font-medium">Belum ada data permintaan.</td>
                    </tr>
                  ) : (
                    requests.map((req) => (
                      <tr key={req.id} className="hover:bg-muted/30 transition-colors group">
                        <td className="p-4 text-sm font-medium text-foreground">{req.request_date}</td>
                        <td className="p-4 font-bold text-foreground">{req.item_name}</td>
                        <td className="p-4 text-sm font-black text-purple-600">{req.quantity}</td>
                        <td className="p-4">
                          {req.status === 'approved' ? (
                            <Badge className="bg-emerald-100 text-emerald-700 border-none flex w-fit items-center gap-1 font-bold px-3 py-1">
                              <CheckCircle2 size={12} /> DITERIMA
                            </Badge>
                          ) : req.status === 'rejected' ? (
                            <Badge className="bg-rose-100 text-rose-700 border-none flex w-fit items-center gap-1 font-bold px-3 py-1">
                              <XCircle size={12} /> DITOLAK
                            </Badge>
                          ) : (
                            <Badge className="bg-amber-100 text-amber-700 border-none flex w-fit items-center gap-1 font-bold px-3 py-1">
                              <Clock size={12} /> MENUNGGU
                            </Badge>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
