/**
 * Initial Roster of 30 Custom Caribbean Cruise Ducks (DUCK-001 to DUCK-030)
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

const CUSTOM_DUCK_DEFINITIONS = [
  {
    duckId: 'DUCK-001',
    name: 'Captain Barnaby Quack',
    theme: 'Caribbean Pirate Captain',
    originDeck: 'Deck 11 - Lido Poolside Tiki Bar',
    findCount: 3,
    firstFoundAt: '2026-09-13T14:20:00.000Z',
    lastFoundAt: '2026-09-13T21:10:00.000Z',
    lastFoundByCity: 'Seattle, WA, USA'
  },
  {
    duckId: 'DUCK-002',
    name: 'Sunny Piña Colada',
    theme: 'Tropical Pineapple Duck',
    originDeck: 'Deck 10 - Serenity Sun Deck',
    findCount: 2,
    firstFoundAt: '2026-09-13T15:05:00.000Z',
    lastFoundAt: '2026-09-13T19:45:00.000Z',
    lastFoundByCity: 'Toronto, Canada'
  },
  {
    duckId: 'DUCK-003',
    name: 'First Mate Coral',
    theme: 'Snorkel & Reef Explorer',
    originDeck: 'Deck 5 - Royal Promenade Aft',
    findCount: 2,
    firstFoundAt: '2026-09-13T16:12:00.000Z',
    lastFoundAt: '2026-09-13T22:05:00.000Z',
    lastFoundByCity: 'London, United Kingdom'
  },
  {
    duckId: 'DUCK-004',
    name: 'Admiral Turquoise',
    theme: 'Nautical Helm Duck',
    originDeck: 'Deck 8 - Central Park Tropical Garden',
    findCount: 1,
    firstFoundAt: '2026-09-13T17:30:00.000Z',
    lastFoundAt: '2026-09-13T17:30:00.000Z',
    lastFoundByCity: 'Sydney, Australia'
  },
  {
    duckId: 'DUCK-005',
    name: 'Mango Calypso',
    theme: 'Steel Drum Island Musician',
    originDeck: 'Deck 14 - Observation Lounge Forward',
    findCount: 2,
    firstFoundAt: '2026-09-13T18:15:00.000Z',
    lastFoundAt: '2026-09-13T22:40:00.000Z',
    lastFoundByCity: 'Tokyo, Japan'
  },
  {
    duckId: 'DUCK-006',
    name: 'Sailor Shellby',
    theme: 'Conch Shell Diver',
    originDeck: 'Deck 6 - Schooner Piano Bar',
    findCount: 1,
    firstFoundAt: '2026-09-13T19:00:00.000Z',
    lastFoundAt: '2026-09-13T19:00:00.000Z',
    lastFoundByCity: 'Chicago, IL, USA'
  },
  {
    duckId: 'DUCK-007',
    name: 'Agent 007 Quack',
    theme: 'Casino Royale Tuxedo Duck',
    originDeck: 'Deck 4 - Casino Royale Entrance',
    findCount: 1,
    firstFoundAt: '2026-09-13T20:10:00.000Z',
    lastFoundAt: '2026-09-13T20:10:00.000Z',
    lastFoundByCity: 'São Paulo, Brazil'
  },
  {
    duckId: 'DUCK-008',
    name: 'Bimini Breeze',
    theme: 'Sunglasses & Flip-Flops',
    originDeck: 'Deck 12 - Mini Golf Course Hole 7',
    findCount: 1,
    firstFoundAt: '2026-09-13T20:45:00.000Z',
    lastFoundAt: '2026-09-13T20:45:00.000Z',
    lastFoundByCity: 'Munich, Germany'
  },
  {
    duckId: 'DUCK-009',
    name: 'Cozumel Cruiser',
    theme: 'Fiesta Sombrero Duck',
    originDeck: 'Deck 15 - Solarium Hot Tub Palm',
    findCount: 0,
    firstFoundAt: null,
    lastFoundAt: null,
    lastFoundByCity: null
  },
  {
    duckId: 'DUCK-010',
    name: 'Navigator Lucas',
    theme: 'Junior Captain Golden Duck',
    originDeck: 'Deck 11 - Soft Serve Ice Cream Station',
    findCount: 1,
    firstFoundAt: '2026-09-13T21:30:00.000Z',
    lastFoundAt: '2026-09-13T21:30:00.000Z',
    lastFoundByCity: 'Miami, FL, USA'
  },
  {
    duckId: 'DUCK-011',
    name: 'Nassau Nightjar',
    theme: 'Starlight Glow Duck',
    originDeck: 'Deck 7 - Library & Card Room',
    findCount: 0,
    firstFoundAt: null,
    lastFoundAt: null,
    lastFoundByCity: null
  },
  {
    duckId: 'DUCK-012',
    name: 'Commander Ivan',
    theme: 'Fleet Architect Duck',
    originDeck: 'Deck 5 - Guest Services Atrium',
    findCount: 1,
    firstFoundAt: '2026-09-13T22:15:00.000Z',
    lastFoundAt: '2026-09-13T22:15:00.000Z',
    lastFoundByCity: 'Austin, TX, USA'
  },
  {
    duckId: 'DUCK-013',
    name: 'Sunset Hammock Quack',
    theme: 'Sunset Hammock Duck',
    originDeck: 'Deck 10 - Aft Hammock Lounge',
    findCount: 0,
    firstFoundAt: null,
    lastFoundAt: null,
    lastFoundByCity: null
  },
  {
    duckId: 'DUCK-014',
    name: 'St. Thomas Treasure Hunter',
    theme: 'Golden Compass Buccaneer',
    originDeck: 'Deck 6 - Boardwalk Carousel',
    findCount: 0,
    firstFoundAt: null,
    lastFoundAt: null,
    lastFoundByCity: null
  },
  {
    duckId: 'DUCK-015',
    name: 'Bahama Mama Flamingo',
    theme: 'Pink Flamingo Floatie Duck',
    originDeck: 'Deck 11 - Splashaway Bay Waterpark',
    findCount: 0,
    firstFoundAt: null,
    lastFoundAt: null,
    lastFoundByCity: null
  },
  {
    duckId: 'DUCK-016',
    name: 'Reggae Beach Surfer',
    theme: 'Surfboard Wave Rider',
    originDeck: 'Deck 16 - FlowRider Surf Simulator',
    findCount: 0,
    firstFoundAt: null,
    lastFoundAt: null,
    lastFoundByCity: null
  },
  {
    duckId: 'DUCK-017',
    name: 'Deep Sea Scuba Quack',
    theme: 'Scuba Mask & Flippers Duck',
    originDeck: 'Deck 5 - Shore Excursions Desk',
    findCount: 0,
    firstFoundAt: null,
    lastFoundAt: null,
    lastFoundByCity: null
  },
  {
    duckId: 'DUCK-018',
    name: 'Castaway Island Explorer',
    theme: 'Tropical Safari Hat Duck',
    originDeck: 'Deck 8 - Tropical Plant Planter #4',
    findCount: 0,
    firstFoundAt: null,
    lastFoundAt: null,
    lastFoundByCity: null
  },
  {
    duckId: 'DUCK-019',
    name: 'Key West Conch Cruiser',
    theme: 'Key Lime Pie Sailor Duck',
    originDeck: 'Deck 11 - Poolside Towel Station',
    findCount: 0,
    firstFoundAt: null,
    lastFoundAt: null,
    lastFoundByCity: null
  },
  {
    duckId: 'DUCK-020',
    name: 'San Juan Fortress Sentry',
    theme: 'El Morro Castle Guard Duck',
    originDeck: 'Deck 14 - Forward Starboard Overlook',
    findCount: 0,
    firstFoundAt: null,
    lastFoundAt: null,
    lastFoundByCity: null
  },
  {
    duckId: 'DUCK-021',
    name: 'Tiki Torch Guardian',
    theme: 'Polynesian Tiki Mask Duck',
    originDeck: 'Deck 11 - Bamboo Tiki Lounge',
    findCount: 0,
    firstFoundAt: null,
    lastFoundAt: null,
    lastFoundByCity: null
  },
  {
    duckId: 'DUCK-022',
    name: 'Dolphin Whisperer',
    theme: 'Turquoise Dolphin Rider Duck',
    originDeck: 'Deck 12 - Running Track Starboard',
    findCount: 0,
    firstFoundAt: null,
    lastFoundAt: null,
    lastFoundByCity: null
  },
  {
    duckId: 'DUCK-023',
    name: 'Starboard Watch Lookout',
    theme: 'Brass Spyglass Binocular Duck',
    originDeck: 'Deck 14 - Bridge Viewing Window',
    findCount: 0,
    firstFoundAt: null,
    lastFoundAt: null,
    lastFoundByCity: null
  },
  {
    duckId: 'DUCK-024',
    name: 'Coconut Cabana VIP',
    theme: 'Coconut Drink & Umbrella Duck',
    originDeck: 'Deck 15 - VIP Cabana Sun Deck',
    findCount: 0,
    firstFoundAt: null,
    lastFoundAt: null,
    lastFoundByCity: null
  },
  {
    duckId: 'DUCK-025',
    name: 'Golden Compass Navigator',
    theme: 'Astrolabe & Sextant Explorer',
    originDeck: 'Deck 7 - Compass Rose Lounge',
    findCount: 0,
    firstFoundAt: null,
    lastFoundAt: null,
    lastFoundByCity: null
  },
  {
    duckId: 'DUCK-026',
    name: 'Grand Turk Islander',
    theme: 'Turks & Caicos Conch Diver',
    originDeck: 'Deck 4 - Main Dining Room Entrance',
    findCount: 0,
    firstFoundAt: null,
    lastFoundAt: null,
    lastFoundByCity: null
  },
  {
    duckId: 'DUCK-027',
    name: 'Aruba Aloe Breeze',
    theme: 'Divi-Divi Tree Beach Duck',
    originDeck: 'Deck 9 - Elevator Lobby Midship',
    findCount: 0,
    firstFoundAt: null,
    lastFoundAt: null,
    lastFoundByCity: null
  },
  {
    duckId: 'DUCK-028',
    name: 'Curaçao Blue Lagoon',
    theme: 'Rainbow Waterfront Cruiser',
    originDeck: 'Deck 5 - Sorrentos Pizza Counter',
    findCount: 0,
    firstFoundAt: null,
    lastFoundAt: null,
    lastFoundByCity: null
  },
  {
    duckId: 'DUCK-029',
    name: 'St. Maarten Jet Blast',
    theme: 'Maho Beach Pilot Aviator Duck',
    originDeck: 'Deck 12 - Sky Bar Upper Terrace',
    findCount: 0,
    firstFoundAt: null,
    lastFoundAt: null,
    lastFoundByCity: null
  },
  {
    duckId: 'DUCK-030',
    name: 'Captain’s Grand Finale',
    theme: 'Golden Crown Royal Duck #30',
    originDeck: 'Deck 5 - Royal Theater Balcony',
    findCount: 0,
    firstFoundAt: null,
    lastFoundAt: null,
    lastFoundByCity: null
  }
];

const INITIAL_DUCKS = CUSTOM_DUCK_DEFINITIONS.map(d => ({
  ...d,
  signatureHash: generateDuckSignature(d.duckId),
  active: true
}));

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
    distanceMilesToShip: 3346,
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
