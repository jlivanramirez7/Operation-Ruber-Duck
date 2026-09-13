import { WorldCity } from '../types/duck';

/**
 * Curated Bundled Global Cities Database for Zero-Latency Offline/Satellite Lookup
 * Enables instant autocomplete even on high-latency cruise ship Starlink/VSAT Wi-Fi,
 * with Nominatim geocoding fallback for any town on Earth.
 */
export const BUNDLED_WORLD_CITIES: WorldCity[] = [
  // United States
  { city: 'Miami', region: 'FL', country: 'United States', countryCode: 'US', lat: 25.7617, lng: -80.1918 },
  { city: 'Orlando', region: 'FL', country: 'United States', countryCode: 'US', lat: 28.5383, lng: -81.3792 },
  { city: 'Tampa', region: 'FL', country: 'United States', countryCode: 'US', lat: 27.9506, lng: -82.4572 },
  { city: 'Fort Lauderdale', region: 'FL', country: 'United States', countryCode: 'US', lat: 26.1224, lng: -80.1373 },
  { city: 'Seattle', region: 'WA', country: 'United States', countryCode: 'US', lat: 47.6062, lng: -122.3321 },
  { city: 'New York', region: 'NY', country: 'United States', countryCode: 'US', lat: 40.7128, lng: -74.0060 },
  { city: 'Los Angeles', region: 'CA', country: 'United States', countryCode: 'US', lat: 34.0522, lng: -118.2437 },
  { city: 'San Francisco', region: 'CA', country: 'United States', countryCode: 'US', lat: 37.7749, lng: -122.4194 },
  { city: 'San Diego', region: 'CA', country: 'United States', countryCode: 'US', lat: 32.7157, lng: -117.1611 },
  { city: 'Chicago', region: 'IL', country: 'United States', countryCode: 'US', lat: 41.8781, lng: -87.6298 },
  { city: 'Austin', region: 'TX', country: 'United States', countryCode: 'US', lat: 30.2672, lng: -97.7431 },
  { city: 'Dallas', region: 'TX', country: 'United States', countryCode: 'US', lat: 32.7767, lng: -96.7970 },
  { city: 'Houston', region: 'TX', country: 'United States', countryCode: 'US', lat: 29.7604, lng: -95.3698 },
  { city: 'Atlanta', region: 'GA', country: 'United States', countryCode: 'US', lat: 33.7490, lng: -84.3880 },
  { city: 'Boston', region: 'MA', country: 'United States', countryCode: 'US', lat: 42.3601, lng: -71.0589 },
  { city: 'Denver', region: 'CO', country: 'United States', countryCode: 'US', lat: 39.7392, lng: -104.9903 },
  { city: 'Phoenix', region: 'AZ', country: 'United States', countryCode: 'US', lat: 33.4484, lng: -112.0740 },
  { city: 'Las Vegas', region: 'NV', country: 'United States', countryCode: 'US', lat: 36.1699, lng: -115.1398 },
  { city: 'Nashville', region: 'TN', country: 'United States', countryCode: 'US', lat: 36.1627, lng: -86.7816 },
  { city: 'Charlotte', region: 'NC', country: 'United States', countryCode: 'US', lat: 35.2271, lng: -80.8431 },
  { city: 'Washington', region: 'DC', country: 'United States', countryCode: 'US', lat: 38.9072, lng: -77.0369 },
  { city: 'Philadelphia', region: 'PA', country: 'United States', countryCode: 'US', lat: 39.9526, lng: -75.1652 },
  { city: 'Minneapolis', region: 'MN', country: 'United States', countryCode: 'US', lat: 44.9778, lng: -93.2650 },
  { city: 'Detroit', region: 'MI', country: 'United States', countryCode: 'US', lat: 42.3314, lng: -83.0458 },
  { city: 'Portland', region: 'OR', country: 'United States', countryCode: 'US', lat: 45.5152, lng: -122.6784 },
  { city: 'Salt Lake City', region: 'UT', country: 'United States', countryCode: 'US', lat: 40.7608, lng: -111.8910 },
  { city: 'Honolulu', region: 'HI', country: 'United States', countryCode: 'US', lat: 21.3069, lng: -157.8583 },
  { city: 'New Orleans', region: 'LA', country: 'United States', countryCode: 'US', lat: 29.9511, lng: -90.0715 },
  { city: 'San Juan', region: 'PR', country: 'Puerto Rico', countryCode: 'PR', lat: 18.4655, lng: -66.1057 },

  // Canada
  { city: 'Toronto', region: 'Ontario', country: 'Canada', countryCode: 'CA', lat: 43.6532, lng: -79.3832 },
  { city: 'Vancouver', region: 'BC', country: 'Canada', countryCode: 'CA', lat: 49.2827, lng: -123.1207 },
  { city: 'Montreal', region: 'Quebec', country: 'Canada', countryCode: 'CA', lat: 45.5017, lng: -73.5673 },
  { city: 'Calgary', region: 'Alberta', country: 'Canada', countryCode: 'CA', lat: 51.0447, lng: -114.0719 },
  { city: 'Ottawa', region: 'Ontario', country: 'Canada', countryCode: 'CA', lat: 45.4215, lng: -75.6972 },
  { city: 'Halifax', region: 'Nova Scotia', country: 'Canada', countryCode: 'CA', lat: 44.6488, lng: -63.5752 },

  // Europe
  { city: 'London', region: 'England', country: 'United Kingdom', countryCode: 'GB', lat: 51.5074, lng: -0.1278 },
  { city: 'Edinburgh', region: 'Scotland', country: 'United Kingdom', countryCode: 'GB', lat: 55.9533, lng: -3.1883 },
  { city: 'Manchester', region: 'England', country: 'United Kingdom', countryCode: 'GB', lat: 53.4808, lng: -2.2426 },
  { city: 'Dublin', region: 'Leinster', country: 'Ireland', countryCode: 'IE', lat: 53.3498, lng: -6.2603 },
  { city: 'Paris', region: 'Île-de-France', country: 'France', countryCode: 'FR', lat: 48.8566, lng: 2.3522 },
  { city: 'Madrid', region: 'Madrid', country: 'Spain', countryCode: 'ES', lat: 40.4168, lng: -3.7038 },
  { city: 'Barcelona', region: 'Catalonia', country: 'Spain', countryCode: 'ES', lat: 41.3874, lng: 2.1686 },
  { city: 'Rome', region: 'Lazio', country: 'Italy', countryCode: 'IT', lat: 41.9028, lng: 12.4964 },
  { city: 'Milan', region: 'Lombardy', country: 'Italy', countryCode: 'IT', lat: 45.4642, lng: 9.1900 },
  { city: 'Berlin', region: 'Berlin', country: 'Germany', countryCode: 'DE', lat: 52.5200, lng: 13.4050 },
  { city: 'Munich', region: 'Bavaria', country: 'Germany', countryCode: 'DE', lat: 48.1351, lng: 11.5820 },
  { city: 'Amsterdam', region: 'North Holland', country: 'Netherlands', countryCode: 'NL', lat: 52.3676, lng: 4.9041 },
  { city: 'Zurich', region: 'Zurich', country: 'Switzerland', countryCode: 'CH', lat: 47.3769, lng: 8.5417 },
  { city: 'Stockholm', region: 'Stockholm', country: 'Sweden', countryCode: 'SE', lat: 59.3293, lng: 18.0686 },
  { city: 'Oslo', region: 'Oslo', country: 'Norway', countryCode: 'NO', lat: 59.9139, lng: 10.7522 },
  { city: 'Copenhagen', region: 'Capital Region', country: 'Denmark', countryCode: 'DK', lat: 55.6761, lng: 12.5683 },
  { city: 'Reykjavik', region: 'Capital Region', country: 'Iceland', countryCode: 'IS', lat: 64.1466, lng: -21.9426 },
  { city: 'Lisbon', region: 'Lisbon', country: 'Portugal', countryCode: 'PT', lat: 38.7223, lng: -9.1393 },
  { city: 'Vienna', region: 'Vienna', country: 'Austria', countryCode: 'AT', lat: 48.2082, lng: 16.3738 },
  { city: 'Athens', region: 'Attica', country: 'Greece', countryCode: 'GR', lat: 37.9838, lng: 23.7275 },

  // Latin America & Caribbean
  { city: 'Mexico City', region: 'CDMX', country: 'Mexico', countryCode: 'MX', lat: 19.4326, lng: -99.1332 },
  { city: 'Cancún', region: 'Quintana Roo', country: 'Mexico', countryCode: 'MX', lat: 21.1619, lng: -86.8515 },
  { city: 'São Paulo', region: 'SP', country: 'Brazil', countryCode: 'BR', lat: -23.5505, lng: -46.6333 },
  { city: 'Rio de Janeiro', region: 'RJ', country: 'Brazil', countryCode: 'BR', lat: -22.9068, lng: -43.1729 },
  { city: 'Buenos Aires', region: 'CABA', country: 'Argentina', countryCode: 'AR', lat: -34.6037, lng: -58.3816 },
  { city: 'Bogotá', region: 'Cundinamarca', country: 'Colombia', countryCode: 'CO', lat: 4.7110, lng: -74.0721 },
  { city: 'Santiago', region: 'RM', country: 'Chile', countryCode: 'CL', lat: -33.4489, lng: -70.6693 },
  { city: 'Lima', region: 'Lima', country: 'Peru', countryCode: 'PE', lat: -12.0464, lng: -77.0428 },
  { city: 'Nassau', region: 'New Providence', country: 'Bahamas', countryCode: 'BS', lat: 25.0443, lng: -77.3504 },

  // Asia & Oceania
  { city: 'Tokyo', region: 'Kanto', country: 'Japan', countryCode: 'JP', lat: 35.6762, lng: 139.6503 },
  { city: 'Osaka', region: 'Kansai', country: 'Japan', countryCode: 'JP', lat: 34.6937, lng: 135.5023 },
  { city: 'Seoul', region: 'Seoul', country: 'South Korea', countryCode: 'KR', lat: 37.5665, lng: 126.9780 },
  { city: 'Singapore', region: 'Central', country: 'Singapore', countryCode: 'SG', lat: 1.3521, lng: 103.8198 },
  { city: 'Sydney', region: 'NSW', country: 'Australia', countryCode: 'AU', lat: -33.8688, lng: 151.2093 },
  { city: 'Melbourne', region: 'VIC', country: 'Australia', countryCode: 'AU', lat: -37.8136, lng: 144.9631 },
  { city: 'Brisbane', region: 'QLD', country: 'Australia', countryCode: 'AU', lat: -27.4705, lng: 153.0260 },
  { city: 'Auckland', region: 'Auckland', country: 'New Zealand', countryCode: 'NZ', lat: -36.8485, lng: 174.7633 },
  { city: 'Manila', region: 'NCR', country: 'Philippines', countryCode: 'PH', lat: 14.5995, lng: 120.9842 },
  { city: 'Bangkok', region: 'Bangkok', country: 'Thailand', countryCode: 'TH', lat: 13.7563, lng: 100.5018 },
  { city: 'Dubai', region: 'Dubai', country: 'United Arab Emirates', countryCode: 'AE', lat: 25.2048, lng: 55.2708 }
];
