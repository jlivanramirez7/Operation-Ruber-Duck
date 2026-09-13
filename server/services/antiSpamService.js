/**
 * Maritime NAT-Aware Anti-Spam, Cryptographic QR Validation & Zero-PII Service
 * Specifically engineered for Cruise Ship Satellite Wi-Fi (Starlink / VSAT Carrier-Grade NAT)
 */

const { generateDuckSignature, SHIP_POSITION } = require('../data/seedDucks');

// Profanity filter list for family-friendly cruise ship scavenger hunt
const PROFANITY_WORDS = [
  'fuck', 'shit', 'bitch', 'asshole', 'bastard', 'dick', 'pussy', 'cunt',
  'slut', 'whore', 'cock', 'nigger', 'faggot', 'retard'
];

/**
 * Calculates Great-Circle Statute Miles from Finder's Hometown to the Cruise Ship
 * using the Haversine formula.
 */
function calculateDistanceMilesToShip(lat, lng) {
  const toRad = (deg) => (deg * Math.PI) / 180;
  const R = 3958.8; // Earth radius in statute miles
  const dLat = toRad(SHIP_POSITION.lat - lat);
  const dLng = toRad(SHIP_POSITION.lng - lng);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat)) * Math.cos(toRad(SHIP_POSITION.lat)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

/**
 * Validates the physical QR tag HMAC signature (?id=DUCK-042&sig=...)
 */
function verifyQrSignature(duckId, providedSig) {
  if (!duckId) return false;
  const expected = generateDuckSignature(duckId);
  if (!providedSig) return false;
  return providedSig.toLowerCase().trim() === expected.toLowerCase();
}

/**
 * Enforces Zero-PII (no emails, phone numbers, URLs) and family-friendly profanity scrubbing.
 * Truncates congratulatory notes strictly to 100 characters.
 */
function sanitizeDiscoveryInput({ city, region, country, note, deckFound }) {
  const cleanText = (str, maxLen = 60) => {
    if (!str || typeof str !== 'string') return '';
    let s = str.trim();
    // Strip email addresses (Zero PII)
    s = s.replace(/\S+@\S+\.\S+/g, '[redacted]');
    // Strip phone numbers (Zero PII)
    s = s.replace(/\b(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/g, '[redacted]');
    // Strip URLs
    s = s.replace(/https?:\/\/\S+/gi, '');
    // Filter profanity
    for (const badWord of PROFANITY_WORDS) {
      const regex = new RegExp(`\\b${badWord}\\b`, 'gi');
      s = s.replace(regex, '***');
    }
    return s.slice(0, maxLen).trim();
  };

  const sanitizedCity = cleanText(city, 60);
  const sanitizedRegion = cleanText(region, 60);
  const sanitizedCountry = cleanText(country, 60);
  const sanitizedNote = cleanText(note, 100);
  const sanitizedDeck = cleanText(deckFound || 'Cruise Ship Deck', 60);

  return {
    city: sanitizedCity,
    region: sanitizedRegion,
    country: sanitizedCountry,
    note: sanitizedNote,
    deckFound: sanitizedDeck
  };
}

/**
 * Cruise-Ship NAT-Safe Device Rate Limiter
 * Prevents duplicate spam from the same device within 1 hour per Duck ID,
 * while never blocking shared Starlink/VSAT shipboard NAT IP addresses.
 */
function evaluateDeviceRateLimit(existingRecord, duckId, nowMs = Date.now()) {
  const COOLDOWN_MS = 60 * 60 * 1000; // 1 hour cooldown per device per duck
  const MAX_SUBMISSIONS_PER_HOUR = 8; // Max ducks a single device can log per hour

  if (!existingRecord) {
    return {
      allowed: true,
      newRecord: {
        lastSubmissionAt: new Date(nowMs).toISOString(),
        lastSubmissionMs: nowMs,
        submissionCountHour: 1,
        recentDucks: { [duckId]: nowMs }
      }
    };
  }

  const lastDuckMs = existingRecord.recentDucks && existingRecord.recentDucks[duckId];
  if (lastDuckMs && nowMs - lastDuckMs < COOLDOWN_MS) {
    const minutesRemaining = Math.ceil((COOLDOWN_MS - (nowMs - lastDuckMs)) / 60000);
    return {
      allowed: false,
      reason: `Ahoy! Your device already logged ${duckId} recently. Please wait ${minutesRemaining} min before logging the same duck again (or scan a different duck!).`
    };
  }

  const windowElapsed = nowMs - (existingRecord.lastSubmissionMs || 0);
  const countInWindow = windowElapsed < COOLDOWN_MS ? (existingRecord.submissionCountHour || 0) : 0;

  if (countInWindow >= MAX_SUBMISSIONS_PER_HOUR) {
    return {
      allowed: false,
      reason: 'Whoa there, speedy sailor! You have logged 8 ducks this hour. Take a quick tropical breather!'
    };
  }

  const updatedRecentDucks = { ...(existingRecord.recentDucks || {}), [duckId]: nowMs };
  return {
    allowed: true,
    newRecord: {
      lastSubmissionAt: new Date(nowMs).toISOString(),
      lastSubmissionMs: nowMs,
      submissionCountHour: countInWindow + 1,
      recentDucks: updatedRecentDucks
    }
  };
}

module.exports = {
  calculateDistanceMilesToShip,
  verifyQrSignature,
  sanitizeDiscoveryInput,
  evaluateDeviceRateLimit
};
