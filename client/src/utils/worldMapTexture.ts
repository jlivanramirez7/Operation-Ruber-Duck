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

interface PolygonFeature {
  name: string;
  points: [number, number][];
  isLake?: boolean; // True for inland water bodies (e.g. Great Lakes, Caspian Sea)
}

/**
 * High-Definition (HD) Geographic Continent, Peninsula, Island & Inland Lake Polygons [lng, lat][]
 * Engineered for 4K (4096x2048) zero-latency, zero-CDN-dependency 3D Globe rendering.
 */
const HD_WORLD_POLYGONS: PolygonFeature[] = [
  // ================= NORTH AMERICA (HD Coastline with Alaska, Baja, Yucatan, Florida, East Coast & Hudson Bay) =================
  {
    name: 'North America Mainland',
    points: [
      [-168.0, 65.6], [-166.0, 68.2], [-161.0, 70.3], [-156.5, 71.3], [-148.0, 70.4], [-139.0, 69.6],
      [-133.0, 69.5], [-128.0, 70.3], [-124.0, 69.8], [-118.0, 68.8], [-114.0, 68.0], [-108.0, 68.5],
      [-96.0, 68.2], [-93.0, 69.5], [-86.0, 68.0], [-82.5, 67.0], [-83.0, 64.0], [-90.0, 63.5],
      [-94.5, 60.5], [-94.0, 58.8], [-89.0, 56.8], [-82.5, 55.0], [-80.5, 51.5], [-79.0, 54.5],
      [-78.0, 58.5], [-77.5, 62.5], [-74.0, 62.2], [-71.0, 61.0], [-69.5, 59.0], [-64.5, 60.2],
      [-61.5, 57.5], [-57.0, 54.5], [-55.6, 51.6], [-58.5, 51.0], [-64.5, 50.2], [-67.5, 49.0],
      [-64.5, 47.0], [-61.0, 45.8], [-63.5, 44.5], [-66.0, 43.5], [-67.0, 45.0], [-69.0, 44.0],
      [-70.8, 43.0], [-70.0, 41.8], [-71.2, 41.5], [-73.8, 40.6], [-74.0, 39.8], [-75.0, 38.5],
      [-75.5, 37.0], [-76.3, 36.9], [-75.5, 35.2], [-76.5, 34.7], [-78.0, 33.9], [-79.9, 32.8],
      [-81.4, 30.8], [-80.5, 28.5], [-80.0, 26.8], [-80.1, 25.8], [-80.4, 25.2], [-81.1, 25.2],
      [-81.8, 26.2], [-82.7, 27.8], [-82.8, 29.0], [-84.2, 30.1], [-85.5, 30.0], [-87.5, 30.3],
      [-89.0, 30.2], [-89.1, 29.1], [-90.5, 29.2], [-92.0, 29.6], [-93.8, 29.7], [-95.0, 29.2],
      [-97.2, 27.8], [-97.1, 25.9], [-97.5, 24.0], [-97.8, 22.2], [-96.3, 19.2], [-94.5, 18.2],
      [-92.2, 18.5], [-90.5, 19.8], [-90.4, 21.2], [-88.0, 21.6], [-86.8, 21.2], [-87.8, 18.2],
      [-88.3, 17.5], [-88.5, 15.8], [-86.0, 16.0], [-83.2, 15.0], [-83.6, 11.0], [-83.0, 10.0],
      [-81.5, 8.8], [-79.5, 9.4], [-77.8, 8.5], [-77.5, 7.2], [-78.2, 7.5], [-79.9, 8.2],
      [-80.5, 7.2], [-82.5, 8.2], [-84.0, 9.0], [-85.8, 10.3], [-87.2, 12.5], [-88.0, 13.2],
      [-90.8, 13.9], [-92.2, 14.5], [-93.5, 16.0], [-95.2, 16.2], [-97.0, 15.7], [-99.9, 16.8],
      [-103.5, 18.2], [-105.6, 20.4], [-106.5, 23.2], [-109.5, 25.8], [-112.5, 28.8],
      [-114.5, 31.5], [-114.8, 31.8], [-113.5, 30.0], [-111.5, 26.8], [-109.8, 22.9],
      [-110.2, 24.0], [-112.2, 25.5], [-114.2, 27.8], [-115.8, 30.5], [-117.1, 32.5],
      [-118.5, 34.0], [-120.6, 34.5], [-122.0, 36.8], [-122.5, 37.8], [-123.8, 39.5],
      [-124.4, 40.4], [-124.1, 43.0], [-124.0, 46.2], [-124.7, 48.4], [-123.2, 49.2],
      [-125.0, 50.2], [-128.0, 51.0], [-130.5, 53.5], [-131.0, 55.5], [-134.5, 57.5],
      [-136.5, 58.8], [-140.0, 59.8], [-144.5, 60.2], [-147.5, 60.8], [-151.5, 59.5],
      [-154.0, 58.0], [-158.5, 56.2], [-161.5, 55.5], [-164.8, 54.5], [-162.0, 56.0],
      [-158.0, 58.5], [-161.8, 59.0], [-162.0, 60.2], [-165.5, 61.5], [-166.0, 63.5],
      [-161.5, 64.5], [-164.0, 66.0], [-168.0, 65.6]
    ]
  },
  // Canadian Arctic & Major North American Islands
  {
    name: 'Baffin Island',
    points: [
      [-80.0, 73.5], [-74.0, 71.5], [-67.0, 69.0], [-61.5, 66.0], [-64.5, 63.0],
      [-66.5, 62.0], [-71.0, 63.5], [-74.0, 64.5], [-77.5, 66.5], [-79.0, 69.5],
      [-85.0, 71.5], [-85.0, 73.2], [-80.0, 73.5]
    ]
  },
  {
    name: 'Victoria Island',
    points: [
      [-118.0, 73.0], [-108.0, 73.0], [-101.0, 70.2], [-104.0, 68.8], [-114.0, 69.0],
      [-118.0, 71.0], [-118.0, 73.0]
    ]
  },
  {
    name: 'Banks Island',
    points: [
      [-125.0, 74.5], [-118.0, 74.0], [-120.0, 71.5], [-125.5, 72.0], [-125.0, 74.5]
    ]
  },
  {
    name: 'Ellesmere Island',
    points: [
      [-88.0, 82.0], [-62.0, 82.5], [-74.0, 78.0], [-78.0, 76.5], [-88.0, 76.5],
      [-92.0, 79.5], [-88.0, 82.0]
    ]
  },
  {
    name: 'Newfoundland',
    points: [
      [-59.2, 47.6], [-56.0, 51.5], [-55.4, 51.5], [-53.0, 48.6], [-52.6, 46.8],
      [-55.8, 46.9], [-59.2, 47.6]
    ]
  },
  {
    name: 'Vancouver Island',
    points: [
      [-128.4, 50.7], [-125.5, 50.1], [-123.3, 48.4], [-125.0, 48.6], [-128.4, 50.7]
    ]
  },

  // ================= GREAT LAKES (Carved out as inland water bodies) =================
  {
    name: 'Lake Superior',
    isLake: true,
    points: [
      [-92.1, 46.8], [-89.5, 48.0], [-87.5, 48.8], [-84.5, 46.5], [-87.0, 46.4],
      [-90.5, 46.8], [-92.1, 46.8]
    ]
  },
  {
    name: 'Lake Michigan',
    isLake: true,
    points: [
      [-87.8, 45.8], [-85.0, 45.8], [-86.2, 43.0], [-87.3, 41.6], [-87.9, 43.0],
      [-87.8, 45.8]
    ]
  },
  {
    name: 'Lake Huron',
    isLake: true,
    points: [
      [-84.5, 46.0], [-81.0, 46.0], [-80.0, 44.5], [-82.4, 43.0], [-83.9, 43.6],
      [-84.5, 46.0]
    ]
  },
  {
    name: 'Lake Erie',
    isLake: true,
    points: [
      [-83.4, 42.0], [-78.9, 42.9], [-79.2, 42.2], [-82.5, 41.5], [-83.4, 42.0]
    ]
  },
  {
    name: 'Lake Ontario',
    isLake: true,
    points: [
      [-79.8, 43.3], [-76.1, 44.1], [-76.2, 43.4], [-79.3, 43.2], [-79.8, 43.3]
    ]
  },

  // ================= GREENLAND & ICELAND =================
  {
    name: 'Greenland',
    points: [
      [-70.0, 77.5], [-60.0, 81.5], [-40.0, 83.4], [-20.0, 81.8], [-18.0, 76.5],
      [-22.0, 70.5], [-32.0, 68.0], [-38.0, 65.5], [-43.5, 60.0], [-48.5, 61.0],
      [-51.5, 64.0], [-54.0, 68.0], [-56.0, 73.0], [-60.0, 75.5], [-70.0, 77.5]
    ]
  },
  {
    name: 'Iceland',
    points: [
      [-24.2, 65.8], [-21.5, 66.4], [-14.0, 66.2], [-13.5, 64.5], [-19.0, 63.4],
      [-22.8, 63.9], [-24.2, 65.8]
    ]
  },

  // ================= CARIBBEAN ARCHIPELAGO & BAHAMAS (HD Cruise Region) =================
  {
    name: 'Cuba',
    points: [
      [-84.95, 21.85], [-83.5, 22.8], [-82.0, 23.15], [-80.0, 22.9], [-77.8, 21.8],
      [-75.5, 20.8], [-74.15, 20.2], [-75.2, 19.9], [-77.7, 19.85], [-78.2, 20.6],
      [-80.2, 21.6], [-82.2, 22.1], [-83.8, 22.1], [-84.95, 21.85]
    ]
  },
  {
    name: 'Hispaniola (Haiti & Dominican Republic)',
    points: [
      [-74.45, 18.5], [-73.2, 19.9], [-71.2, 19.9], [-69.2, 19.2], [-68.35, 18.6],
      [-68.6, 18.1], [-71.5, 17.6], [-72.5, 18.2], [-74.45, 18.2], [-74.45, 18.5]
    ]
  },
  {
    name: 'Jamaica',
    points: [
      [-78.35, 18.3], [-77.2, 18.45], [-76.2, 17.95], [-77.3, 17.75], [-78.35, 18.2], [-78.35, 18.3]
    ]
  },
  {
    name: 'Puerto Rico',
    points: [
      [-67.25, 18.5], [-65.6, 18.4], [-65.6, 17.95], [-67.2, 17.95], [-67.25, 18.5]
    ]
  },
  {
    name: 'Grand Bahama & Abaco',
    points: [
      [-79.0, 26.7], [-77.0, 26.8], [-77.0, 26.0], [-78.9, 26.5], [-79.0, 26.7]
    ]
  },
  {
    name: 'Andros & New Providence (Bahamas)',
    points: [
      [-78.2, 25.1], [-77.3, 25.1], [-77.5, 23.8], [-78.1, 24.0], [-78.2, 25.1]
    ]
  },
  {
    name: 'Eleuthera & Exuma (Bahamas)',
    points: [
      [-76.7, 25.5], [-75.2, 23.5], [-75.8, 23.2], [-76.9, 25.2], [-76.7, 25.5]
    ]
  },
  {
    name: 'Turks & Caicos',
    points: [
      [-72.4, 21.9], [-71.1, 21.4], [-71.6, 21.2], [-72.5, 21.7], [-72.4, 21.9]
    ]
  },
  {
    name: 'Cozumel',
    points: [
      [-87.0, 20.6], [-86.7, 20.6], [-86.8, 20.25], [-87.05, 20.3], [-87.0, 20.6]
    ]
  },
  {
    name: 'Cayman Islands',
    points: [
      [-81.4, 19.4], [-81.05, 19.35], [-81.1, 19.25], [-81.4, 19.3], [-81.4, 19.4]
    ]
  },
  {
    name: 'Virgin Islands & St. Maarten',
    points: [
      [-65.0, 18.4], [-63.0, 18.1], [-63.1, 17.6], [-64.9, 17.7], [-65.0, 18.4]
    ]
  },
  {
    name: 'Lesser Antilles North (Antigua, Guadeloupe, Dominica)',
    points: [
      [-62.2, 17.2], [-61.2, 16.4], [-61.2, 15.2], [-61.7, 15.2], [-62.0, 16.5], [-62.2, 17.2]
    ]
  },
  {
    name: 'Lesser Antilles South (Martinique, St. Lucia, Barbados, Grenada)',
    points: [
      [-61.2, 14.8], [-59.5, 13.2], [-61.5, 12.0], [-61.8, 12.2], [-61.2, 14.8]
    ]
  },
  {
    name: 'Trinidad & Tobago',
    points: [
      [-61.9, 10.8], [-60.5, 11.3], [-60.9, 10.1], [-61.9, 10.1], [-61.9, 10.8]
    ]
  },
  {
    name: 'Aruba, Bonaire & Curacao',
    points: [
      [-70.1, 12.6], [-68.2, 12.2], [-68.3, 11.9], [-70.1, 12.4], [-70.1, 12.6]
    ]
  },

  // ================= SOUTH AMERICA =================
  {
    name: 'South America Mainland',
    points: [
      [-77.5, 7.2], [-76.8, 8.2], [-75.5, 10.5], [-74.0, 11.2], [-71.8, 12.2],
      [-70.2, 11.5], [-71.5, 10.5], [-71.2, 9.8], [-70.5, 10.2], [-68.0, 10.6],
      [-62.0, 10.7], [-60.0, 8.5], [-58.0, 6.8], [-54.0, 5.8], [-51.0, 4.0],
      [-50.0, 1.5], [-48.0, -0.8], [-44.0, -2.5], [-38.5, -3.8], [-35.2, -5.8],
      [-34.8, -7.5], [-38.5, -13.0], [-39.0, -18.0], [-41.0, -22.0], [-43.2, -23.0],
      [-46.2, -24.0], [-48.5, -26.5], [-49.8, -29.5], [-52.2, -32.2], [-53.5, -34.0],
      [-55.0, -35.0], [-57.5, -35.5], [-56.8, -37.0], [-58.8, -38.8], [-62.2, -39.0],
      [-63.0, -41.0], [-65.0, -43.0], [-65.8, -45.2], [-67.5, -46.5], [-65.8, -48.0],
      [-68.5, -52.5], [-67.0, -54.8], [-70.0, -55.2], [-74.0, -52.5], [-75.5, -48.0],
      [-74.0, -44.0], [-73.2, -39.5], [-71.6, -33.0], [-71.4, -29.5], [-70.5, -23.5],
      [-70.2, -18.5], [-75.5, -14.5], [-77.2, -12.0], [-79.2, -8.0], [-81.3, -4.7],
      [-79.8, -2.5], [-80.8, -0.8], [-79.8, 1.0], [-78.8, 1.8], [-77.5, 4.5],
      [-77.5, 7.2]
    ]
  },
  {
    name: 'Falkland Islands',
    points: [
      [-61.2, -51.2], [-57.8, -51.3], [-58.2, -52.3], [-61.0, -52.1], [-61.2, -51.2]
    ]
  },
  {
    name: 'Galapagos Islands',
    points: [
      [-91.6, -0.2], [-90.2, -0.4], [-90.5, -1.2], [-91.6, -0.9], [-91.6, -0.2]
    ]
  },

  // ================= EUROPE & MEDITERRANEAN (HD Iberia, France, Italy Boot, Greece, Scandinavia, UK) =================
  {
    name: 'Great Britain',
    points: [
      [-5.2, 50.0], [-3.5, 50.3], [-1.2, 50.7], [1.4, 51.3], [0.8, 51.8], [1.7, 52.5],
      [0.2, 53.5], [-0.5, 54.5], [-1.5, 55.5], [-3.0, 56.0], [-1.8, 57.5], [-3.5, 58.6],
      [-5.0, 58.6], [-5.8, 57.5], [-5.5, 56.0], [-4.8, 55.0], [-3.5, 54.5], [-3.1, 53.4],
      [-4.5, 53.3], [-4.1, 52.5], [-5.2, 51.8], [-3.2, 51.4], [-5.2, 50.0]
    ]
  },
  {
    name: 'Ireland',
    points: [
      [-10.2, 51.6], [-9.8, 52.5], [-10.2, 54.0], [-8.5, 55.2], [-6.2, 55.2],
      [-5.5, 54.3], [-6.0, 53.4], [-6.3, 52.2], [-8.0, 51.8], [-10.2, 51.6]
    ]
  },
  {
    name: 'Continental Europe & Scandinavia',
    points: [
      [-9.0, 37.0], [-9.3, 38.8], [-8.8, 42.0], [-9.2, 43.0], [-7.5, 43.7], [-1.8, 43.4],
      [-1.2, 46.0], [-4.8, 48.4], [-1.8, 49.6], [1.6, 50.9], [4.2, 52.0], [5.5, 53.3],
      [8.6, 54.0], [8.2, 57.0], [10.6, 57.7], [10.2, 56.0], [12.5, 55.6], [11.2, 58.5],
      [10.8, 59.8], [7.0, 58.0], [5.0, 60.5], [6.0, 62.5], [10.5, 64.0], [14.5, 67.5],
      [19.0, 69.8], [25.8, 71.1], [31.0, 69.8], [34.0, 69.2], [40.5, 67.5], [38.0, 65.0],
      [42.0, 66.5], [44.0, 68.5], [50.0, 68.8], [60.0, 69.5], [60.0, 55.0], [52.0, 47.0],
      [47.0, 46.0], [40.0, 43.5], [37.5, 45.0], [36.5, 45.5], [33.5, 44.5], [31.0, 46.5],
      [29.6, 45.2], [28.0, 43.0], [29.0, 41.2], [26.0, 40.5], [24.0, 40.2], [23.0, 39.0],
      [24.0, 38.0], [22.5, 36.4], [21.2, 37.8], [20.0, 39.8], [19.4, 41.8], [16.0, 44.0],
      [13.8, 45.5], [12.3, 45.4], [12.6, 44.0], [14.0, 42.5], [16.2, 41.8], [18.5, 40.1],
      [16.8, 39.8], [16.5, 38.8], [15.6, 38.0], [15.8, 38.8], [14.0, 40.8], [12.2, 41.8],
      [10.3, 43.8], [8.9, 44.4], [7.5, 43.8], [5.4, 43.3], [3.2, 42.4], [0.8, 40.8],
      [-0.5, 38.3], [-2.2, 36.8], [-5.4, 36.0], [-6.3, 36.5], [-9.0, 37.0]
    ]
  },
  {
    name: 'Sicily',
    points: [
      [12.4, 37.8], [15.6, 38.2], [15.2, 36.7], [12.6, 37.6], [12.4, 37.8]
    ]
  },
  {
    name: 'Sardinia',
    points: [
      [8.2, 41.2], [9.8, 41.2], [9.6, 39.0], [8.4, 39.0], [8.2, 41.2]
    ]
  },
  {
    name: 'Corsica',
    points: [
      [8.6, 42.8], [9.5, 43.0], [9.4, 41.4], [8.6, 41.6], [8.6, 42.8]
    ]
  },
  {
    name: 'Crete & Cyprus',
    points: [
      [23.5, 35.6], [26.3, 35.2], [26.2, 34.9], [23.5, 35.2], [23.5, 35.6]
    ]
  },

  // ================= AFRICA & MADAGASCAR =================
  {
    name: 'Africa Mainland',
    points: [
      [-5.8, 35.8], [-2.0, 35.2], [3.0, 36.8], [10.5, 37.3], [11.2, 33.5], [15.5, 32.2],
      [20.2, 32.8], [25.0, 31.6], [32.3, 31.3], [33.8, 28.0], [37.2, 22.0], [39.0, 18.0],
      [43.3, 12.6], [49.0, 11.5], [51.4, 11.9], [49.5, 8.0], [45.0, 2.0], [41.0, -1.5],
      [39.5, -6.5], [40.6, -10.5], [40.8, -15.0], [36.5, -18.5], [35.4, -24.0],
      [32.9, -26.0], [31.0, -29.8], [28.0, -32.8], [25.5, -34.0], [20.0, -34.8],
      [18.4, -34.3], [17.8, -32.0], [16.5, -28.6], [14.5, -22.8], [11.8, -17.0],
      [13.2, -12.5], [12.2, -6.0], [9.4, -1.0], [9.5, 4.0], [5.5, 4.5], [2.5, 6.4],
      [-2.0, 4.8], [-7.6, 4.4], [-11.5, 6.8], [-13.6, 9.5], [-16.8, 12.4], [-17.5, 14.7],
      [-16.5, 19.5], [-17.0, 21.0], [-14.8, 24.5], [-13.2, 27.8], [-9.8, 30.5],
      [-9.3, 32.5], [-5.8, 35.8]
    ]
  },
  {
    name: 'Madagascar',
    points: [
      [49.3, -12.0], [50.5, -15.2], [49.8, -19.0], [47.2, -25.0], [45.1, -25.6],
      [43.6, -22.5], [44.5, -19.5], [46.3, -15.8], [48.2, -13.5], [49.3, -12.0]
    ]
  },

  // ================= ASIA & MIDDLE EAST =================
  {
    name: 'Asia & Middle East Mainland',
    points: [
      [26.2, 40.0], [29.0, 41.2], [35.0, 42.0], [41.5, 41.5], [40.0, 43.5], [47.0, 46.0],
      [52.0, 47.0], [60.0, 55.0], [60.0, 69.5], [68.0, 71.0], [73.0, 72.5], [82.0, 73.5],
      [92.0, 75.5], [105.0, 77.5], [114.0, 74.0], [128.0, 72.5], [140.0, 73.0],
      [152.0, 71.0], [162.0, 69.5], [172.0, 68.5], [179.9, 66.5], [179.9, 62.5],
      [172.0, 60.5], [163.0, 59.5], [160.0, 55.0], [156.5, 51.0], [158.0, 53.5],
      [162.0, 56.5], [158.0, 59.0], [150.0, 59.5], [142.0, 59.0], [139.0, 54.0],
      [141.0, 51.5], [136.0, 45.0], [131.0, 42.5], [129.5, 38.5], [129.0, 35.2],
      [126.5, 34.5], [126.2, 37.5], [124.2, 39.8], [121.5, 39.0], [122.5, 37.0],
      [120.2, 35.0], [121.8, 31.0], [120.5, 27.5], [117.0, 23.5], [114.0, 22.2],
      [109.8, 20.2], [108.5, 21.5], [106.5, 20.5], [108.2, 16.0], [109.2, 12.5],
      [104.8, 8.8], [103.0, 11.5], [100.5, 13.5], [99.2, 10.0], [101.8, 6.2],
      [104.2, 1.4], [101.5, 3.0], [98.5, 7.8], [98.2, 15.8], [94.5, 16.0], [92.2, 20.5],
      [89.0, 22.0], [87.0, 20.8], [82.2, 17.0], [80.2, 13.0], [77.5, 8.1], [75.0, 12.5],
      [72.8, 19.0], [72.5, 21.5], [69.0, 22.5], [67.0, 24.8], [61.5, 25.2], [56.5, 27.0],
      [51.5, 29.0], [48.5, 30.0], [50.0, 26.5], [51.5, 24.5], [55.5, 24.5], [59.8, 22.5],
      [56.5, 18.0], [49.0, 14.5], [43.5, 12.6], [42.5, 16.5], [39.0, 21.5], [35.0, 28.0],
      [33.8, 28.0], [32.5, 30.0], [34.5, 31.5], [35.8, 35.8], [36.2, 36.8], [32.8, 36.2],
      [27.5, 37.0], [26.2, 40.0]
    ]
  },
  {
    name: 'Chukotka Peninsula East Tip',
    points: [
      [-179.9, 66.5], [-170.0, 66.0], [-172.0, 64.5], [-179.9, 62.5], [-179.9, 66.5]
    ]
  },
  {
    name: 'Caspian Sea (Inland Water)',
    isLake: true,
    points: [
      [47.0, 46.0], [51.5, 45.0], [53.5, 41.0], [54.0, 37.5], [50.5, 37.2],
      [49.0, 40.5], [47.5, 43.0], [47.0, 46.0]
    ]
  },
  {
    name: 'Sri Lanka',
    points: [
      [79.8, 9.8], [81.8, 8.2], [81.2, 6.0], [79.8, 6.8], [79.8, 9.8]
    ]
  },
  {
    name: 'Japan (Honshu & Kyushu)',
    points: [
      [140.8, 41.5], [142.0, 39.5], [141.0, 38.0], [140.8, 35.8], [139.0, 34.8],
      [136.8, 34.2], [134.5, 33.5], [131.5, 31.2], [130.2, 31.5], [129.8, 33.5],
      [132.5, 35.5], [136.5, 37.2], [139.5, 39.5], [140.8, 41.5]
    ]
  },
  {
    name: 'Japan (Hokkaido)',
    points: [
      [141.8, 45.5], [145.5, 43.4], [143.2, 42.0], [140.2, 41.8], [141.8, 45.5]
    ]
  },
  {
    name: 'Taiwan',
    points: [
      [121.5, 25.3], [122.0, 24.5], [120.8, 21.9], [120.1, 23.2], [121.5, 25.3]
    ]
  },
  {
    name: 'Philippines (Luzon & Mindanao)',
    points: [
      [120.5, 18.5], [122.5, 16.5], [124.2, 13.0], [126.2, 9.5], [125.5, 6.0],
      [122.0, 7.0], [121.0, 12.5], [119.8, 16.0], [120.5, 18.5]
    ]
  },
  {
    name: 'Sumatra (Indonesia)',
    points: [
      [95.3, 5.8], [100.0, 2.0], [104.5, -2.5], [105.8, -5.8], [103.5, -5.5],
      [98.8, 0.5], [95.3, 5.8]
    ]
  },
  {
    name: 'Java (Indonesia)',
    points: [
      [105.2, -6.0], [114.5, -7.8], [114.2, -8.7], [105.5, -6.8], [105.2, -6.0]
    ]
  },
  {
    name: 'Borneo',
    points: [
      [115.0, 6.5], [119.0, 4.5], [117.5, -1.0], [114.5, -4.0], [110.2, -3.0],
      [109.0, 1.8], [113.0, 4.5], [115.0, 6.5]
    ]
  },
  {
    name: 'Sulawesi',
    points: [
      [120.5, 1.2], [125.2, 1.5], [123.0, -3.5], [120.5, -5.5], [119.0, -2.5], [120.5, 1.2]
    ]
  },

  // ================= OCEANIA & AUSTRALIA =================
  {
    name: 'New Guinea',
    points: [
      [131.0, -1.0], [136.0, -2.0], [142.0, -3.5], [148.0, -6.5], [150.8, -10.5],
      [147.0, -9.5], [141.0, -8.5], [135.0, -4.5], [131.0, -1.0]
    ]
  },
  {
    name: 'Australia Mainland',
    points: [
      [113.5, -22.0], [118.5, -20.2], [122.2, -17.0], [126.0, -14.0], [130.8, -12.4],
      [136.5, -12.0], [136.0, -15.0], [139.5, -17.5], [141.5, -15.0], [142.5, -10.8],
      [145.5, -15.5], [149.0, -20.5], [153.2, -25.5], [153.6, -28.5], [151.2, -33.8],
      [150.0, -37.5], [146.5, -38.8], [144.0, -38.5], [139.0, -35.8], [136.0, -35.0],
      [133.5, -32.2], [128.0, -32.0], [123.5, -34.0], [118.0, -35.0], [115.0, -34.2],
      [114.0, -28.0], [113.5, -22.0]
    ]
  },
  {
    name: 'Tasmania',
    points: [
      [144.8, -40.8], [148.3, -41.0], [147.8, -43.5], [145.5, -43.3], [144.8, -40.8]
    ]
  },
  {
    name: 'New Zealand North Island',
    points: [
      [172.8, -34.5], [175.8, -36.8], [178.5, -37.8], [176.5, -40.5], [174.8, -41.5],
      [173.8, -39.2], [174.5, -36.8], [172.8, -34.5]
    ]
  },
  {
    name: 'New Zealand South Island',
    points: [
      [173.8, -40.8], [174.2, -42.0], [172.8, -43.8], [170.5, -46.0], [167.5, -46.6],
      [166.5, -45.5], [170.0, -43.2], [172.5, -41.0], [173.8, -40.8]
    ]
  },
  {
    name: 'Hawaiian Islands',
    points: [
      [-156.0, 20.2], [-154.8, 19.5], [-155.8, 18.9], [-156.0, 20.2]
    ]
  }
];

