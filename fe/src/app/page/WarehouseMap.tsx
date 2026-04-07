import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { MapPin, Package, AlertTriangle } from "lucide-react";
import { Progress } from "../components/ui/progress";

const warehouseZones = [
  {
    id: "zone-a",
    name: "Zona A",
    totalRacks: 24,
    occupiedRacks: 20,
    capacity: 83,
    status: "Optimal",
    color: "bg-[#10b981]",
    items: [
      { rack: "A-12", sku: "LDR-500-A", name: "Sensor Lidar", quantity: 8 },
      { rack: "A-8", sku: "ACT-350-C", name: "Aktuator Pneumatik", quantity: 23 },
      { rack: "A-20", sku: "SV-200-F", name: "Motor Servo", quantity: 12 },
    ],
  },
  {
    id: "zone-b",
    name: "Zona B",
    totalRacks: 28,
    occupiedRacks: 26,
    capacity: 93,
    status: "Mendekati Penuh",
    color: "bg-[#f59e0b]",
    items: [
      { rack: "B-5", sku: "SM-200-B", name: "Motor Stepper", quantity: 45 },
      { rack: "B-15", sku: "CB-X1-E", name: "Papan Kontrol", quantity: 67 },
      { rack: "B-11", sku: "GRP-500-H", name: "Gripper Robotik", quantity: 29 },
    ],
  },
  {
    id: "zone-c",
    name: "Zona C",
    totalRacks: 20,
    occupiedRacks: 14,
    capacity: 70,
    status: "Tersedia",
    color: "bg-primary",
    items: [
      { rack: "C-3", sku: "BP-3000-D", name: "Paket Baterai", quantity: 18 },
      { rack: "C-7", sku: "CAM-HD-G", name: "Modul Kamera", quantity: 34 },
    ],
  },
];

export function WarehouseMap() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-semibold text-foreground">Peta Gudang</h1>
        <p className="text-muted-foreground mt-1">Okupansi zona dan lokasi rak</p>
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
          <p className="text-sm text-muted-foreground mt-1">Blueprint zona interaktif</p>
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
                <p className="text-sm font-semibold text-foreground px-1">Barang Utama di {zone.name}</p>
                {zone.items.map((item, index) => (
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
              Zona B berada pada kapasitas 93%. Pertimbangkan untuk mendistribusikan ulang barang ke Zona C atau meminta ruang penyimpanan tambahan.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
