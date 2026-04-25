import React from 'react';
import { usePolis, STATUS_COLORS, CATEGORY_META } from '../../store/PolisState';
import { DndContext, useDraggable, useDroppable, closestCorners } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { ChevronUp, ShieldCheck, GripVertical, Layers } from 'lucide-react';
import './KanbanBoard.css';

const COLUMNS = [
  { id: 'New',         label: 'Pending',     statusKey: 'New' },
  { id: 'In Progress', label: 'In Progress',  statusKey: 'In Progress' },
  { id: 'Resolved',    label: 'Resolved',     statusKey: 'Resolved' },
];

/* ── Draggable Issue Card ── */
const IssueCard = ({ issue }) => {
  const { upvoteIssue, upvotedIssues } = usePolis();
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: issue.id,
    data: { issue },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 999 : 1,
  };

  const statusColor = STATUS_COLORS[issue.status];
  const catMeta = CATEGORY_META[issue.category];
  const isUpvoted = upvotedIssues?.has(issue.id);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`issue-card ${isDragging ? 'is-dragging' : ''}`}
    >
      {/* Left status stripe */}
      <div className="card-stripe" style={{ background: statusColor }}></div>

      {/* Drag handle */}
      <div className="drag-handle" {...listeners} {...attributes}>
        <GripVertical size={14} />
      </div>

      <div className="card-body">
        <div className="card-top-row">
          <span className="cat-badge" style={{ color: catMeta.color, borderColor: `${catMeta.color}40` }}>
            {catMeta.emoji} {catMeta.label}
          </span>
          <span className="card-zone">{issue.zone}</span>
        </div>

        <h3 className="card-title">{issue.title}</h3>
        <p className="card-desc">{issue.description}</p>

        <div className="card-bottom-row">
          <button
            className="upvote-btn"
            onPointerDown={e => e.stopPropagation()}
            onClick={() => upvoteIssue(issue.id)}
            style={isUpvoted ? { background: '#2563eb', color: '#ffffff', borderColor: '#2563eb' } : {}}
          >
            <ChevronUp size={12} /> {issue.upvotes}
          </button>

          {issue.verified && (
            <span className="verified-chip">
              <ShieldCheck size={11} /> Verified
            </span>
          )}

          <span className="card-date">{issue.date}</span>
        </div>
      </div>
    </div>
  );
};

/* ── Droppable Column ── */
const KanbanColumn = ({ column, issues }) => {
  const { setNodeRef, isOver } = useDroppable({ id: column.id });
  const statusColor = STATUS_COLORS[column.statusKey];

  const sortedIssues = [...issues].sort((a, b) => b.upvotes - a.upvotes);

  return (
    <div ref={setNodeRef} className={`kanban-col ${isOver ? 'col-over' : ''}`}>
      <div className="col-header">
        <div className="col-title-row">
          <span className="col-status-dot" style={{ background: statusColor, boxShadow: `0 0 8px ${statusColor}` }}></span>
          <h2 className="col-title">{column.label}</h2>
        </div>
        <span className="col-count" style={{ background: `${statusColor}20`, color: statusColor, border: `1px solid ${statusColor}40` }}>
          {issues.length}
        </span>
      </div>

      <div className="col-cards">
        {sortedIssues.map(issue => (
          <IssueCard key={issue.id} issue={issue} />
        ))}
        {issues.length === 0 && (
          <div className="col-empty">No issues here</div>
        )}
      </div>
    </div>
  );
};

/* ── Kanban Board (supports compact + fullscreen modes) ── */
const KanbanBoard = ({ compact, fullscreen }) => {
  const { issues, updateIssueStatus, metrics } = usePolis();

  const handleDragEnd = ({ active, over }) => {
    if (over && active.id && over.id) {
      const issue = active.data.current?.issue;
      if (issue && issue.status !== over.id) {
        updateIssueStatus(active.id, over.id);
      }
    }
  };

  const grouped = COLUMNS.reduce((acc, col) => {
    acc[col.id] = issues.filter(i => i.status === col.id);
    return acc;
  }, {});

  return (
    <DndContext collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
      <div className={`kanban-board ${compact ? 'compact' : ''} ${fullscreen ? 'fullscreen' : ''}`}>
        {compact ? (
          /* ── Compact: single scrollable column, all issues ── */
          <div className="compact-feed">
            <div className="compact-header">
              <Layers size={14} style={{ color: 'var(--col-progress)' }} />
              <span>Issue Feed</span>
              <span className="compact-total">{metrics.total} total</span>
            </div>
            <div className="compact-cards">
              {[...issues]
                .sort((a, b) => b.upvotes - a.upvotes)
                .map(issue => <IssueCard key={issue.id} issue={issue} />)
              }
            </div>
          </div>
        ) : (
          /* ── Full: three columns ── */
          <div className="kanban-cols-wrap">
            {COLUMNS.map(col => (
              <KanbanColumn key={col.id} column={col} issues={grouped[col.id]} />
            ))}
          </div>
        )}
      </div>
    </DndContext>
  );
};

export default KanbanBoard;