/**
 * Major International Country Borders [lng, lat][]
 * Rendered as subtle tactical lines across landmasses so individual countries stand out cleanly.
 */
const HD_COUNTRY_BORDERS: Array<{ name: string; points: [number, number][] }> = [
  // ================= NORTH & CENTRAL AMERICA =================
  {
    name: 'USA - Canada (Main 49th Parallel & Eastern Border)',
    points: [
      [-123.2, 49.0], [-95.1, 49.0], [-92.1, 48.0], [-88.0, 48.0], [-84.0, 46.5],
      [-82.5, 43.0], [-79.0, 43.2], [-74.7, 45.0], [-71.5, 45.0], [-67.8, 47.2], [-67.0, 45.2]
    ]
  },
  {
    name: 'USA - Canada (Alaska - Yukon/BC)',
    points: [
      [-141.0, 69.6], [-141.0, 60.0], [-135.0, 59.0], [-130.0, 55.0]
    ]
  },
  {
    name: 'USA - Mexico (Pacific to Gulf of Mexico)',
    points: [
      [-117.1, 32.5], [-114.8, 32.7], [-111.0, 31.3], [-108.2, 31.3], [-106.5, 31.8],
      [-104.5, 29.5], [-103.0, 29.0], [-101.4, 29.8], [-99.5, 27.5], [-97.1, 25.9]
    ]
  },
  {
    name: 'Mexico - Guatemala & Belize',
    points: [
      [-92.2, 14.5], [-91.4, 16.0], [-90.5, 17.8], [-89.1, 17.8], [-88.3, 18.5]
    ]
  },
  {
    name: 'Guatemala - Belize & Honduras/El Salvador',
    points: [
      [-89.1, 17.8], [-89.2, 15.9], [-88.2, 15.7], [-89.3, 14.4], [-90.1, 13.8]
    ]
  },
  {
    name: 'Honduras - Nicaragua',
    points: [
      [-83.2, 15.0], [-85.5, 14.0], [-87.5, 13.0]
    ]
  },
  {
    name: 'Nicaragua - Costa Rica',
    points: [
      [-83.7, 10.9], [-85.6, 11.2]
    ]
  },
  {
    name: 'Costa Rica - Panama',
    points: [
      [-82.5, 9.6], [-82.9, 8.3]
    ]
  },
  {
    name: 'Panama - Colombia',
    points: [
      [-77.2, 8.6], [-77.9, 7.2]
    ]
  },
  {
    name: 'Haiti - Dominican Republic (Hispaniola)',
    points: [
      [-71.8, 19.7], [-71.7, 18.9], [-71.8, 18.0]
    ]
  },

  // ================= SOUTH AMERICA =================
  {
    name: 'Colombia - Venezuela',
    points: [
      [-71.8, 12.2], [-72.5, 9.0], [-72.0, 7.0], [-67.8, 6.2], [-67.0, 1.8]
    ]
  },
  {
    name: 'Venezuela - Guyana',
    points: [
      [-60.0, 8.5], [-61.4, 6.0], [-60.7, 5.2]
    ]
  },
  {
    name: 'Guyana - Suriname',
    points: [
      [-57.1, 6.0], [-58.0, 4.0], [-56.5, 2.0]
    ]
  },
  {
    name: 'Suriname - French Guiana',
    points: [
      [-54.0, 5.8], [-54.2, 4.0], [-54.5, 2.2]
    ]
  },
  {
    name: 'French Guiana - Brazil',
    points: [
      [-51.6, 4.0], [-53.0, 2.2]
    ]
  },
  {
    name: 'Brazil Northern Border (Venezuela, Guyana, Suriname)',
    points: [
      [-67.0, 1.8], [-64.0, 3.8], [-60.7, 5.2], [-59.8, 3.3], [-58.5, 1.5],
      [-56.5, 2.0], [-53.0, 2.2]
    ]
  },
  {
    name: 'Colombia - Ecuador & Peru',
    points: [
      [-78.8, 1.4], [-77.6, 0.8], [-75.2, -0.1], [-71.0, -2.2], [-70.0, -4.2]
    ]
  },
  {
    name: 'Ecuador - Peru',
    points: [
      [-80.3, -3.5], [-79.0, -5.0], [-78.4, -3.0], [-75.2, -1.0]
    ]
  },
  {
    name: 'Brazil Western Border (Colombia, Peru, Bolivia)',
    points: [
      [-67.0, 1.8], [-70.0, -4.2], [-73.8, -7.4], [-70.5, -11.0], [-65.3, -10.5],
      [-60.2, -14.0], [-57.8, -19.0]
    ]
  },
  {
    name: 'Peru - Bolivia & Chile',
    points: [
      [-69.6, -11.0], [-69.0, -14.5], [-69.4, -17.5], [-70.4, -18.3]
    ]
  },
  {
    name: 'Bolivia - Chile, Argentina & Paraguay',
    points: [
      [-69.4, -17.5], [-68.0, -22.5], [-62.6, -22.2], [-61.9, -20.0], [-58.2, -20.2]
    ]
  },
  {
    name: 'Paraguay - Brazil & Argentina',
    points: [
      [-57.8, -19.0], [-57.6, -22.1], [-54.3, -24.0], [-54.6, -25.6], [-58.6, -27.3],
      [-57.6, -25.3], [-62.6, -22.2]
    ]
  },
  {
    name: 'Brazil - Argentina & Uruguay',
    points: [
      [-54.6, -25.6], [-53.7, -26.8], [-57.6, -30.2], [-53.4, -33.7]
    ]
  },
  {
    name: 'Uruguay - Argentina',
    points: [
      [-57.6, -30.2], [-58.4, -34.0]
    ]
  },
  {
    name: 'Chile - Argentina (Andes Spine)',
    points: [
      [-68.0, -22.5], [-68.5, -27.0], [-70.0, -33.0], [-71.0, -39.0], [-72.0, -46.0],
      [-73.0, -50.0], [-68.6, -52.3], [-68.6, -54.9]
    ]
  },

  // ================= EUROPE =================
  {
    name: 'Portugal - Spain',
    points: [
      [-8.8, 41.8], [-6.2, 41.5], [-7.0, 39.0], [-7.4, 37.2]
    ]
  },
  {
    name: 'Spain - France (Pyrenees)',
    points: [
      [-1.8, 43.4], [0.5, 42.7], [3.2, 42.4]
    ]
  },
  {
    name: 'France - Belgium, Germany, Switzerland & Italy',
    points: [
      [2.5, 51.1], [4.2, 50.0], [6.0, 49.5], [8.2, 49.0], [7.6, 47.6],
      [6.0, 46.2], [6.8, 45.8], [7.0, 44.2], [7.5, 43.8]
    ]
  },
  {
    name: 'Netherlands & Belgium - Germany',
    points: [
      [3.4, 51.4], [5.8, 51.2], [6.2, 51.8], [7.2, 53.3]
    ]
  },
  {
    name: 'Germany - Denmark',
    points: [
      [8.6, 54.9], [9.5, 54.8]
    ]
  },
  {
    name: 'Germany - Poland & Czechia',
    points: [
      [14.2, 53.9], [14.7, 51.0], [12.1, 50.3], [13.8, 48.8]
    ]
  },
  {
    name: 'Germany & Austria - Switzerland & Italy',
    points: [
      [7.6, 47.6], [9.6, 47.5], [13.0, 47.8], [13.8, 48.8], [16.9, 48.0],
      [16.5, 46.8], [13.7, 46.5], [13.8, 45.6]
    ]
  },
  {
    name: 'Poland - Czechia, Slovakia, Ukraine & Belarus',
    points: [
      [14.7, 51.0], [18.9, 49.5], [22.6, 49.1], [24.1, 50.5], [23.9, 52.0], [23.5, 54.0]
    ]
  },
  {
    name: 'Hungary, Romania & Balkans',
    points: [
      [16.9, 48.0], [22.9, 48.0], [26.6, 48.2], [28.2, 45.5], [28.6, 43.7],
      [22.7, 44.2], [19.0, 45.9], [16.5, 46.8]
    ]
  },
  {
    name: 'Greece Northern Border',
    points: [
      [20.0, 39.8], [21.0, 40.9], [23.0, 41.3], [26.2, 41.7], [26.0, 40.8]
    ]
  },
  {
    name: 'Norway - Sweden & Finland',
    points: [
      [11.2, 59.0], [12.3, 61.5], [14.0, 64.5], [18.0, 68.5], [20.6, 69.0],
      [24.2, 67.0], [24.1, 65.8]
    ]
  },
  {
    name: 'Finland - Russia',
    points: [
      [27.8, 60.5], [31.5, 62.5], [30.0, 66.0], [29.0, 69.0]
    ]
  },
  {
    name: 'Baltic States & Ukraine - Russia/Belarus',
    points: [
      [28.2, 59.4], [27.5, 57.5], [28.2, 56.0], [26.6, 55.3], [23.5, 54.0],
      [24.1, 51.5], [30.5, 52.0], [34.0, 52.2], [38.0, 50.0], [40.2, 49.3], [38.2, 47.1]
    ]
  },

  // ================= AFRICA & MIDDLE EAST =================
  {
    name: 'Morocco - Algeria',
    points: [
      [-2.2, 35.1], [-1.2, 32.2], [-4.5, 30.0], [-8.7, 28.5]
    ]
  },
  {
    name: 'Algeria - Tunisia & Libya',
    points: [
      [8.6, 36.9], [7.5, 33.0], [9.5, 30.2], [11.9, 23.5]
    ]
  },
  {
    name: 'Libya - Egypt',
    points: [
      [25.1, 31.6], [25.0, 22.0]
    ]
  },
  {
    name: 'Egypt - Sudan (22nd Parallel)',
    points: [
      [25.0, 22.0], [36.9, 22.0]
    ]
  },
  {
    name: 'Sahel & East Africa (Chad, Sudan, Ethiopia, Kenya, Somalia)',
    points: [
      [11.9, 23.5], [24.0, 19.5], [22.5, 13.0], [35.0, 11.5], [36.5, 14.5],
      [38.5, 18.0], [42.8, 11.0], [47.0, 8.0], [42.0, 4.2], [36.0, 4.5],
      [34.0, 1.0], [34.0, -1.0], [37.6, -3.2], [39.2, -4.7]
    ]
  },
  {
    name: 'Southern Africa (Namibia, Botswana, Zimbabwe, South Africa)',
    points: [
      [16.5, -28.6], [20.0, -28.5], [20.0, -25.0], [26.0, -24.6], [29.4, -22.2],
      [31.5, -22.4], [32.0, -26.0], [32.9, -26.8]
    ]
  },
  {
    name: 'Turkey - Syria, Iraq, Iran & Caucasus',
    points: [
      [36.0, 36.8], [42.4, 37.1], [44.8, 39.7], [41.5, 41.5]
    ]
  },
  {
    name: 'Levant & Arabian Peninsula (Israel, Jordan, Iraq, Saudi Arabia, Yemen, Oman)',
    points: [
      [34.3, 31.2], [35.5, 32.7], [39.0, 33.4], [42.0, 32.0], [47.5, 29.1],
      [48.5, 30.0], [46.0, 33.5], [44.8, 37.1]
    ]
  },
  {
    name: 'Saudi Arabia - Yemen & Oman',
    points: [
      [42.8, 16.5], [47.0, 17.0], [52.0, 19.0], [55.2, 22.5], [51.5, 24.2]
    ]
  },
  {
    name: 'Iran - Afghanistan & Pakistan',
    points: [
      [61.2, 35.6], [60.8, 31.0], [63.2, 27.2], [61.6, 25.2]
    ]
  },

  // ================= ASIA & OCEANIA =================
  {
    name: 'Russia - Kazakhstan Border',
    points: [
      [48.0, 47.0], [51.0, 51.5], [61.0, 51.0], [70.0, 55.0], [80.0, 51.0], [87.3, 49.1]
    ]
  },
  {
    name: 'Russia - Mongolia & China Border',
    points: [
      [87.3, 49.1], [95.0, 50.5], [106.0, 50.3], [116.0, 49.8], [121.0, 53.3],
      [127.5, 50.0], [135.0, 48.5], [131.0, 42.5]
    ]
  },
  {
    name: 'Mongolia - China Southern Border',
    points: [
      [87.8, 49.0], [96.0, 43.0], [105.0, 42.0], [111.5, 43.5], [119.8, 46.8], [116.0, 49.8]
    ]
  },
  {
    name: 'India - Pakistan Border',
    points: [
      [68.2, 23.8], [70.0, 27.0], [74.5, 31.5], [74.8, 34.5], [77.0, 35.5]
    ]
  },
  {
    name: 'India - China, Nepal & Bhutan (Himalayas)',
    points: [
      [77.0, 35.5], [80.0, 31.0], [88.0, 27.8], [92.0, 27.8], [97.4, 28.2]
    ]
  },
  {
    name: 'India - Bangladesh & Myanmar',
    points: [
      [88.5, 26.5], [89.8, 25.2], [92.4, 25.0], [92.7, 22.0], [94.5, 25.0], [97.4, 28.2]
    ]
  },
  {
    name: 'China - Myanmar, Laos & Vietnam',
    points: [
      [97.4, 28.2], [98.8, 24.0], [101.5, 21.5], [104.0, 22.8], [108.0, 21.5]
    ]
  },
  {
    name: 'Southeast Asia (Thailand, Myanmar, Laos, Cambodia, Vietnam)',
    points: [
      [98.5, 10.0], [99.0, 14.5], [98.0, 18.5], [100.5, 20.4], [104.8, 17.4],
      [105.5, 14.4], [102.5, 13.5], [102.9, 11.7]
    ]
  },
  {
    name: 'China - North Korea & South Korea DMZ',
    points: [
      [124.3, 40.0], [128.0, 42.0], [130.6, 42.5], [128.4, 38.6], [126.2, 37.8]
    ]
  },
  {
    name: 'Papua New Guinea - Indonesia (New Guinea Island)',
    points: [
      [141.0, -2.6], [141.0, -9.1]
    ]
  }
];

