/**
 * Initial Roster of 30 Custom Caribbean Cruise Ducks (DUCK-001 to DUCK-030)
 * Hidden by Ivan & Lucas across the ship!
 * All duck names are max 3 words & hilarious for 10-year-olds!
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
    name: 'Sir Quacks-a-Lot',
    theme: 'Pirate Booty Boss',
    originDeck: 'Deck 11 - Lido Poolside Tiki Bar',
    findCount: 3,
    firstFoundAt: '2026-09-13T14:20:00.000Z',
    lastFoundAt: '2026-09-13T21:10:00.000Z',
    lastFoundByCity: 'Seattle, WA, USA'
  },
  {
    duckId: 'DUCK-002',
    name: 'Lord Waddle Butt',
    theme: 'Supreme Poolside Boss',
    originDeck: 'Deck 10 - Serenity Sun Deck',
    findCount: 2,
    firstFoundAt: '2026-09-13T15:05:00.000Z',
    lastFoundAt: '2026-09-13T19:45:00.000Z',
    lastFoundByCity: 'Toronto, Canada'
  },
  {
    duckId: 'DUCK-003',
    name: 'Captain Brain Freeze',
    theme: 'Slushie Patrol Duck',
    originDeck: 'Deck 5 - Royal Promenade Aft',
    findCount: 2,
    firstFoundAt: '2026-09-13T16:12:00.000Z',
    lastFoundAt: '2026-09-13T22:05:00.000Z',
    lastFoundByCity: 'London, United Kingdom'
  },
  {
    duckId: 'DUCK-004',
    name: 'Agent Sneaky Beak',
    theme: 'Undercover Spy Duck',
    originDeck: 'Deck 8 - Central Park Tropical Garden',
    findCount: 1,
    firstFoundAt: '2026-09-13T17:30:00.000Z',
    lastFoundAt: '2026-09-13T17:30:00.000Z',
    lastFoundByCity: 'Sydney, Australia'
  },
  {
    duckId: 'DUCK-005',
    name: 'DJ Disco Quack',
    theme: 'Dance Floor Legend',
    originDeck: 'Deck 14 - Observation Lounge Forward',
    findCount: 2,
    firstFoundAt: '2026-09-13T18:15:00.000Z',
    lastFoundAt: '2026-09-13T22:40:00.000Z',
    lastFoundByCity: 'Tokyo, Japan'
  },
  {
    duckId: 'DUCK-006',
    name: 'Count Quackula',
    theme: 'Vampire Sunburn Duck',
    originDeck: 'Deck 6 - Schooner Piano Bar',
    findCount: 1,
    firstFoundAt: '2026-09-13T19:00:00.000Z',
    lastFoundAt: '2026-09-13T19:00:00.000Z',
    lastFoundByCity: 'Chicago, IL, USA'
  },
  {
    duckId: 'DUCK-007',
    name: 'James Pond 007',
    theme: 'Tuxedo Secret Agent',
    originDeck: 'Deck 4 - Casino Royale Entrance',
    findCount: 1,
    firstFoundAt: '2026-09-13T20:10:00.000Z',
    lastFoundAt: '2026-09-13T20:10:00.000Z',
    lastFoundByCity: 'São Paulo, Brazil'
  },
  {
    duckId: 'DUCK-008',
    name: 'Professor Belly Flop',
    theme: 'High Dive Champion',
    originDeck: 'Deck 12 - Mini Golf Course Hole 7',
    findCount: 1,
    firstFoundAt: '2026-09-13T20:45:00.000Z',
    lastFoundAt: '2026-09-13T20:45:00.000Z',
    lastFoundByCity: 'Munich, Germany'
  },
  {
    duckId: 'DUCK-009',
    name: 'Taco Tuesday Duck',
    theme: 'Extra Guacamole Boss',
    originDeck: 'Deck 15 - Solarium Hot Tub Palm',
    findCount: 0,
    firstFoundAt: null,
    lastFoundAt: null,
    lastFoundByCity: null
  },
  {
    duckId: 'DUCK-010',
    name: 'King Cone Destroyer',
    theme: 'Soft Serve Conqueror',
    originDeck: 'Deck 11 - Soft Serve Ice Cream Station',
    findCount: 1,
    firstFoundAt: '2026-09-13T21:30:00.000Z',
    lastFoundAt: '2026-09-13T21:30:00.000Z',
    lastFoundByCity: 'Miami, FL, USA'
  },
  {
    duckId: 'DUCK-011',
    name: 'Glow-in-the-Dark Gary',
    theme: 'Midnight Ninja Duck',
    originDeck: 'Deck 7 - Library & Card Room',
    findCount: 0,
    firstFoundAt: null,
    lastFoundAt: null,
    lastFoundByCity: null
  },
  {
    duckId: 'DUCK-012',
    name: 'Commander Splash Pants',
    theme: 'Water Slide Master',
    originDeck: 'Deck 5 - Guest Services Atrium',
    findCount: 1,
    firstFoundAt: '2026-09-13T22:15:00.000Z',
    lastFoundAt: '2026-09-13T22:15:00.000Z',
    lastFoundByCity: 'Austin, TX, USA'
  },
  {
    duckId: 'DUCK-013',
    name: 'Sergeant Soggy Bottom',
    theme: 'Hot Tub Lurker',
    originDeck: 'Deck 10 - Aft Hammock Lounge',
    findCount: 0,
    firstFoundAt: null,
    lastFoundAt: null,
    lastFoundByCity: null
  },
  {
    duckId: 'DUCK-014',
    name: 'Barnacle Breath Bob',
    theme: 'Pirate Treasure Hunter',
    originDeck: 'Deck 6 - Boardwalk Carousel',
    findCount: 0,
    firstFoundAt: null,
    lastFoundAt: null,
    lastFoundByCity: null
  },
  {
    duckId: 'DUCK-015',
    name: 'Flamingo Floatie Fred',
    theme: 'Pink Poolside VIP',
    originDeck: 'Deck 11 - Splashaway Bay Waterpark',
    findCount: 0,
    firstFoundAt: null,
    lastFoundAt: null,
    lastFoundByCity: null
  },
  {
    duckId: 'DUCK-016',
    name: 'Wipeout Wave Rider',
    theme: 'FlowRider Legend',
    originDeck: 'Deck 16 - FlowRider Surf Simulator',
    findCount: 0,
    firstFoundAt: null,
    lastFoundAt: null,
    lastFoundByCity: null
  },
  {
    duckId: 'DUCK-017',
    name: 'Scuba Steve Quack',
    theme: 'Deep Sea Explorer',
    originDeck: 'Deck 5 - Shore Excursions Desk',
    findCount: 0,
    firstFoundAt: null,
    lastFoundAt: null,
    lastFoundByCity: null
  },
  {
    duckId: 'DUCK-018',
    name: 'Major Monkey Business',
    theme: 'Jungle Plant Hider',
    originDeck: 'Deck 8 - Tropical Plant Planter #4',
    findCount: 0,
    firstFoundAt: null,
    lastFoundAt: null,
    lastFoundByCity: null
  },
  {
    duckId: 'DUCK-019',
    name: 'Sir Eats-a-Lot',
    theme: 'Buffet Champion Duck',
    originDeck: 'Deck 11 - Poolside Towel Station',
    findCount: 0,
    firstFoundAt: null,
    lastFoundAt: null,
    lastFoundByCity: null
  },
  {
    duckId: 'DUCK-020',
    name: 'General Goosebumps',
    theme: 'Cannon Fortress Guard',
    originDeck: 'Deck 14 - Forward Starboard Overlook',
    findCount: 0,
    firstFoundAt: null,
    lastFoundAt: null,
    lastFoundByCity: null
  },
  {
    duckId: 'DUCK-021',
    name: 'Tiki Torch Terry',
    theme: 'Island Fire Dancer',
    originDeck: 'Deck 11 - Bamboo Tiki Lounge',
    findCount: 0,
    firstFoundAt: null,
    lastFoundAt: null,
    lastFoundByCity: null
  },
  {
    duckId: 'DUCK-022',
    name: 'Turbo Dolphin Rider',
    theme: 'Speedboat Daredevil',
    originDeck: 'Deck 12 - Running Track Starboard',
    findCount: 0,
    firstFoundAt: null,
    lastFoundAt: null,
    lastFoundByCity: null
  },
  {
    duckId: 'DUCK-023',
    name: 'Captain Crazy Eyes',
    theme: 'Binocular Lookout Duck',
    originDeck: 'Deck 14 - Bridge Viewing Window',
    findCount: 0,
    firstFoundAt: null,
    lastFoundAt: null,
    lastFoundByCity: null
  },
  {
    duckId: 'DUCK-024',
    name: 'Coconut Nose Ned',
    theme: 'Cabana Chill Master',
    originDeck: 'Deck 15 - VIP Cabana Sun Deck',
    findCount: 0,
    firstFoundAt: null,
    lastFoundAt: null,
    lastFoundByCity: null
  },
  {
    duckId: 'DUCK-025',
    name: 'Doctor Dizzy Compass',
    theme: 'Lost Navigator Duck',
    originDeck: 'Deck 7 - Compass Rose Lounge',
    findCount: 0,
    firstFoundAt: null,
    lastFoundAt: null,
    lastFoundByCity: null
  },
  {
    duckId: 'DUCK-026',
    name: 'Mega Shark Bait',
    theme: 'Reef Snorkel Survivor',
    originDeck: 'Deck 4 - Main Dining Room Entrance',
    findCount: 0,
    firstFoundAt: null,
    lastFoundAt: null,
    lastFoundByCity: null
  },
  {
    duckId: 'DUCK-027',
    name: 'Sunburn Sam',
    theme: 'Forgot SPF 100',
    originDeck: 'Deck 9 - Elevator Lobby Midship',
    findCount: 0,
    firstFoundAt: null,
    lastFoundAt: null,
    lastFoundByCity: null
  },
  {
    duckId: 'DUCK-028',
    name: 'Pizza Slice Pete',
    theme: 'Midnight Pizza Bandit',
    originDeck: 'Deck 5 - Sorrentos Pizza Counter',
    findCount: 0,
    firstFoundAt: null,
    lastFoundAt: null,
    lastFoundByCity: null
  },
  {
    duckId: 'DUCK-029',
    name: 'Jetpack Jerry',
    theme: 'Turbo Sky Flyer',
    originDeck: 'Deck 12 - Sky Bar Upper Terrace',
    findCount: 0,
    firstFoundAt: null,
    lastFoundAt: null,
    lastFoundByCity: null
  },
  {
    duckId: 'DUCK-030',
    name: 'The Golden Goose',
    theme: 'Final Boss Duck',
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
    duckName: 'Sir Quacks-a-Lot',
    city: 'Seattle',
    region: 'WA',
    country: 'United States',
    countryCode: 'US',
    lat: 47.6062,
    lng: -122.3321,
    distanceMilesToShip: 3346,
    note: 'Found Sir Quacks-a-Lot hiding by the soft serve ice cream machine! 🍦🦆',
    deckFound: 'Deck 11 - Lido Poolside Tiki Bar',
    fingerprintHash: 'seed_fp_seattle_01',
    verifiedQrSignature: true,
    createdAt: '2026-09-13T21:10:00.000Z'
  },
  {
    id: 'disc_init_02',
    duckId: 'DUCK-002',
    duckName: 'Lord Waddle Butt',
    city: 'Toronto',
    region: 'Ontario',
    country: 'Canada',
    countryCode: 'CA',
    lat: 43.6532,
    lng: -79.3832,
    distanceMilesToShip: 1584,
    note: 'Spotted Lord Waddle Butt chilling on the sun deck! Re-hiding on Deck 8! 🍍☀️',
    deckFound: 'Deck 10 - Serenity Sun Deck',
    fingerprintHash: 'seed_fp_toronto_02',
    verifiedQrSignature: true,
    createdAt: '2026-09-13T19:45:00.000Z'
  },
  {
    id: 'disc_init_03',
    duckId: 'DUCK-003',
    duckName: 'Captain Brain Freeze',
    city: 'London',
    region: 'England',
    country: 'United Kingdom',
    countryCode: 'GB',
    lat: 51.5074,
    lng: -0.1278,
    distanceMilesToShip: 4320,
    note: 'Flew from London for this Caribbean cruise! Awesome game Ivan & Lucas! 🇬🇧🚢',
    deckFound: 'Deck 5 - Royal Promenade Aft',
    fingerprintHash: 'seed_fp_london_03',
    verifiedQrSignature: true,
    createdAt: '2026-09-13T22:05:00.000Z'
  },
  {
    id: 'disc_init_04',
    duckId: 'DUCK-004',
    duckName: 'Agent Sneaky Beak',
    city: 'Sydney',
    region: 'NSW',
    country: 'Australia',
    countryCode: 'AU',
    lat: -33.8688,
    lng: 151.2093,
    distanceMilesToShip: 9640,
    note: '9,600+ miles from Sydney Harbour to the Caribbean! Best cruise scavenger hunt! 🦘🌴',
    deckFound: 'Deck 8 - Central Park Tropical Garden',
    fingerprintHash: 'seed_fp_sydney_04',
    verifiedQrSignature: true,
    createdAt: '2026-09-13T17:30:00.000Z'
  },
  {
    id: 'disc_init_05',
    duckId: 'DUCK-005',
    duckName: 'DJ Disco Quack',
    city: 'Tokyo',
    region: 'Kanto',
    country: 'Japan',
    countryCode: 'JP',
    lat: 35.6762,
    lng: 139.6503,
    distanceMilesToShip: 8250,
    note: 'Found DJ Disco Quack watching the ocean sunset on Deck 14! Arigato! 🗾🦆',
    deckFound: 'Deck 14 - Observation Lounge Forward',
    fingerprintHash: 'seed_fp_tokyo_05',
    verifiedQrSignature: true,
    createdAt: '2026-09-13T22:40:00.000Z'
  },
  {
    id: 'disc_init_06',
    duckId: 'DUCK-006',
    duckName: 'Count Quackula',
    city: 'Chicago',
    region: 'IL',
    country: 'United States',
    countryCode: 'US',
    lat: 41.8781,
    lng: -87.6298,
    distanceMilesToShip: 1680,
    note: 'Found Count Quackula sitting on the piano keys! Windy City says ahoy! 🎹🧛',
    deckFound: 'Deck 6 - Schooner Piano Bar',
    fingerprintHash: 'seed_fp_chicago_06',
    verifiedQrSignature: true,
    createdAt: '2026-09-13T19:00:00.000Z'
  },
  {
    id: 'disc_init_07',
    duckId: 'DUCK-007',
    duckName: 'James Pond 007',
    city: 'São Paulo',
    region: 'SP',
    country: 'Brazil',
    countryCode: 'BR',
    lat: -23.5505,
    lng: -46.6333,
    distanceMilesToShip: 3480,
    note: 'Shaken, not stirred! Found James Pond 007 near the roulette wheel! 🇧🇷🎲',
    deckFound: 'Deck 4 - Casino Royale Entrance',
    fingerprintHash: 'seed_fp_saopaulo_07',
    verifiedQrSignature: true,
    createdAt: '2026-09-13T20:10:00.000Z'
  },
  {
    id: 'disc_init_08',
    duckId: 'DUCK-008',
    duckName: 'Professor Belly Flop',
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
    duckName: 'King Cone Destroyer',
    city: 'Miami',
    region: 'FL',
    country: 'United States',
    countryCode: 'US',
    lat: 25.7617,
    lng: -80.1918,
    distanceMilesToShip: 635,
    note: 'Found King Cone Destroyer right by the ice cream cones! 305 crew checking in! 🍦🌴',
    deckFound: 'Deck 11 - Soft Serve Ice Cream Station',
    fingerprintHash: 'seed_fp_miami_09',
    verifiedQrSignature: true,
    createdAt: '2026-09-13T21:30:00.000Z'
  },
  {
    id: 'disc_init_10',
    duckId: 'DUCK-012',
    duckName: 'Commander Splash Pants',
    city: 'Austin',
    region: 'TX',
    country: 'United States',
    countryCode: 'US',
    lat: 30.2672,
    lng: -97.7431,
    distanceMilesToShip: 1750,
    note: 'Spotted Commander Splash Pants in the atrium! Hook em from Texas! 🤠⚓',
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
