/**
 * Initial Roster of Custom Caribbean Cruise Ducks (DUCK-001 to DUCK-025)
 * Hidden by Ivan & Lucas across the ship!
 */

const crypto = require('crypto');

const QR_SECRET_SALT = process.env.QR_SECRET_SALT || 'operation-rubber-duck-caribbean-2026-salt';

function generateDuckSignature(duckId) {
  return crypto
    .createHmac('sha256', QR_SECRET_SALT)
    .update(duckId.toUpperCase().trim())
    .digest('hex')
    .slice(0, 8);
}

// Ship's Current Position in the Caribbean (Grand Turk / Eastern Caribbean Corridor)
const SHIP_POSITION = {
  name: 'Caribbean Sea (Grand Turk / St. Thomas Corridor)',
  lat: 21.4691,
  lng: -71.1399
};

const INITIAL_DUCKS = [
  {
    duckId: 'DUCK-001',
    name: 'Captain Barnaby Quack',
    theme: 'Caribbean Pirate Captain',
    originDeck: 'Deck 11 - Lido Poolside Tiki Bar',
    findCount: 3,
    firstFoundAt: '2026-09-13T14:20:00.000Z',
    lastFoundAt: '2026-09-13T21:10:00.000Z',
    lastFoundByCity: 'Seattle, WA, USA',
    signatureHash: generateDuckSignature('DUCK-001'),
    active: true
  },
  {
    duckId: 'DUCK-002',
    name: 'Sunny Piña Colada',
    theme: 'Tropical Pineapple Duck',
    originDeck: 'Deck 10 - Serenity Sun Deck',
    findCount: 2,
    firstFoundAt: '2026-09-13T15:05:00.000Z',
    lastFoundAt: '2026-09-13T19:45:00.000Z',
    lastFoundByCity: 'Toronto, Canada',
    signatureHash: generateDuckSignature('DUCK-002'),
    active: true
  },
  {
    duckId: 'DUCK-003',
    name: 'First Mate Coral',
    theme: 'Snorkel & Reef Explorer',
    originDeck: 'Deck 5 - Royal Promenade Aft',
    findCount: 2,
    firstFoundAt: '2026-09-13T16:12:00.000Z',
    lastFoundAt: '2026-09-13T22:05:00.000Z',
    lastFoundByCity: 'London, United Kingdom',
    signatureHash: generateDuckSignature('DUCK-003'),
    active: true
  },
  {
    duckId: 'DUCK-004',
    name: 'Admiral Turquoise',
    theme: 'Nautical Helm Duck',
    originDeck: 'Deck 8 - Central Park Tropical Garden',
    findCount: 1,
    firstFoundAt: '2026-09-13T17:30:00.000Z',
    lastFoundAt: '2026-09-13T17:30:00.000Z',
    lastFoundByCity: 'Sydney, Australia',
    signatureHash: generateDuckSignature('DUCK-004'),
    active: true
  },
  {
    duckId: 'DUCK-005',
    name: 'Mango Calypso',
    theme: 'Steel Drum Island Musician',
    originDeck: 'Deck 14 - Observation Lounge Forward',
    findCount: 2,
    firstFoundAt: '2026-09-13T18:15:00.000Z',
    lastFoundAt: '2026-09-13T22:40:00.000Z',
    lastFoundByCity: 'Tokyo, Japan',
    signatureHash: generateDuckSignature('DUCK-005'),
    active: true
  },
  {
    duckId: 'DUCK-006',
    name: 'Sailor Shellby',
    theme: 'Conch Shell Diver',
    originDeck: 'Deck 6 - Schooner Piano Bar',
    findCount: 1,
    firstFoundAt: '2026-09-13T19:00:00.000Z',
    lastFoundAt: '2026-09-13T19:00:00.000Z',
    lastFoundByCity: 'Chicago, IL, USA',
    signatureHash: generateDuckSignature('DUCK-006'),
    active: true
  },
  {
    duckId: 'DUCK-007',
    name: 'Agent 007 Quack',
    theme: 'Casino Royale Tuxedo Duck',
    originDeck: 'Deck 4 - Casino Royale Entrance',
    findCount: 1,
    firstFoundAt: '2026-09-13T20:10:00.000Z',
    lastFoundAt: '2026-09-13T20:10:00.000Z',
    lastFoundByCity: 'São Paulo, Brazil',
    signatureHash: generateDuckSignature('DUCK-007'),
    active: true
  },
  {
    duckId: 'DUCK-008',
    name: 'Bimini Breeze',
    theme: 'Sunglasses & Flip-Flops',
    originDeck: 'Deck 12 - Mini Golf Course Hole 7',
    findCount: 1,
    firstFoundAt: '2026-09-13T20:45:00.000Z',
    lastFoundAt: '2026-09-13T20:45:00.000Z',
    lastFoundByCity: 'Munich, Germany',
    signatureHash: generateDuckSignature('DUCK-008'),
    active: true
  },
  {
    duckId: 'DUCK-009',
    name: 'Cozumel Cruiser',
    theme: 'Fiesta Sombrero Duck',
    originDeck: 'Deck 15 - Solarium Hot Tub Palm',
    findCount: 0,
    firstFoundAt: null,
    lastFoundAt: null,
    lastFoundByCity: null,
    signatureHash: generateDuckSignature('DUCK-009'),
    active: true
  },
  {
    duckId: 'DUCK-010',
    name: 'Navigator Lucas',
    theme: 'Junior Captain Golden Duck',
    originDeck: 'Deck 11 - Soft Serve Ice Cream Station',
    findCount: 1,
    firstFoundAt: '2026-09-13T21:30:00.000Z',
    lastFoundAt: '2026-09-13T21:30:00.000Z',
    lastFoundByCity: 'Miami, FL, USA',
    signatureHash: generateDuckSignature('DUCK-010'),
    active: true
  },
  {
    duckId: 'DUCK-011',
    name: 'Nassau Nightjar',
    theme: 'Starlight Glow Duck',
    originDeck: 'Deck 7 - Library & Card Room',
    findCount: 0,
    firstFoundAt: null,
    lastFoundAt: null,
    lastFoundByCity: null,
    signatureHash: generateDuckSignature('DUCK-011'),
    active: true
  },
  {
    duckId: 'DUCK-012',
    name: 'Commander Ivan',
    theme: 'Fleet Architect Duck',
    originDeck: 'Deck 5 - Guest Services Atrium',
    findCount: 1,
    firstFoundAt: '2026-09-13T22:15:00.000Z',
    lastFoundAt: '2026-09-13T22:15:00.000Z',
    lastFoundByCity: 'Austin, TX, USA',
    signatureHash: generateDuckSignature('DUCK-012'),
    active: true
  }
];

