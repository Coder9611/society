import React, { createContext, useContext, useState, useMemo } from 'react';

const PolisContext = createContext();

// Divya Apartment, Triveni Nagar, Malad East, Mumbai
export const SOCIETY_CENTER = { lat: 19.1817042, lng: 72.8638453 };

// Status → color mapping per PS-03 spec
export const STATUS_COLORS = {
  'New':         '#ef4444', // Red  - problem pending
  'In Progress': '#3b82f6', // Blue - ongoing
  'Resolved':    '#22c55e', // Green - complete
};

export const CATEGORY_META = {
  infrastructure: { color: '#f97316', label: 'Infrastructure', emoji: '🔧' },
  sanitation:     { color: '#3b82f6', label: 'Sanitation',     emoji: '🗑️' },
  safety:         { color: '#ef4444', label: 'Safety',         emoji: '🛡️' },
  greenery:       { color: '#22c55e', label: 'Greenery',       emoji: '🌿' },
};

const initialIssues = [
  {
    id: 'issue-1',
    lat: 19.181950, lng: 72.863700,
    category: 'infrastructure',
    status: 'New',
    upvotes: 47,
    title: 'Potholes at Society Gate',
    description: 'Deep potholes right outside the Divya Apartment entrance causing vehicle damage.',
    date: '2026-04-20',
    verified: false,
    zone: 'Divya Apt Gate',
  },
  {
    id: 'issue-2',
    lat: 19.182100, lng: 72.864100,
    category: 'sanitation',
    status: 'In Progress',
    upvotes: 32,
    title: 'Overflowing Bins near Tadiwala Rd',
    description: 'Garbage bins at the corner of Tadiwala Rd haven\'t been cleared for 2 days.',
    date: '2026-04-22',
    verified: true,
    zone: 'Tadiwala Rd',
  },
  {
    id: 'issue-3',
    lat: 19.181200, lng: 72.863400,
    category: 'safety',
    status: 'Resolved',
    upvotes: 89,
    title: 'Broken Streetlight',
    description: 'Streetlight overlooking the parked vehicles was fixed yesterday.',
    date: '2026-04-18',
    verified: true,
    zone: 'Parking Zone',
  },
  {
    id: 'issue-4',
    lat: 19.181400, lng: 72.862900,
    category: 'greenery',
    status: 'New',
    upvotes: 24,
    title: 'Overgrown Branches near Alta Monte',
    description: 'Branches reaching into the pathway block pedestrians near Alta Monte wall.',
    date: '2026-04-24',
    verified: false,
    zone: 'Alta Monte Wall',
  },
  {
    id: 'issue-5',
    lat: 19.181800, lng: 72.863100,
    category: 'infrastructure',
    status: 'In Progress',
    upvotes: 61,
    title: 'Leaking Pipeline',
    description: 'Main water pipeline showing signs of leakage near Neelam Apartment.',
    date: '2026-04-21',
    verified: false,
    zone: 'Neelam Apt',
  },
  {
    id: 'issue-6',
    lat: 19.182300, lng: 72.863300,
    category: 'safety',
    status: 'New',
    upvotes: 18,
    title: 'Stray Dog Menace',
    description: 'Aggressive strays reported near the children\'s play area.',
    date: '2026-04-23',
    verified: false,
    zone: 'Play Area',
  }
];

export const PolisProvider = ({ children }) => {
  const [issues, setIssues] = useState(initialIssues);
  const [viewMode, setViewMode] = useState('map'); // 'map' | 'kanban' | 'analytics'
  const [filters, setFilters] = useState({ category: null });
  const [upvotedIssues, setUpvotedIssues] = useState(new Set()); // Track local upvotes

  const addIssue = (issue) => {
    setIssues(prev => [
      ...prev,
      {
        ...issue,
        id: `issue-${Date.now()}`,
        status: 'New',
        upvotes: 1,
        date: new Date().toISOString().split('T')[0],
        verified: false,
        zone: 'Custom Pin',
      }
    ]);
  };

  const updateIssueStatus = (id, newStatus) => {
    setIssues(prev =>
      prev.map(issue => issue.id === id ? { ...issue, status: newStatus } : issue)
    );
  };

  const upvoteIssue = (id) => {
    if (upvotedIssues.has(id)) {
      // User is removing their upvote
      setUpvotedIssues(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      setIssues(prev =>
        prev.map(issue => issue.id === id ? { ...issue, upvotes: issue.upvotes - 1 } : issue)
      );
    } else {
      // User is adding their upvote
      setUpvotedIssues(prev => new Set(prev).add(id));
      setIssues(prev =>
        prev.map(issue => issue.id === id ? { ...issue, upvotes: issue.upvotes + 1 } : issue)
      );
    }
  };

  const metrics = useMemo(() => {
    const total = issues.length;
    const resolved = issues.filter(i => i.status === 'Resolved').length;
    const rate = total === 0 ? 0 : Math.round((resolved / total) * 100);

    const countByCategory = issues.reduce((acc, i) => {
      acc[i.category] = (acc[i.category] || 0) + 1;
      return acc;
    }, {});

    let dominantCategory = 'None';
    let max = 0;
    Object.entries(countByCategory).forEach(([cat, val]) => {
      if (val > max) { max = val; dominantCategory = cat; }
    });

    // Find hotzone by zone name with most issues
    const countByZone = issues.reduce((acc, i) => {
      acc[i.zone] = (acc[i.zone] || 0) + 1;
      return acc;
    }, {});
    let hotzone = 'N/A';
    let zoneMax = 0;
    Object.entries(countByZone).forEach(([zone, cnt]) => {
      if (cnt > zoneMax) { zoneMax = cnt; hotzone = zone; }
    });

    return { total, resolved, rate, dominantCategory, hotzone };
  }, [issues]);

  const filteredIssues = useMemo(() => {
    if (filters.category) {
      return issues.filter(i => i.category === filters.category);
    }
    return issues;
  }, [issues, filters]);

  const value = {
    issues: filteredIssues,
    rawIssues: issues,
    upvotedIssues,
    viewMode,
    setViewMode,
    filters,
    setFilters,
    addIssue,
    updateIssueStatus,
    upvoteIssue,
    metrics,
  };

  return (
    <PolisContext.Provider value={value}>
      {children}
    </PolisContext.Provider>
  );
};

export const usePolis = () => useContext(PolisContext);
