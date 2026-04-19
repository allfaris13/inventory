import { useState } from 'react';
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
  CreditCard,
  Truck,
  ShoppingCart,
  Percent
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

const MOCK_RAB: RABItem[] = [
  { id: 'RAB-001', tanggalPengajuan: '05/01/2026', namaBarang: 'solder deko 60W', jumlah: 4, satuan: 'pcs', estimasiHarga: 80000, totalEstimasi: 320000, kebutuhan: 'teknisi', status: 'Pending' },
  { id: 'RAB-002', tanggalPengajuan: '05/01/2026', namaBarang: 'tang cucut', jumlah: 2, satuan: 'pcs', estimasiHarga: 20000, totalEstimasi: 40000, kebutuhan: 'teknisi', status: 'Realized' },
  { id: 'RAB-003', tanggalPengajuan: '05/01/2026', namaBarang: 'timah roll kecil', jumlah: 10, satuan: 'pcs', estimasiHarga: 25000, totalEstimasi: 250000, kebutuhan: 'teknisi', status: 'Realized' },
];

const MOCK_REALISASI: RealisasiItem[] = [
  { 
    id: 'RAB-M-001', 
    tanggalPengajuan: '05/01/2026', 
    namaBarang: 'tang cucut', 
    jumlah: 2, 
    satuan: 'pcs', 
    estimasiHarga: 20000, 
    totalEstimasi: 40000, 
    kebutuhan: 'teknisi', 
    status: 'Realized',
    tanggalPembelian: '05/01/2026',
    hargaSatuan: 20000,
    subTotal: 40000,
    biayaLayanan: 0,
    biayaOngkir: 0,
    diskon: 0,
    totalAkhir: 40000,
    tujuanPembelian: 'teknisi',
    metodePembelian: 'offline',
    sumberDana: 'Dana RAB'
  },
  { 
    id: 'RAB-M-002', 
    tanggalPengajuan: '05/01/2026', 
    namaBarang: 'timah roll kecil', 
    jumlah: 10, 
    satuan: 'pcs', 
    estimasiHarga: 25000, 
    totalEstimasi: 250000, 
    kebutuhan: 'teknisi', 
    status: 'Realized',
    tanggalPembelian: '05/01/2026',
    hargaSatuan: 25000,
    subTotal: 250000,
    biayaLayanan: 0,
    biayaOngkir: 0,
    diskon: 0,
    totalAkhir: 250000,
    tujuanPembelian: 'teknisi',
    metodePembelian: 'offline',
    sumberDana: 'Dana RAB'
  },
  { 
    id: 'RAB-P-001', 
    tanggalPengajuan: '05/01/2026', 
    namaBarang: 'lem g', 
    jumlah: 1, 
    satuan: 'box', 
    estimasiHarga: 125999, 
    totalEstimasi: 125999, 
    kebutuhan: 'pengajar', 
    status: 'Realized',
    tanggalPembelian: '06/01/2026',
    hargaSatuan: 125999,
    subTotal: 125999,
    biayaLayanan: 801,
    biayaOngkir: 0,
    diskon: 15121,
    totalAkhir: 111679,
    tujuanPembelian: 'pengajar',
    metodePembelian: 'online',
    sumberDana: 'Dana RAB'
  },
  { 
    id: 'RAB-P-002', 
    tanggalPengajuan: '05/01/2026', 
    namaBarang: 'spidul snowman permanent', 
    jumlah: 1, 
    satuan: 'box', 
    estimasiHarga: 70200, 
    totalEstimasi: 70200, 
    kebutuhan: 'pengajar', 
    status: 'Realized',
    tanggalPembelian: '06/01/2026',
    hargaSatuan: 70200,
    subTotal: 70200,
    biayaLayanan: 345,
    biayaOngkir: 0,
    diskon: 6527,
    totalAkhir: 64018,
    tujuanPembelian: 'pengajar',
    metodePembelian: 'online',
    sumberDana: 'Dana RAB'
  },
  { 
    id: 'RAB-P-003', 
    tanggalPengajuan: '05/01/2026', 
    namaBarang: 'spidul Boardmarker', 
    jumlah: 1, 
    satuan: 'box', 
    estimasiHarga: 79900, 
    totalEstimasi: 79900, 
    kebutuhan: 'pengajar', 
    status: 'Realized',
    tanggalPembelian: '06/01/2026',
    hargaSatuan: 79900,
    subTotal: 79900,
    biayaLayanan: 508,
    biayaOngkir: 0,
    diskon: 9587,
    totalAkhir: 70821,
    tujuanPembelian: 'pengajar',
    metodePembelian: 'online',
    sumberDana: 'Dana RAB'
  },
  { 
    id: 'RAB-K-001', 
    tanggalPengajuan: '08/01/2026', 
    namaBarang: 'flashcard', 
    jumlah: 1, 
    satuan: 'pack', 
    estimasiHarga: 63900, 
    totalEstimasi: 63900, 
    kebutuhan: 'kurikulum', 
    status: 'Realized',
    tanggalPembelian: '10/01/2026',
    hargaSatuan: 63900,
    subTotal: 63900,
    biayaLayanan: 0,
    biayaOngkir: 0,
    diskon: 0,
    totalAkhir: 63900,
    tujuanPembelian: 'kurikulum',
    metodePembelian: 'offline',
    sumberDana: 'Dana RAB'
  }
];

