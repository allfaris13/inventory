import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { ArrowDownCircle, ArrowUpCircle, Calendar, Plus, X } from "lucide-react";
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

const transactionData = [
  {
    id: "TXN-2024-001",
    date: "31 Mar 2026 09:23",
    type: "Masuk",
    item: "Sensor Lidar LDR-500",
    sku: "LDR-500-A",
    quantity: 20,
    location: "Zona A - Rak 12",
    vendor: "RoboTech Industries",
    status: "Selesai",
  },
  {
    id: "TXN-2024-002",
    date: "31 Mar 2026 11:45",
    type: "Keluar",
    item: "Motor Stepper Industri",
    sku: "SM-200-B",
    quantity: 15,
    location: "Jalur Perakitan 2",
    vendor: "Transfer Internal",
    status: "Selesai",
  },
  {
    id: "TXN-2024-003",
    date: "30 Mar 2026 14:12",
    type: "Masuk",
    item: "Paket Baterai BP-3000",
    sku: "BP-3000-D",
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
    sku: "SV-200-F",
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
    sku: "CB-X1-E",
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
    sku: "ACT-350-C",
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
    sku: "CAM-HD-G",
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
    sku: "GRP-500-H",
    quantity: 6,
    location: "Jalur Perakitan 2",
    vendor: "Transfer Internal",
    status: "Selesai",
  },
];

