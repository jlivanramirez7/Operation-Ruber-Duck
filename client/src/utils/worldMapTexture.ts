import * as THREE from 'three';

/**
 * Exact spherical coordinate projection matching THREE.SphereGeometry UV mapping.
 * Ensures 100% mathematical alignment between canvas texture pixels (lng, lat)
 * and 3D mesh surface coordinates (x, y, z).
 */
export function latLngToVector3(lat: number, lng: number, radius: number): THREE.Vector3 {
  const phi = ((90 - lat) * Math.PI) / 180;
  const theta = ((lng + 180) * Math.PI) / 180;
  const x = -radius * Math.cos(theta) * Math.sin(phi);
  const y = radius * Math.cos(phi);
  const z = radius * Math.sin(theta) * Math.sin(phi);
  return new THREE.Vector3(x, y, z);
}

/**
 * High-precision simplified geographic continent & island polygons [lng, lat][]
 * Engineered for zero-latency, zero-CDN-dependency 3D Globe rendering on satellite Wi-Fi.
 */
const WORLD_POLYGONS: Array<{ name: string; points: [number, number][] }> = [
  // North America
  {
    name: 'North America',
    points: [
      [-168, 71], [-140, 70], [-128, 70], [-110, 68], [-95, 68], [-82, 63], [-65, 60],
      [-55, 52], [-60, 46], [-67, 45], [-70, 42], [-75, 35], [-80, 25], [-82, 25],
      [-83, 30], [-90, 29], [-97, 26], [-97, 20], [-87, 21], [-87, 18], [-83, 10],
      [-78, 8], [-80, 8], [-85, 11], [-92, 15], [-105, 20], [-110, 23], [-115, 30],
      [-120, 34], [-124, 40], [-124, 48], [-135, 58], [-150, 60], [-162, 55], [-166, 60],
      [-168, 71]
    ]
  },
  // Greenland
  {
    name: 'Greenland',
    points: [
      [-55, 82], [-20, 82], [-18, 70], [-43, 60], [-52, 65], [-55, 75], [-55, 82]
    ]
  },
  // Cuba
  {
    name: 'Cuba',
    points: [
      [-84.9, 21.8], [-82.0, 23.1], [-77.5, 21.0], [-74.1, 20.1], [-77.0, 19.9],
      [-82.5, 22.2], [-84.9, 21.8]
    ]
  },
  // Hispaniola (Haiti & Dominican Republic)
  {
    name: 'Hispaniola',
    points: [
      [-74.4, 19.8], [-71.0, 19.9], [-68.3, 18.5], [-71.8, 17.6], [-74.4, 18.4], [-74.4, 19.8]
    ]
  },
  // Puerto Rico & Virgin Islands
  {
    name: 'Puerto Rico',
    points: [
      [-67.3, 18.5], [-65.6, 18.4], [-65.6, 17.9], [-67.3, 17.9], [-67.3, 18.5]
    ]
  },
  // Bahamas & Turks and Caicos
  {
    name: 'Bahamas',
    points: [
      [-79.0, 26.8], [-77.0, 26.6], [-75.0, 24.0], [-71.1, 21.5], [-73.0, 22.0],
      [-77.5, 24.5], [-79.0, 26.8]
    ]
  },
  // South America
  {
    name: 'South America',
    points: [
      [-78, 9], [-75, 11], [-62, 10], [-50, 2], [-35, -6], [-38, -15], [-40, -22],
      [-48, -28], [-53, -34], [-62, -39], [-65, -45], [-68, -54], [-74, -52], [-73, -42],
      [-71, -30], [-75, -15], [-81, -5], [-78, 9]
    ]
  },
  // United Kingdom & Ireland
  {
    name: 'UK & Ireland',
    points: [
      [-6, 58], [-2, 58], [1.8, 52.5], [1.2, 51], [-5, 50], [-6, 54], [-10, 52],
      [-10, 55], [-6, 58]
    ]
  },
  // Continental Europe
  {
    name: 'Europe',
    points: [
      [-9, 36], [-9, 43], [-2, 43], [-4, 48], [2, 51], [8, 54], [8, 58], [5, 62],
      [15, 69], [28, 71], [40, 68], [60, 68], [60, 55], [40, 45], [28, 42], [24, 38],
      [15, 38], [12, 44], [8, 44], [3, 42], [-5, 36], [-9, 36]
    ]
  },
  // Africa
  {
    name: 'Africa',
    points: [
      [-17, 15], [-13, 28], [-6, 36], [10, 37], [33, 32], [51, 12], [40, -10],
      [35, -25], [20, -35], [18, -34], [14, -22], [9, -2], [5, 5], [-8, 5], [-17, 15]
    ]
  },
  // Asia
  {
    name: 'Asia',
    points: [
      [30, 41], [40, 42], [60, 55], [75, 72], [110, 74], [140, 72], [170, 66],
      [160, 55], [140, 52], [135, 38], [122, 40], [122, 30], [108, 20], [104, 1],
      [98, 16], [88, 22], [80, 8], [72, 21], [62, 25], [56, 26], [48, 30], [36, 36],
      [30, 41]
    ]
  },
  // Japan
  {
    name: 'Japan',
    points: [
      [130, 31], [136, 34], [141, 38], [145, 43], [140, 41], [136, 36], [131, 34], [130, 31]
    ]
  },
  // Australia
  {
    name: 'Australia',
    points: [
      [114, -22], [122, -14], [136, -12], [142, -11], [150, -22], [153, -28],
      [148, -38], [138, -35], [130, -32], [115, -34], [114, -22]
    ]
  },
  // New Zealand
  {
    name: 'New Zealand',
    points: [
      [172, -34], [178, -38], [174, -42], [168, -46], [166, -45], [172, -40], [172, -34]
    ]
  }
];