// Generate remaining ducks up to DUCK-025 so hiders have a full ready-to-print fleet
const THEMES = [
  'Sunset Hammock Duck',
  'St. Thomas Treasure Hunter',
  'Bahama Mama Flamingo Duck',
  'Reggae Beach Surfer',
  'Deep Sea Scuba Quack',
  'Castaway Island Explorer',
  'Key West Conch Cruiser',
  'San Juan Fortress Sentry',
  'Tiki Torch Guardian',
  'Dolphin Whisperer Duck',
  'Starboard Watch Lookout',
  'Coconut Cabana VIP',
  'Golden Compass Navigator'
];

for (let i = 13; i <= 25; i++) {
  const num = String(i).padStart(3, '0');
  const duckId = `DUCK-${num}`;
  INITIAL_DUCKS.push({
    duckId,
    name: `Cruiser #${num} (${THEMES[(i - 13) % THEMES.length].split(' ')[0]})`,
    theme: THEMES[(i - 13) % THEMES.length],
    originDeck: `Deck ${(i % 10) + 5} - Secret Cruise Alcove`,
    findCount: 0,
    firstFoundAt: null,
    lastFoundAt: null,
    lastFoundByCity: null,
    signatureHash: generateDuckSignature(duckId),
    active: true
  });
}