/**
 * Generates an ultra-crisp 4K HD (4096x2048) Caribbean Navigation World Map Canvas Texture.
 * Designed for high contrast between sapphire ocean bathymetry and vibrant tropical emerald landmasses.
 */
export function createWorldGlobeTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 4096;
  canvas.height = 2048;
  const ctx = canvas.getContext('2d')!;

  const lngToX = (lng: number) => ((lng + 180) / 360) * canvas.width;
  const latToY = (lat: number) => ((90 - lat) / 180) * canvas.height;

  // 1. Rich Deep Sapphire Ocean Bathymetry Gradient
  const oceanGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
  oceanGrad.addColorStop(0, '#021221');
  oceanGrad.addColorStop(0.25, '#042038');
  oceanGrad.addColorStop(0.5, '#072E4E'); // Deep Caribbean sapphire
  oceanGrad.addColorStop(0.75, '#042038');
  oceanGrad.addColorStop(1, '#021221');
  ctx.fillStyle = oceanGrad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // 2. Subtle Nautical Lat/Lng Graticule Grid (every 15 degrees)
  ctx.lineWidth = 1.5;
  ctx.strokeStyle = 'rgba(0, 229, 195, 0.12)';
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
  ctx.lineWidth = 2.5;
  ctx.strokeStyle = 'rgba(0, 245, 212, 0.32)';
  [0, 23.436, -23.436].forEach(lat => {
    const y = latToY(lat);
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  });

  // Separate landmasses from inland lakes
  const landmasses = HD_WORLD_POLYGONS.filter(p => !p.isLake);
  const inlandLakes = HD_WORLD_POLYGONS.filter(p => p.isLake);

  // 3. PASS 1: Render Shallow Coral Reef / Continental Shelf Outer Glow around all landmasses
  ctx.save();
  ctx.shadowColor = 'rgba(0, 245, 212, 0.55)';
  ctx.shadowBlur = 28;
  ctx.fillStyle = '#156064';
  landmasses.forEach(poly => {
    ctx.beginPath();
    poly.points.forEach(([lng, lat], idx) => {
      const x = lngToX(lng);
      const y = latToY(lat);
      if (idx === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.closePath();
    ctx.fill();
  });
  ctx.restore();

  // 4. PASS 2A: High-Contrast Emerald-Teal Landmass Fill
  const landGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
  landGrad.addColorStop(0, '#1B6E6A');
  landGrad.addColorStop(0.35, '#218378');
  landGrad.addColorStop(0.5, '#279685'); // Vibrant tropical emerald at equator/Caribbean
  landGrad.addColorStop(0.65, '#218378');
  landGrad.addColorStop(1, '#1B6E6A');

  landmasses.forEach(poly => {
    ctx.beginPath();
    poly.points.forEach(([lng, lat], idx) => {
      const x = lngToX(lng);
      const y = latToY(lat);
      if (idx === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.closePath();
    ctx.fillStyle = landGrad;
    ctx.fill();
  });

  // 5. PASS 2B: Render Faint Major Country Borders across landmasses
  ctx.save();
  ctx.setLineDash([7, 5]);
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  HD_COUNTRY_BORDERS.forEach(border => {
    ctx.beginPath();
    border.points.forEach(([lng, lat], idx) => {
      const x = lngToX(lng);
      const y = latToY(lat);
      if (idx === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    // Subtle soft glow underneath country border
    ctx.lineWidth = 2.6;
    ctx.strokeStyle = 'rgba(0, 245, 212, 0.22)';
    ctx.stroke();

    // Crisp faint inner dashed country line
    ctx.lineWidth = 1.4;
    ctx.strokeStyle = 'rgba(175, 255, 244, 0.52)';
    ctx.stroke();
  });
  ctx.restore();

  // 6. PASS 2C: Render Dual-Layer Illuminated Coastal Shorelines on top
  landmasses.forEach(poly => {
    ctx.beginPath();
    poly.points.forEach(([lng, lat], idx) => {
      const x = lngToX(lng);
      const y = latToY(lat);
      if (idx === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.closePath();

    // Outer turquoise shoreline glow
    ctx.lineWidth = 4.0;
    ctx.strokeStyle = 'rgba(0, 245, 212, 0.7)';
    ctx.stroke();

    // Crisp bright inner shoreline edge
    ctx.lineWidth = 1.8;
    ctx.strokeStyle = '#9EFFF0';
    ctx.stroke();
  });

  // 5. PASS 3: Carve out Great Lakes & Caspian Sea as deep sapphire inland waters
  inlandLakes.forEach(lake => {
    ctx.beginPath();
    lake.points.forEach(([lng, lat], idx) => {
      const x = lngToX(lng);
      const y = latToY(lat);
      if (idx === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.closePath();

    ctx.fillStyle = '#05233B';
    ctx.fill();

    ctx.lineWidth = 2.0;
    ctx.strokeStyle = '#00F5D4';
    ctx.stroke();
  });

  // 6. PASS 4: Add subtle illuminated topographic radar dots inside landmasses for depth
  ctx.fillStyle = 'rgba(165, 255, 240, 0.28)';
  for (let lat = -58; lat <= 70; lat += 2.5) {
    for (let lng = -170; lng <= 170; lng += 2.5) {
      const x = Math.floor(lngToX(lng));
      const y = Math.floor(latToY(lat));
      const pixel = ctx.getImageData(x, y, 1, 1).data;
      // Landmass green channel is > 100 (#1B6E6A to #279685 -> G=110..150), Ocean is G < 60
      if (pixel[1] > 95) {
        ctx.fillRect(x, y, 3, 3);
      }
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.anisotropy = 16;
  texture.needsUpdate = true;
  return texture;
}
