import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Clock, Compass, MapPin, Navigation, Pause, Play, Ship, Sparkles, ZoomIn, ZoomOut } from 'lucide-react';
import { Discovery, ShipPosition } from '../types/duck';
import { createWorldGlobeTexture, latLngToVector3 } from '../utils/worldMapTexture';
import { formatPinnedTimestamp } from '../utils/timeFormat';

interface GlobeViewProps {
  discoveries: Discovery[];
  shipPosition: ShipPosition;
  selectedDiscovery: Discovery | null;
  onSelectDiscovery: (discovery: Discovery) => void;
}

interface ProjectedPinOverlay {
  id: string;
  label: string;
  sublabel: string;
  x: number;
  y: number;
  visible: boolean;
  isShip: boolean;
  isSelected: boolean;
  discovery: Discovery | null;
}

const GLOBE_RADIUS = 108;

export const GlobeView: React.FC<GlobeViewProps> = ({
  discoveries,
  shipPosition,
  selectedDiscovery,
  onSelectDiscovery
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const globeGroupRef = useRef<THREE.Group | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const targetRotationRef = useRef<{ x: number; y: number }>({
    x: (22 * Math.PI) / 180,
    y: -((-76 + 90) * Math.PI) / 180
  });
  const isDraggingRef = useRef<boolean>(false);
  const previousMouseRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isAutoRotating, setIsAutoRotating] = useState<boolean>(true);
  const isAutoRotatingRef = useRef<boolean>(true);
  const [projectedOverlays, setProjectedOverlays] = useState<ProjectedPinOverlay[]>([]);

  useEffect(() => {
    isAutoRotatingRef.current = isAutoRotating;
  }, [isAutoRotating]);

  // Smoothly center globe on a specific (lat, lng)
  const centerGlobeOnLatLng = (lat: number, lng: number) => {
    setIsAutoRotating(false);
    isAutoRotatingRef.current = false;
    targetRotationRef.current = {
      x: Math.max(-0.9, Math.min(0.9, (lat * Math.PI) / 180)),
      y: -((lng + 90) * Math.PI) / 180
    };
  };

  useEffect(() => {
    if (selectedDiscovery) {
      centerGlobeOnLatLng(selectedDiscovery.lat, selectedDiscovery.lng);
    }
  }, [selectedDiscovery]);

  const flyToShip = () => {
    centerGlobeOnLatLng(shipPosition.lat, shipPosition.lng);
  };

  const handleZoom = (delta: number) => {
    if (cameraRef.current) {
      cameraRef.current.position.z = Math.max(
        180,
        Math.min(360, cameraRef.current.position.z + delta)
      );
    }
  };

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 860;
    const height = container.clientHeight || 600;

    // 1. Initialize Three.js Scene, Camera, & WebGLRenderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, width / height, 1, 1500);
    camera.position.set(0, 0, 268);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 2. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x00f2d4, 1.45);
    dirLight1.position.set(240, 190, 250);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xffc83b, 0.9);
    dirLight2.position.set(-220, -150, 190);
    scene.add(dirLight2);

    // 3. Starfield Background
    const starsGeo = new THREE.BufferGeometry();
    const starCount = 520;
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i += 3) {
      starPositions[i] = (Math.random() - 0.5) * 1050;
      starPositions[i + 1] = (Math.random() - 0.5) * 850;
      starPositions[i + 2] = -160 - Math.random() * 400;
    }
    starsGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starsMat = new THREE.PointsMaterial({
      color: 0x9dc4dc,
      size: 1.6,
      transparent: true,
      opacity: 0.7
    });
    const starField = new THREE.Points(starsGeo, starsMat);
    scene.add(starField);

    // 4. Master Globe Group (rotates Earth + Pins + Arcs together)
    const globeGroup = new THREE.Group();
    globeGroup.rotation.x = targetRotationRef.current.x;
    globeGroup.rotation.y = targetRotationRef.current.y;
    globeGroupRef.current = globeGroup;
    scene.add(globeGroup);

    // 5. 3D Earth Sphere with High-Resolution Vector World Map Canvas Texture
    const earthGeo = new THREE.SphereGeometry(GLOBE_RADIUS, 64, 64);
    const earthTexture = createWorldGlobeTexture();
    const earthMat = new THREE.MeshPhongMaterial({
      map: earthTexture,
      specular: new THREE.Color(0x00d2b8),
      shininess: 22
    });
    const earthMesh = new THREE.Mesh(earthGeo, earthMat);
    globeGroup.add(earthMesh);

    // 6. Outer Atmospheric Glow Halo Sphere
    const atmosGeo = new THREE.SphereGeometry(GLOBE_RADIUS * 1.038, 64, 64);
    const atmosMat = new THREE.MeshBasicMaterial({
      color: 0x00e5c3,
      transparent: true,
      opacity: 0.12,
      side: THREE.BackSide
    });
    const atmosMesh = new THREE.Mesh(atmosGeo, atmosMat);
    globeGroup.add(atmosMesh);

    // 7. Build 3D Pins, Surface Halos, & Great-Circle Flight Arcs to Caribbean Ship
    const pinsGroup = new THREE.Group();
    globeGroup.add(pinsGroup);

    const shipVec = latLngToVector3(shipPosition.lat, shipPosition.lng, GLOBE_RADIUS);

    // Add 3D Marker for the Cruise Ship in the Caribbean Sea
    const shipPinGroup = new THREE.Group();
    const shipNormal = shipVec.clone().normalize();
    const shipTopVec = shipNormal.clone().multiplyScalar(GLOBE_RADIUS + 9);

    const shipStemGeo = new THREE.BufferGeometry().setFromPoints([shipVec, shipTopVec]);
    const shipStemMat = new THREE.LineBasicMaterial({ color: 0xff7a59, linewidth: 3 });
    shipPinGroup.add(new THREE.Line(shipStemGeo, shipStemMat));

    const shipHeadGeo = new THREE.SphereGeometry(3.4, 16, 16);
    const shipHeadMat = new THREE.MeshBasicMaterial({ color: 0xff7a59 });
    const shipHeadMesh = new THREE.Mesh(shipHeadGeo, shipHeadMat);
    shipHeadMesh.position.copy(shipTopVec);
    shipPinGroup.add(shipHeadMesh);
    pinsGroup.add(shipPinGroup);

    // Add 3D Pins + Flight Arcs for all Discoveries
    discoveries.forEach(d => {
      const isSelected = selectedDiscovery?.id === d.id;
      const startVec = latLngToVector3(d.lat, d.lng, GLOBE_RADIUS);
      const normal = startVec.clone().normalize();
      const pinTopVec = normal.clone().multiplyScalar(GLOBE_RADIUS + (isSelected ? 10.5 : 7.2));

      // Pin Stem
      const stemGeo = new THREE.BufferGeometry().setFromPoints([startVec, pinTopVec]);
      const stemMat = new THREE.LineBasicMaterial({
        color: isSelected ? 0xffc83b : 0x00f2d4,
        linewidth: 2
      });
      pinsGroup.add(new THREE.Line(stemGeo, stemMat));

      // Glowing Pin Head Sphere
      const headGeo = new THREE.SphereGeometry(isSelected ? 3.0 : 2.2, 14, 14);
      const headMat = new THREE.MeshBasicMaterial({
        color: isSelected ? 0xffc83b : 0x00f2d4
      });
      const headMesh = new THREE.Mesh(headGeo, headMat);
      headMesh.position.copy(pinTopVec);
      pinsGroup.add(headMesh);

      // 3D Flight Arc from Finder's Hometown to Caribbean Cruise Ship
      const midPoint = startVec
        .clone()
        .add(shipVec)
        .multiplyScalar(0.5);
      const dist = startVec.distanceTo(shipVec);
      const arcAltitude = GLOBE_RADIUS + Math.max(18, dist * 0.28);
      midPoint.normalize().multiplyScalar(arcAltitude);

      const curve = new THREE.QuadraticBezierCurve3(startVec, midPoint, shipVec);
      const curvePoints = curve.getPoints(48);
      const arcGeo = new THREE.BufferGeometry().setFromPoints(curvePoints);
      const arcMat = new THREE.LineBasicMaterial({
        color: isSelected ? 0xffc83b : 0x00d2b8,
        transparent: true,
        opacity: isSelected ? 0.95 : 0.45
      });
      pinsGroup.add(new THREE.Line(arcGeo, arcMat));
    });

    // 8. Pointer / Touch Interactive Rotation & Zoom Listeners
    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      isDraggingRef.current = true;
      setIsAutoRotating(false);
      isAutoRotatingRef.current = false;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      previousMouseRef.current = { x: clientX, y: clientY };
    };

    const onPointerMove = (e: MouseEvent | TouchEvent) => {
      if (!isDraggingRef.current || !globeGroupRef.current) return;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      const deltaX = clientX - previousMouseRef.current.x;
      const deltaY = clientY - previousMouseRef.current.y;

      targetRotationRef.current.y += deltaX * 0.0065;
      targetRotationRef.current.x = Math.max(
        -1.1,
        Math.min(1.1, targetRotationRef.current.x + deltaY * 0.0065)
      );
      globeGroupRef.current.rotation.y = targetRotationRef.current.y;
      globeGroupRef.current.rotation.x = targetRotationRef.current.x;
      previousMouseRef.current = { x: clientX, y: clientY };
    };

    const onPointerUp = () => {
      isDraggingRef.current = false;
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      camera.position.z = Math.max(180, Math.min(360, camera.position.z + e.deltaY * 0.14));
    };

    const domElem = renderer.domElement;
    domElem.addEventListener('mousedown', onPointerDown);
    domElem.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);
    domElem.addEventListener('touchstart', onPointerDown, { passive: true });
    domElem.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('touchend', onPointerUp);
    domElem.addEventListener('wheel', onWheel, { passive: false });

    // 9. Animation Loop + 3D-to-2D Projected City Labels
    let animFrameId: number;
    let frameCounter = 0;

    const animate = () => {
      animFrameId = requestAnimationFrame(animate);

      if (globeGroupRef.current) {
        if (isAutoRotatingRef.current && !isDraggingRef.current) {
          targetRotationRef.current.y += 0.0028;
        }
        globeGroupRef.current.rotation.y +=
          (targetRotationRef.current.y - globeGroupRef.current.rotation.y) * 0.09;
        globeGroupRef.current.rotation.x +=
          (targetRotationRef.current.x - globeGroupRef.current.rotation.x) * 0.09;
      }

      renderer.render(scene, camera);

      // Update projected HTML city pin badges every 3 frames
      frameCounter++;
      if (frameCounter % 3 === 0 && globeGroupRef.current && container) {
        const currentW = container.clientWidth || width;
        const currentH = container.clientHeight || height;
        const cameraDir = camera.position.clone().normalize();

        const newOverlays: ProjectedPinOverlay[] = [];

        // Project Cruise Ship Marker
        const shipWorldPos = latLngToVector3(shipPosition.lat, shipPosition.lng, GLOBE_RADIUS + 9);
        shipWorldPos.applyEuler(globeGroupRef.current.rotation);
        const shipSurfaceNormal = shipWorldPos.clone().normalize();
        const shipVisible = shipSurfaceNormal.dot(cameraDir) > 0.18;

        if (shipVisible) {
          const projected = shipWorldPos.clone().project(camera);
          newOverlays.push({
            id: 'caribbean_cruise_ship',
            label: '🚢 Cruise Ship',
            sublabel: 'Caribbean Sea',
            x: ((projected.x + 1) * currentW) / 2,
            y: ((-projected.y + 1) * currentH) / 2,
            visible: true,
            isShip: true,
            isSelected: false,
            discovery: null
          });
        }

        // Project Hometown Discovery Pins
        discoveries.forEach(d => {
          const pinWorldPos = latLngToVector3(d.lat, d.lng, GLOBE_RADIUS + 8);
          pinWorldPos.applyEuler(globeGroupRef.current!.rotation);
          const pinNormal = pinWorldPos.clone().normalize();
          const isVisible = pinNormal.dot(cameraDir) > 0.22;

          if (isVisible) {
            const projected = pinWorldPos.clone().project(camera);
            newOverlays.push({
              id: d.id,
              label: `${d.city}`,
              sublabel: d.duckId,
              x: ((projected.x + 1) * currentW) / 2,
              y: ((-projected.y + 1) * currentH) / 2,
              visible: true,
              isShip: false,
              isSelected: selectedDiscovery?.id === d.id,
              discovery: d
            });
          }
        });

        setProjectedOverlays(newOverlays);
      }
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth || 860;
      const newH = container.clientHeight || 600;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mouseup', onPointerUp);
      window.removeEventListener('touchend', onPointerUp);
      domElem.removeEventListener('mousedown', onPointerDown);
      domElem.removeEventListener('mousemove', onPointerMove);
      domElem.removeEventListener('touchstart', onPointerDown);
      domElem.removeEventListener('touchmove', onPointerMove);
      domElem.removeEventListener('wheel', onWheel);
      renderer.dispose();
    };
  }, [discoveries, shipPosition, selectedDiscovery]);

  const timeInfo = selectedDiscovery
    ? formatPinnedTimestamp(selectedDiscovery.createdAt)
    : null;

  return (
    <div className="globe-section-container">
      {/* Dedicated Top Controls & Legend Bar (Outside Globe Canvas so it never covers the Earth!) */}
      <div className="globe-top-toolbar">
        <div className="globe-toolbar-left">
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

          <button
            type="button"
            className="globe-control-btn"
            onClick={() => handleZoom(-28)}
            title="Zoom In"
          >
            <ZoomIn size={15} />
          </button>

          <button
            type="button"
            className="globe-control-btn"
            onClick={() => handleZoom(28)}
            title="Zoom Out"
          >
            <ZoomOut size={15} />
          </button>
        </div>

        <div className="globe-legend-inline">
          <span className="legend-item">
            <span className="legend-dot dot-hometown" /> Finder Hometown Pin
          </span>
          <span className="legend-item">
            <span className="legend-dot dot-ship" /> Caribbean Cruise Ship
          </span>
        </div>
      </div>

      {/* Large 600px Unobstructed 3D Spinning Globe Canvas */}
      <div className="globe-wrapper">
        <div ref={mountRef} className="globe-canvas-mount" />

        {/* 3D Projected Interactive City Pin Badges */}
        <div className="globe-projected-pins-layer">
          {projectedOverlays.map(pin => (
            <button
              key={pin.id}
              type="button"
              className={`projected-pin-badge ${pin.isShip ? 'pin-badge-ship' : ''} ${
                pin.isSelected ? 'pin-badge-selected' : ''
              }`}
              style={{
                left: `${pin.x}px`,
                top: `${pin.y}px`
              }}
              onClick={() => {
                if (pin.discovery) {
                  onSelectDiscovery(pin.discovery);
                } else if (pin.isShip) {
                  flyToShip();
                }
              }}
            >
              <span className="pin-badge-dot" />
              <span className="pin-badge-text">{pin.label}</span>
              {pin.sublabel && <span className="pin-badge-sub">{pin.sublabel}</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Dedicated Docked Pin Inspection Card BELOW the 3D Globe (Never overlaps the spinning Earth!) */}
      {selectedDiscovery && (
        <div className="selected-pin-docked-card">
          <div className="selected-pin-header">
            <div className="selected-pin-badge">
              <Sparkles size={15} />
              <span>
                {selectedDiscovery.duckId}: {selectedDiscovery.duckName}
              </span>
            </div>
            <span className="selected-pin-miles">
              <Navigation size={14} /> {selectedDiscovery.distanceMilesToShip.toLocaleString()} miles to ship
            </span>
          </div>

          <div className="selected-pin-location">
            <MapPin size={17} className="pin-icon" />
            <strong>
              {selectedDiscovery.city}
              {selectedDiscovery.region ? `, ${selectedDiscovery.region}` : ''}
            </strong>
            <span className="country-tag">{selectedDiscovery.country}</span>
          </div>

          <p className="selected-pin-note">"{selectedDiscovery.note}"</p>

          <div className="selected-pin-footer">
            <span className="pin-deck-info">
              <Compass size={13} /> Spotted on: <strong>{selectedDiscovery.deckFound}</strong>
            </span>
            <span className="pin-time-info">
              <Clock size={13} /> Pinned: <strong>{timeInfo?.fullDateTime}</strong>
              {timeInfo?.relative && (
                <span className="pin-time-relative"> ({timeInfo.relative})</span>
              )}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
