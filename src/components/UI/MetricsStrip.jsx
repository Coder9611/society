import React from 'react';
import { usePolis } from '../../store/PolisState';
import { Map, LayoutGrid } from 'lucide-react';
import './MetricsStrip.css';

const MetricsStrip = () => {
  const { viewMode, setViewMode, metrics } = usePolis();

  return (
    <div className="metrics-strip">
      <div className="metrics-container">
        <div className="metric-box">
          <span className="metric-label">TOTAL ISSUES</span>
          <span className="metric-val">{metrics.total}</span>
        </div>
        <div className="metric-divider"></div>
        <div className="metric-box">
          <span className="metric-label">RESOLUTION RATE</span>
          <span className="metric-val">{metrics.rate}% <span className="trend-up">~</span></span>
        </div>
        <div className="metric-divider"></div>
        <div className="metric-box">
          <span className="metric-label">HOTSPOT</span>
          <span className="metric-val-small">Market Zone</span>
        </div>
        <div className="metric-divider"></div>
        <div className="metric-box">
          <span className="metric-label">TOP NEED</span>
          <span className="metric-val-small need-cat"><span className="cat-dot"></span><span style={{textTransform: 'capitalize'}}>{metrics.dominantCategory}</span></span>
        </div>
      </div>

      <div className="view-toggle-pills">
        <button 
          className={`pill-btn ${viewMode === 'map' ? 'active' : ''}`}
          onClick={() => setViewMode('map')}
        >
          <Map size={16} />
          Map
        </button>
        <button 
          className={`pill-btn ${viewMode === 'kanban' ? 'active' : ''}`}
          onClick={() => setViewMode('kanban')}
        >
          <LayoutGrid size={16} />
          Board
        </button>
      </div>
    </div>
  );
};

export default MetricsStrip;
