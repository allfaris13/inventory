import { Link, useLocation } from "react-router";
import { 
  LayoutDashboard, 
  Package, 
  ArrowLeftRight, 
  Building2, 
  Wrench, 
  Map,
  X 
} from "lucide-react";

const navItems = [
  { path: "/dashboard", label: "Dasbor", icon: LayoutDashboard },
  { path: "/inventory", label: "Inventaris", icon: Package },
  { path: "/transactions", label: "Transaksi", icon: ArrowLeftRight },
  { path: "/vendors", label: "Vendor", icon: Building2 },
  { path: "/maintenance", label: "Pemeliharaan", icon: Wrench },
  { path: "/warehouse-map", label: "Peta Gudang", icon: Map },
];

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const location = useLocation();
  
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