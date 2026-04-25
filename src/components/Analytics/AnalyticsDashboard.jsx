import React, { useMemo } from 'react';
import { usePolis, CATEGORY_META, STATUS_COLORS } from '../../store/PolisState';
import { Target, TrendingUp, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import './AnalyticsDashboard.css';

export default function AnalyticsDashboard() {
  const { rawIssues: issues, metrics } = usePolis();

  // Metrics
  const byCategory = useMemo(() => {
    return issues.reduce((acc, i) => {
      acc[i.category] = (acc[i.category] || 0) + 1;
      return acc;
    }, {});
  }, [issues]);

  const byStatus = useMemo(() => {
    return issues.reduce((acc, i) => {
      acc[i.status] = (acc[i.status] || 0) + 1;
      return acc;
    }, {});
  }, [issues]);

  const topIssues = useMemo(() => {
    return [...issues].sort((a, b) => b.upvotes - a.upvotes).slice(0, 3);
  }, [issues]);

  return (
    <div className="analytics-dashboard">
      <div className="analytics-header">
        <h1 className="analytics-title">Society Analytics Engine</h1>
        <p className="analytics-subtitle">Real-time civic telemetry for Divya Apt</p>
      </div>

      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon"><Target size={20} /></div>
          <div className="metric-data">
            <h3>Total Reports</h3>
            <p className="metric-value">{metrics.total}</p>
          </div>
        </div>
        <div className="metric-card">
          <div className="metric-icon" style={{color: '#22c55e', background: '#22c55e20'}}><CheckCircle size={20} /></div>
          <div className="metric-data">
            <h3>Resolution Rate</h3>
            <p className="metric-value">{metrics.rate}%</p>
          </div>
        </div>
        <div className="metric-card">
          <div className="metric-icon" style={{color: '#f97316', background: '#f9731620'}}><AlertTriangle size={20} /></div>
          <div className="metric-data">
            <h3>Dominant Issue</h3>
            <p className="metric-value" style={{fontSize: '18px', lineHeight: '32px'}}>{CATEGORY_META[metrics.dominantCategory]?.label || '—'}</p>
          </div>
        </div>
        <div className="metric-card">
          <div className="metric-icon" style={{color: '#3b82f6', background: '#3b82f620'}}><TrendingUp size={20} /></div>
          <div className="metric-data">
            <h3>Hotzone</h3>
            <p className="metric-value" style={{fontSize: '18px', lineHeight: '32px'}}>{metrics.hotzone}</p>
          </div>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-panel">
          <h2>Category Breakdown</h2>
          <div className="pie-container">
            {Object.keys(CATEGORY_META).map((cat) => {
              const meta = CATEGORY_META[cat];
              const count = byCategory[cat] || 0;
              const percent = metrics.total > 0 ? (count / metrics.total) * 100 : 0;
              
              if (count === 0) return null;
              
              return (
                <div key={cat} className="bar-row">
                  <div className="bar-label">
                    <span>{meta.emoji} {meta.label}</span>
                    <span>{count}</span>
                  </div>
                  <div className="bar-track">
                    <div 
                      className="bar-fill" 
                      style={{ width: `${percent}%`, background: meta.color }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="chart-panel">
          <h2>Resolution Status</h2>
          <div className="pie-container">
             {['New', 'In Progress', 'Resolved'].map((status) => {
              const count = byStatus[status] || 0;
              const percent = metrics.total > 0 ? (count / metrics.total) * 100 : 0;
              const color = STATUS_COLORS[status];
              
              return (
                <div key={status} className="bar-row">
                  <div className="bar-label">
                    <span>{status === 'New' ? 'Pending' : status}</span>
                    <span>{count}</span>
                  </div>
                  <div className="bar-track">
                    <div 
                      className="bar-fill" 
                      style={{ width: `${percent}%`, background: color }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="chart-panel" style={{gridColumn: '1 / -1'}}>
          <h2>Top Upvoted Issues</h2>
          <div className="top-issues-list">
            {topIssues.map(issue => (
              <div key={issue.id} className="top-issue-item">
                <div className="top-issue-votes">
                  <span>▲ {issue.upvotes}</span>
                </div>
                <div className="top-issue-details">
                  <h4 className="top-issue-title">{issue.title}</h4>
                  <p className="top-issue-zone">{issue.zone}</p>
                </div>
                <div className="top-issue-status" style={{background: `${STATUS_COLORS[issue.status]}20`, color: STATUS_COLORS[issue.status]}}>
                  {issue.status}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
