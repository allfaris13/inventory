import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ThemeProvider } from './app/context/ThemeContext';
import { RootLayout } from './app/components/layout/RootLayout';
import { Dashboard as DashboardPusat } from './app/pages/pusat/Dashboard';
import { DashboardCabang } from './app/pages/cabang/DashboardCabang';
import { Inventory } from './app/pages/shared/Inventory';
import { ComponentDetail } from './app/page/ComponentDetail';
import { MaintenanceDetail } from './app/page/MaintenanceDetail';
import { RescheduleMaintenance } from './app/page/RescheduleMaintenance';
import { Maintenance } from './app/page/Maintenance';
import { Transactions } from './app/page/Transactions';
import { Peminjaman } from './app/page/Peminjaman';
import { PinjamForm } from './app/page/PinjamForm';
import { WarehouseMap } from './app/page/WarehouseMap';
import { ProfileSettings } from './app/components/profile/ProfileSettings';
import { RobotHPP } from './app/page/RobotHPP';
import { Purchasing } from './app/page/Purchasing';
import { ManajemenCabang } from './app/pages/pusat/ManajemenCabang';
import { AuditTrail } from './app/page/AuditTrail';
import { Distribution } from './app/pages/shared/Distribution';

import { LoginPanel } from './app/components/login/LoginPanel';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('user'));
  
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const isSuperAdmin = user?.role === 'super_admin' || user?.email === 'admin@robogudang.com';

  // Listen for storage changes (optional, but good for multi-tab)
  useEffect(() => {
    const handleStorageChange = () => {
      setIsAuthenticated(!!localStorage.getItem('user'));
    };
    window.addEventListener('storage', handleStorageChange);
    
    // Check every time this component mounts or navigates
    // (Simple way to sync since we're not using a full auth provider yet)
    const interval = setInterval(handleStorageChange, 1000);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={!isAuthenticated ? <LoginPanel /> : <Navigate to="/dashboard" replace />} />
          
          <Route path="/" element={isAuthenticated ? <RootLayout /> : <Navigate to="/login" replace />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={isSuperAdmin ? <DashboardPusat /> : <DashboardCabang />} />
            <Route path="inventory" element={<Inventory />} />
            <Route path="inventory/:id" element={<ComponentDetail />} />
            <Route path="maintenance" element={<Maintenance />} />
            <Route path="maintenance/:id" element={<MaintenanceDetail />} />
            <Route path="maintenance/reschedule/:id" element={<RescheduleMaintenance />} />
            <Route path="transactions" element={<Transactions />} />
            <Route path="peminjaman" element={<Peminjaman />} />
            <Route path="warehouse-map" element={<WarehouseMap />} />
            <Route path="production-cost" element={<RobotHPP />} />
            <Route path="purchasing" element={<Purchasing />} />
            <Route path="profile-settings" element={<ProfileSettings />} />
            <Route path="manajemen-cabang" element={<ManajemenCabang />} />
            <Route path="audit-log" element={<AuditTrail />} />
            <Route path="distribution" element={<Distribution />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Route>

          {/* Public Route for Schools */}
          <Route path="/pinjam" element={<PinjamForm />} />

          {/* Fallback jika path ngaco */}
          <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}