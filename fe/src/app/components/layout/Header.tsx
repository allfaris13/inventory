import { Bell, User, Sun, Moon } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Badge } from "../ui/badge";

const notifications = [
  { id: 1, type: "alert", message: "Stok rendah: Sensor Lidar LDR-500", time: "5 menit lalu" },
  { id: 2, type: "alert", message: "Kritis: Motor Servo SM-200 di bawah ambang batas", time: "12 menit lalu" },
  { id: 3, type: "info", message: "Pengiriman masuk tiba besok", time: "1 jam lalu" },
  { id: 4, type: "success", message: "Pemeliharaan selesai untuk Zona A", time: "2 jam lalu" },
];

export function Header() {
  const [notificationCount] = useState(notifications.length);
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="h-16 bg-card border-b border-border px-6 flex items-center justify-between shadow-sm transition-colors">
      <div className="flex items-center gap-4">
        <div>
          <p className="text-xs text-muted-foreground">Selamat datang kembali,</p>
          <h2 className="text-sm font-semibold text-foreground">Operasional Gudang</h2>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        {/* Theme Toggle */}
        <button 
          onClick={toggleTheme}
          className="p-2 hover:bg-muted rounded-lg transition-colors text-foreground"
          title={theme === 'dark' ? 'Ganti ke Mode Terang' : 'Ganti ke Mode Gelap'}
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        {/* Notifications Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="relative p-2 hover:bg-muted rounded-lg transition-colors">
              <Bell className="w-5 h-5 text-foreground" />
              {notificationCount > 0 && (
                <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center bg-destructive text-destructive-foreground text-[10px] font-bold">
                  {notificationCount}
                </Badge>
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 bg-card border-border text-foreground">
            <div className="p-3 border-b border-border">
              <h3 className="font-semibold">Notifikasi</h3>
            </div>
            <div className="max-h-96 overflow-auto">
              {notifications.map((notif) => (
                <DropdownMenuItem key={notif.id} className="p-3 flex flex-col items-start gap-1 cursor-pointer hover:bg-muted font-medium">
                  <p className="text-sm">{notif.message}</p>
                  <span className="text-xs text-muted-foreground">{notif.time}</span>
                </DropdownMenuItem>
              ))}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Profile */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-3 p-2 hover:bg-muted rounded-lg transition-colors">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <User className="w-4 h-4 text-primary-foreground" />
              </div>
              <div className="text-left hidden md:block">
                <p className="text-sm font-medium text-foreground">Sarah Mitchell</p>
                <p className="text-xs text-muted-foreground">Manajer Gudang</p>
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 bg-card border-border text-foreground">
            <DropdownMenuItem asChild className="cursor-pointer hover:bg-muted">
              <Link to="/profile-settings" className="w-full">Pengaturan Profil</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="cursor-pointer hover:bg-muted">
              <Link to="/system-preferences" className="w-full">Preferensi Sistem</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="cursor-pointer text-destructive hover:bg-destructive/10">
              <Link to="/login" className="w-full">Keluar</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}