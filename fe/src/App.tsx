import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './app/context/ThemeContext';
import { RootLayout } from './app/components/layout/RootLayout';
import { Dashboard } from './app/page/Dashboard';
import { Inventory } from './app/page/Inventory';
import { ComponentDetail } from './app/page/ComponentDetail';
import { MaintenanceDetail } from './app/page/MaintenanceDetail';
import { RescheduleMaintenance } from './app/page/RescheduleMaintenance';
import { Maintenance } from './app/page/Maintenance';
import { Transactions } from './app/page/Transactions';
import { Vendors } from './app/page/Vendors';
import { WarehouseMap } from './app/page/WarehouseMap';
import { SystemPreferences } from './app/components/profile/SystemPreferences';
import { ProfileSettings } from './app/components/profile/ProfileSettings';

import { LoginPanel } from './app/components/login/LoginPanel';

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPanel />} />
          <Route path="/" element={<RootLayout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="inventory" element={<Inventory />} />
            <Route path="inventory/:id" element={<ComponentDetail />} />
            <Route path="maintenance" element={<Maintenance />} />
            <Route path="maintenance/:id" element={<MaintenanceDetail />} />
            <Route path="maintenance/reschedule/:id" element={<RescheduleMaintenance />} />
            <Route path="transactions" element={<Transactions />} />
            <Route path="vendors" element={<Vendors />} />
            <Route path="warehouse-map" element={<WarehouseMap />} />
            <Route path="system-preferences" element={<SystemPreferences />} />
            <Route path="profile-settings" element={<ProfileSettings />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}