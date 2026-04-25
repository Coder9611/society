import React from 'react';
import { usePolis, CATEGORY_META, STATUS_COLORS } from './store/PolisState';
import MapView from './components/Map/MapView.jsx';
import KanbanBoard from './components/Kanban/KanbanBoard.jsx';
import AnalyticsDashboard from './components/Analytics/AnalyticsDashboard.jsx';
import { MapPin, LayoutGrid, Target, Zap, BarChart3, Shield } from 'lucide-react';
import './index.css';

const NAV_ITEMS = [
  { icon: Target,     label: 'Spatial Map', key: 'map' },
  { icon: LayoutGrid, label: 'Kanban Board', key: 'kanban' },
  { icon: BarChart3,  label: 'Analytics',   key: 'analytics' },
];

export default function App() {
  const { metrics, viewMode, setViewMode } = usePolis();

  return (
    <div className="polis-app">

      {/* ── TOP BAR ───────────────────────────────────────────── */}
      <header className="topbar">
        {/* Brand */}
        <div className="brand">
          <div className="brand-dot"></div>
          <div>
            <div className="brand-name">Project Polis</div>
            <div className="brand-sub">Divya Apt // Society OS</div>
          </div>
        </div>

        {/* Metrics Strip */}
        <div className="metrics-row">
          <div className="metric-chip">
            <span className="metric-chip-label">Total</span>
            <span className="metric-chip-val blue">{metrics.total}</span>
          </div>
          <div className="metric-chip">
            <span className="metric-chip-label">Resolved</span>
            <span className="metric-chip-val green">{metrics.resolved}</span>
          </div>
          <div className="metric-chip">
            <span className="metric-chip-label">Rate</span>
            <span className="metric-chip-val green">{metrics.rate}%</span>
          </div>
          <div className="metric-chip">
            <span className="metric-chip-label">Hotzone</span>
            <span className="metric-chip-val orange" style={{fontSize: 12}}>{metrics.hotzone}</span>
          </div>
          <div className="metric-chip">
            <span className="metric-chip-label">Top Need</span>
            <span className="metric-chip-val" style={{fontSize: 12, color: CATEGORY_META[metrics.dominantCategory]?.color}}>
              {CATEGORY_META[metrics.dominantCategory]?.label || '—'}
            </span>
          </div>
        </div>

        {/* View Toggle */}
        <div className="view-toggle">
          <button
            className={`toggle-btn ${viewMode === 'map' ? 'active' : ''}`}
            onClick={() => setViewMode('map')}
          >
            <MapPin size={14} /> Map
          </button>
          <button
            className={`toggle-btn ${viewMode === 'kanban' ? 'active' : ''}`}
            onClick={() => setViewMode('kanban')}
          >
            <LayoutGrid size={14} /> Board
          </button>
        </div>
      </header>

      {/* ── SIDEBAR ───────────────────────────────────────────── */}
      <aside className="sidebar">
        <div className="sidebar-section-label">Navigation</div>
        {NAV_ITEMS.map(({ icon: Icon, label, key }) => (
          <button
            key={key}
            className={`nav-item ${viewMode === key ? 'active' : ''}`}
            onClick={() => setViewMode(key)}
          >
            <Icon size={16} className="nav-icon" />
            {label}
          </button>
        ))}

        {/* Category Legend */}
        <div className="legend-section">
          <div className="sidebar-section-label" style={{marginTop: 16}}>Category Key</div>
          {Object.entries(CATEGORY_META).map(([key, { color, label, emoji }]) => (
            <div key={key} className="legend-item">
              <div className="legend-dot" style={{ background: color, boxShadow: `0 0 6px ${color}` }}></div>
              <span className="legend-label">{emoji} {label}</span>
            </div>
          ))}

          {/* Status Legend */}
          <div className="sidebar-section-label" style={{marginTop: 16}}>Status Key</div>
          {Object.entries(STATUS_COLORS).map(([status, color]) => (
            <div key={status} className="status-bar">
              <span className="status-badge" style={{ color, borderColor: color }}>
                <span style={{width: 5, height: 5, borderRadius: '50%', background: color, display: 'inline-block'}}></span>
                {status === 'New' ? 'PENDING' : status === 'In Progress' ? 'ONGOING' : 'DONE'}
              </span>
              <span className="status-label">{status}</span>
            </div>
          ))}
        </div>

        {/* Quick Action */}
        <button className="btn-report" onClick={() => setViewMode('map')}>
          <Zap size={14} /> File Report
        </button>
      </aside>

      {/* ── MAIN CONTENT ──────────────────────────────────────── */}
      {viewMode === 'map' ? (
        <>
          <div className="map-panel">
            <MapView />
          </div>
          <aside className="kanban-panel">
            <KanbanBoard compact />
          </aside>
        </>
      ) : viewMode === 'analytics' ? (
        <div style={{gridColumn: '2 / 4', gridRow: 2, overflow: 'hidden', borderRadius: 'var(--radius-lg)'}}>
          <AnalyticsDashboard />
        </div>
      ) : (
        <div style={{gridColumn: '2 / 4', gridRow: 2, overflow: 'hidden', borderRadius: 'var(--radius-lg)'}}>
          <KanbanBoard fullscreen />
        </div>
      )}
    </div>
  );
}
