// React import removed
import { Search, Bell, User } from 'lucide-react';
import './TopBar.css';

export function TopBar() {
  return (
    <header className="topbar glass-panel">
      <div className="search-container">
        <Search className="search-icon" size={20} />
        <input 
          type="text" 
          placeholder="SEARCH INVENTORY OR SERIAL NUMBER..." 
          className="search-input"
        />
      </div>
      
      <div className="topbar-actions">
        <button className="icon-btn">
          <Bell size={20} />
          <span className="badge">3</span>
        </button>
        <button className="profile-btn">
          <div className="avatar">
            <User size={20} />
          </div>
          <div className="profile-info">
            <span className="name">SYS_ADMIN</span>
            <span className="role">Level 4 Access</span>
          </div>
        </button>
      </div>
    </header>
  );
}
