import React from 'react';
import { Target, Grid, Activity, BarChart2, Shield } from 'lucide-react';

const SidebarWidget = () => {
  return (
    <div style={{display: 'flex', flexDirection: 'column', gap: 32, height: '100%'}}>
      <div style={{color: 'var(--text-secondary)', fontSize: 11, letterSpacing: 2}}>MODULES</div>
      
      <nav style={{display: 'flex', flexDirection: 'column', gap: 16}}>
        <a href="#" className="nav-btn active">
          <Target size={18} /> Spatial Map
        </a>
        <a href="#" className="nav-btn">
          <Grid size={18} /> Data Grid
        </a>
        <a href="#" className="nav-btn">
          <Activity size={18} /> Pulse Feed
        </a>
        <a href="#" className="nav-btn">
          <BarChart2 size={18} /> Analytics
        </a>
      </nav>

      <div style={{marginTop: 'auto', background: 'rgba(255,255,255,0.02)', padding: 20, borderRadius: 16, border: '1px solid var(--border-subtle)'}}>
        <div style={{display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12}}>
          <Shield size={20} color="var(--accent-cyan)" />
          <span style={{fontSize: 13, fontWeight: 600}}>System Secure</span>
        </div>
        <div style={{fontSize: 11, color: 'var(--text-muted)'}}>All geospatial tracking units active and synched.</div>
      </div>
      
      <style>{`
        .nav-btn {
          display: flex;
          align-items: center;
          gap: 12px;
          text-decoration: none;
          color: var(--text-secondary);
          font-size: 14px;
          font-weight: 500;
          padding: 12px 16px;
          border-radius: 12px;
          transition: all 0.2s;
        }
        .nav-btn:hover {
          background: rgba(255,255,255,0.05);
          color: white;
        }
        .nav-btn.active {
          background: rgba(0, 240, 255, 0.1);
          color: var(--accent-cyan);
          border: 1px solid rgba(0, 240, 255, 0.2);
        }
      `}</style>
    </div>
  );
};

export default SidebarWidget;
