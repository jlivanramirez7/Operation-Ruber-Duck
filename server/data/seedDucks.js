/**
 * Initial Roster of 30 Custom Caribbean Cruise Ducks (DUCK-001 to DUCK-030)
 * Hidden by Ivan & Lucas across the ship!
 * All duck names are max 3 words & hilarious for 10-year-olds!
 * Seed discoveries have been eliminated so the database starts clean (0 finds).
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
    findCount: 0,
    firstFoundAt: null,
    lastFoundAt: null,
    lastFoundByCity: null
  },
  {
    duckId: 'DUCK-002',
    name: 'Lord Waddle Butt',
    theme: 'Supreme Poolside Boss',
    originDeck: 'Deck 10 - Serenity Sun Deck',
    findCount: 0,
    firstFoundAt: null,
    lastFoundAt: null,
    lastFoundByCity: null
  },
  {
    duckId: 'DUCK-003',
    name: 'Captain Brain Freeze',
    theme: 'Slushie Patrol Duck',
    originDeck: 'Deck 5 - Royal Promenade Aft',
    findCount: 0,
    firstFoundAt: null,
    lastFoundAt: null,
    lastFoundByCity: null
  },
  {
    duckId: 'DUCK-004',
    name: 'Agent Sneaky Beak',
    theme: 'Undercover Spy Duck',
    originDeck: 'Deck 8 - Central Park Tropical Garden',
    findCount: 0,
    firstFoundAt: null,
    lastFoundAt: null,
    lastFoundByCity: null
  },
  {
    duckId: 'DUCK-005',
    name: 'DJ Disco Quack',
    theme: 'Dance Floor Legend',
    originDeck: 'Deck 14 - Observation Lounge Forward',
    findCount: 0,
    firstFoundAt: null,
    lastFoundAt: null,
    lastFoundByCity: null
  },
  {
    duckId: 'DUCK-006',
    name: 'Count Quackula',
    theme: 'Vampire Sunburn Duck',
    originDeck: 'Deck 6 - Schooner Piano Bar',
    findCount: 0,
    firstFoundAt: null,
    lastFoundAt: null,
    lastFoundByCity: null
  },
  {
    duckId: 'DUCK-007',
    name: 'James Pond 007',
    theme: 'Tuxedo Secret Agent',
    originDeck: 'Deck 4 - Casino Royale Entrance',
    findCount: 0,
    firstFoundAt: null,
    lastFoundAt: null,
    lastFoundByCity: null
  },
  {
    duckId: 'DUCK-008',
    name: 'Professor Belly Flop',
    theme: 'High Dive Champion',
    originDeck: 'Deck 12 - Mini Golf Course Hole 7',
    findCount: 0,
    firstFoundAt: null,
    lastFoundAt: null,
    lastFoundByCity: null
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
    findCount: 0,
    firstFoundAt: null,
    lastFoundAt: null,
    lastFoundByCity: null
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
    findCount: 0,
    firstFoundAt: null,
    lastFoundAt: null,
    lastFoundByCity: null
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

// Seed discoveries eliminated — database starts clean with 0 discoveries
const INITIAL_DISCOVERIES = [];

module.exports = {
  QR_SECRET_SALT,
  SHIP_POSITION,
  INITIAL_DUCKS,
  INITIAL_DISCOVERIES,
  generateDuckSignature
};
