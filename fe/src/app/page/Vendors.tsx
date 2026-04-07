import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Star, TrendingUp, Clock, Package } from "lucide-react";
import { Progress } from "../components/ui/progress";

const vendorData = [
  {
    id: 1,
    name: "RoboTech Industries",
    category: "Elektronik & Sensor",
    rating: 4.8,
    totalOrders: 145,
    onTimeDelivery: 96,
    leadTime: "7-10 hari",
    reliability: "Sangat Baik",
    activeContracts: 12,
    totalValue: "Rp 7.3M",
  },
  {
    id: 2,
    name: "MechaSystems Corp",
    category: "Komponen Mekanik",
    rating: 4.6,
    totalOrders: 98,
    onTimeDelivery: 92,
    leadTime: "10-14 hari",
    reliability: "Baik",
    activeContracts: 8,
    totalValue: "Rp 4.9M",
  },
  {
    id: 3,
    name: "PowerCell Solutions",
    category: "Baterai & Daya",
    rating: 4.9,
    totalOrders: 203,
    onTimeDelivery: 98,
    leadTime: "5-7 hari",
    reliability: "Sangat Baik",
    activeContracts: 15,
    totalValue: "Rp 9.2M",
  },
  {
    id: 4,
    name: "Actuator Dynamics",
    category: "Aktuator & Motor",
    rating: 4.5,
    totalOrders: 76,
    onTimeDelivery: 88,
    leadTime: "12-16 hari",
    reliability: "Cukup Baik",
    activeContracts: 6,
    totalValue: "Rp 4.3M",
  },
  {
    id: 5,
    name: "Circuit Masters Ltd",
    category: "Papan Kontrol",
    rating: 4.7,
    totalOrders: 134,
    onTimeDelivery: 94,
    leadTime: "8-12 hari",
    reliability: "Baik",
    activeContracts: 10,
    totalValue: "Rp 6.0M",
  },
  {
    id: 6,
    name: "Vision Tech Components",
    category: "Kamera & Optik",
    rating: 4.4,
    totalOrders: 62,
    onTimeDelivery: 85,
    leadTime: "14-18 hari",
    reliability: "Cukup Baik",
    activeContracts: 5,
    totalValue: "Rp 3.5M",
  },
];

const reliabilityColors = {
  "Sangat Baik": "bg-success text-success-foreground",
  "Baik": "bg-primary text-primary-foreground",
  "Cukup Baik": "bg-[#3b82f6] text-white",
};

export function Vendors() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-semibold text-foreground">Manajemen Vendor</h1>
        <p className="text-muted-foreground mt-1">Keandalan pemasok dan pelacakan kinerja</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-card border-border shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Package className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Vendor Aktif</p>
              <p className="text-2xl font-semibold mt-0.5">{vendorData.length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-card border-border shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
              <Star className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Rating Rata-rata</p>
              <p className="text-2xl font-semibold mt-0.5">4.65</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-card border-border shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#10b981]/10 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-[#10b981]" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Pengiriman Tepat Waktu</p>
              <p className="text-2xl font-semibold mt-0.5">92%</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-card border-border shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#6366f1]/10 flex items-center justify-center">
              <Clock className="w-5 h-5 text-[#6366f1]" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Waktu Tunggu Rata-rata</p>
              <p className="text-2xl font-semibold mt-0.5">10 hari</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Vendor Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {vendorData.map((vendor) => (
          <Card key={vendor.id} className="p-6 bg-card border-border shadow-lg hover:shadow-xl transition-all hover:border-primary/50">
            {/* Vendor Header */}
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-foreground">{vendor.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">{vendor.category}</p>
              </div>
              <Badge className={reliabilityColors[vendor.reliability as keyof typeof reliabilityColors]}>
                {vendor.reliability}
              </Badge>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-4 h-4 ${
                      star <= Math.floor(vendor.rating)
                        ? "fill-[#f59e0b] text-[#f59e0b]"
                        : "text-muted"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm font-semibold">{vendor.rating}</span>
              <span className="text-xs text-muted-foreground">({vendor.totalOrders} pesanan)</span>
            </div>

            {/* Metrics */}
            <div className="space-y-4">
              {/* On-Time Delivery */}
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Pengiriman Tepat Waktu</span>
                  <span className="font-semibold">{vendor.onTimeDelivery}%</span>
                </div>
                <Progress value={vendor.onTimeDelivery} className="h-2" />
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <p className="text-xs text-muted-foreground">Waktu Tunggu</p>
                  <p className="font-medium mt-1 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-muted-foreground" />
                    {vendor.leadTime}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Kontrak Aktif</p>
                  <p className="font-medium mt-1">{vendor.activeContracts}</p>
                </div>
              </div>

              {/* Total Value */}
              <div className="pt-2 border-t border-border">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Total Nilai Kontrak</span>
                  <span className="text-lg font-semibold text-success">{vendor.totalValue}</span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