/**
 * Generates an ultra-crisp 2048x1024 Caribbean Navigation World Map Canvas Texture.
 * 100% self-contained (zero external CDN dependencies).
 */
export function createWorldGlobeTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  const lngToX = (lng: number) => ((lng + 180) / 360) * canvas.width;
  const latToY = (lat: number) => ((90 - lat) / 180) * canvas.height;

  // 1. Deep Caribbean Sapphire Ocean Bathymetry Gradient
  const oceanGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
  oceanGrad.addColorStop(0, '#031929');
  oceanGrad.addColorStop(0.3, '#062C47');
  oceanGrad.addColorStop(0.5, '#093B5E'); // Equatorial Caribbean warm waters
  oceanGrad.addColorStop(0.7, '#062C47');
  oceanGrad.addColorStop(1, '#031929');
  ctx.fillStyle = oceanGrad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // 2. Subtle Lat/Lng Nautical Graticule Grid (every 15 degrees)
  ctx.lineWidth = 1;
  ctx.strokeStyle = 'rgba(0, 210, 184, 0.14)';
  for (let lng = -180; lng <= 180; lng += 15) {
    const x = lngToX(lng);
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }
  for (let lat = -75; lat <= 75; lat += 15) {
    const y = latToY(lat);
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }

  // Highlight Equator & Tropics (Tropic of Cancer passes right through the Bahamas/Caribbean!)
  ctx.lineWidth = 1.5;
  ctx.strokeStyle = 'rgba(0, 242, 212, 0.35)';
  [0, 23.436, -23.436].forEach(lat => {
    const y = latToY(lat);
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  });

  // 3. Render Landmass Continents & Caribbean Islands
  WORLD_POLYGONS.forEach(poly => {
    ctx.beginPath();
    poly.points.forEach(([lng, lat], idx) => {
      const x = lngToX(lng);
      const y = latToY(lat);
      if (idx === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.closePath();

    // Landmass fill (rich tropical emerald-teal slate)
    ctx.fillStyle = '#0F4D58';
    ctx.fill();

    // Glowing turquoise shoreline border
    ctx.lineWidth = 2.2;
    ctx.strokeStyle = '#00E5C3';
    ctx.stroke();
  });

  // 4. Add subtle glowing coordinate dots across continents for visual depth
  ctx.fillStyle = 'rgba(0, 242, 212, 0.25)';
  for (let lat = -60; lat <= 70; lat += 4) {
    for (let lng = -170; lng <= 170; lng += 4) {
      const x = lngToX(lng);
      const y = latToY(lat);
      const pixel = ctx.getImageData(x, y, 1, 1).data;
      // Check if pixel is landmass (#0F4D58 -> R=15, G=77, B=88)
      if (pixel[1] > 60 && pixel[2] > 70) {
        ctx.fillRect(x, y, 2, 2);
      }
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}
