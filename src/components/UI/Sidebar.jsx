import React from 'react';
import { Building2, LayoutDashboard, Map, FileText, Users, Plus, Settings } from 'lucide-react';
import './Sidebar.css';

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <Building2 size={24} />
        <h2>Project Polis</h2>
      </div>

      <div className="sidebar-profile">
        <div className="profile-icon">
          <Building2 size={16} color="white" />
        </div>
        <div className="profile-text">
          <span className="name">Civic Admin</span>
          <span className="role">City Council</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <a href="#" className="nav-item">
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </a>
        <a href="#" className="nav-item active">
          <Map size={20} />
          <span>Map View</span>
        </a>
        <a href="#" className="nav-item">
          <FileText size={20} />
          <span>Reports</span>
        </a>
        <a href="#" className="nav-item">
          <Users size={20} />
          <span>Community</span>
        </a>
      </nav>

      <div className="sidebar-footer">
        <button className="btn-new-report">
          <Plus size={16} />
          <span>New Report</span>
        </button>
        <button className="btn-settings">
          <Settings size={20} />
          <span>Settings</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