const INITIAL_DISCOVERIES = [
  {
    id: 'disc_init_01',
    duckId: 'DUCK-001',
    duckName: 'Captain Barnaby Quack',
    city: 'Seattle',
    region: 'WA',
    country: 'United States',
    countryCode: 'US',
    lat: 47.6062,
    lng: -122.3321,
    distanceMilesToShip: 3310,
    note: 'Ahoy from the Pacific Northwest! Found Captain Barnaby near the Lido pool towels! 🦆🌊',
    deckFound: 'Deck 11 - Lido Poolside Tiki Bar',
    fingerprintHash: 'seed_fp_seattle_01',
    verifiedQrSignature: true,
    createdAt: '2026-09-13T21:10:00.000Z'
  },
  {
    id: 'disc_init_02',
    duckId: 'DUCK-002',
    duckName: 'Sunny Piña Colada',
    city: 'Toronto',
    region: 'Ontario',
    country: 'Canada',
    countryCode: 'CA',
    lat: 43.6532,
    lng: -79.3832,
    distanceMilesToShip: 1584,
    note: 'Kids were so excited to spot Sunny on the Serenity deck! Re-hiding on Deck 8! 🍍☀️',
    deckFound: 'Deck 10 - Serenity Sun Deck',
    fingerprintHash: 'seed_fp_toronto_02',
    verifiedQrSignature: true,
    createdAt: '2026-09-13T19:45:00.000Z'
  },
  {
    id: 'disc_init_03',
    duckId: 'DUCK-003',
    duckName: 'First Mate Coral',
    city: 'London',
    region: 'England',
    country: 'United Kingdom',
    countryCode: 'GB',
    lat: 51.5074,
    lng: -0.1278,
    distanceMilesToShip: 4320,
    note: 'Flew all the way from London for this Caribbean cruise! Brilliant game Ivan & Lucas! 🇬🇧🚢',
    deckFound: 'Deck 5 - Royal Promenade Aft',
    fingerprintHash: 'seed_fp_london_03',
    verifiedQrSignature: true,
    createdAt: '2026-09-13T22:05:00.000Z'
  },
  {
    id: 'disc_init_04',
    duckId: 'DUCK-004',
    duckName: 'Admiral Turquoise',
    city: 'Sydney',
    region: 'NSW',
    country: 'Australia',
    countryCode: 'AU',
    lat: -33.8688,
    lng: 151.2093,
    distanceMilesToShip: 9640,
    note: '9,600+ miles from Sydney Harbour to the Caribbean! Best cruise scavenger hunt ever! 🦘🌴',
    deckFound: 'Deck 8 - Central Park Tropical Garden',
    fingerprintHash: 'seed_fp_sydney_04',
    verifiedQrSignature: true,
    createdAt: '2026-09-13T17:30:00.000Z'
  },
  {
    id: 'disc_init_05',
    duckId: 'DUCK-005',
    duckName: 'Mango Calypso',
    city: 'Tokyo',
    region: 'Kanto',
    country: 'Japan',
    countryCode: 'JP',
    lat: 35.6762,
    lng: 139.6503,
    distanceMilesToShip: 8250,
    note: 'Found Mango Calypso while watching the ocean sunset on Deck 14! Arigato! 🗾🦆',
    deckFound: 'Deck 14 - Observation Lounge Forward',
    fingerprintHash: 'seed_fp_tokyo_05',
    verifiedQrSignature: true,
    createdAt: '2026-09-13T22:40:00.000Z'
  },
  {
    id: 'disc_init_06',
    duckId: 'DUCK-006',
    duckName: 'Sailor Shellby',
    city: 'Chicago',
    region: 'IL',
    country: 'United States',
    countryCode: 'US',
    lat: 41.8781,
    lng: -87.6298,
    distanceMilesToShip: 1680,
    note: 'Found Sailor Shellby sitting on the piano keys! Windy City says ahoy! 🎹🍹',
    deckFound: 'Deck 6 - Schooner Piano Bar',
    fingerprintHash: 'seed_fp_chicago_06',
    verifiedQrSignature: true,
    createdAt: '2026-09-13T19:00:00.000Z'
  },
  {
    id: 'disc_init_07',
    duckId: 'DUCK-007',
    duckName: 'Agent 007 Quack',
    city: 'São Paulo',
    region: 'SP',
    country: 'Brazil',
    countryCode: 'BR',
    lat: -23.5505,
    lng: -46.6333,
    distanceMilesToShip: 3480,
    note: 'Shaken, not stirred! Found Agent 007 near the roulette wheel! 🇧🇷🎲',
    deckFound: 'Deck 4 - Casino Royale Entrance',
    fingerprintHash: 'seed_fp_saopaulo_07',
    verifiedQrSignature: true,
    createdAt: '2026-09-13T20:10:00.000Z'
  },
  {
    id: 'disc_init_08',
    duckId: 'DUCK-008',
    duckName: 'Bimini Breeze',
    city: 'Munich',
    region: 'Bavaria',
    country: 'Germany',
    countryCode: 'DE',
    lat: 48.1351,
    lng: 11.5820,
    distanceMilesToShip: 4850,
    note: 'Hole-in-one surprise on Hole 7! Greetings from Munich! ⛳🏖️',
    deckFound: 'Deck 12 - Mini Golf Course Hole 7',
    fingerprintHash: 'seed_fp_munich_08',
    verifiedQrSignature: true,
    createdAt: '2026-09-13T20:45:00.000Z'
  },
  {
    id: 'disc_init_09',
    duckId: 'DUCK-010',
    duckName: 'Navigator Lucas',
    city: 'Miami',
    region: 'FL',
    country: 'United States',
    countryCode: 'US',
    lat: 25.7617,
    lng: -80.1918,
    distanceMilesToShip: 635,
    note: 'Found Navigator Lucas right by the ice cream cones! 305 cruise crew checking in! 🍦🌴',
    deckFound: 'Deck 11 - Soft Serve Ice Cream Station',
    fingerprintHash: 'seed_fp_miami_09',
    verifiedQrSignature: true,
    createdAt: '2026-09-13T21:30:00.000Z'
  },
  {
    id: 'disc_init_10',
    duckId: 'DUCK-012',
    duckName: 'Commander Ivan',
    city: 'Austin',
    region: 'TX',
    country: 'United States',
    countryCode: 'US',
    lat: 30.2672,
    lng: -97.7431,
    distanceMilesToShip: 1750,
    note: 'Spotted Commander Ivan in the atrium! Hook em from Texas! 🤠⚓',
    deckFound: 'Deck 5 - Guest Services Atrium',
    fingerprintHash: 'seed_fp_austin_10',
    verifiedQrSignature: true,
    createdAt: '2026-09-13T22:15:00.000Z'
  }
];

module.exports = {
  QR_SECRET_SALT,
  SHIP_POSITION,
  INITIAL_DUCKS,
  INITIAL_DISCOVERIES,
  generateDuckSignature
};
