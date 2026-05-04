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
  Truck,
  Users
} from "lucide-react";

const navItems = [
  { path: "/dashboard", label: "Dasbor", icon: LayoutDashboard },
  { path: "/inventory", label: "Inventaris", icon: Package },
  { path: "/purchasing", label: "Purchasing", icon: ShoppingBag },
  { path: "/transactions", label: "Transaksi", icon: ArrowLeftRight },
  { path: "/peminjaman", label: "Peminjaman", icon: Building2 }, // Building2 remains as a solid icon choice
  { path: "/maintenance", label: "Pemeliharaan", icon: Wrench },
  { path: "/production-cost", label: "Biaya Produksi", icon: DollarSign },
  { path: "/warehouse-map", label: "Peta Gudang", icon: Map },
  { path: "/distribution", label: "Distribusi", icon: Truck },
];

const adminItems = [
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
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
              <Package className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-foreground">RoboGudang</h1>
              <p className="text-xs text-muted-foreground">Sistem Inventaris</p>
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
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            // Hide Purchasing and Peminjaman for non-super_admins
            if ((item.path === '/purchasing' || item.path === '/peminjaman') && !isSuperAdmin) {
              return null;
            }
            
            const Icon = item.icon;
            const isActive = location.pathname === item.path || 
              (item.path !== "/" && location.pathname.startsWith(item.path));
            
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => onClose?.()}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg transition-all
                  ${isActive 
                    ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' 
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }
                `}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}

          {isSuperAdmin && (
            <>
              <div className="px-4 py-2 mt-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">
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
                      flex items-center gap-3 px-4 py-3 rounded-lg transition-all
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