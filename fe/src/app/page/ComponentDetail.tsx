import { useParams, useNavigate } from "react-router-dom";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { ArrowLeft, Download } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

import { useState, useEffect } from "react";

export function ComponentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [component, setComponent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetch('/api/inventory')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const found = data.find((item: any) => item.id.toString() === id);
          if (found) {
            const rawPrice = found.unitPrice ? parseInt(found.unitPrice.replace(/\D/g, '')) || 0 : 0;
            const computedTotal = `Rp ${(rawPrice * found.stock).toLocaleString('id-ID')}`;

            setComponent({
              sku: `INV-${found.id}`,
              name: found.name,
              category: found.category,
              condition: found.status || "Baru",
              stock: found.stock,
              maxStock: 100,
              location: found.location || "-",
              supplier: found.supplier || "Vendor Utama",
              unitPrice: found.unitPrice || "Rp 0",
              totalValue: computedTotal,
              lastRestocked: "-",
              specifications: typeof found.specifications === 'string' ? JSON.parse(found.specifications) : (found.specifications && Object.keys(found.specifications).length > 0 ? found.specifications : {
                "Tipe": found.category,
                "Lokasi": found.location || "-"
              }),
              movements: []
            });
          }
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Fetch error:", err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="p-8 text-foreground">Memuat data...</div>;
  if (!component) return <div className="p-8 text-foreground">Komponen tidak ditemukan.</div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-2 transition-colors text-sm font-medium"
          >
            <ArrowLeft size={16} />
            Kembali ke Inventaris
          </button>
          <h1 className="text-4xl font-bold text-foreground tracking-tight">{component.name}</h1>
          <p className="text-muted-foreground font-medium mt-1">SKU: {component.sku}</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2 border-border text-foreground hover:bg-muted">
            <Download className="w-4 h-4" />
            Ekspor
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Image & Specs */}
        <Card className="lg:col-span-1 p-6 border-border bg-card shadow-sm transition-colors">
          <div className="aspect-[4/3] rounded-xl overflow-hidden border border-border">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80"
              alt={component.name}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="mt-6 space-y-4">
            <h3 className="text-lg font-bold text-foreground border-b border-border pb-2 uppercase tracking-tight">Spesifikasi Teknis</h3>
            {Object.entries(component.specifications).map(([key, value]) => (
              <div key={key} className="flex justify-between items-center py-1 border-b border-muted/30">
                <span className="text-sm font-medium text-muted-foreground">{key}</span>
                <span className="text-sm font-bold text-foreground">{value as string}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Right Column - Status & Movements */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-8 border-border bg-card shadow-sm text-muted-foreground transition-colors">
              <h3 className="text-xl font-bold text-foreground mb-8 uppercase tracking-tight">Informasi Inventaris</h3>
              <div className="grid grid-cols-2 gap-x-8 gap-y-10">
                <div className="space-y-2">
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Kategori</p>
                  <Badge className="bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 font-bold px-3">
                    {component.category}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Kondisi</p>
                  <Badge className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 font-bold px-3">
                    {component.condition}
                  </Badge>
                </div>
                <div className="col-span-2 space-y-2">
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Stok Saat Ini</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-foreground">{component.stock} / {component.maxStock}</span>
                    <span className="text-xl font-semibold text-muted-foreground">unit</span>
                  </div>
                </div>
                <div className="col-span-2 space-y-2">
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Lokasi</p>
                  <p className="text-lg font-bold text-foreground">{component.location}</p>
                </div>
                <div className="space-y-1 border-t border-border pt-6">
                  <p className="font-bold text-[10px] text-muted-foreground uppercase tracking-widest">Harga Satuan</p>
                  <p className="text-foreground text-lg font-bold">{component.unitPrice}</p>
                </div>
                <div className="space-y-1 border-t border-border pt-6">
                  <p className="font-bold text-[10px] text-muted-foreground uppercase tracking-widest">Total Nilai</p>
                  <p className="text-emerald-500 text-lg font-bold">{component.totalValue}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Pemasok</p>
                  <p className="font-bold text-foreground">{component.supplier}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Terakhir Diisi Ulang</p>
                  <p className="font-bold text-foreground">{component.lastRestocked}</p>
                </div>
              </div>
            </Card>

            <Card className="p-8 border-border bg-card shadow-sm transition-colors">
              <h3 className="text-xl font-bold text-foreground mb-8 uppercase tracking-tight">Riwayat Pergerakan Stok</h3>
              <div className="relative pl-8 space-y-10">
                <div className="absolute left-3 top-2 bottom-2 w-px bg-border"></div>
                {component.movements.map((movement: any, index: number) => (
                  <div key={index} className="relative">
                    <div className={`absolute -left-[25px] top-1.5 w-3 h-3 rounded-full border-2 border-background ${movement.type === "Masuk" ? "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]" : "bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.3)]"}`}></div>
                    <div className="space-y-2 text-muted-foreground">
                      <div className="flex items-center gap-3">
                        <Badge className={`${movement.type === "Masuk" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-indigo-500/10 text-indigo-500 border-indigo-500/20"} text-[10px] font-bold py-0.5 px-2`}>
                          {movement.type}
                        </Badge>
                        <span className="text-xs font-bold tracking-widest uppercase opacity-70">{movement.date}</span>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-black text-foreground">Jumlah: {movement.quantity} unit</p>
                        <p className="text-xs font-medium">{movement.location}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
