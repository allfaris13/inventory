import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { ArrowDownCircle, ArrowUpCircle, Calendar } from "lucide-react";
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
  const inboundCount = transactionData.filter(t => t.type === "Masuk").length;
  const outboundCount = transactionData.filter(t => t.type === "Keluar").length;
  const inProgressCount = transactionData.filter(t => t.status === "Dalam Proses").length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-semibold text-foreground">Riwayat Transaksi</h1>
        <p className="text-muted-foreground mt-1">Pergerakan inventaris masuk dan keluar</p>
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
              <p className="text-2xl font-semibold mt-0.5">{transactionData.length}</p>
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
              {transactionData.map((transaction) => (
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
    </div>
  );
}
