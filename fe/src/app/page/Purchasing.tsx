import { useState, useEffect } from 'react';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { 
  Table, 
  TableBody, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '../components/ui/table';
import { 
  ShoppingBag, 
  Plus, 
  ArrowUpRight, 
  TrendingUp, 
  Calculator,
  ChevronRight,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  DollarSign,
  X,
  ShoppingCart,
  Percent,
  Truck,
  CreditCard,
  Trash2,
  Edit,
  RotateCcw
} from 'lucide-react';

interface RABItem {
  id: string;
  tanggalPengajuan: string;
  namaBarang: string;
  jumlah: number;
  satuan: string;
  estimasiHarga: number;
  totalEstimasi: number;
  kebutuhan: string; // e.g. "teknisi", "pengajar"
  kategori: 'Fisik' | 'Non-Fisik';
  status: 'Pending' | 'Realized';
}

interface RealisasiItem extends RABItem {
  tanggalPembelian: string;
  hargaSatuan: number;
  subTotal: number;
  biayaLayanan: number;
  biayaOngkir: number;
  diskon: number;
  totalAkhir: number;
  tujuanPembelian: string;
  metodePembelian: 'online' | 'offline';
  sumberDana: string;
}

export interface FormItemRow {
  namaBarang: string;
  jumlah: number;
  satuan: string;
  estimasiHarga: number;
}

export function Purchasing() {
  const [activeTab, setActiveTab] = useState<'RAB' | 'Realisasi' | 'Laporan'>('RAB');
  const [rabItems, setRabItems] = useState<RABItem[]>([]);
  const [realisasiItems, setRealisasiItems] = useState<RealisasiItem[]>([]);
  const [isRABModalOpen, setIsRABModalOpen] = useState(false);
  const [isRealisasiModalOpen, setIsRealisasiModalOpen] = useState(false);
  const [selectedRAB, setSelectedRAB] = useState<RABItem | null>(null);

  // Form States for RAB
  const [newRAB, setNewRAB] = useState<{
    tanggalPengajuan: string;
    kebutuhan: string;
    kategori: 'Fisik' | 'Non-Fisik';
  }>({
    tanggalPengajuan: new Date().toLocaleDateString('id-ID'),
    kebutuhan: 'teknisi',
    kategori: 'Fisik'
  });

  const [itemsList, setItemsList] = useState<FormItemRow[]>([
    { namaBarang: '', jumlah: 1, satuan: 'pcs', estimasiHarga: 0 }
  ]);

  const [realItemsList, setRealItemsList] = useState<FormItemRow[]>([]);

  // Form States for Realisasi
  const [newReal, setNewReal] = useState<Partial<RealisasiItem>>({
    tanggalPembelian: new Date().toLocaleDateString('id-ID'),
    hargaSatuan: 0,
    biayaLayanan: 0,
    biayaOngkir: 0,
    diskon: 0,
    metodePembelian: 'offline',
    sumberDana: 'Dana RAB'
  });
  const [pemasukanDana, setPemasukanDana] = useState<number>(() => {
    const saved = localStorage.getItem('pemasukan_dana_rab');
    return saved ? parseInt(saved) : 16855990;
  });

  useEffect(() => {
    localStorage.setItem('pemasukan_dana_rab', pemasukanDana.toString());
  }, [pemasukanDana]);

  useEffect(() => {
    fetchPurchasing();
  }, []);

  const fetchPurchasing = () => {
    fetch('/api/purchasing')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setRabItems(data);
          setRealisasiItems(data.filter(item => item.status === 'Realized'));
        }
      })
      .catch(err => console.error("Fetch purchasing error:", err));
  };

  const parseItems = (item: RABItem): FormItemRow[] => {
    try {
      if (item.namaBarang && item.namaBarang.trim().startsWith('[')) {
        return JSON.parse(item.namaBarang);
      }
    } catch (e) {}
    return [{
      namaBarang: item.namaBarang,
      jumlah: item.jumlah,
      satuan: item.satuan,
      estimasiHarga: item.estimasiHarga
    }];
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getRealisasiSubtotal = () => {
    return realItemsList.reduce((sum, item) => sum + (item.jumlah * item.estimasiHarga), 0);
  };

  const getRealisasiTotal = () => {
    const sub = getRealisasiSubtotal();
    return sub + (newReal.biayaLayanan || 0) + (newReal.biayaOngkir || 0) - (newReal.diskon || 0);
  };

  const handleSaveRAB = async (e: React.FormEvent) => {
    e.preventDefault();
    const totalEstimasi = itemsList.reduce((sum, item) => sum + (item.jumlah * item.estimasiHarga), 0);
    try {
      const res = await fetch('/api/purchasing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tanggalPengajuan: newRAB.tanggalPengajuan,
          kebutuhan: newRAB.kebutuhan,
          kategori: newRAB.kategori,
          namaBarang: JSON.stringify(itemsList),
          jumlah: 1,
          satuan: 'items',
          estimasiHarga: totalEstimasi
        })
      });
      if (res.ok) {
        fetchPurchasing();
        setIsRABModalOpen(false);
        setItemsList([{ namaBarang: '', jumlah: 1, satuan: 'pcs', estimasiHarga: 0 }]);
      }
    } catch (err) {
      console.error("Save RAB error:", err);
    }
  };

  const handleOpenRealisasi = (item: RABItem) => {
    setSelectedRAB(item);
    const parsed = parseItems(item);
    setRealItemsList(parsed);
    
    if (item.status === 'Realized') {
      const real = item as RealisasiItem;
      setNewReal({
        tanggalPembelian: real.tanggalPembelian || new Date().toLocaleDateString('id-ID'),
        hargaSatuan: real.hargaSatuan || 0,
        biayaLayanan: real.biayaLayanan || 0,
        biayaOngkir: real.biayaOngkir || 0,
        diskon: real.diskon || 0,
        tujuanPembelian: real.tujuanPembelian || item.kebutuhan,
        metodePembelian: real.metodePembelian || 'offline',
        sumberDana: real.sumberDana || 'Dana RAB'
      });
    } else {
      setNewReal({
        tanggalPembelian: new Date().toLocaleDateString('id-ID'),
        hargaSatuan: 0,
        biayaLayanan: 0,
        biayaOngkir: 0,
        diskon: 0,
        metodePembelian: 'offline',
        sumberDana: 'Dana RAB',
        tujuanPembelian: item.kebutuhan
      });
    }
    setIsRealisasiModalOpen(true);
  };

  const handleSaveRealisasi = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRAB) return;

    const subTotal = getRealisasiSubtotal();
    try {
      const res = await fetch('/api/purchasing', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          real_id: (selectedRAB as any).real_id,
          tanggalPembelian: newReal.tanggalPembelian,
          namaBarang: JSON.stringify(realItemsList),
          jumlah: 1,
          satuan: 'items',
          hargaSatuan: subTotal,
          biayaLayanan: newReal.biayaLayanan,
          biayaOngkir: newReal.biayaOngkir,
          diskon: newReal.diskon,
          tujuanPembelian: newReal.tujuanPembelian,
          metodePembelian: newReal.metodePembelian,
          sumberDana: newReal.sumberDana
        })
      });
      if (res.ok) {
        fetchPurchasing();
        setIsRealisasiModalOpen(false);
        setActiveTab('Realisasi');
      }
    } catch (err) {
      console.error("Save Realisasi error:", err);
    }
  };

  const handleDeletePurchasing = async (item: RABItem) => {
    if (!confirm("Apakah Anda yakin ingin menghapus pengajuan RAB ini? Tindakan ini tidak dapat dibatalkan.")) return;
    const anyItem = item as any;
    let realId = anyItem.real_id;
    if (!realId && typeof item.id === 'string' && item.id.includes('-')) {
      const parts = item.id.split('-');
      realId = parseInt(parts[parts.length - 1]) || item.id;
    }
    try {
      const res = await fetch(`/api/purchasing?id=${realId}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        fetchPurchasing();
      }
    } catch (err) {
      console.error("Delete purchasing error:", err);
    }
  };

  const handleResetPurchasing = async (item: RABItem) => {
    if (!confirm("Apakah Anda yakin ingin membatalkan realisasi pembelanjaan ini dan mengembalikan status ke Pending?")) return;
    const anyItem = item as any;
    let realId = anyItem.real_id;
    if (!realId && typeof item.id === 'string' && item.id.includes('-')) {
      const parts = item.id.split('-');
      realId = parseInt(parts[parts.length - 1]) || item.id;
    }
    try {
      const res = await fetch(`/api/purchasing?id=${realId}&action=reset`, {
        method: 'DELETE'
      });
      if (res.ok) {
        fetchPurchasing();
      }
    } catch (err) {
      console.error("Reset purchasing error:", err);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
        <div>
          <h1 className="text-4xl font-black text-foreground tracking-tight flex items-center gap-3">
             <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center text-primary border border-primary/30">
                <ShoppingBag size={28} />
             </div>
             Purchasing & RAB
          </h1>
          <p className="text-muted-foreground font-medium mt-2 italic tracking-wide uppercase text-[10px]">Procurement Cycle: Planning & Realization</p>
        </div>
        
        <div className="flex gap-3">
           {activeTab === 'RAB' && (
             <Button 
               onClick={() => setIsRABModalOpen(true)}
               className="bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-2 h-14 px-6 rounded-2xl font-black uppercase text-xs tracking-widest transition-all shadow-xl shadow-indigo-500/20"
             >
                <Plus size={20} />
                Buat Pengajuan RAB
             </Button>
           )}
        </div>
      </div>

      {/* Tabs Layout */}
      <div className="flex p-1.5 bg-muted/30 rounded-[2rem] w-full max-w-2xl border border-border">
        {(['RAB', 'Realisasi', 'Laporan'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-4 px-6 rounded-[1.5rem] font-black text-[10px] tracking-[0.2em] uppercase transition-all ${activeTab === tab ? 'bg-card text-foreground shadow-2xl border border-border' : 'text-muted-foreground hover:text-foreground'}`}
          >
            {tab === 'RAB' ? 'Pengajuan RAB' : tab === 'Realisasi' ? 'Realisasi Belanja' : 'Laporan Bulanan'}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="grid grid-cols-1 gap-8">
        {activeTab === 'RAB' && (
          <Card className="border-border bg-card shadow-xl rounded-[2.5rem] overflow-hidden">
             <div className="p-8 border-b border-border bg-muted/10 flex justify-between items-center">
                <div className="flex flex-col gap-1">
                   <h3 className="text-lg font-black text-foreground uppercase tracking-tight">Daftar Pengajuan RAB</h3>
                   <p className="text-xs text-muted-foreground font-bold italic tracking-widest uppercase">Perencanaan Anggaran Periode berjalan</p>
                </div>
                <div className="flex gap-2">
                   <div className="px-4 py-2 border border-border rounded-xl bg-muted/20 flex items-center gap-2">
                      <Clock size={14} className="text-orange-500" />
                      <span className="text-[10px] font-black uppercase">{rabItems.filter(r => r.status === 'Pending').length} Menunggu</span>
                   </div>
                </div>
             </div>
             <Table>
                <TableHeader>
                   <TableRow className="border-border hover:bg-transparent">
                      <TableHead className="px-8 font-black text-[10px] uppercase tracking-widest text-muted-foreground">Tanggal</TableHead>
                      <TableHead className="px-8 font-black text-[10px] uppercase tracking-widest text-muted-foreground">Barang</TableHead>
                      <TableHead className="px-8 font-black text-[10px] uppercase tracking-widest text-muted-foreground text-center">Jumlah</TableHead>
                      <TableHead className="px-8 font-black text-[10px] uppercase tracking-widest text-muted-foreground text-right">Estimasi</TableHead>
                      <TableHead className="px-8 font-black text-[10px] uppercase tracking-widest text-muted-foreground text-right">Total</TableHead>
                      <TableHead className="px-8 font-black text-[10px] uppercase tracking-widest text-muted-foreground">Penerima</TableHead>
                      <TableHead className="px-8 font-black text-[10px] uppercase tracking-widest text-muted-foreground text-center">Status</TableHead>
                      <TableHead className="px-8 font-black text-[10px] uppercase tracking-widest text-muted-foreground text-right">Aksi</TableHead>
                   </TableRow>
                </TableHeader>
                <TableBody>
                   {rabItems.map((item) => {
                      const parsed = parseItems(item);
                      return (
                         <TableRow key={item.id} className="border-border hover:bg-muted/10 transition-colors group">
                            <td className="px-8 py-6 text-xs font-mono font-medium text-muted-foreground">{item.tanggalPengajuan}</td>
                            <td className="px-8 py-6">
                               <div className="space-y-1">
                                  {parsed.map((sub, idx) => (
                                     <div key={idx} className="flex flex-col mb-2 last:mb-0 border-b border-border/10 pb-1 last:border-none">
                                        <span className="text-sm font-black text-foreground uppercase tracking-tight">{sub.namaBarang}</span>
                                        <span className="text-[10px] text-muted-foreground font-mono">Qty: {sub.jumlah} {sub.satuan} @ {formatCurrency(sub.estimasiHarga)}</span>
                                     </div>
                                  ))}
                               </div>
                               <p className="text-[10px] font-mono text-indigo-500 mt-2 font-bold uppercase tracking-widest">Ref: {item.id}</p>
                            </td>
                            <td className="px-8 py-6 text-center text-sm font-black">{parsed.length} Item</td>
                            <td className="px-8 py-6 text-right text-xs font-bold text-muted-foreground">---</td>
                            <td className="px-8 py-6 text-right text-sm font-black text-indigo-500">{formatCurrency(item.totalEstimasi)}</td>
                            <td className="px-8 py-6">
                               <Badge className="bg-muted border-border text-foreground text-[9px] font-black uppercase tracking-widest">
                                  {item.kebutuhan}
                               </Badge>
                            </td>
                            <td className="px-8 py-6 text-center">
                               {item.status === 'Realized' ? (
                                  <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[9px] font-black">SUKSES</Badge>
                               ) : (
                                  <Badge className="bg-orange-500/10 text-orange-500 border-orange-500/20 text-[9px] font-black">PENDING</Badge>
                               )}
                            </td>
                            <td className="px-8 py-6 text-right">
                                {item.status === 'Pending' ? (
                                   <div className="flex justify-end items-center gap-2">
                                      <button 
                                        onClick={() => handleOpenRealisasi(item)}
                                        className="p-3 bg-indigo-600/10 hover:bg-indigo-600 text-indigo-500 hover:text-white rounded-xl transition-all shadow-sm"
                                        title="Realisasikan Belanja"
                                      >
                                         <ChevronRight size={18} />
                                      </button>
                                      <button 
                                        onClick={() => handleDeletePurchasing(item)}
                                        className="p-3 bg-rose-500/10 hover:bg-rose-600 text-rose-500 hover:text-white rounded-xl transition-all shadow-sm"
                                        title="Hapus Pengajuan"
                                      >
                                         <Trash2 size={18} />
                                      </button>
                                   </div>
                                ) : (
                                   <div className="flex justify-end items-center gap-2">
                                      <div className="flex items-center gap-1.5 text-emerald-500 font-bold text-xs uppercase tracking-wider mr-2">
                                         <CheckCircle2 size={16} />
                                         <span>Sukses</span>
                                      </div>
                                      <button 
                                        onClick={() => handleOpenRealisasi(item)}
                                        className="p-3 bg-emerald-500/10 hover:bg-emerald-600 text-emerald-500 hover:text-white rounded-xl transition-all shadow-sm"
                                        title="Edit Realisasi"
                                      >
                                         <Edit size={16} />
                                      </button>
                                      <button 
                                        onClick={() => handleResetPurchasing(item)}
                                        className="p-3 bg-amber-500/10 hover:bg-amber-600 text-amber-500 hover:text-white rounded-xl transition-all shadow-sm"
                                        title="Batalkan Realisasi (Kembali ke Pending)"
                                      >
                                         <RotateCcw size={16} />
                                      </button>
                                      <button 
                                        onClick={() => handleDeletePurchasing(item)}
                                        className="p-3 bg-rose-500/10 hover:bg-rose-600 text-rose-500 hover:text-white rounded-xl transition-all shadow-sm"
                                        title="Hapus Pengajuan"
                                      >
                                         <Trash2 size={16} />
                                      </button>
                                   </div>
                                )}
                             </td>
                         </TableRow>
                      );
                   })}
                </TableBody>
             </Table>
          </Card>
        )}

        {activeTab === 'Realisasi' && (
          <Card className="border-border bg-card shadow-xl rounded-[2.5rem] overflow-hidden">
             <div className="p-8 border-b border-border bg-muted/10">
                <h3 className="text-lg font-black text-foreground uppercase tracking-tight">Realisasi Pembelanjaan</h3>
                <p className="text-xs text-muted-foreground font-bold italic tracking-widest uppercase">Pencatatan Biaya Aktual & Operasional Belanja</p>
             </div>
             <Table>
                <TableHeader>
                   <TableRow className="border-border hover:bg-transparent">
                      <TableHead className="px-8 font-black text-[10px] uppercase tracking-widest text-muted-foreground">Tgl Beli</TableHead>
                      <TableHead className="px-8 font-black text-[10px] uppercase tracking-widest text-muted-foreground">Barang</TableHead>
                      <TableHead className="px-8 font-black text-[10px] uppercase tracking-widest text-muted-foreground text-center">Qty</TableHead>
                      <TableHead className="px-8 font-black text-[10px] uppercase tracking-widest text-muted-foreground text-right">Harga</TableHead>
                      <TableHead className="px-8 font-black text-[10px] uppercase tracking-widest text-muted-foreground text-right">Extra Fees</TableHead>
                      <TableHead className="px-8 font-black text-[10px] uppercase tracking-widest text-muted-foreground">Kategori</TableHead>
                      <TableHead className="px-8 font-black text-[10px] uppercase tracking-widest text-muted-foreground text-right">Total Akhir</TableHead>
                      <TableHead className="px-8 font-black text-[10px] uppercase tracking-widest text-muted-foreground">Metode</TableHead>
                   </TableRow>
                </TableHeader>
                <TableBody>
                   {realisasiItems.map((item, i) => {
                      const parsed = parseItems(item);
                      return (
                         <TableRow key={i} className="border-border hover:bg-muted/10 transition-colors">
                         <td className="px-8 py-6 text-xs font-mono font-medium text-muted-foreground">{item.tanggalPembelian}</td>
                         <td className="px-8 py-6">
                            <div className="space-y-1">
                               {parsed.map((sub, idx) => (
                                  <div key={idx} className="flex flex-col mb-2 last:mb-0 border-b border-border/10 pb-1 last:border-none">
                                     <span className="text-sm font-black text-foreground uppercase tracking-tight">{sub.namaBarang}</span>
                                     <span className="text-[10px] text-muted-foreground font-mono">Qty: {sub.jumlah} {sub.satuan} @ {formatCurrency(sub.estimasiHarga)}</span>
                                  </div>
                               ))}
                            </div>
                            <p className="text-[10px] font-mono text-muted-foreground">RAB Ref: {item.id}</p>
                         </td>
                         <td className="px-8 py-6 text-center text-sm font-black">{parsed.length} Item</td>
                         <td className="px-8 py-6 text-right text-xs font-bold text-muted-foreground">---</td>
                         <td className="px-8 py-6 text-right">
                            <div className="flex flex-col gap-0.5">
                               {item.biayaOngkir > 0 && <span className="text-[10px] text-orange-500 font-bold">🚛 {formatCurrency(item.biayaOngkir)}</span>}
                               {item.biayaLayanan > 0 && <span className="text-[10px] text-blue-500 font-bold">⚙️ {formatCurrency(item.biayaLayanan)}</span>}
                               {item.diskon > 0 && <span className="text-[10px] text-emerald-500 font-bold">🏷️ -{formatCurrency(item.diskon)}</span>}
                               {item.biayaOngkir === 0 && item.biayaLayanan === 0 && item.diskon === 0 && <span className="text-[10px] text-muted-foreground">No extra fees</span>}
                            </div>
                         </td>
                         <td className="px-8 py-6">
                             <Badge className={`${item.kategori === 'Fisik' ? 'bg-blue-500/10 text-blue-500' : 'bg-orange-500/10 text-orange-500'} border-transparent text-[9px] font-black uppercase tracking-widest`}>
                                {item.kategori}
                             </Badge>
                          </td>
                          <td className="px-8 py-6 text-right text-lg font-black text-emerald-600 italic">{formatCurrency(item.totalAkhir)}</td>
                         <td className="px-8 py-6">
                            <div className="flex flex-col gap-1">
                               <Badge className="bg-muted border-border text-foreground text-[9px] font-black uppercase tracking-widest w-fit">
                                  {item.metodePembelian}
                               </Badge>
                               <span className="text-[10px] text-muted-foreground font-medium italic">{item.sumberDana}</span>
                            </div>
                         </td>
                      </TableRow>
                    ); })}
                </TableBody>
             </Table>
          </Card>
        )}

        {activeTab === 'Laporan' && (
          <div className="space-y-8 animate-in fade-in duration-500">
             {/* Stats Summary */}
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="p-8 border-border bg-emerald-500/5 flex flex-col gap-4 rounded-[2.5rem] relative overflow-hidden group">
                   <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                      <TrendingUp size={80} />
                   </div>
                   <p className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.3em]">Total Pemasukan Dana (Edit Inline)</p>
                   <div className="flex items-center gap-1">
                      <span className="text-sm font-black text-foreground opacity-50">Rp</span>
                      <input
                        type="text"
                        className="bg-transparent text-3xl font-black text-foreground focus:outline-none focus:ring-1 focus:ring-emerald-500/20 rounded-xl px-2 py-0.5 w-full"
                        value={pemasukanDana === 0 ? '' : pemasukanDana.toLocaleString('id-ID')}
                        onChange={e => {
                           const val = e.target.value.replace(/\D/g, '');
                           setPemasukanDana(val ? parseInt(val, 10) : 0);
                        }}
                      />
                   </div>
                   <div className="flex items-center gap-2 text-[10px] font-black text-emerald-600 uppercase">
                      <CheckCircle2 size={14} /> Sinkron Dana RAB
                   </div>
                </Card>

                <Card className="p-8 border-border bg-rose-500/5 flex flex-col gap-4 rounded-[2.5rem] relative overflow-hidden group">
                   <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                      <ArrowUpRight size={80} />
                   </div>
                   <p className="text-[10px] font-black text-rose-600 uppercase tracking-[0.3em]">Total Pengeluaran RAB</p>
                   <h2 className="text-4xl font-black text-foreground">{formatCurrency(realisasiItems.reduce((acc, i) => acc + i.totalAkhir, 0))}</h2>
                   <div className="flex items-center gap-2 text-[10px] font-black text-rose-600 uppercase">
                      <Calculator size={14} /> Berdasarkan Realisasi
                   </div>
                </Card>

                <Card className="p-8 border-border bg-indigo-500/5 flex flex-col gap-4 rounded-[2.5rem] relative overflow-hidden group">
                   <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                      <DollarSign size={80} />
                   </div>
                   <p className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.3em]">Sisa Dana RAB</p>
                   <h2 className="text-4xl font-black text-foreground">{formatCurrency(pemasukanDana - realisasiItems.reduce((acc, i) => acc + i.totalAkhir, 0))}</h2>
                   <div className="flex items-center gap-2 text-[10px] font-black text-indigo-600 uppercase">
                      <AlertCircle size={14} /> Saldo Tersedia
                   </div>
                </Card>
             </div>

             <Card className="border-border bg-card shadow-xl rounded-[2.5rem] overflow-hidden">
                <div className="p-8 border-b border-border bg-muted/10">
                   <h3 className="text-lg font-black text-foreground uppercase tracking-tight">Ikhtisar Periode</h3>
                   <p className="text-xs text-muted-foreground font-bold italic tracking-widest uppercase">Rekapitulasi Budget vs Realisasi Bulanan</p>
                </div>
                <Table>
                   <TableHeader>
                      <TableRow className="border-border hover:bg-transparent">
                         <TableHead className="px-8 font-black text-[10px] uppercase tracking-widest text-muted-foreground">Periode</TableHead>
                         <TableHead className="px-8 font-black text-[10px] uppercase tracking-widest text-muted-foreground text-right border-x border-border/10">Pemasukan Dana</TableHead>
                         <TableHead className="px-8 font-black text-[10px] uppercase tracking-widest text-muted-foreground text-right">Pengeluaran Fisik</TableHead>
                         <TableHead className="px-8 font-black text-[10px] uppercase tracking-widest text-muted-foreground text-right">Pengeluaran Non-Fisik</TableHead>
                         <TableHead className="px-8 font-black text-[10px] uppercase tracking-widest text-muted-foreground text-right">TOTAL PENGELUARAN</TableHead>
                         <TableHead className="px-8 font-black text-[10px] uppercase tracking-widest text-muted-foreground text-right border-l border-border/10">SISA DANA</TableHead>
                      </TableRow>
                   </TableHeader>
                   <TableBody>
                      <TableRow className="border-border hover:bg-muted/10 font-black">
                         <td className="px-8 py-8 text-sm uppercase tracking-wider">Januari 2026</td>
                         <td className="px-8 py-8 text-right text-indigo-500 border-x border-border/10">{formatCurrency(pemasukanDana)}</td>
                         <td className="px-8 py-8 text-right text-muted-foreground">
                           {formatCurrency(realisasiItems.filter(i => i.kategori === 'Fisik').reduce((acc, i) => acc + i.totalAkhir, 0))}
                         </td>
                         <td className="px-8 py-8 text-right text-orange-500">
                           {formatCurrency(realisasiItems.filter(i => i.kategori === 'Non-Fisik').reduce((acc, i) => acc + i.totalAkhir, 0))}
                         </td>
                         <td className="px-8 py-8 text-right text-rose-500">{formatCurrency(realisasiItems.reduce((acc, i) => acc + i.totalAkhir, 0))}</td>
                         <td className="px-8 py-8 text-right text-emerald-500 border-l border-border/10">
                           {formatCurrency(pemasukanDana - realisasiItems.reduce((acc, i) => acc + i.totalAkhir, 0))}
                         </td>
                      </TableRow>
                      {[2,3,4,5,6].map(m => (
                        <TableRow key={m} className="border-border hover:bg-muted/10 opacity-30 italic">
                           <td className="px-8 py-6 text-xs text-muted-foreground uppercase">{m === 2 ? 'Februari' : m === 3 ? 'Maret' : m === 4 ? 'April' : m === 5 ? 'Mei' : 'Juni'} 2026</td>
                           <td className="px-8 py-6 text-right border-x border-border/10">---</td>
                           <td className="px-8 py-6 text-right">---</td>
                           <td className="px-8 py-6 text-right">---</td>
                           <td className="px-8 py-6 text-right">---</td>
                           <td className="px-8 py-6 text-right border-l border-border/10">---</td>
                        </TableRow>
                      ))}
                   </TableBody>
                </Table>
             </Card>
          </div>
        )}
      </div>

      {/* MODAL: INPUT PENGAJUAN RAB */}
      {isRABModalOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-300 overflow-y-auto">
           <Card className="w-full max-w-lg bg-card border-slate-800 shadow-2xl rounded-[3rem] my-8">
              <div className="p-10 border-b border-border bg-muted/20 flex justify-between items-center">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 border border-indigo-500/20">
                       <FileText size={24} />
                    </div>
                    <div>
                       <h2 className="text-2xl font-black text-foreground leading-none uppercase italic">Form Pengajuan RAB</h2>
                       <p className="text-xs font-bold text-muted-foreground tracking-widest uppercase mt-1">Audit Perencanaan Belanja</p>
                    </div>
                 </div>
                 <button onClick={() => setIsRABModalOpen(false)} className="p-3 hover:bg-muted rounded-2xl transition-all">
                    <X size={24} />
                 </button>
              </div>

              <form onSubmit={handleSaveRAB} className="p-10 space-y-8">
                  <div className="grid grid-cols-3 gap-6">
                     <div className="space-y-3 col-span-1">
                        <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-1">Tanggal Pengajuan</label>
                        <Input 
                          type="text"
                          placeholder="DD/MM/YYYY" 
                          className="h-12 border-border bg-muted/20 font-bold rounded-xl"
                          value={newRAB.tanggalPengajuan}
                          onChange={e => setNewRAB({...newRAB, tanggalPengajuan: e.target.value})}
                          required
                        />
                     </div>
                     <div className="space-y-3 col-span-1">
                        <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-1">Kategori</label>
                        <select 
                          className="h-12 w-full border border-border bg-muted/20 font-bold rounded-xl px-4 outline-none focus:ring-2 focus:ring-indigo-500"
                          value={newRAB.kategori}
                          onChange={e => setNewRAB({...newRAB, kategori: e.target.value as any})}
                        >
                           <option value="Fisik" className="bg-card">Fisik (Barang)</option>
                           <option value="Non-Fisik" className="bg-card">Non-Fisik (Bensin/Parkir/etc)</option>
                        </select>
                     </div>
                     <div className="space-y-3 col-span-1">
                        <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-1">Peruntukan</label>
                        <select 
                          className="h-12 w-full border border-border bg-muted/20 font-bold rounded-xl px-4 outline-none focus:ring-2 focus:ring-indigo-500"
                          value={newRAB.kebutuhan}
                          onChange={e => setNewRAB({...newRAB, kebutuhan: e.target.value})}
                        >
                           <option className="bg-card">teknisi</option>
                           <option className="bg-card">pengajar</option>
                           <option className="bg-card">kurikulum</option>
                           <option className="bg-card">operasional</option>
                        </select>
                     </div>
                  </div>

                  <div className="space-y-4">
                     <div className="flex justify-between items-center px-1">
                        <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Daftar Barang Belanja ({itemsList.length})</label>
                        <button
                          type="button"
                          onClick={() => setItemsList([...itemsList, { namaBarang: '', jumlah: 1, satuan: 'pcs', estimasiHarga: 0 }])}
                          className="px-4 py-2 border border-indigo-500/20 bg-indigo-500/5 hover:bg-indigo-500/10 text-indigo-500 rounded-xl font-black text-[9px] uppercase tracking-widest transition-all"
                        >
                           + Tambah Barang
                        </button>
                     </div>

                     <div className="space-y-4 max-h-[35vh] overflow-y-auto pr-2 custom-scrollbar">
                        {itemsList.map((item, index) => (
                           <div key={index} className="p-6 rounded-[1.5rem] border border-border/80 bg-muted/5 space-y-4 relative group">
                              {itemsList.length > 1 && (
                                 <button
                                   type="button"
                                   onClick={() => setItemsList(itemsList.filter((_, i) => i !== index))}
                                   className="absolute top-4 right-4 text-rose-500 hover:text-rose-400 p-1 bg-rose-500/10 hover:bg-rose-500/20 rounded-lg transition-all"
                                 >
                                    <X size={14} />
                                 </button>
                              )}
                              <div className="space-y-2">
                                 <label className="text-[9px] font-black text-muted-foreground uppercase tracking-widest px-1">Nama Barang #{index + 1}</label>
                                 <Input 
                                   placeholder="e.g. Solder Deko 60W" 
                                   className="h-11 border-border bg-muted/20 text-sm font-black uppercase rounded-lg italic"
                                   value={item.namaBarang}
                                   onChange={e => {
                                      const newList = [...itemsList];
                                      newList[index].namaBarang = e.target.value;
                                      setItemsList(newList);
                                   }}
                                   required
                                 />
                              </div>
                              <div className="grid grid-cols-3 gap-4">
                                 <div className="space-y-1.5">
                                    <label className="text-[9px] font-black text-muted-foreground uppercase tracking-widest px-1">Jumlah</label>
                                    <Input 
                                      type="number" 
                                      className="h-10 border-border bg-muted/20 font-black text-center rounded-lg"
                                      value={item.jumlah}
                                      onChange={e => {
                                         const newList = [...itemsList];
                                         newList[index].jumlah = parseInt(e.target.value) || 1;
                                         setItemsList(newList);
                                      }}
                                    />
                                 </div>
                                 <div className="space-y-1.5">
                                    <label className="text-[9px] font-black text-muted-foreground uppercase tracking-widest px-1">Satuan</label>
                                    <Input 
                                      placeholder="pcs" 
                                      className="h-10 border-border bg-muted/20 font-bold rounded-lg text-center"
                                      value={item.satuan}
                                      onChange={e => {
                                         const newList = [...itemsList];
                                         newList[index].satuan = e.target.value;
                                         setItemsList(newList);
                                      }}
                                    />
                                 </div>
                                 <div className="space-y-1.5">
                                    <label className="text-[9px] font-black text-muted-foreground uppercase tracking-widest px-1">Harga Est.</label>
                                    <Input 
                                      type="number" 
                                      className="h-10 border-border bg-muted/20 font-black rounded-lg text-right pr-2"
                                      value={item.estimasiHarga}
                                      onChange={e => {
                                         const newList = [...itemsList];
                                         newList[index].estimasiHarga = parseInt(e.target.value) || 0;
                                         setItemsList(newList);
                                      }}
                                    />
                                 </div>
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>

                  <div className="p-6 rounded-[2rem] bg-indigo-500/5 border border-indigo-500/10 text-center">
                     <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-2">Total Estimasi Anggaran</p>
                     <p className="text-3xl font-black text-foreground italic">{formatCurrency(itemsList.reduce((sum, item) => sum + (item.jumlah * item.estimasiHarga), 0))}</p>
                  </div>

                 <div className="flex gap-4 pt-4">
                    <button 
                      type="button" 
                      onClick={() => setIsRABModalOpen(false)}
                      className="flex-1 bg-transparent hover:bg-muted text-muted-foreground font-black uppercase text-[10px] tracking-widest h-16 rounded-2xl"
                    >
                       Batal
                    </button>
                    <button 
                      type="submit"
                      className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase text-[10px] tracking-widest h-16 rounded-2xl shadow-xl shadow-indigo-500/20 active:scale-95 transition-all"
                    >
                       Simpan Pengajuan
                    </button>
                 </div>
              </form>
           </Card>
        </div>
      )}

      {/* MODAL: REALISASI PEMBELANJAAN */}
      {isRealisasiModalOpen && selectedRAB && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-300 overflow-y-auto">
           <Card className="w-full max-w-2xl bg-card border-slate-800 shadow-2xl rounded-[3rem] my-8">
              <div className="p-10 border-b border-border bg-muted/20 flex justify-between items-center">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 border border-emerald-500/20">
                       <ShoppingCart size={24} />
                    </div>
                    <div>
                       <h2 className="text-2xl font-black text-foreground leading-none uppercase italic">Realisasi Belanja</h2>
                       <p className="text-xs font-bold text-muted-foreground tracking-widest uppercase mt-1">Audit Pengeluaran Aktual: {selectedRAB.namaBarang}</p>
                    </div>
                 </div>
                 <button onClick={() => setIsRealisasiModalOpen(false)} className="p-3 hover:bg-muted rounded-2xl transition-all">
                    <X size={24} />
                 </button>
              </div>

              <form onSubmit={handleSaveRealisasi} className="p-10 space-y-8">
                 <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-3">
                       <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-1">Tanggal Pembelian</label>
                       <Input 
                         type="text"
                         placeholder="DD/MM/YYYY" 
                         className="h-12 border-border bg-muted/20 font-bold rounded-xl"
                         value={newReal.tanggalPembelian}
                         onChange={e => setNewReal({...newReal, tanggalPembelian: e.target.value})}
                         required
                       />
                    </div>
                    <div className="space-y-3">
                       <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-1">Tujuan Pembelian</label>
                       <Input 
                         placeholder="Contoh: teknisi" 
                         className="h-12 border-border bg-muted/20 font-bold rounded-xl"
                         value={newReal.tujuanPembelian}
                         onChange={e => setNewReal({...newReal, tujuanPembelian: e.target.value})}
                       />
                    </div>
                 </div>

                  <div className="space-y-4">
                     <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-1">Daftar Barang Realisasi ({realItemsList.length})</label>
                     <div className="space-y-4 max-h-[35vh] overflow-y-auto pr-2 custom-scrollbar">
                        {realItemsList.map((item, index) => (
                           <div key={index} className="p-6 rounded-[1.5rem] border border-border/80 bg-muted/5 space-y-4 relative group">
                              <div className="space-y-2">
                                 <label className="text-[9px] font-black text-muted-foreground uppercase tracking-widest px-1">Nama Barang #{index + 1}</label>
                                 <Input 
                                   placeholder="Nama barang..." 
                                   className="h-11 border-border bg-muted/20 text-sm font-black uppercase rounded-lg italic"
                                   value={item.namaBarang}
                                   onChange={e => {
                                      const newList = [...realItemsList];
                                      newList[index].namaBarang = e.target.value;
                                      setRealItemsList(newList);
                                   }}
                                   required
                                 />
                              </div>
                              <div className="grid grid-cols-3 gap-4">
                                 <div className="space-y-1.5">
                                    <label className="text-[9px] font-black text-muted-foreground uppercase tracking-widest px-1">Qty Aktual</label>
                                    <Input 
                                      type="number" 
                                      className="h-10 border-border bg-muted/20 font-black text-center rounded-lg"
                                      value={item.jumlah}
                                      onChange={e => {
                                         const newList = [...realItemsList];
                                         newList[index].jumlah = parseInt(e.target.value) || 1;
                                         setRealItemsList(newList);
                                      }}
                                    />
                                 </div>
                                 <div className="space-y-1.5">
                                    <label className="text-[9px] font-black text-muted-foreground uppercase tracking-widest px-1">Satuan</label>
                                    <Input 
                                      placeholder="pcs" 
                                      className="h-10 border-border bg-muted/20 font-bold rounded-lg text-center"
                                      value={item.satuan}
                                      onChange={e => {
                                         const newList = [...realItemsList];
                                         newList[index].satuan = e.target.value;
                                         setRealItemsList(newList);
                                      }}
                                    />
                                 </div>
                                 <div className="space-y-1.5">
                                    <label className="text-[9px] font-black text-muted-foreground uppercase tracking-widest px-1">Harga Satuan</label>
                                    <Input 
                                      type="number" 
                                      className="h-10 border-border bg-muted/20 font-black rounded-lg text-right pr-2"
                                      value={item.estimasiHarga}
                                      onChange={e => {
                                         const newList = [...realItemsList];
                                         newList[index].estimasiHarga = parseInt(e.target.value) || 0;
                                         setRealItemsList(newList);
                                      }}
                                    />
                                 </div>
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>

                 <div className="grid grid-cols-3 gap-6">
                    <div className="space-y-3">
                       <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-1 flex items-center gap-2">
                          <Percent size={12} className="text-emerald-500" /> Diskon
                       </label>
                       <Input 
                         type="number" 
                         className="h-12 border-border bg-muted/20 font-bold rounded-xl text-emerald-500"
                         value={newReal.diskon}
                         onChange={e => setNewReal({...newReal, diskon: parseInt(e.target.value) || 0})}
                       />
                    </div>
                    <div className="space-y-3">
                       <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-1 flex items-center gap-2">
                          <Truck size={12} className="text-orange-500" /> Ongkir
                       </label>
                       <Input 
                         type="number" 
                         className="h-12 border-border bg-muted/20 font-bold rounded-xl text-orange-500"
                         value={newReal.biayaOngkir}
                         onChange={e => setNewReal({...newReal, biayaOngkir: parseInt(e.target.value) || 0})}
                       />
                    </div>
                    <div className="space-y-3">
                       <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-1 flex items-center gap-2">
                          <CreditCard size={12} className="text-blue-500" /> Layanan
                       </label>
                       <Input 
                         type="number" 
                         className="h-12 border-border bg-muted/20 font-bold rounded-xl text-blue-500"
                         value={newReal.biayaLayanan}
                         onChange={e => setNewReal({...newReal, biayaLayanan: parseInt(e.target.value) || 0})}
                       />
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-3">
                       <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-1">Metode Pembelian</label>
                       <select 
                         className="h-12 w-full border border-border bg-muted/20 font-bold rounded-xl px-4 outline-none focus:ring-2 focus:ring-emerald-500"
                         value={newReal.metodePembelian}
                         onChange={e => setNewReal({...newReal, metodePembelian: e.target.value as any})}
                       >
                          <option value="offline" className="bg-card">offline (Toko langsung)</option>
                          <option value="online" className="bg-card">online (Marketplace)</option>
                       </select>
                    </div>
                    <div className="space-y-3">
                       <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-1">Sumber Dana / Keterangan</label>
                       <Input 
                         placeholder="Dana RAB" 
                         className="h-12 border-border bg-muted/20 font-bold rounded-xl"
                         value={newReal.sumberDana}
                         onChange={e => setNewReal({...newReal, sumberDana: e.target.value})}
                       />
                    </div>
                 </div>

                  <div className="p-8 rounded-[2.5rem] bg-emerald-500/5 border border-emerald-500/10 flex flex-col items-center gap-2">
                     <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em]">Total Akhir Realisasi</p>
                     <p className="text-4xl font-black text-foreground italic">
                        {formatCurrency(getRealisasiTotal())}
                     </p>
                     <div className="mt-2 flex items-center gap-3">
                         <div className="text-[9px] font-bold text-muted-foreground flex items-center gap-1">
                            <Calculator size={10} /> Subtotal: {formatCurrency(getRealisasiSubtotal())}
                         </div>
                         <div className="text-[9px] font-bold text-muted-foreground/30">|</div>
                         <div className="text-[9px] font-bold text-rose-400 flex items-center gap-1">
                            <TrendingUp size={10} /> Fees: {formatCurrency((newReal.biayaLayanan || 0) + (newReal.biayaOngkir || 0))}
                         </div>
                     </div>
                  </div>

                 <div className="flex gap-4 pt-4">
                    <button 
                      type="button" 
                      onClick={() => setIsRealisasiModalOpen(false)}
                      className="flex-1 bg-transparent hover:bg-muted text-muted-foreground font-black uppercase text-[10px] tracking-widest h-16 rounded-2xl"
                    >
                       Batal
                    </button>
                    <button 
                      type="submit"
                      className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase text-[10px] tracking-widest h-16 rounded-2xl shadow-xl shadow-emerald-500/20 active:scale-95 transition-all"
                    >
                       Konfirmasi & Lunas
                    </button>
                 </div>
              </form>
           </Card>
        </div>
      )}
    </div>
  );
}
