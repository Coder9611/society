import React from 'react';
import { Search, Bell, HelpCircle } from 'lucide-react';
import './TopNav.css';

const TopNav = () => {
  return (
    <header className="topnav">
      <div className="search-bar">
        <Search size={16} />
        <input type="text" placeholder="Search locality..." />
      </div>
      <div className="topnav-actions">
        <button className="icon-btn"><Bell size={18} /></button>
        <button className="icon-btn"><HelpCircle size={18} /></button>
        <div className="avatar">
          <img src="https://i.pravatar.cc/100?img=11" alt="Avatar" />
        </div>
      </div>
    </header>
  );
};

export default TopNav;
