import React from 'react';
import { usePolis } from '../../store/PolisState';

const KanbanWidget = () => {
  const { issues } = usePolis();

  return (
    <div style={{display: 'flex', flexDirection: 'column', height: '100%'}}>
      <div style={{padding: '24px 24px 16px', borderBottom: '1px solid var(--border-subtle)', background: 'rgba(0,0,0,0.2)'}}>
        <h2 style={{fontSize: 14, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase'}}>Live Intel Feed</h2>
      </div>
      
      <div style={{flex: 1, overflowY: 'auto', padding: 24, display: 'flex', flexDirection: 'column', gap: 16}}>
        {issues.map(issue => (
          <div key={issue.id} style={{
            background: 'var(--bg-panel)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 16,
            padding: 16,
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            transition: 'transform 0.2s'
          }}>
            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 8}}>
              <span style={{fontSize: 10, color: 'var(--accent-cyan)', textTransform: 'uppercase', letterSpacing: 1, border: '1px solid var(--accent-cyan)', padding: '2px 6px', borderRadius: 4}}>{issue.category}</span>
              <span style={{fontSize: 11, color: 'var(--text-muted)'}}>{issue.status}</span>
            </div>
            <h3 style={{fontSize: 14, marginBottom: 8}}>{issue.title}</h3>
            <p style={{fontSize: 12, color: 'var(--text-secondary)', marginBottom: 12}}>{issue.description}</p>
            <div style={{display: 'flex', gap: 12, fontSize: 11, color: 'var(--text-secondary)', alignItems: 'center'}}>
              <div style={{background: 'rgba(255,255,255,0.05)', padding: '4px 8px', borderRadius: 4}}>{issue.upvotes} UPVOTES</div>
              {issue.verified && <div style={{color: 'var(--accent-neon)'}}>VERIFIED</div>}
            </div>
          </div>
        ))}
      </div>
      
      <style>{`
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: var(--border-subtle); border-radius: 4px; }
      `}</style>
    </div>
  );
};

export default KanbanWidget;