export function Purchasing() {
  const [activeTab, setActiveTab] = useState<'RAB' | 'Realisasi' | 'Laporan'>('RAB');
  const [rabItems, setRabItems] = useState<RABItem[]>(MOCK_RAB);
  const [realisasiItems, setRealisasiItems] = useState<RealisasiItem[]>(MOCK_REALISASI);
  const [isRABModalOpen, setIsRABModalOpen] = useState(false);
  const [isRealisasiModalOpen, setIsRealisasiModalOpen] = useState(false);
  const [selectedRAB, setSelectedRAB] = useState<RABItem | null>(null);

  // Form States for RAB
  const [newRAB, setNewRAB] = useState<Omit<RABItem, 'id' | 'status' | 'totalEstimasi'>>({
    tanggalPengajuan: new Date().toLocaleDateString('id-ID'),
    namaBarang: '',
    jumlah: 1,
    satuan: 'pcs',
    estimasiHarga: 0,
    kebutuhan: 'teknisi'
  });

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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleSaveRAB = (e: React.FormEvent) => {
    e.preventDefault();
    const item: RABItem = {
      ...newRAB,
      id: `RAB-${String(rabItems.length + 1).padStart(3, '0')}`,
      totalEstimasi: newRAB.jumlah * newRAB.estimasiHarga,
      status: 'Pending'
    };
    setRabItems([item, ...rabItems]);
    setIsRABModalOpen(false);
  };

  const handleOpenRealisasi = (item: RABItem) => {
    setSelectedRAB(item);
    setNewReal({
      ...newReal,
      namaBarang: item.namaBarang,
      jumlah: item.jumlah,
      satuan: item.satuan,
      hargaSatuan: item.estimasiHarga,
      tujuanPembelian: item.kebutuhan,
      subTotal: item.jumlah * item.estimasiHarga
    });
    setIsRealisasiModalOpen(true);
  };

  const handleSaveRealisasi = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRAB) return;

    const subTotal = (newReal.jumlah || 1) * (newReal.hargaSatuan || 0);
    const totalAkhir = subTotal + (newReal.biayaLayanan || 0) + (newReal.biayaOngkir || 0) - (newReal.diskon || 0);

    const item: RealisasiItem = {
      ...selectedRAB,
      ...newReal,
      subTotal,
      totalAkhir,
      status: 'Realized'
    } as RealisasiItem;

    setRealisasiItems([item, ...realisasiItems]);
    setRabItems(rabItems.map(r => r.id === selectedRAB.id ? { ...r, status: 'Realized' } : r));
    setIsRealisasiModalOpen(false);
    setActiveTab('Realisasi');
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
                   {rabItems.map((item) => (
                      <TableRow key={item.id} className="border-border hover:bg-muted/10 transition-colors group">
                         <td className="px-8 py-6 text-xs font-mono font-medium text-muted-foreground">{item.tanggalPengajuan}</td>
                         <td className="px-8 py-6">
                            <p className="text-sm font-black text-foreground uppercase tracking-tight">{item.namaBarang}</p>
                            <p className="text-[10px] font-mono text-muted-foreground">{item.id}</p>
                         </td>
                         <td className="px-8 py-6 text-center text-sm font-black">{item.jumlah} {item.satuan}</td>
                         <td className="px-8 py-6 text-right text-xs font-bold text-muted-foreground">{formatCurrency(item.estimasiHarga)}</td>
                         <td className="px-8 py-6 text-right text-sm font-black text-indigo-500">{formatCurrency(item.totalEstimasi)}</td>
                         <td className="px-8 py-6">
                            <Badge className="bg-muted border-border text-foreground text-[9px] font-black uppercase tracking-widest">
                               {item.kebutuhan}
                            </Badge>
                         </td>
                         <td className="px-8 py-6 text-center">
                            {item.status === 'Realized' ? (
                               <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[9px] font-black">REALIZED</Badge>
                            ) : (
                               <Badge className="bg-orange-500/10 text-orange-500 border-orange-500/20 text-[9px] font-black">PENDING</Badge>
                            )}
                         </td>
                         <td className="px-8 py-6 text-right">
                            {item.status === 'Pending' && (
                               <button 
                                 onClick={() => handleOpenRealisasi(item)}
                                 className="p-3 bg-indigo-600/10 hover:bg-indigo-600 text-indigo-500 hover:text-white rounded-xl transition-all shadow-sm"
                               >
                                  <ChevronRight size={18} />
                               </button>
                            )}
                         </td>
                      </TableRow>
                   ))}
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
                      <TableHead className="px-8 font-black text-[10px] uppercase tracking-widest text-muted-foreground text-right">Total Akhir</TableHead>
                      <TableHead className="px-8 font-black text-[10px] uppercase tracking-widest text-muted-foreground">Metode</TableHead>
                   </TableRow>
                </TableHeader>
                <TableBody>
                   {realisasiItems.map((item, i) => (
                      <TableRow key={i} className="border-border hover:bg-muted/10 transition-colors">
                         <td className="px-8 py-6 text-xs font-mono font-medium text-muted-foreground">{item.tanggalPembelian}</td>
                         <td className="px-8 py-6">
                            <p className="text-sm font-black text-foreground uppercase tracking-tight">{item.namaBarang}</p>
                            <p className="text-[10px] font-mono text-muted-foreground">RAB Ref: {item.id}</p>
                         </td>
                         <td className="px-8 py-6 text-center text-sm font-black">{item.jumlah} {item.satuan}</td>
                         <td className="px-8 py-6 text-right text-xs font-bold text-muted-foreground">{formatCurrency(item.hargaSatuan)}</td>
                         <td className="px-8 py-6 text-right">
                            <div className="flex flex-col gap-0.5">
                               {item.biayaOngkir > 0 && <span className="text-[10px] text-orange-500 font-bold">🚛 {formatCurrency(item.biayaOngkir)}</span>}
                               {item.biayaLayanan > 0 && <span className="text-[10px] text-blue-500 font-bold">⚙️ {formatCurrency(item.biayaLayanan)}</span>}
                               {item.diskon > 0 && <span className="text-[10px] text-emerald-500 font-bold">🏷️ -{formatCurrency(item.diskon)}</span>}
                               {item.biayaOngkir === 0 && item.biayaLayanan === 0 && item.diskon === 0 && <span className="text-[10px] text-muted-foreground">No extra fees</span>}
                            </div>
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
                   ))}
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
                   <p className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.3em]">Total Pemasukan Dana</p>
                   <h2 className="text-4xl font-black text-foreground">{formatCurrency(16855990)}</h2>
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
                   <h2 className="text-4xl font-black text-foreground">{formatCurrency(16855990 - realisasiItems.reduce((acc, i) => acc + i.totalAkhir, 0))}</h2>
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
                         <TableHead className="px-8 font-black text-[10px] uppercase tracking-widest text-muted-foreground text-right">Pengeluaran RAB (Fisik)</TableHead>
                         <TableHead className="px-8 font-black text-[10px] uppercase tracking-widest text-muted-foreground text-right">TOTAL PENGELUARAN</TableHead>
                         <TableHead className="px-8 font-black text-[10px] uppercase tracking-widest text-muted-foreground text-right border-l border-border/10">SISA DANA</TableHead>
                      </TableRow>
                   </TableHeader>
                   <TableBody>
                      <TableRow className="border-border hover:bg-muted/10 font-black">
                         <td className="px-8 py-8 text-sm uppercase tracking-wider">Januari 2026</td>
                         <td className="px-8 py-8 text-right text-indigo-500 border-x border-border/10">{formatCurrency(16855990)}</td>
                         <td className="px-8 py-8 text-right text-muted-foreground">{formatCurrency(14961273)}</td>
                         <td className="px-8 py-8 text-right text-rose-500">{formatCurrency(15026773)}</td>
                         <td className="px-8 py-8 text-right text-emerald-500 border-l border-border/10">{formatCurrency(1829216)}</td>
                      </TableRow>
                      {[2,3,4,5,6].map(m => (
                        <TableRow key={m} className="border-border hover:bg-muted/10 opacity-30 italic">
                           <td className="px-8 py-6 text-xs text-muted-foreground uppercase">{m === 2 ? 'Februari' : m === 3 ? 'Maret' : m === 4 ? 'April' : m === 5 ? 'Mei' : 'Juni'} 2026</td>
                           <td className="px-8 py-6 text-right border-x border-border/10">---</td>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-300">
           <Card className="w-full max-w-lg bg-card border-slate-800 shadow-2xl rounded-[3rem] overflow-hidden flex flex-col">
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
                 <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-3">
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
                    <div className="space-y-3">
                       <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-1">Peruntukan / Kebutuhan</label>
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

                 <div className="space-y-3">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-1">Nama Barang</label>
                    <Input 
                      placeholder="e.g. Solder Deko 60W" 
                      className="h-14 border-border bg-muted/20 text-lg font-black uppercase rounded-2xl italic"
                      value={newRAB.namaBarang}
                      onChange={e => setNewRAB({...newRAB, namaBarang: e.target.value})}
                      required
                    />
                 </div>

                 <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-3">
                       <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-1">Jumlah & Satuan</label>
                       <div className="flex gap-2">
                          <Input 
                            type="number" 
                            className="h-12 border-border bg-muted/20 font-black text-center rounded-xl flex-1 shadow-inner"
                            value={newRAB.jumlah}
                            onChange={e => setNewRAB({...newRAB, jumlah: parseInt(e.target.value) || 1})}
                          />
                          <Input 
                            placeholder="pcs" 
                            className="h-12 border-border bg-muted/20 font-bold rounded-xl w-24 text-center"
                            value={newRAB.satuan}
                            onChange={e => setNewRAB({...newRAB, satuan: e.target.value})}
                          />
                       </div>
                    </div>
                    <div className="space-y-3">
                       <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-1">Estimasi Harga Satuan</label>
                       <Input 
                         type="number" 
                         className="h-12 border-border bg-muted/20 font-black rounded-xl shadow-inner pr-8"
                         value={newRAB.estimasiHarga}
                         onChange={e => setNewRAB({...newRAB, estimasiHarga: parseInt(e.target.value) || 0})}
                       />
                    </div>
                 </div>

                 <div className="p-6 rounded-[2rem] bg-indigo-500/5 border border-indigo-500/10 text-center">
                    <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-2">Total Estimasi Anggaran</p>
                    <p className="text-3xl font-black text-foreground italic">{formatCurrency(newRAB.jumlah * newRAB.estimasiHarga)}</p>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-300">
           <Card className="w-full max-w-2xl bg-card border-slate-800 shadow-2xl rounded-[3rem] overflow-hidden flex flex-col max-h-[90vh]">
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

              <form onSubmit={handleSaveRealisasi} className="flex-1 overflow-y-auto p-10 space-y-8 custom-scrollbar">
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

                 <div className="space-y-3">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-1">Nama Barang</label>
                    <Input 
                      placeholder="Nama barang..." 
                      className="h-14 border-border bg-muted/20 text-lg font-black uppercase rounded-2xl italic"
                      value={newReal.namaBarang}
                      onChange={e => setNewReal({...newReal, namaBarang: e.target.value})}
                      required
                    />
                 </div>

                 <div className="grid grid-cols-3 gap-8">
                    <div className="space-y-3">
                       <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-1">Harga Satuan Aktual</label>
                       <Input 
                         type="number" 
                         className="h-14 border-border bg-muted/20 text-lg font-black rounded-2xl shadow-inner focus:ring-2 focus:ring-emerald-500"
                         value={newReal.hargaSatuan}
                         onChange={e => setNewReal({...newReal, hargaSatuan: parseInt(e.target.value) || 0})}
                         required
                       />
                    </div>
                    <div className="space-y-3">
                       <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-1">Jumlah</label>
                       <Input 
                         type="number" 
                         className="h-14 border-border bg-muted/20 text-lg font-black rounded-2xl text-center shadow-inner"
                         value={newReal.jumlah}
                         onChange={e => setNewReal({...newReal, jumlah: parseInt(e.target.value) || 1})}
                         required
                       />
                    </div>
                    <div className="space-y-3">
                       <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-1">Satuan</label>
                       <Input 
                         placeholder="pcs" 
                         className="h-14 border-border bg-muted/20 text-lg font-black rounded-2xl text-center shadow-inner"
                         value={newReal.satuan}
                         onChange={e => setNewReal({...newReal, satuan: e.target.value})}
                         required
                       />
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
                       {formatCurrency(((newReal.jumlah || 1) * (newReal.hargaSatuan || 0)) + (newReal.biayaLayanan || 0) + (newReal.biayaOngkir || 0) - (newReal.diskon || 0))}
                    </p>
                    <div className="mt-2 flex items-center gap-3">
                        <div className="text-[9px] font-bold text-muted-foreground flex items-center gap-1">
                           <Calculator size={10} /> Subtotal: {formatCurrency((newReal.jumlah || 1) * (newReal.hargaSatuan || 0))}
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
