import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { ArrowDownCircle, ArrowUpCircle, Calendar, X } from "lucide-react";
import { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { Printer, CheckCircle2 } from "lucide-react";

const transactionData = [
  {
    id: "TXN-2024-001",
    date: "31 Mar 2026 09:23",
    type: "Masuk",
    item: "Saklar On/Off Mini",
    quantity: 50,
    location: "Zona A - Laci 1",
    vendor: "RoboTech Industries",
    recipient: "Logistik",
    target: "Gudang",
    status: "Selesai",
  },
  {
    id: "TXN-2024-002",
    date: "31 Mar 2026 11:45",
    type: "Keluar",
    item: "Kabel Jumper AWG24 (Meter)",
    quantity: 15,
    location: "Jalur Perakitan 2",
    vendor: "Internal",
    recipient: "Budi Teknisi",
    target: "Teknisi",
    status: "Selesai",
  },
  {
    id: "TXN-2024-003",
    date: "30 Mar 2026 14:12",
    type: "Masuk",
    item: "Paket Baterai BP-3000",
    quantity: 30,
    location: "Zona C - Rak 3",
    vendor: "PowerCell Solutions",
    status: "Selesai",
  },
  {
    id: "TXN-2024-004",
    date: "30 Mar 2026 16:30",
    type: "Keluar",
    item: "Motor Servo SM-200",
    quantity: 8,
    location: "Jalur Perakitan 1",
    vendor: "Transfer Internal",
    status: "Selesai",
  },
  {
    id: "TXN-2024-005",
    date: "29 Mar 2026 10:05",
    type: "Masuk",
    item: "Papan Kontrol CB-X1",
    quantity: 45,
    location: "Zona B - Rak 15",
    vendor: "Circuit Masters Ltd",
    status: "Selesai",
  },
  {
    id: "TXN-2024-006",
    date: "29 Mar 2026 13:20",
    type: "Keluar",
    item: "Aktuator Pneumatik",
    quantity: 12,
    location: "Jalur Perakitan 3",
    vendor: "Transfer Internal",
    status: "Dalam Proses",
  },
  {
    id: "TXN-2024-007",
    date: "28 Mar 2026 08:45",
    type: "Masuk",
    item: "Modul Kamera HD",
    quantity: 25,
    location: "Zona C - Rak 7",
    vendor: "Vision Tech Components",
    status: "Selesai",
  },
  {
    id: "TXN-2024-008",
    date: "28 Mar 2026 15:10",
    type: "Keluar",
    item: "Perakit Gripper Robotik",
    quantity: 6,
    location: "Jalur Perakitan 2",
    vendor: "Transfer Internal",
    status: "Selesai",
  },
];

export function Transactions() {
  const [items, setItems] = useState(transactionData);
  const [activeTab, setActiveTab] = useState<'Semua' | 'Masuk' | 'Teknisi' | 'Prepare'>('Semua');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showNota, setShowNota] = useState(false);
  const [lastTxn, setLastTxn] = useState<any>(null);
  const [newTxn, setNewTxn] = useState({
    type: 'Masuk',
    item: 'Saklar On/Off Mini',
    quantity: 1,
    vendor: '',
    recipient: '',
    target: 'Gudang',
    location: '',
    status: 'Selesai'
  });

  const filteredItems = items.filter(t => {
    if (activeTab === 'Semua') return true;
    if (activeTab === 'Masuk') return t.type === 'Masuk';
    if (activeTab === 'Teknisi') return t.target === 'Teknisi';
    if (activeTab === 'Prepare') return t.target === 'Prepare';
    return true;
  });

  const inboundCount = items.filter(t => t.type === "Masuk").length;
  const outboundCount = items.filter(t => t.type === "Keluar").length;
  const inProgressCount = items.filter(t => t.status === "Dalam Proses").length;

  const handleOpenAddModal = (type: 'Masuk' | 'Keluar', target?: string) => {
    setNewTxn({
      ...newTxn,
      type: type,
      target: target || (type === 'Masuk' ? 'Gudang' : 'Teknisi'),
      recipient: type === 'Masuk' ? 'Logistik' : ''
    });
    setIsModalOpen(true);
  };

  const handleAddTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    const id = `RO-${new Date().getFullYear()}-${String(items.length + 1).padStart(4, '0')}`;
    const date = new Date().toLocaleString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }).replace(/\./g, ':');
    
    const newEntry = {
      id,
      date,
      type: newTxn.type,
      item: newTxn.item,
      quantity: newTxn.quantity,
      location: newTxn.location,
      vendor: newTxn.vendor || 'Internal',
      recipient: newTxn.recipient,
      target: newTxn.target,
      status: newTxn.status
    };

    setItems([newEntry, ...items]);
    setLastTxn(newEntry);
    setIsModalOpen(false);
    setShowNota(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-semibold text-foreground tracking-tight uppercase">Riwayat Transaksi</h1>
          <p className="text-muted-foreground mt-1 text-sm font-bold tracking-widest uppercase">PERGERAKAN INVENTARIS MASUK DAN KELUAR</p>
        </div>
        <div className="flex gap-2">
          {activeTab === 'Masuk' || activeTab === 'Semua' ? (
            <Button 
              onClick={() => handleOpenAddModal('Masuk')}
              className="bg-emerald-600 hover:bg-emerald-500 text-white gap-2 h-11 px-4 font-black shadow-lg shadow-emerald-500/20 rounded-xl uppercase text-[10px] tracking-widest"
            >
              <ArrowDownCircle size={16} />
              Catat Masuk
            </Button>
          ) : null}
          {activeTab === 'Teknisi' || activeTab === 'Semua' ? (
            <Button 
              onClick={() => handleOpenAddModal('Keluar', 'Teknisi')}
              className="bg-indigo-600 hover:bg-indigo-500 text-white gap-2 h-11 px-4 font-black shadow-lg shadow-indigo-500/20 rounded-xl uppercase text-[10px] tracking-widest"
            >
              <ArrowUpCircle size={16} />
              Kirim ke Teknisi
            </Button>
          ) : null}
          {activeTab === 'Prepare' || activeTab === 'Semua' ? (
            <Button 
              onClick={() => handleOpenAddModal('Keluar', 'Prepare')}
              className="bg-purple-600 hover:bg-purple-500 text-white gap-2 h-11 px-4 font-black shadow-lg shadow-purple-500/20 rounded-xl uppercase text-[10px] tracking-widest"
            >
              <ArrowUpCircle size={16} />
              Kirim ke Prepare
            </Button>
          ) : null}
        </div>
      </div>

      {/* Tabs Layout */}
      <div className="flex p-1 bg-muted/30 rounded-2xl w-full max-w-xl border border-border">
        {['Semua', 'Masuk', 'Teknisi', 'Prepare'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`flex-1 py-2.5 px-4 rounded-xl font-black text-[9px] tracking-widest uppercase transition-all ${activeTab === tab ? 'bg-card text-foreground shadow-lg border border-border' : 'text-muted-foreground hover:text-foreground'}`}
          >
            {tab === 'Teknisi' ? 'Ke Teknisi' : tab === 'Prepare' ? 'Ke Prepare' : tab}
          </button>
        ))}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-card border-border shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <ArrowDownCircle className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Masuk</p>
              <p className="text-2xl font-semibold mt-0.5">{inboundCount}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-card border-border shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
              <ArrowUpCircle className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Keluar</p>
              <p className="text-2xl font-semibold mt-0.5">{outboundCount}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-card border-border shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#f59e0b]/10 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-[#f59e0b]" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Dalam Proses</p>
              <p className="text-2xl font-semibold mt-0.5">{inProgressCount}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-card border-border shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#10b981]/10 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-[#10b981]" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total</p>
              <p className="text-2xl font-semibold mt-0.5">{items.length}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Transaction Table */}
      <Card className="bg-card border-border shadow-lg overflow-hidden">
        <div className="p-6 border-b border-border">
          <h3 className="text-lg font-semibold text-foreground">Transaksi Terbaru</h3>
          <p className="text-sm text-muted-foreground mt-1">Semua pergerakan inventaris</p>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-muted/30">
                <TableHead className="text-foreground font-semibold">No. Nota</TableHead>
                <TableHead className="text-foreground font-semibold">Tanggal</TableHead>
                <TableHead className="text-foreground font-semibold">Tipe</TableHead>
                <TableHead className="text-foreground font-semibold">Barang</TableHead>
                <TableHead className="text-foreground font-semibold">Jumlah</TableHead>
                <TableHead className="text-foreground font-semibold">Penerima/Sumber</TableHead>
                <TableHead className="text-foreground font-semibold text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.map((transaction) => (
                <TableRow 
                  key={transaction.id} 
                  className="border-border hover:bg-muted/20 transition-colors"
                >
                  <TableCell className="font-mono text-xs font-bold text-muted-foreground">
                    {transaction.id}
                  </TableCell>
                  <TableCell className="text-xs text-foreground">
                    {transaction.date}
                  </TableCell>
                  <TableCell>
                    <Badge 
                      className={
                        transaction.type === "Masuk" 
                          ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/20 text-[9px] font-black" 
                          : "bg-indigo-500/20 text-indigo-400 border-indigo-500/20 text-[9px] font-black"
                      }
                    >
                      {transaction.type === "Masuk" ? "MASUK" : `KELUAR (${transaction.target})`}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-bold text-sm text-foreground">
                    {transaction.item}
                  </TableCell>
                  <TableCell className="font-black text-foreground">
                    {transaction.quantity} Unit
                  </TableCell>
                  <TableCell className="text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-[10px] font-bold">
                        {(transaction.recipient || transaction.vendor || '??')[0]}
                      </div>
                      <span className="text-muted-foreground font-medium">
                        {transaction.recipient || transaction.vendor}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-muted-foreground hover:text-indigo-500"
                      onClick={() => { setLastTxn(transaction); setShowNota(true); }}
                    >
                      <Printer size={16} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Add Transaction Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <Card className="w-full max-w-md bg-card border-border shadow-2xl p-0 overflow-hidden animate-in zoom-in-95 rounded-[2rem]">
            <div className="p-8 border-b border-border flex justify-between items-center bg-muted/20">
              <h2 className="text-xl font-black text-foreground uppercase tracking-tight">
                {newTxn.type === 'Masuk' ? 'Input Barang Masuk' : `Kirim ke ${newTxn.target}`}
              </h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleAddTransaction} className="p-10 space-y-6">
              <div className="space-y-2">
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Pilih Barang</label>
                  <select 
                    className="flex h-12 w-full rounded-xl border border-border bg-card px-3 py-1 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary font-bold shadow-sm"
                    value={newTxn.item}
                    onChange={e => setNewTxn({...newTxn, item: e.target.value})}
                  >
                    <option className="bg-card">Saklar On/Off Mini</option>
                    <option className="bg-card">Kabel Jumper AWG24 (Meter)</option>
                    <option className="bg-card">Saklar Terakit</option>
                  </select>
                </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Jumlah Unit</label>
                  <Input 
                    type="number" 
                    required 
                    min="1"
                    placeholder="Contoh: 10" 
                    className="h-12 bg-card border-border font-bold text-foreground rounded-xl shadow-sm text-center text-lg"
                    value={newTxn.quantity || ''}
                    onChange={e => setNewTxn({...newTxn, quantity: parseInt(e.target.value)})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Lokasi Rak</label>
                  <Input 
                    placeholder="Zona A - Rak 12" 
                    className="h-12 bg-card border-border font-bold text-foreground rounded-xl shadow-sm font-mono"
                    value={newTxn.location}
                    onChange={e => setNewTxn({...newTxn, location: e.target.value})}
                  />
                </div>
              </div>

              {newTxn.type === 'Masuk' ? (
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Vendor / Sumber</label>
                  <Input 
                    placeholder="Contoh: RoboTech Ind." 
                    className="h-12 bg-card border-border font-bold text-foreground rounded-xl shadow-sm"
                    value={newTxn.vendor}
                    onChange={e => setNewTxn({...newTxn, vendor: e.target.value})}
                  />
                </div>
              ) : (
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Nama Penerima ({newTxn.target})</label>
                  <Input 
                    placeholder={`Nama ${newTxn.target === 'Teknisi' ? 'Teknisi' : 'Tim Prepare'}`} 
                    className="h-12 bg-card border-border font-bold text-foreground rounded-xl shadow-sm border-indigo-500/20 focus:ring-indigo-500"
                    value={newTxn.recipient}
                    onChange={e => setNewTxn({...newTxn, recipient: e.target.value})}
                    required
                  />
                </div>
              )}

              <div className="pt-8 flex gap-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  className="flex-1 h-14 border-border text-muted-foreground font-black uppercase text-[10px] tracking-widest hover:bg-muted rounded-2xl"
                  onClick={() => setIsModalOpen(false)}
                >
                  Batal
                </Button>
                <Button 
                  type="submit" 
                  className="flex-1 h-14 bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase text-[10px] tracking-widest rounded-2xl shadow-lg shadow-indigo-500/20 active:scale-95 transition-all"
                >
                  Konfirmasi Transaksi
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* Nota Barang Modal */}
      {showNota && lastTxn && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-300">
           <Card className="w-full max-w-lg bg-white text-slate-900 shadow-2xl overflow-hidden rounded-[2.5rem] p-0 border-none animate-in zoom-in-95">
              <div className="bg-slate-900 p-10 text-white flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                       <CheckCircle2 className="text-emerald-400" size={24} />
                       <h2 className="text-2xl font-black uppercase tracking-tighter italic">RoboEdu</h2>
                    </div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">SURAT JALAN / NOTA BARANG</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-slate-500 uppercase">No. Transaksi</p>
                    <p className="text-sm font-mono font-black">{lastTxn.id}</p>
                  </div>
              </div>

              <div className="p-12 space-y-10">
                  <div className="flex justify-between items-end border-b pb-8 border-slate-100">
                      <div className="space-y-1">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Petugas Logistik</p>
                        <p className="font-black text-lg">Logistik RoboEdu</p>
                      </div>
                      <div className="text-right space-y-1">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Tanggal Keluar</p>
                        <p className="font-bold">{lastTxn.date}</p>
                      </div>
                  </div>

                  <div className="space-y-6">
                      <div className="grid grid-cols-4 text-[9px] font-black text-slate-400 uppercase tracking-widest pb-2 border-b border-slate-50">
                          <div className="col-span-2">Deskripsi Barang</div>
                          <div className="text-center">Jumlah</div>
                          <div className="text-right">Satuan</div>
                      </div>
                      <div className="grid grid-cols-4 font-black text-slate-800 text-sm">
                          <div className="col-span-2">{lastTxn.item}</div>
                          <div className="text-center">{lastTxn.quantity}</div>
                          <div className="text-right">Unit</div>
                      </div>
                  </div>

                  <div className="bg-slate-50 p-6 rounded-2xl space-y-2">
                       <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Ditujukan Kepada ({lastTxn.target})</p>
                       <p className="font-black text-indigo-600 text-xl">{lastTxn.recipient || lastTxn.vendor}</p>
                  </div>

                  <div className="pt-6 grid grid-cols-2 gap-12">
                      <div className="space-y-12">
                         <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">Pengirim</p>
                         <div className="border-b border-slate-200 w-full h-px"></div>
                         <p className="text-[10px] font-bold text-center text-slate-300 italic pt-2">Tanda Tangan & Nama Terang</p>
                      </div>
                      <div className="space-y-12">
                         <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">Penerima</p>
                         <div className="border-b border-slate-200 w-full h-px"></div>
                         <p className="text-[10px] font-bold text-center text-slate-300 italic pt-2">{lastTxn.recipient || lastTxn.vendor}</p>
                      </div>
                  </div>

                  <div className="pt-10 flex gap-4">
                      <Button 
                        onClick={() => setShowNota(false)}
                        className="flex-1 h-14 bg-slate-100 hover:bg-slate-200 text-slate-600 font-black uppercase text-[10px] tracking-widest rounded-2xl"
                      >
                         Batal
                      </Button>
                      <Button 
                        onClick={() => window.print()}
                        className="flex-1 h-14 bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase text-[10px] tracking-widest rounded-2xl shadow-xl shadow-indigo-500/20"
                      >
                         <Printer size={16} className="mr-2" />
                         Cetak Nota
                      </Button>
                  </div>
              </div>
           </Card>
        </div>
      )}
    </div>
  );
}
