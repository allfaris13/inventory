import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { MapPin, Package, AlertTriangle } from "lucide-react";
import { Progress } from "../components/ui/progress";

import { useState, useEffect } from "react";

export function WarehouseMap() {
  const [warehouseZones, setWarehouseZones] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/inventory')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          // Group items by zone (prefix of location)
          const zones: Record<string, any> = {};
          
          data.forEach(item => {
            const zoneName = item.location ? item.location.split(' - ')[0] : 'Lainnya';
            if (!zones[zoneName]) {
              zones[zoneName] = {
                id: zoneName.toLowerCase().replace(' ', '-'),
                name: zoneName,
                totalRacks: 30,
                occupiedRacks: 0,
                capacity: 0,
                status: "Normal",
                color: zoneName.includes('A') ? "bg-[#10b981]" : zoneName.includes('B') ? "bg-[#f59e0b]" : "bg-primary",
                items: []
              };
            }
            
            if (zones[zoneName].items.length < 5) {
              zones[zoneName].items.push({
                rack: item.location || "-",
                sku: `INV-${item.id}`,
                name: item.name,
                quantity: item.stock
              });
            }
            zones[zoneName].occupiedRacks++;
          });

          const zoneList = Object.values(zones).map((z: any) => ({
            ...z,
            capacity: Math.min(100, Math.floor((z.occupiedRacks / z.totalRacks) * 100)),
            status: z.occupiedRacks > 25 ? "Mendekati Penuh" : "Optimal"
          }));

          setWarehouseZones(zoneList);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Fetch error:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-8 text-foreground">Memuat peta gudang...</div>;
  if (warehouseZones.length === 0) return <div className="p-8 text-foreground">Data gudang tidak tersedia.</div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-semibold text-foreground">Peta Gudang</h1>
        <p className="text-muted-foreground mt-1">Okupansi zona dan lokasi rak real-time</p>
      </div>

      {/* Zone Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {warehouseZones.map((zone) => (
          <Card key={zone.id} className="p-6 bg-card border-border shadow-lg hover:shadow-xl transition-all">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-semibold text-foreground">{zone.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {zone.occupiedRacks} / {zone.totalRacks} rak terisi
                </p>
              </div>
              <Badge className={zone.color + " text-white"}>
                {zone.status}
              </Badge>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Kapasitas</span>
                  <span className="font-semibold">{zone.capacity}%</span>
                </div>
                <Progress value={zone.capacity} className="h-2" />
              </div>

              <div className="pt-3 border-t border-border">
                <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                  <Package className="w-3 h-3" />
                  Barang Tersimpan ({zone.items.length})
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* 2D Warehouse Blueprint */}
      <Card className="p-6 bg-card border-border shadow-lg">
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-foreground">Tata Letak Gudang</h3>
          <p className="text-sm text-muted-foreground mt-1">Blueprint zona dinamis</p>
        </div>

        {/* Blueprint Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {warehouseZones.map((zone) => (
            <div key={zone.id} className="space-y-4">
              {/* Zone Header */}
              <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg border border-border">
                <div className={`w-3 h-3 rounded-full ${zone.color}`}></div>
                <h4 className="font-semibold text-foreground">{zone.name}</h4>
                <Badge variant="outline" className="ml-auto">
                  {zone.capacity}% Penuh
                </Badge>
              </div>

              {/* Rack Grid Visualization */}
              <div className="p-4 bg-muted/10 rounded-lg border-2 border-border">
                <div className="grid grid-cols-4 gap-2 mb-4">
                  {Array.from({ length: 16 }).map((_, index) => {
                    const isOccupied = index < Math.floor((zone.occupiedRacks / zone.totalRacks) * 16);
                    return (
                      <div
                        key={index}
                        className={`
                          aspect-square rounded border-2 transition-all cursor-pointer
                          ${isOccupied 
                            ? zone.color + ' border-transparent shadow-lg' 
                            : 'bg-muted/30 border-dashed border-border hover:border-primary/50'
                          }
                        `}
                        title={isOccupied ? "Terisi" : "Tersedia"}
                      ></div>
                    );
                  })}
                </div>

                <div className="flex gap-4 text-xs">
                  <div className="flex items-center gap-1">
                    <div className={`w-3 h-3 rounded ${zone.color}`}></div>
                    <span className="text-muted-foreground">Terisi</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded bg-muted/30 border border-dashed border-border"></div>
                    <span className="text-muted-foreground">Tersedia</span>
                  </div>
                </div>
              </div>

              {/* Stored Items List */}
              <div className="space-y-2">
                <p className="text-sm font-semibold text-foreground px-1">Sampel Barang di {zone.name}</p>
                {zone.items.map((item: any, index: number) => (
                  <div
                    key={index}
                    className="p-3 bg-muted/20 rounded-lg border border-border hover:border-primary/50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <MapPin className="w-3 h-3 text-primary" />
                          <span className="text-xs font-mono text-muted-foreground">{item.rack}</span>
                        </div>
                        <p className="text-sm font-medium text-foreground">{item.name}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">SKU: {item.sku}</p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {item.quantity} unit
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>
      {/* Capacity Alerts */}
      <Card className="p-6 bg-card border-border shadow-lg">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-[#f59e0b]/10 flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-5 h-5 text-[#f59e0b]" />
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-1">Peringatan Kapasitas</h4>
            <p className="text-sm text-muted-foreground">
              Okupansi zona dipantau secara real-time. Jika zona melebihi 80%, segera lakukan audit ruang atau restock plan.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
