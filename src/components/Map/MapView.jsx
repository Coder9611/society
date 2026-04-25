import React, { useState, useCallback, useEffect } from 'react';
import { APIProvider, Map, useMap } from '@vis.gl/react-google-maps';
import { usePolis, SOCIETY_CENTER, STATUS_COLORS, CATEGORY_META } from '../../store/PolisState';
import { X, ChevronUp, ShieldCheck, MapPin as PinIcon } from 'lucide-react';
import './MapView.css';

const GOOGLE_MAP_STYLE = [
  { elementType: 'geometry',           stylers: [{ color: '#0c0f18' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#0c0f18' }] },
  { elementType: 'labels.text.fill',   stylers: [{ color: '#4a5568' }] },
  { featureType: 'administrative.locality', elementType: 'labels.text.fill', stylers: [{ color: '#8892a4' }] },
  { featureType: 'poi',                elementType: 'labels',  stylers: [{ visibility: 'off' }] },
  { featureType: 'poi.park',           elementType: 'geometry', stylers: [{ color: '#111a24' }] },
  { featureType: 'road',               elementType: 'geometry', stylers: [{ color: '#1a2035' }] },
  { featureType: 'road',               elementType: 'geometry.stroke', stylers: [{ color: '#0c0f18' }] },
  { featureType: 'road',               elementType: 'labels.text.fill', stylers: [{ color: '#4a5568' }] },
  { featureType: 'road.highway',       elementType: 'geometry', stylers: [{ color: '#1e2a3a' }] },
  { featureType: 'road.highway',       elementType: 'geometry.stroke', stylers: [{ color: '#0c0f18' }] },
  { featureType: 'road.highway',       elementType: 'labels.text.fill', stylers: [{ color: '#6b7a8d' }] },
  { featureType: 'transit',            elementType: 'geometry', stylers: [{ color: '#0f1724' }] },
  { featureType: 'transit.station',    elementType: 'labels.text.fill', stylers: [{ color: '#d59563' }] },
  { featureType: 'water',              elementType: 'geometry', stylers: [{ color: '#071525' }] },
  { featureType: 'water',              elementType: 'labels.text.fill', stylers: [{ color: '#1f2d3d' }] },
  { featureType: 'landscape.man_made', elementType: 'geometry.fill', stylers: [{ color: '#0e111c' }] },
];

// Creates a custom SVG marker icon for a given status color
function makeMarkerIcon(statusColor, catEmoji) {
  const svg = `
<svg width="44" height="54" viewBox="0 0 44 54" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <filter id="glow">
      <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
      <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>
  <!-- Outer ring -->
  <circle cx="22" cy="22" r="19" fill="none" stroke="${statusColor}" stroke-width="1.5" opacity="0.4" filter="url(#glow)"/>
  <!-- Core circle -->
  <circle cx="22" cy="22" r="13" fill="#0c0f18" stroke="${statusColor}" stroke-width="2" filter="url(#glow)"/>
  <!-- Stem -->
  <line x1="22" y1="35" x2="22" y2="52" stroke="${statusColor}" stroke-width="2" stroke-linecap="round" opacity="0.7"/>
  <!-- Foot dot -->
  <circle cx="22" cy="52" r="2.5" fill="${statusColor}" opacity="0.5"/>
  <!-- Emoji text -->
  <text x="22" y="27" text-anchor="middle" font-size="14" dominant-baseline="middle">${catEmoji}</text>
</svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

// ── Manages all markers on the underlying map instance ── */
const MarkerLayer = ({ issues, onPinClick }) => {
  const map = useMap();

  useEffect(() => {
    if (!map || !window.google) return;

    const markers = issues.map(issue => {
      const statusColor = STATUS_COLORS[issue.status];
      const catMeta = CATEGORY_META[issue.category];
      const iconUrl = makeMarkerIcon(statusColor, catMeta.emoji);

      const marker = new window.google.maps.Marker({
        position: { lat: issue.lat, lng: issue.lng },
        map,
        title: issue.title,
        icon: {
          url: iconUrl,
          scaledSize: new window.google.maps.Size(44, 54),
          anchor: new window.google.maps.Point(22, 52),
        },
        optimized: false,
      });

      marker.addListener('click', () => onPinClick(issue));
      return marker;
    });

    return () => {
      markers.forEach(m => m.setMap(null));
    };
  }, [map, issues, onPinClick]);

  return null;
};

// ── Issue Info Popup (using React-rendered overlay) ── */
const IssuePopup = ({ issue, onClose, onUpvote }) => {
  const color = STATUS_COLORS[issue.status];
  const catMeta = CATEGORY_META[issue.category];

  // Use a custom floating div inside the map-container, not InfoWindow
  return (
    <div className="issue-popup-float animate-slide-up">
      <div className="popup-top">
        <div className="popup-cat" style={{ color: catMeta.color }}>
          {catMeta.emoji} {catMeta.label}
        </div>
        <div className="popup-status-badge" style={{ color, borderColor: color }}>
          ● {issue.status}
        </div>
        <button className="popup-close-btn" onClick={onClose}><X size={14}/></button>
      </div>
      <h3 className="popup-title">{issue.title}</h3>
      <p className="popup-zone">📍 {issue.zone}</p>
      <p className="popup-desc">{issue.description}</p>
      <div className="popup-footer">
        <button className="popup-upvote" onClick={() => onUpvote(issue.id)}>
          <ChevronUp size={13}/> {issue.upvotes} upvotes
        </button>
        {issue.verified && (
          <span className="popup-verified"><ShieldCheck size={11}/> Verified</span>
        )}
        <span className="popup-date">{issue.date}</span>
      </div>
    </div>
  );
};

// ── Pin Submission Form ── */
const SubmissionForm = ({ coords, onClose, onSubmit }) => {
  const [form, setForm] = useState({ title: '', description: '', category: 'infrastructure' });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div className="submission-overlay">
      <div className="submission-form animate-slide-up">
        <div className="form-topbar">
          <h3>📍 Report Issue</h3>
          <button className="form-close" onClick={onClose}><X size={16}/></button>
        </div>
        <p className="form-coords">
          {coords.lat.toFixed(5)}°N · {Math.abs(coords.lng).toFixed(5)}°E · Divya Apt
        </p>
        <form onSubmit={e => { e.preventDefault(); onSubmit({ ...form, lat: coords.lat, lng: coords.lng }); }}>
          <div className="form-field">
            <label>Title</label>
            <input required value={form.title} onChange={e => set('title', e.target.value)} placeholder="e.g. Waterlogging at Junction…"/>
          </div>
          <div className="form-field">
            <label>Category</label>
            <select value={form.category} onChange={e => set('category', e.target.value)}>
              {Object.entries(CATEGORY_META).map(([k, v]) => (
                <option key={k} value={k}>{v.emoji} {v.label}</option>
              ))}
            </select>
          </div>
          <div className="form-field">
            <label>Description</label>
            <textarea rows={3} value={form.description} onChange={e => set('description', e.target.value)} placeholder="Describe the civic issue…"/>
          </div>
          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-submit"><PinIcon size={14}/> Drop Pin</button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ── MapInner (has access to useMap) ── */
const MapInner = ({ issues, onPinClick }) => {
  return <MarkerLayer issues={issues} onPinClick={onPinClick} />;
};

// ── Main MapView ── */
const MapView = () => {
  const { issues, addIssue, upvoteIssue } = usePolis();
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [pendingCoords, setPendingCoords] = useState(null);

  const handleMapClick = useCallback((e) => {
    if (e.detail?.latLng) {
      setSelectedIssue(null);
      setPendingCoords({ lat: e.detail.latLng.lat, lng: e.detail.latLng.lng });
    }
  }, []);

  const handlePinClick = useCallback((issue) => {
    setPendingCoords(null);
    setSelectedIssue(issue);
  }, []);

  const handleSubmit = (issueData) => {
    addIssue(issueData);
    setPendingCoords(null);
  };

  return (
    <div className="map-container">
      <APIProvider apiKey="AIzaSyCcWkHsHdx9chup6yIkdQt3VdeswzfQFAA">
        <Map
          defaultCenter={SOCIETY_CENTER}
          defaultZoom={17}
          minZoom={16}
          maxZoom={19}
          restriction={{
            latLngBounds: {
              north: SOCIETY_CENTER.lat + 0.005,
              south: SOCIETY_CENTER.lat - 0.005,
              east:  SOCIETY_CENTER.lng + 0.005,
              west:  SOCIETY_CENTER.lng - 0.005,
            },
            strictBounds: true,
          }}
          gestureHandling="greedy"
          disableDefaultUI
          styles={GOOGLE_MAP_STYLE}
          className="gmap"
          onClick={handleMapClick}
        >
          <MapInner issues={issues} onPinClick={handlePinClick} />
        </Map>
      </APIProvider>

      {/* HUD */}
      <div className="map-hud">
        <div className="hud-label">
          <span className="hud-dot"></span>
          LIVE · SOCIETY DOMAIN · DIVYA APT
        </div>
        <div className="hud-hint">Click map to log incident locally</div>
      </div>

      {/* Selected issue popup */}
      {selectedIssue && (
        <IssuePopup
          issue={selectedIssue}
          onClose={() => setSelectedIssue(null)}
          onUpvote={upvoteIssue}
        />
      )}

      {/* New issue form */}
      {pendingCoords && (
        <SubmissionForm
          coords={pendingCoords}
          onClose={() => setPendingCoords(null)}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
};

export default MapView;
