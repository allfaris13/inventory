import { useParams, useNavigate } from "react-router-dom";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { ArrowLeft, Download, Edit } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

const componentDetails = {
  "LDR-500-A": {
    sku: "LDR-500-A",
    name: "Sensor Lidar LDR-500",
    category: "Elektronik",
    condition: "Baru",
    stock: 8,
    maxStock: 50,
    location: "Zona A - Rak 12",
    supplier: "RoboTech Industries",
    unitPrice: "Rp 18.750.000",
    totalValue: "Rp 150.000.000",
    lastRestocked: "15 Maret 2026",
    specifications: {
      "Jangkauan Deteksi": "0.1m - 100m",
      "Akurasi": "±2cm",
      "Kecepatan Pemindaian": "10 Hz",
      "Panjang Gelombang": "905 nm",
      "Catu Daya": "12-24V DC",
      "Suhu Operasi": "-20°C hingga 60°C",
      "Berat": "850g",
      "Antarmuka": "Ethernet, CAN Bus",
    },
    movements: [
      { date: "28 Maret 2026", type: "Keluar", quantity: 5, location: "Jalur Perakitan 2" },
      { date: "15 Maret 2026", type: "Masuk", quantity: 20, location: "Zona A - Rak 12" },
      { date: "10 Februari 2026", type: "Keluar", quantity: 12, location: "Jalur Perakitan 1" },
      { date: "22 Januari 2026", type: "Masuk", quantity: 15, location: "Zona A - Rak 12" },
    ],
  },
  "SM-200-B": {
    sku: "SM-200-B",
    name: "Motor Stepper Industri",
    category: "Mekanik",
    condition: "Baru",
    stock: 45,
    maxStock: 100,
    location: "Zona B - Rak 5",
    supplier: "MechaSystems Corp",
    unitPrice: "Rp 4.500.000",
    totalValue: "Rp 202.500.000",
    lastRestocked: "20 Maret 2026",
    specifications: {
      "Torsi": "2.5 Nm",
      "Step Angle": "1.8°",
      "Arus": "4.2A",
      "Frame Size": "NEMA 23",
    },
    movements: [
      { date: "20 Maret 2026", type: "Masuk", quantity: 50, location: "Zona B - Rak 5" },
    ],
  }
};

export function ComponentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Fallback to LDR-500-A if not found
  const component = componentDetails[id as keyof typeof componentDetails] || componentDetails["LDR-500-A"];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Back Button and Header */}
      <div className="flex flex-col gap-4">
        <button
          onClick={() => navigate("/inventory")}
          className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors w-fit text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Inventaris
        </button>

        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-bold text-white tracking-tight">{component.name}</h1>
            <p className="text-slate-400 font-medium mt-1">SKU: {component.sku}</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="gap-2 border-slate-700 text-slate-200 hover:bg-slate-800">
              <Edit className="w-4 h-4" />
              Edit
            </Button>
            <Button className="bg-indigo-600 hover:bg-indigo-500 text-white gap-2 shadow-lg shadow-indigo-500/20">
              <Download className="w-4 h-4" />
              Ekspor
            </Button>
          </div>
        </div>
      </div>

      {/* Main Grid: Image and Technical Specs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 border-slate-800/50 bg-slate-900/20">
          <div className="aspect-[4/3] rounded-xl overflow-hidden border border-slate-800">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80"
              alt={component.name}
              className="w-full h-full object-cover"
            />
          </div>
        </Card>

        <Card className="p-8 border-slate-800/50 bg-slate-900/20 flex flex-col">
          <h3 className="text-xl font-bold text-white mb-8">Spesifikasi Teknis</h3>
          <div className="space-y-4 flex-1">
            {Object.entries(component.specifications).map(([key, value]) => (
              <div key={key} className="flex justify-between items-center py-3 border-b border-slate-800/50 last:border-0">
                <span className="text-sm font-medium text-slate-400">{key}</span>
                <span className="text-sm font-bold text-slate-100">{value}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-8 border-slate-800/50 bg-slate-900/20 text-slate-400">
          <h3 className="text-xl font-bold text-white mb-8 border-slate-800/50">Informasi Inventaris</h3>
          <div className="grid grid-cols-2 gap-x-8 gap-y-10">
            <div className="space-y-2">
              <p className="text-sm font-medium">Kategori</p>
              <Badge className="bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 font-bold px-3">
                {component.category}
              </Badge>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Kondisi</p>
              <Badge className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold px-3">
                {component.condition}
              </Badge>
            </div>
            <div className="col-span-2 space-y-2">
              <p className="text-sm font-medium">Stok Saat Ini</p>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-white">{component.stock} / {component.maxStock}</span>
                <span className="text-xl font-semibold text-slate-500">unit</span>
              </div>
            </div>
            <div className="col-span-2 space-y-2">
              <p className="text-sm font-medium">Lokasi</p>
              <p className="text-lg font-bold text-slate-100">{component.location}</p>
            </div>
            <div className="space-y-1 border-t border-slate-800/50 pt-6">
              <p className="font-semibold text-xs">Harga Satuan</p>
              <p className="text-white text-lg font-bold">{component.unitPrice}</p>
            </div>
            <div className="space-y-1 border-t border-slate-800/50 pt-6">
              <p className="font-semibold text-xs">Total Nilai</p>
              <p className="text-emerald-400 text-lg font-bold">{component.totalValue}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium">Pemasok</p>
              <p className="font-bold text-slate-100">{component.supplier}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium">Terakhir Diisi Ulang</p>
              <p className="font-bold text-slate-100">{component.lastRestocked}</p>
            </div>
          </div>
        </Card>

        <Card className="p-8 border-slate-800/50 bg-slate-900/20">
          <h3 className="text-xl font-bold text-white mb-8">Riwayat Pergerakan Stok</h3>
          <div className="relative pl-8 space-y-10">
            <div className="absolute left-3 top-2 bottom-2 w-px bg-slate-800"></div>
            {component.movements.map((movement, index) => (
              <div key={index} className="relative">
                <div className={`absolute -left-[25px] top-1.5 w-3 h-3 rounded-full border-2 border-slate-950 ${movement.type === "Masuk" ? "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" : "bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]"}`}></div>
                <div className="space-y-2 text-slate-400">
                  <div className="flex items-center gap-3">
                    <Badge className={`${movement.type === "Masuk" ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" : "bg-indigo-500/20 text-indigo-400 border-indigo-500/30"} text-[10px] font-bold py-0.5 px-2`}>
                      {movement.type}
                    </Badge>
                    <span className="text-xs font-semibold tracking-wide uppercase">{movement.date}</span>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-slate-100">Jumlah: {movement.quantity} unit</p>
                    <p className="text-xs font-medium">{movement.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
