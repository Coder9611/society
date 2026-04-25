import React from 'react';
import { usePolis } from '../../store/PolisState';
import { Map, LayoutGrid, CheckCircle2, AlertTriangle } from 'lucide-react';
import './HUD.css';

const HUD = () => {
  const { viewMode, setViewMode, metrics } = usePolis();

  return (
    <header className="hud-header glass-panel">
      <div className="hud-logo">
        <div className="logo-orb"></div>
        <h1>POLIS</h1>
      </div>

      <div className="hud-metrics">
        <div className="metric">
          <AlertTriangle size={16} className="metric-icon highlight" />
          <div className="metric-text">
            <span>Total Issues</span>
            <strong>{metrics.total}</strong>
          </div>
        </div>
        <div className="metric">
          <CheckCircle2 size={16} className="metric-icon success" />
          <div className="metric-text">
            <span>Resolved</span>
            <strong>{metrics.resolved} ({metrics.rate}%)</strong>
          </div>
        </div>
        <div className="metric">
          <div className="metric-text">
            <span>Critical Zone</span>
            <strong style={{textTransform: 'capitalize'}}>{metrics.dominantCategory}</strong>
          </div>
        </div>
      </div>

      <div className="view-toggle">
        <button 
          className={`toggle-btn ${viewMode === 'map' ? 'active' : ''}`}
          onClick={() => setViewMode('map')}
        >
          <Map size={18} />
          <span>Map</span>
        </button>
        <button 
          className={`toggle-btn ${viewMode === 'kanban' ? 'active' : ''}`}
          onClick={() => setViewMode('kanban')}
        >
          <LayoutGrid size={18} />
          <span>Board</span>
        </button>
      </div>
    </header>
  );
};

export default HUD;
