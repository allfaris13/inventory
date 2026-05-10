import { useState, useEffect } from 'react';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { School, Truck, History, CalendarDays, Box } from 'lucide-react';

export function PrepareDistribute() {
  const [myInventory, setMyInventory] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
  const [form, setForm] = useState({
    itemId: '',
    quantity: '',
    schoolName: '',
    notes: ''
  });

  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const prepareId = user?.id;

  const fetchData = async () => {
    try {
      const [invRes, histRes] = await Promise.all([
        fetch(`/api/prepare/inventory?prepare_id=${prepareId}`),
        fetch(`/api/prepare/distributions?prepare_id=${prepareId}`)
      ]);
      const inv = await invRes.json();
      const hist = await histRes.json();
      setMyInventory(inv || []);
      setHistory(hist || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (prepareId) fetchData();
  }, [prepareId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.itemId || !form.quantity || !form.schoolName) {
      alert("Mohon lengkapi semua kolom wajib.");
      return;
    }

    // Validate quantity locally
    const selectedItem = myInventory.find(i => i.item_id.toString() === form.itemId);
    if (selectedItem && parseInt(form.quantity) > selectedItem.stock) {
      alert(`Stok tidak cukup! Stok yang Anda miliki hanya ${selectedItem.stock}.`);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/prepare/distributions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prepare_id: prepareId,
          item_id: parseInt(form.itemId),
          quantity: parseInt(form.quantity),
          school_name: form.schoolName,
          notes: form.notes
        })
      });
      const data = await res.json();
      if (res.ok) {
        alert("Barang berhasil didistribusikan ke sekolah!");
        setForm({ itemId: '', quantity: '', schoolName: '', notes: '' });
        fetchData();
      } else {
        alert(data.error || "Gagal mendistribusikan.");
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
          <div className="p-2 bg-violet-600 rounded-xl text-white shadow-lg shadow-violet-600/30">
             <Truck size={24} />
          </div>
          Distribusi ke Sekolah
        </h1>
        <p className="text-muted-foreground font-medium">Catat pengiriman barang dari tangan Anda ke instansi/sekolah tujuan.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* Input Form */}
        <div className="xl:col-span-5">
          <Card className="p-8 border-none shadow-2xl bg-white dark:bg-neutral-900 ring-1 ring-violet-500/10">
            <h2 className="text-xl font-black mb-6 text-foreground flex items-center gap-2 border-b border-border pb-4">
              <School size={20} className="text-violet-600" />
              Form Distribusi Barang
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-muted-foreground uppercase tracking-wider">Pilih Barang Anda</label>
                <select 
                  value={form.itemId}
                  onChange={(e) => setForm({...form, itemId: e.target.value})}
                  className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3.5 text-foreground font-medium focus:ring-2 focus:ring-violet-500 transition-all outline-none"
                  required
                >
                  <option value="">-- Barang di Tangan --</option>
                  {myInventory.map(item => (
                    <option key={item.item_id} value={item.item_id}>
                      {item.item_name} (Tersedia: {item.stock})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-black text-muted-foreground uppercase tracking-wider">Jumlah Dikirim</label>
                  <Input 
                    type="number" min="1" placeholder="Contoh: 5"
                    className="h-12 bg-muted/50 border-border font-medium focus-visible:ring-violet-500"
                    value={form.quantity}
                    onChange={(e) => setForm({...form, quantity: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2 flex items-end">
                   <div className="p-3 bg-violet-50 text-violet-700 dark:bg-violet-900/20 dark:text-violet-400 rounded-xl text-xs font-bold flex gap-2 items-center h-12 border border-violet-100 dark:border-violet-800/50 flex-1">
                      <Box size={16} />
                      Pastikan stok cukup
                   </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-muted-foreground uppercase tracking-wider">Nama Instansi / Sekolah</label>
                <Input 
                  placeholder="Masukkan nama sekolah..."
                  className="h-12 bg-muted/50 border-border font-medium focus-visible:ring-violet-500"
                  value={form.schoolName}
                  onChange={(e) => setForm({...form, schoolName: e.target.value})}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-muted-foreground uppercase tracking-wider">Catatan Tambahan (Opsional)</label>
                <Input 
                  placeholder="Tujuan kegiatan, PIC, dll."
                  className="h-12 bg-muted/50 border-border focus-visible:ring-violet-500"
                  value={form.notes}
                  onChange={(e) => setForm({...form, notes: e.target.value})}
                />
              </div>

              <Button 
                type="submit" 
                disabled={loading}
                className="w-full h-14 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-black text-lg rounded-xl shadow-xl shadow-violet-500/20 transition-all duration-300 active:scale-95 flex gap-2 items-center justify-center"
              >
                {loading ? 'Memproses...' : (
                  <>
                    Konfirmasi Pengiriman
                    <Truck size={20} />
                  </>
                )}
              </Button>
            </form>
          </Card>
        </div>

        {/* History */}
        <div className="xl:col-span-7 space-y-4">
          <h3 className="text-xl font-black flex items-center gap-2 text-foreground">
            <History size={20} className="text-violet-600" />
            Riwayat Distribusi Sekolah
          </h3>
          
          <div className="space-y-4">
            {history.length === 0 ? (
              <div className="bg-muted/30 border-2 border-dashed border-border rounded-2xl p-12 text-center text-muted-foreground font-medium">
                Belum ada riwayat pengiriman ke sekolah.
              </div>
            ) : (
              history.map((item, idx) => (
                <Card key={idx} className="p-6 border-none shadow-md hover:shadow-xl transition-shadow bg-white dark:bg-neutral-900 ring-1 ring-border group flex flex-col md:flex-row gap-6 md:items-center justify-between">
                  <div className="flex items-center gap-4">
                     <div className="h-16 w-16 rounded-2xl bg-violet-50 dark:bg-violet-900/20 flex items-center justify-center text-violet-600 dark:text-violet-400 group-hover:bg-violet-600 group-hover:text-white transition-all duration-500 shrink-0 border border-violet-100 dark:border-violet-800">
                        <School size={28} />
                     </div>
                     <div>
                        <h4 className="text-lg font-black text-foreground group-hover:text-violet-600 transition-colors">{item.school_name}</h4>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-sm font-medium text-muted-foreground">
                          <span className="flex items-center gap-1"><Box size={14} />{item.item_name}</span>
                          <span className="flex items-center gap-1 text-violet-600 dark:text-violet-400 font-bold"><Truck size={14} />{item.quantity} Pcs</span>
                        </div>
                     </div>
                  </div>
                  
                  <div className="flex items-center gap-3 shrink-0 border-t md:border-t-0 md:border-l border-border pt-4 md:pt-0 md:pl-6">
                     <div className="text-right">
                        <div className="text-xs font-black text-muted-foreground uppercase flex items-center justify-end gap-1">
                          <CalendarDays size={12} />
                          Tanggal Kirim
                        </div>
                        <div className="text-sm font-bold text-foreground mt-0.5">
                          {item.dist_date}
                        </div>
                     </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