export function Transactions() {
  const [items, setItems] = useState(transactionData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTxn, setNewTxn] = useState({
    type: 'Masuk',
    sku: 'LDR-500-A',
    quantity: 0,
    vendor: '',
    location: '',
    status: 'Selesai'
  });

  const inboundCount = items.filter(t => t.type === "Masuk").length;
  const outboundCount = items.filter(t => t.type === "Keluar").length;
  const inProgressCount = items.filter(t => t.status === "Dalam Proses").length;

  const handleAddTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    const id = `TXN-2026-${String(items.length + 1).padStart(3, '0')}`;
    const date = new Date().toLocaleString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }).replace(/\./g, ':');
    
    // Quick mapping for item name based on SKU
    const itemNames: Record<string, string> = {
      'LDR-500-A': 'Sensor Lidar LDR-500',
      'SM-200-B': 'Motor Stepper Industri',
      'BP-3000-D': 'Paket Baterai BP-3000'
    };

    const newEntry = {
      id,
      date,
      type: newTxn.type,
      item: itemNames[newTxn.sku] || 'Barang Baru',
      sku: newTxn.sku,
      quantity: newTxn.quantity,
      location: newTxn.location,
      vendor: newTxn.vendor,
      status: newTxn.status
    };

    setItems([newEntry, ...items]);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-semibold text-foreground tracking-tight uppercase">Riwayat Transaksi</h1>
          <p className="text-muted-foreground mt-1 text-sm font-bold tracking-widest uppercase">PERGERAKAN INVENTARIS MASUK DAN KELUAR</p>
        </div>
        <Button 
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-500 text-white gap-2 h-12 px-6 font-black shadow-lg shadow-indigo-500/20 transition-all active:scale-95 rounded-xl uppercase text-xs tracking-widest"
        >
          <Plus size={18} />
          Catat Transaksi
        </Button>
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
                <TableHead className="text-foreground font-semibold">ID Transaksi</TableHead>
                <TableHead className="text-foreground font-semibold">Tanggal & Waktu</TableHead>
                <TableHead className="text-foreground font-semibold">Tipe</TableHead>
                <TableHead className="text-foreground font-semibold">Barang</TableHead>
                <TableHead className="text-foreground font-semibold">SKU</TableHead>
                <TableHead className="text-foreground font-semibold">Jumlah</TableHead>
                <TableHead className="text-foreground font-semibold">Lokasi</TableHead>
                <TableHead className="text-foreground font-semibold">Vendor/Sumber</TableHead>
                <TableHead className="text-foreground font-semibold">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((transaction) => (
                <TableRow 
                  key={transaction.id} 
                  className="border-border hover:bg-muted/20 transition-colors"
                >
                  <TableCell className="font-mono text-sm text-muted-foreground">
                    {transaction.id}
                  </TableCell>
                  <TableCell className="text-sm text-foreground">
                    {transaction.date}
                  </TableCell>
                  <TableCell>
                    <Badge 
                      className={
                        transaction.type === "Masuk" 
                          ? "bg-primary text-primary-foreground gap-1" 
                          : "bg-success text-success-foreground gap-1"
                      }
                    >
                      {transaction.type === "Masuk" ? (
                        <ArrowDownCircle className="w-3 h-3" />
                      ) : (
                        <ArrowUpCircle className="w-3 h-3" />
                      )}
                      {transaction.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium text-foreground">
                    {transaction.item}
                  </TableCell>
                  <TableCell className="font-mono text-sm text-muted-foreground">
                    {transaction.sku}
                  </TableCell>
                  <TableCell className="font-semibold text-foreground">
                    {transaction.quantity}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {transaction.location}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {transaction.vendor}
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={transaction.status === "Selesai" ? "default" : "secondary"}
                      className={
                        transaction.status === "Selesai"
                          ? "bg-success text-success-foreground"
                          : "bg-[#f59e0b] text-white"
                      }
                    >
                      {transaction.status}
                    </Badge>
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
              <h2 className="text-xl font-black text-foreground uppercase tracking-tight">Catat Transaksi Baru</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleAddTransaction} className="p-10 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Tipe Transaksi</label>
                  <select 
                    className="flex h-12 w-full rounded-xl border border-border bg-card px-3 py-1 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary font-bold shadow-sm"
                    value={newTxn.type}
                    onChange={e => setNewTxn({...newTxn, type: e.target.value})}
                  >
                    <option className="bg-card">Masuk</option>
                    <option className="bg-card">Keluar</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Pilih Barang (SKU)</label>
                  <select 
                    className="flex h-12 w-full rounded-xl border border-border bg-card px-3 py-1 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary font-bold shadow-sm"
                    value={newTxn.sku}
                    onChange={e => setNewTxn({...newTxn, sku: e.target.value})}
                  >
                    <option className="bg-card" value="LDR-500-A">LDR-500-A (Sensor Lidar)</option>
                    <option className="bg-card" value="SM-200-B">SM-200-B (Motor Stepper)</option>
                    <option className="bg-card" value="BP-3000-D">BP-3000-D (Baterai)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Jumlah Unit</label>
                  <Input 
                    type="number" 
                    required 
                    min="1"
                    placeholder="Contoh: 10" 
                    className="h-12 bg-card border-border font-bold text-foreground rounded-xl shadow-sm"
                    value={newTxn.quantity || ''}
                    onChange={e => setNewTxn({...newTxn, quantity: parseInt(e.target.value)})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Status</label>
                  <select 
                    className={`flex h-12 w-full rounded-xl border bg-card px-3 py-1 text-sm outline-none focus:ring-2 focus:ring-primary font-bold shadow-sm ${newTxn.status === 'Selesai' ? 'text-emerald-500 border-emerald-500/20' : 'text-amber-500 border-amber-500/20'}`}
                    value={newTxn.status}
                    onChange={e => setNewTxn({...newTxn, status: e.target.value})}
                  >
                    <option className="bg-card text-foreground" value="Selesai">Selesai</option>
                    <option className="bg-card text-foreground" value="Dalam Proses">Dalam Proses</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Vendor / Pihak Kedua</label>
                <Input 
                  placeholder="Contoh: RoboTech Ind. atau Transfer Internal" 
                  className="h-12 bg-card border-border font-bold text-foreground rounded-xl shadow-sm"
                  value={newTxn.vendor}
                  onChange={e => setNewTxn({...newTxn, vendor: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Lokasi Simpan / Tujuan</label>
                <Input 
                  placeholder="Contoh: Zona A - Rak 12" 
                  className="h-12 bg-card border-border font-bold text-foreground rounded-xl shadow-sm font-mono"
                  value={newTxn.location}
                  onChange={e => setNewTxn({...newTxn, location: e.target.value})}
                />
              </div>

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
    </div>
  );
}
