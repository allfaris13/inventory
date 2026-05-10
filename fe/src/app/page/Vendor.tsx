import { useState } from 'react';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { 
  Building2, 
  Search, 
  TrendingDown, 
  DollarSign, 
  Star, 
  ShoppingBag, 
  CheckCircle,
  AlertCircle,
  ThumbsUp,
  Tag,
  ArrowUpDown
} from 'lucide-react';

interface Supplier {
  id: string;
  name: string;
  platform: 'Tokopedia' | 'Shopee' | 'Offline' | 'Website';
  transactionCount: number;
  totalSpend: number;
  mainCategory: string;
  rating: number;
  status: 'Prioritas' | 'Terverifikasi' | 'Aktif';
}

interface PriceComparison {
  componentName: string;
  sku: string;
  prices: {
    vendorName: string;
    price: number;
    link?: string;
  }[];
}

export function Vendor() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'suppliers' | 'comparison'>('suppliers');

  // Seeded suppliers list who have transacted with RoboEdu
  const suppliers: Supplier[] = [
    { id: 'SPL-001', name: 'MitraBot Indonesia', platform: 'Tokopedia', transactionCount: 14, totalSpend: 18500000, mainCategory: 'Mikrokontroler & Sensor', rating: 4.9, status: 'Prioritas' },
    { id: 'SPL-002', name: 'CV Robotika Nusantara', platform: 'Shopee', transactionCount: 9, totalSpend: 12400000, mainCategory: 'Baterai & Charger', rating: 4.8, status: 'Terverifikasi' },
    { id: 'SPL-003', name: 'Jakarta Robot Store', platform: 'Website', transactionCount: 11, totalSpend: 9800000, mainCategory: 'Aktuator & Motor', rating: 4.7, status: 'Aktif' },
    { id: 'SPL-004', name: 'Indorobot Store', platform: 'Tokopedia', transactionCount: 5, totalSpend: 4200000, mainCategory: 'Kabel & Konektor', rating: 4.6, status: 'Aktif' },
    { id: 'SPL-005', name: 'Gudang Arduino Utama', platform: 'Offline', transactionCount: 8, totalSpend: 15600000, mainCategory: 'Kit Edukasi Lengkap', rating: 4.9, status: 'Prioritas' }
  ];

  // Seeded comparison matrix for common robotic components
  const comparisons: PriceComparison[] = [
    {
      componentName: 'Arduino Uno R3 DIP',
      sku: 'COMP-001',
      prices: [
        { vendorName: 'MitraBot Indonesia', price: 89000 },
        { vendorName: 'CV Robotika Nusantara', price: 95000 },
        { vendorName: 'Jakarta Robot Store', price: 92000 }
      ]
    },
    {
      componentName: 'LiPo Battery 3S 2200mAh 35C',
      sku: 'COMP-002',
      prices: [
        { vendorName: 'MitraBot Indonesia', price: 260000 },
        { vendorName: 'CV Robotika Nusantara', price: 245000 },
        { vendorName: 'Jakarta Robot Store', price: 255000 }
      ]
    },
    {
      componentName: 'Servo Motor SG90 TowerPro',
      sku: 'COMP-003',
      prices: [
        { vendorName: 'MitraBot Indonesia', price: 17000 },
        { vendorName: 'CV Robotika Nusantara', price: 15000 },
        { vendorName: 'Jakarta Robot Store', price: 12000 }
      ]
    },
    {
      componentName: 'Sensor Ultrasonic HC-SR04',
      sku: 'COMP-004',
      prices: [
        { vendorName: 'MitraBot Indonesia', price: 15800 },
        { vendorName: 'CV Robotika Nusantara', price: 18000 },
        { vendorName: 'Jakarta Robot Store', price: 19000 }
      ]
    },
    {
      componentName: 'Driver Motor L298N Dual H-Bridge',
      sku: 'COMP-005',
      prices: [
        { vendorName: 'MitraBot Indonesia', price: 24000 },
        { vendorName: 'CV Robotika Nusantara', price: 22000 },
        { vendorName: 'Jakarta Robot Store', price: 25000 }
      ]
    }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getCheapestVendor = (prices: { vendorName: string; price: number }[]) => {
    return prices.reduce((min, p) => p.price < min.price ? p : min, prices[0]);
  };

  const filteredSuppliers = suppliers.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.mainCategory.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredComparisons = comparisons.filter(c =>
    c.componentName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-black text-foreground tracking-tight uppercase flex items-center gap-3">
            <Building2 className="w-8 h-8 text-primary" /> Analisis Vendor & Supplier
          </h2>
          <p className="text-sm text-muted-foreground font-bold italic tracking-widest uppercase">
            Perbandingan Harga Supplier & Direktori Mitra RoboEdu
          </p>
        </div>
      </div>

      {/* Tabs & Search */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-2 p-1.5 bg-muted/30 border border-border/50 rounded-2xl w-fit">
          <button
            onClick={() => setActiveTab('suppliers')}
            className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
              activeTab === 'suppliers' 
                ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Daftar Supplier RoboEdu
          </button>
          <button
            onClick={() => setActiveTab('comparison')}
            className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
              activeTab === 'comparison' 
                ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Analisis Harga Termurah
          </button>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Cari vendor atau komponen..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-11 pr-4 py-6 bg-card border-border hover:border-primary/50 focus:border-primary rounded-2xl text-xs font-bold shadow-sm"
          />
        </div>
      </div>

      {/* Suppliers Directory Tab */}
      {activeTab === 'suppliers' && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredSuppliers.map((sup) => (
            <Card key={sup.id} className="border-border bg-card shadow-lg hover:shadow-xl rounded-[2rem] overflow-hidden group transition-all duration-300">
              <div className="p-6 space-y-5">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black text-primary uppercase tracking-widest font-mono bg-primary/10 px-2.5 py-1 rounded-full">{sup.id}</span>
                    <h3 className="text-lg font-black text-foreground uppercase tracking-tight pt-2 group-hover:text-primary transition-colors">{sup.name}</h3>
                  </div>
                  <Badge className={`
                    ${sup.status === 'Prioritas' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : ''}
                    ${sup.status === 'Terverifikasi' ? 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20' : ''}
                    ${sup.status === 'Aktif' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : ''}
                    text-[9px] font-black px-3 py-1 rounded-lg uppercase tracking-wider
                  `}>
                    {sup.status}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border/40">
                  <div>
                    <p className="text-[10px] text-muted-foreground font-black uppercase tracking-wider">Total Transaksi</p>
                    <p className="text-base font-black text-foreground pt-0.5">{sup.transactionCount} Kali</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground font-black uppercase tracking-wider">Total Pembelanjaan</p>
                    <p className="text-base font-black text-emerald-500 pt-0.5">{formatCurrency(sup.totalSpend)}</p>
                  </div>
                </div>

                <div className="space-y-2.5 pt-2 border-t border-border/40">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-muted-foreground font-bold">Kategori Utama:</span>
                    <span className="font-black text-foreground uppercase tracking-tight">{sup.mainCategory}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-muted-foreground font-bold">Platform Toko:</span>
                    <span className="font-mono bg-muted/50 px-2 py-0.5 rounded text-[10px] font-bold text-foreground">{sup.platform}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-muted-foreground font-bold">Rating Pelayanan:</span>
                    <span className="flex items-center gap-1 font-black text-amber-500">
                      <Star className="w-3.5 h-3.5 fill-amber-500 stroke-amber-500" /> {sup.rating}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Price Comparison Tab */}
      {activeTab === 'comparison' && (
        <Card className="border-border bg-card shadow-xl rounded-[2.5rem] overflow-hidden">
          <div className="p-8 border-b border-border bg-muted/10">
            <h3 className="text-lg font-black text-foreground uppercase tracking-tight">Analisis Matriks Harga Termurah</h3>
            <p className="text-xs text-muted-foreground font-bold italic tracking-widest uppercase">Komparasi Harga Terkini antar Supplier Partner</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-muted/5 text-[10px] uppercase font-black tracking-widest text-muted-foreground">
                  <th className="px-8 py-5">Nama Komponen</th>
                  <th className="px-8 py-5">CV Robotika Nusantara</th>
                  <th className="px-8 py-5">MitraBot Indonesia</th>
                  <th className="px-8 py-5">Jakarta Robot Store</th>
                  <th className="px-8 py-5 text-right">Vendor Termurah</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {filteredComparisons.map((item, idx) => {
                  const cheapest = getCheapestVendor(item.prices);
                  const priceRobotika = item.prices.find(p => p.vendorName === 'CV Robotika Nusantara')?.price || 0;
                  const priceMitrabot = item.prices.find(p => p.vendorName === 'MitraBot Indonesia')?.price || 0;
                  const priceJakarta = item.prices.find(p => p.vendorName === 'Jakarta Robot Store')?.price || 0;

                  return (
                    <tr key={idx} className="hover:bg-muted/10 transition-colors group">
                      <td className="px-8 py-6">
                        <div className="space-y-1">
                          <p className="text-sm font-black text-foreground uppercase tracking-tight">{item.componentName}</p>
                          <p className="text-[10px] text-muted-foreground font-mono font-bold uppercase tracking-wider">{item.sku}</p>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-sm font-bold">
                        <span className={cheapest.vendorName === 'CV Robotika Nusantara' ? 'text-emerald-500 font-black' : 'text-muted-foreground'}>
                          {formatCurrency(priceRobotika)}
                        </span>
                        {cheapest.vendorName === 'CV Robotika Nusantara' && (
                          <Badge className="ml-2 bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[8px] font-black uppercase tracking-wider">Termurah</Badge>
                        )}
                      </td>
                      <td className="px-8 py-6 text-sm font-bold">
                        <span className={cheapest.vendorName === 'MitraBot Indonesia' ? 'text-emerald-500 font-black' : 'text-muted-foreground'}>
                          {formatCurrency(priceMitrabot)}
                        </span>
                        {cheapest.vendorName === 'MitraBot Indonesia' && (
                          <Badge className="ml-2 bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[8px] font-black uppercase tracking-wider">Termurah</Badge>
                        )}
                      </td>
                      <td className="px-8 py-6 text-sm font-bold">
                        <span className={cheapest.vendorName === 'Jakarta Robot Store' ? 'text-emerald-500 font-black' : 'text-muted-foreground'}>
                          {formatCurrency(priceJakarta)}
                        </span>
                        {cheapest.vendorName === 'Jakarta Robot Store' && (
                          <Badge className="ml-2 bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[8px] font-black uppercase tracking-wider">Termurah</Badge>
                        )}
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex flex-col items-end gap-1">
                          <span className="text-xs font-black text-foreground uppercase tracking-tight">{cheapest.vendorName}</span>
                          <span className="text-sm font-black text-emerald-500">{formatCurrency(cheapest.price)}</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
