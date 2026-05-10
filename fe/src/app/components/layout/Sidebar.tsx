import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Package, 
  ArrowLeftRight, 
  Building2, 
  Wrench, 
  Map,
  DollarSign,
  ShoppingBag,
  X,
  Activity,
  Truck
} from "lucide-react";
import { RoboLogo } from "../ui/RoboLogo";

const navItems = [
  { path: "/dashboard", label: "Dasbor", icon: LayoutDashboard },
  { path: "/inventory", label: "Inventaris", icon: Package },
  { path: "/purchasing", label: "Purchasing", icon: ShoppingBag },
  { path: "/transactions", label: "Transaksi", icon: ArrowLeftRight },
  { path: "/peminjaman", label: "Peminjaman", icon: Building2 }, // Building2 remains as a solid icon choice
  { path: "/maintenance", label: "Pemeliharaan", icon: Wrench },
  { path: "/production-cost", label: "Biaya Produksi", icon: DollarSign },
  { path: "/vendors", label: "Vendor", icon: Building2 },
  { path: "/warehouse-map", label: "Peta Gudang", icon: Map },
];

const adminItems = [
  { path: "/distribution", label: "Distribusi", icon: Truck },
  { path: "/manajemen-prepare", label: "Stok Prepare", icon: Package },
  { path: "/audit-log", label: "Audit Log", icon: Activity },
];

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const location = useLocation();
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const isSuperAdmin = user?.role === 'super_admin' || user?.email === 'admin@robogudang.com';
  const isPrepare = user?.role === 'prepare';
  const isAdminCabang = user?.role === 'admin_cabang';
  
  // Define specific menus if role matches
  let finalNavItems = navItems;
  
  if (isPrepare) {
    finalNavItems = [
      { path: "/dashboard", label: "Dashboard Prepare", icon: LayoutDashboard },
      { path: "/prepare/request", label: "Minta ke Pusat", icon: Package },
      { path: "/prepare/distribute", label: "Kirim ke Sekolah", icon: Truck },
    ];
  } else if (isAdminCabang) {
    finalNavItems = [
      { path: "/dashboard", label: "Dasbor Cabang", icon: LayoutDashboard },
      { path: "/inventory", label: "Inventaris", icon: Package },
      { path: "/transactions", label: "Transaksi", icon: ArrowLeftRight },
      { path: "/maintenance", label: "Pemeliharaan", icon: Wrench },
      { path: "/warehouse-map", label: "Peta Gudang", icon: Map },
    ];
  }

  return (
    <>
      {/* Backdrop for Mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[45] lg:hidden" 
          onClick={onClose}
        />
      )}

      <aside className={`
        fixed lg:static inset-y-0 left-0 z-[50]
        w-64 bg-card border-r border-border flex flex-col shadow-xl transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Logo Section */}
        <div className="p-6 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-xl p-2 transition-colors duration-300 ${
              isPrepare ? 'bg-purple-600 text-white shadow-purple-600/30' : 
              isAdminCabang ? 'bg-[#88b04b] text-white shadow-[#88b04b]/30' :
              'bg-[#4DD0E1] text-white shadow-[#4DD0E1]/30'
            }`}>
              <RoboLogo className="w-full h-full" />
            </div>
            <div>
              <h1 className="text-lg font-black text-foreground uppercase italic tracking-tighter">RoboEdu</h1>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                {isPrepare ? 'Logistik Prepare' : isAdminCabang ? 'Operasional Cabang' : 'Gudang Pusat'}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 -mr-2 text-muted-foreground hover:text-foreground lg:hidden"
          >
            <X size={20} />
          </button>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-0.5 overflow-y-auto scrollbar-thin">
          {finalNavItems.map((item) => {
            // For main loop, filter role rules if not already overridden above
            if (!isPrepare && !isAdminCabang && (item.path === '/purchasing' || item.path === '/peminjaman' || item.path === '/production-cost' || item.path === '/vendors') && !isSuperAdmin) {
              return null;
            }
            
            const Icon = item.icon;
            const isActive = location.pathname === item.path || 
              (item.path !== "/" && location.pathname.startsWith(item.path));
            
            const activeClass = isPrepare 
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30' 
              : isAdminCabang
              ? 'bg-[#88b04b] text-white shadow-lg shadow-[#88b04b]/30'
              : 'bg-primary text-primary-foreground shadow-lg shadow-primary/20';

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => onClose?.()}
                className={`
                  flex items-center gap-3 px-3 py-2 rounded-xl transition-all text-sm
                  ${isActive 
                    ? activeClass 
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }
                `}
              >
                <Icon className="w-5 h-5" />
                <span className="font-bold">{item.label}</span>
              </Link>
            );
          })}

          {isSuperAdmin && (
            <>
              <div className="px-4 py-1 mt-2 text-[10px] font-black text-muted-foreground uppercase tracking-widest border-t border-border/50 pt-2">
                Akses Super Admin
              </div>
              {adminItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path || 
                  (item.path !== "/" && location.pathname.startsWith(item.path));
                
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => onClose?.()}
                    className={`
                      flex items-center gap-3 px-3 py-2 rounded-xl transition-all text-sm
                      ${isActive 
                        ? 'bg-orange-500/10 text-orange-500 shadow-lg shadow-orange-500/20' 
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                      }
                    `}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </>
          )}
        </nav>
        
        {/* Footer */}
        <div className="p-4 border-t border-border">
          <div className="text-xs text-muted-foreground text-center">
            © 2026 RoboGudang
          </div>
        </div>
      </aside>
    </>
  );
}