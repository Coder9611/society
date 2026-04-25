import React from 'react';

// Procedurally generate a geometric grid or zones to mimic an intricate map
const generateZones = () => {
  const zones = [];
  const gridSize = 200;
  for (let x = 0; x < 2000; x += gridSize) {
    for (let y = 0; y < 2000; y += gridSize) {
      if (Math.random() > 0.2) {
        zones.push(
          <rect 
            key={`${x}-${y}`}
            x={x + 5} 
            y={y + 5} 
            width={gridSize - 10} 
            height={gridSize - 10}
            className="locality-path"
            rx="12"
          />
        );
      }
    }
  }
  return zones;
};

const generateRoads = () => {
    const lines = [];
    for(let i = 0; i <= 2000; i += 100){
        lines.push(<line key={`h-${i}`} x1="0" y1={i} x2="2000" y2={i} className="grid-lines" />);
        lines.push(<line key={`v-${i}`} x1={i} y1="0" x2={i} y2="2000" className="grid-lines" />);
    }
    return lines;
}

const MapSvg = ({ children }) => {
  return (
    <div className="map-svg">
      <svg 
        width="2000" 
        height="2000" 
        viewBox="0 0 2000 2000" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="dotGrid" width="40" height="40" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1" fill="rgba(0,0,0,0.08)" />
          </pattern>
        </defs>
        
        <rect width="100%" height="100%" fill="url(#dotGrid)" />
        {generateRoads()}
        {generateZones()}
      </svg>
      {/* Pins and Overlays render within the MapSvg container relative to 2000x2000 coordinate space */}
      {children}
    </div>
  );
};

export default MapSvg;
