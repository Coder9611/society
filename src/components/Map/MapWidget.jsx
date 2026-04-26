import React, { useState } from 'react';
import { APIProvider, Map, AdvancedMarker } from '@vis.gl/react-google-maps';
import { usePolis } from '../../store/PolisState';
import { Target, Camera } from 'lucide-react';

const darkMapStyle = [
  { elementType: 'geometry', stylers: [{ color: '#242f3e' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#242f3e' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
  {
    featureType: 'administrative.locality',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#d59563' }]
  },
  {
    featureType: 'poi',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#d59563' }]
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [{ color: '#263c3f' }]
  },
  {
    featureType: 'poi.park',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#6b9a76' }]
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{ color: '#38414e' }]
  },
  {
    featureType: 'road',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#212a37' }]
  },
  {
    featureType: 'road',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#9ca5b3' }]
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [{ color: '#746855' }]
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#1f2835' }]
  },
  {
    featureType: 'road.highway',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#f3d19c' }]
  },
  {
    featureType: 'transit',
    elementType: 'geometry',
    stylers: [{ color: '#2f3948' }]
  },
  {
    featureType: 'transit.station',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#d59563' }]
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#17263c' }]
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#515c6d' }]
  },
  {
    featureType: 'water',
    elementType: 'labels.text.stroke',
    stylers: [{ color: '#17263c' }]
  }
];

const glowingColors = {
  infrastructure: '#ff003c',
  sanitation: '#00f0ff',
  safety: '#8a2be2',
  greenery: '#39ff14'
};

const MapWidget = () => {
  const { issues } = usePolis();

  // The API key provided by the user
  const apiKey = '';

  return (
    <div style={{width: '100%', height: '100%', position: 'relative', borderRadius: 24, overflow: 'hidden'}}>
      <APIProvider apiKey={apiKey}>
        <Map
          defaultCenter={{ lat: 37.7749, lng: -122.4194 }}
          defaultZoom={13}
          gestureHandling={'greedy'}
          disableDefaultUI={true}
          mapId="DEMO_MAP_ID" // Needed to use AdvancedMarker
          styles={darkMapStyle} // Applies standard dark styling
        >
          {issues.map(issue => (
            <AdvancedMarker 
              key={issue.id} 
              position={{ lat: issue.lat, lng: issue.lng }}
            >
              <div style={{
                position: 'relative',
                transform: 'translate(-50%, -50%)',
                cursor: 'pointer'
              }}>
                <div style={{
                  width: 48, 
                  height: 48, 
                  background: `radial-gradient(circle, ${glowingColors[issue.category]} 0%, transparent 70%)`,
                  borderRadius: '50%',
                  opacity: 0.4,
                  animation: 'pulse 2s infinite alternate',
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)'
                }}></div>
                <div style={{
                  width: 14,
                  height: 14,
                  background: '#000',
                  border: `2px solid ${glowingColors[issue.category]}`,
                  borderRadius: '50%',
                  position: 'relative',
                  zIndex: 2,
                  boxShadow: `0 0 10px ${glowingColors[issue.category]}`
                }}></div>
              </div>
            </AdvancedMarker>
          ))}
        </Map>
      </APIProvider>

      {/* Floating HUD Elements */}
      <div style={{
        position: 'absolute',
        top: 24, left: 24,
        background: 'rgba(10,10,10,0.8)',
        backdropFilter: 'blur(8px)',
        border: '1px solid var(--border-subtle)',
        padding: '12px 16px',
        borderRadius: 12,
        pointerEvents: 'none'
      }}>
        <div style={{display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-secondary)', fontSize: 10, letterSpacing: 1, marginBottom: 8}}>
          <Target size={12} />
          <span>AREA SYNC: SAN FRANCISCO</span>
        </div>
        <div style={{display: 'flex', gap: 12}}>
          {['infrastructure', 'sanitation', 'safety', 'greenery'].map(cat => (
            <div key={cat} style={{display: 'flex', alignItems: 'center', gap: 4}}>
              <div style={{width: 6, height: 6, borderRadius: '50%', background: glowingColors[cat], boxShadow: `0 0 6px ${glowingColors[cat]}`}}></div>
            </div>
          ))}
        </div>
      </div>
      
      <button style={{
        position: 'absolute',
        bottom: 24, right: 24,
        background: 'var(--accent-cyan)',
        color: '#000',
        border: 'none',
        padding: '12px 24px',
        borderRadius: 100,
        fontWeight: 700,
        fontSize: 12,
        letterSpacing: 1,
        cursor: 'pointer',
        boxShadow: '0 0 20px rgba(0, 240, 255, 0.4)',
        display: 'flex',
        alignItems: 'center',
        gap: 8
      }}>
        <Camera size={16} /> INTERCEPT INCIDENT
      </button>

      <style>{`
        @keyframes pulse {
          0% { transform: translate(-50%, -50%) scale(0.8); opacity: 0.2; }
          100% { transform: translate(-50%, -50%) scale(1.5); opacity: 0.6; }
        }
      `}</style>
    </div>
  );
};

export default MapWidget;
