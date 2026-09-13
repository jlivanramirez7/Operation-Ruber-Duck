import React, { useEffect, useRef, useState } from 'react';
import Globe from 'react-globe.gl';
import { Compass, MapPin, Navigation, Pause, Play, Ship, Sparkles } from 'lucide-react';
import { Discovery, ShipPosition } from '../types/duck';

interface GlobeViewProps {
  discoveries: Discovery[];
  shipPosition: ShipPosition;
  selectedDiscovery: Discovery | null;
  onSelectDiscovery: (discovery: Discovery) => void;
}

export const GlobeView: React.FC<GlobeViewProps> = ({
  discoveries,
  shipPosition,
  selectedDiscovery,
  onSelectDiscovery
}) => {
  const globeRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 520 });
  const [isAutoRotating, setIsAutoRotating] = useState(true);

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight
        });
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  useEffect(() => {
    if (globeRef.current) {
      const controls = globeRef.current.controls();
      if (controls) {
        controls.autoRotate = isAutoRotating;
        controls.autoRotateSpeed = 0.65;
        controls.enableZoom = true;
      }
      // Initial camera focus on the Americas / Caribbean corridor
      globeRef.current.pointOfView({ lat: 24.5, lng: -76.0, altitude: 2.05 }, 1200);
    }
  }, []);

  useEffect(() => {
    if (globeRef.current) {
      const controls = globeRef.current.controls();
      if (controls) {
        controls.autoRotate = isAutoRotating;
      }
    }
  }, [isAutoRotating]);

  useEffect(() => {
    if (selectedDiscovery && globeRef.current) {
      setIsAutoRotating(false);
      globeRef.current.pointOfView(
        {
          lat: selectedDiscovery.lat,
          lng: selectedDiscovery.lng,
          altitude: 1.45
        },
        1100
      );
    }
  }, [selectedDiscovery]);

  const flyToShip = () => {
    if (globeRef.current) {
      setIsAutoRotating(false);
      globeRef.current.pointOfView(
        {
          lat: shipPosition.lat,
          lng: shipPosition.lng,
          altitude: 1.25
        },
        1100
      );
    }
  };

  // Combine hometown pins + the Cruise Ship marker
  const pointsData = [
    ...discoveries.map(d => ({
      id: d.id,
      lat: d.lat,
      lng: d.lng,
      size: selectedDiscovery?.id === d.id ? 0.85 : 0.55,
      color: selectedDiscovery?.id === d.id ? '#FFC83B' : '#00E5C3',
      label: `${d.city}, ${d.country} (${d.duckId})`,
      isShip: false,
      discovery: d
    })),
    {
      id: 'caribbean_cruise_ship',
      lat: shipPosition.lat,
      lng: shipPosition.lng,
      size: 1.05,
      color: '#FF7A59',
      label: `🚢 CRUISE SHIP: ${shipPosition.name}`,
      isShip: true,
      discovery: null
    }
  ];

  // Flight arcs from every finder's hometown to the Cruise Ship in the Caribbean Sea
  const arcsData = discoveries.map(d => ({
    startLat: d.lat,
    startLng: d.lng,
    endLat: shipPosition.lat,
    endLng: shipPosition.lng,
    color: selectedDiscovery?.id === d.id ? ['#FFC83B', '#FF7A59'] : ['#00E5C3', '#FFC83B'],
    discovery: d
  }));

  return (
    <div className="globe-wrapper" ref={containerRef}>
      <div className="globe-controls-overlay">
        <button
          type="button"
          className="globe-control-btn"
          onClick={() => setIsAutoRotating(!isAutoRotating)}
          title={isAutoRotating ? 'Pause Globe Spin' : 'Resume Globe Spin'}
        >
          {isAutoRotating ? <Pause size={15} /> : <Play size={15} />}
          <span>{isAutoRotating ? 'Spinning' : 'Paused'}</span>
        </button>

        <button
          type="button"
          className="globe-control-btn ship-focus-btn"
          onClick={flyToShip}
          title="Center Globe on Cruise Ship in the Caribbean"
        >
          <Ship size={15} />
          <span>Center on Cruise Ship</span>
        </button>
      </div>

      <div className="globe-legend-pill">
        <span className="legend-item">
          <span className="legend-dot dot-hometown" /> Finder Hometown
        </span>
        <span className="legend-item">
          <span className="legend-dot dot-ship" /> Caribbean Cruise Ship
        </span>
      </div>

      <Globe
        ref={globeRef}
        width={dimensions.width}
        height={dimensions.height}
        backgroundColor="rgba(0,0,0,0)"
        globeImageUrl="https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
        bumpImageUrl="https://unpkg.com/three-globe/example/img/earth-topology.png"
        atmosphereColor="#00D2B8"
        atmosphereAltitude={0.18}
        pointsData={pointsData}
        pointLat="lat"
        pointLng="lng"
        pointColor="color"
        pointAltitude={0.035}
        pointRadius="size"
        pointLabel="label"
        onPointClick={(pt: any) => {
          if (pt && pt.discovery) {
            onSelectDiscovery(pt.discovery);
          } else if (pt && pt.isShip) {
            flyToShip();
          }
        }}
        arcsData={arcsData}
        arcStartLat="startLat"
        arcStartLng="startLng"
        arcEndLat="endLat"
        arcEndLng="endLng"
        arcColor="color"
        arcDashLength={0.45}
        arcDashGap={0.2}
        arcDashAnimateTime={2200}
        arcStroke={0.65}
      />

      {selectedDiscovery && (
        <div className="selected-pin-floating-card">
          <div className="selected-pin-header">
            <div className="selected-pin-badge">
              <Sparkles size={14} />
              <span>{selectedDiscovery.duckId}: {selectedDiscovery.duckName}</span>
            </div>
            <span className="selected-pin-miles">
              <Navigation size={13} /> {selectedDiscovery.distanceMilesToShip.toLocaleString()} miles to ship
            </span>
          </div>
          <div className="selected-pin-location">
            <MapPin size={16} className="pin-icon" />
            <strong>{selectedDiscovery.city}{selectedDiscovery.region ? `, ${selectedDiscovery.region}` : ''}</strong>
            <span className="country-tag">{selectedDiscovery.country}</span>
          </div>
          <p className="selected-pin-note">"{selectedDiscovery.note}"</p>
          <div className="selected-pin-footer">
            <span>Found on: {selectedDiscovery.deckFound}</span>
            <span>{new Date(selectedDiscovery.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      )}
    </div>
  );
};
