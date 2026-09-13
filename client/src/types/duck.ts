export interface Duck {
  duckId: string;
  name: string;
  theme: string;
  originDeck: string;
  findCount: number;
  firstFoundAt: string | null;
  lastFoundAt: string | null;
  lastFoundByCity: string | null;
  signatureHash: string;
  active: boolean;
}

export interface Discovery {
  id: string;
  duckId: string;
  duckName: string;
  city: string;
  region: string;
  country: string;
  countryCode: string;
  lat: number;
  lng: number;
  distanceMilesToShip: number;
  note: string;
  deckFound: string;
  fingerprintHash?: string;
  verifiedQrSignature: boolean;
  createdAt: string;
  pinnedAtFormatted?: string;
  pinnedTimeEpochMs?: number;
}

export interface ShipPosition {
  name: string;
  lat: number;
  lng: number;
}

export interface CruiseStats {
  databaseId: string;
  firestoreConnected: boolean;
  shipPosition: ShipPosition;
  totalDiscoveries: number;
  totalDucksInFleet: number;
  uniqueDucksFound: number;
  uniqueCountriesCount: number;
  uniqueCitiesCount: number;
  totalMilesTraveled: number;
  farthestDiscovery: {
    city: string;
    country: string;
    distanceMiles: number;
    duckName: string;
    duckId: string;
  } | null;
}

export interface WorldCity {
  city: string;
  region: string;
  country: string;
  countryCode: string;
  lat: number;
  lng: number;
}
