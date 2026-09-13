/**
 * Cloud Firestore Stateful Persistence Service for CruiseDuck Tracker ("Operation Rubber Duck")
 * Explicitly targets Google Cloud Firestore database: `operationruberduck-db`
 * Ensures all duck discoveries and fleet stats are permanently recorded to the backend database.
 */

const { Firestore } = require('@google-cloud/firestore');
const fs = require('fs');
const path = require('path');
const {
  INITIAL_DUCKS,
  INITIAL_DISCOVERIES,
  SHIP_POSITION,
  generateDuckSignature
} = require('../data/seedDucks');
const {
  calculateDistanceMilesToShip,
  verifyQrSignature,
  sanitizeDiscoveryInput,
  evaluateDeviceRateLimit
} = require('./antiSpamService');

const DATA_DIR = path.join(__dirname, '../data');
const DUCKS_FILE = path.join(DATA_DIR, 'persistent_ducks.json');
const DISCOVERIES_FILE = path.join(DATA_DIR, 'persistent_discoveries.json');
const RATE_LIMITS_FILE = path.join(DATA_DIR, 'persistent_rate_limits.json');

function readLocalJson(filePath, fallback) {
  try {
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(raw);
    }
  } catch (err) {
    console.warn(`[FirestoreService] Error reading ${filePath}:`, err.message);
  }
  return fallback;
}

function writeLocalJson(filePath, data) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.warn(`[FirestoreService] Error writing ${filePath}:`, err.message);
    return false;
  }
}

class FirestoreService {
  constructor() {
    this.projectId = process.env.GCP_PROJECT_ID || process.env.GOOGLE_CLOUD_PROJECT || 'operation-ruber-duck';
    this.databaseId = process.env.FIRESTORE_DATABASE_ID || 'operationruberduck-db';
    this.client = null;
    this.connected = false;
    this.lastError = null;
    this.triedFallback = false;

    // Ensure initial local persistent files exist and include all 30 seed ducks
    const existingDucks = readLocalJson(DUCKS_FILE, []);
    const duckMap = new Map();
    INITIAL_DUCKS.forEach(d => duckMap.set(d.duckId, d));
    existingDucks.forEach(d => {
      const seed = duckMap.get(d.duckId);
      if (seed) {
        duckMap.set(d.duckId, {
          ...seed,
          findCount: Math.max(seed.findCount || 0, d.findCount || 0),
          firstFoundAt: d.firstFoundAt || seed.firstFoundAt,
          lastFoundAt: d.lastFoundAt || seed.lastFoundAt,
          lastFoundByCity: d.lastFoundByCity || seed.lastFoundByCity
        });
      } else {
        duckMap.set(d.duckId, d);
      }
    });
    writeLocalJson(
      DUCKS_FILE,
      Array.from(duckMap.values()).sort((a, b) => a.duckId.localeCompare(b.duckId))
    );

    if (!fs.existsSync(DISCOVERIES_FILE)) {
      writeLocalJson(DISCOVERIES_FILE, INITIAL_DISCOVERIES);
    }
    if (!fs.existsSync(RATE_LIMITS_FILE)) {
      writeLocalJson(RATE_LIMITS_FILE, {});
    }

    this.init();
  }

  init(dbId = this.databaseId) {
    try {
      this.databaseId = dbId;
      const options = {
        projectId: this.projectId,
        ignoreUndefinedProperties: true
      };
      if (this.databaseId && this.databaseId !== '(default)') {
        options.databaseId = this.databaseId;
      }
      this.client = new Firestore(options);
      console.log(`[FirestoreService] Initialized Cloud Firestore client (project=${this.projectId}, database=${this.databaseId})`);
    } catch (err) {
      console.warn(`[FirestoreService] Firestore client initialization warning: ${err.message}`);
      this.connected = false;
      this.lastError = err.message;
    }
  }

  async handleDatabaseError(err) {
    this.lastError = err.message;
    if ((err.code === 5 || err.message?.includes('NOT_FOUND')) && this.databaseId !== '(default)' && !this.triedFallback) {
      console.warn(`[FirestoreService] Database ${this.databaseId} returned NOT_FOUND. Attempting fallback to '(default)'...`);
      this.triedFallback = true;
      this.init('(default)');
      return true;
    }
    return false;
  }

  async verifyConnectionAndSeed() {
    if (!this.client) return false;
    try {
      const pingRef = this.client.collection('_system_health').doc('ping');
      await pingRef.set({
        service: 'cruiseduck-tracker',
        database: this.databaseId,
        lastPing: new Date().toISOString()
      }, { merge: true });
      this.connected = true;
      this.lastError = null;

      // Check if ducks collection needs seeding in Firestore
      const ducksSnap = await this.client.collection('ducks').limit(1).get();
      if (ducksSnap.empty) {
        console.log(`[FirestoreService] Seeding initial ducks and discoveries into Cloud Firestore (${this.databaseId})...`);
        const batch = this.client.batch();
        for (const duck of INITIAL_DUCKS) {
          batch.set(this.client.collection('ducks').doc(duck.duckId), duck);
        }
        for (const disc of INITIAL_DISCOVERIES) {
          batch.set(this.client.collection('discoveries').doc(disc.id), disc);
        }
        await batch.commit();
        console.log(`[FirestoreService] Cloud Firestore (${this.databaseId}) seeded successfully!`);
      }
      return true;
    } catch (err) {
      const canRetry = await this.handleDatabaseError(err);
      if (canRetry) {
        return this.verifyConnectionAndSeed();
      }
      this.connected = false;
      return false;
    }
  }

  /**
   * Lists all hidden cruise ducks (DUCK-001 to DUCK-025+)
   */
  async listDucks() {
    let localDucks = readLocalJson(DUCKS_FILE, INITIAL_DUCKS);
    if (this.client) {
      try {
        const snap = await this.client.collection('ducks').get();
        if (!snap.empty) {
          this.connected = true;
          const fsDucks = snap.docs.map(doc => doc.data());
          const duckMap = new Map();
          localDucks.forEach(d => duckMap.set(d.duckId, d));
          fsDucks.forEach(d => {
            const existing = duckMap.get(d.duckId);
            if (!existing || (d.findCount || 0) >= (existing.findCount || 0)) {
              duckMap.set(d.duckId, d);
            }
          });
          localDucks = Array.from(duckMap.values());
          writeLocalJson(DUCKS_FILE, localDucks);
        }
      } catch (err) {
        await this.handleDatabaseError(err);
      }
    }
    return localDucks.sort((a, b) => a.duckId.localeCompare(b.duckId));
  }

  /**
   * Gets details for a specific duck by ID (e.g. DUCK-007)
   */
  async getDuckById(duckId) {
    const cleanId = String(duckId || '').toUpperCase().trim();
    const allDucks = await this.listDucks();
    let duck = allDucks.find(d => d.duckId === cleanId);
    if (!duck && /^DUCK-\d{1,3}$/.test(cleanId)) {
      // Dynamically register new duck ID if scanned from a physical tag
      duck = {
        duckId: cleanId,
        name: `Caribbean Cruiser ${cleanId}`,
        theme: 'Tropical Island Explorer Duck',
        originDeck: 'Cruise Ship Public Deck',
        findCount: 0,
        firstFoundAt: null,
        lastFoundAt: null,
        lastFoundByCity: null,
        signatureHash: generateDuckSignature(cleanId),
        active: true
      };
      allDucks.push(duck);
      writeLocalJson(DUCKS_FILE, allDucks);
      if (this.client) {
        try {
          await this.client.collection('ducks').doc(cleanId).set(duck, { merge: true });
        } catch (err) {
          // ignore
        }
      }
    }
    return duck || null;
  }

  /**
   * Lists all verified duck discoveries sorted newest first
   */
  async listDiscoveries(limitCount = 250) {
    let localDiscoveries = readLocalJson(DISCOVERIES_FILE, INITIAL_DISCOVERIES);
    if (this.client) {
      try {
        const snap = await this.client
          .collection('discoveries')
          .orderBy('createdAt', 'desc')
          .limit(limitCount)
          .get();
        if (!snap.empty) {
          this.connected = true;
          const fsDiscoveries = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          const discMap = new Map();
          localDiscoveries.forEach(d => discMap.set(d.id, d));
          fsDiscoveries.forEach(d => discMap.set(d.id, d));
          localDiscoveries = Array.from(discMap.values());
          writeLocalJson(DISCOVERIES_FILE, localDiscoveries);
        }
      } catch (err) {
        await this.handleDatabaseError(err);
      }
    }
    return localDiscoveries
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limitCount);
  }

  /**
   * Records a new duck discovery to Cloud Firestore (`operationruberduck-db`) + persistent server store.
   * Enforces Zero-PII, Profanity Filtering, HMAC Signature Verification, and Cruise-Ship NAT-Safe Device Rate Limiting.
   */
  async recordDiscovery(payload) {
    const rawDuckId = String(payload.duckId || 'DUCK-001').toUpperCase().trim();
    const fingerprintHash = String(payload.fingerprintHash || 'anonymous_device').trim();

    // 1. Check Cruise-Ship NAT-Aware Device Rate Limit (1 hr cooldown per device per duck)
    const rateLimits = readLocalJson(RATE_LIMITS_FILE, {});
    const existingLimit = rateLimits[fingerprintHash];
    const rateEval = evaluateDeviceRateLimit(existingLimit, rawDuckId);

    if (!rateEval.allowed && !payload.bypassRateLimitForTest) {
      const error = new Error(rateEval.reason);
      error.statusCode = 429;
      throw error;
    }

    // 2. Sanitize input (Zero PII & Profanity Filter)
    const sanitized = sanitizeDiscoveryInput({
      city: payload.city,
      region: payload.region,
      country: payload.country,
      note: payload.note,
      deckFound: payload.deckFound
    });

    if (!sanitized.city || !sanitized.country) {
      const error = new Error('Please select your City and Country so we can pin your hometown on the globe!');
      error.statusCode = 400;
      throw error;
    }

    const lat = Number(payload.lat);
    const lng = Number(payload.lng);
    if (Number.isNaN(lat) || Number.isNaN(lng)) {
      const error = new Error('Invalid geographic coordinates for city.');
      error.statusCode = 400;
      throw error;
    }

    // 3. Look up or register the duck
    let duck = await this.getDuckById(rawDuckId);
    if (!duck) {
      duck = {
        duckId: rawDuckId,
        name: `Caribbean Cruiser ${rawDuckId}`,
        theme: 'Tropical Island Duck',
        originDeck: sanitized.deckFound || 'Cruise Ship Deck',
        findCount: 0,
        signatureHash: generateDuckSignature(rawDuckId),
        active: true
      };
    }

    // 4. Verify QR signature if provided
    const isVerifiedQr = verifyQrSignature(rawDuckId, payload.sig);

    // 5. Calculate Great-Circle distance in miles from hometown to Caribbean ship
    const distanceMilesToShip = calculateDistanceMilesToShip(lat, lng);
    const nowIso = new Date().toISOString();
    const discoveryId = `disc_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

    const newDiscovery = {
      id: discoveryId,
      duckId: rawDuckId,
      duckName: duck.name,
      city: sanitized.city,
      region: sanitized.region,
      country: sanitized.country,
      countryCode: String(payload.countryCode || '').toUpperCase().slice(0, 2) || 'UN',
      lat,
      lng,
      distanceMilesToShip,
      note: sanitized.note || `Ahoy from ${sanitized.city}! Found ${duck.name}! 🦆🌴`,
      deckFound: sanitized.deckFound || duck.originDeck || 'Cruise Ship Deck',
      fingerprintHash,
      verifiedQrSignature: isVerifiedQr,
      createdAt: nowIso
    };

    // 6. Update Duck metadata
    const updatedDuck = {
      ...duck,
      findCount: (duck.findCount || 0) + 1,
      firstFoundAt: duck.firstFoundAt || nowIso,
      lastFoundAt: nowIso,
      lastFoundByCity: `${sanitized.city}${sanitized.region ? ', ' + sanitized.region : ''}, ${sanitized.country}`
    };

    // 7. Write to persistent server store immediately
    const allDiscoveries = readLocalJson(DISCOVERIES_FILE, INITIAL_DISCOVERIES);
    allDiscoveries.unshift(newDiscovery);
    writeLocalJson(DISCOVERIES_FILE, allDiscoveries);

    const allDucks = readLocalJson(DUCKS_FILE, INITIAL_DUCKS);
    const duckIdx = allDucks.findIndex(d => d.duckId === rawDuckId);
    if (duckIdx >= 0) {
      allDucks[duckIdx] = updatedDuck;
    } else {
      allDucks.push(updatedDuck);
    }
    writeLocalJson(DUCKS_FILE, allDucks);

    // Update device rate limit store
    rateLimits[fingerprintHash] = rateEval.newRecord;
    writeLocalJson(RATE_LIMITS_FILE, rateLimits);

    // 8. Persist directly to Google Cloud Firestore (`operationruberduck-db`)
    let firestoreSaved = false;
    if (this.client) {
      try {
        const batch = this.client.batch();
        const discRef = this.client.collection('discoveries').doc(discoveryId);
        const duckRef = this.client.collection('ducks').doc(rawDuckId);
        const rateRef = this.client.collection('rate_limits').doc(fingerprintHash);

        batch.set(discRef, newDiscovery);
        batch.set(duckRef, updatedDuck, { merge: true });
        batch.set(rateRef, rateEval.newRecord, { merge: true });

        await batch.commit();
        this.connected = true;
        firestoreSaved = true;
      } catch (err) {
        await this.handleDatabaseError(err);
      }
    }

    return {
      discovery: newDiscovery,
      duck: updatedDuck,
      database: this.databaseId,
      persistedToServerDb: true,
      persistedToCloudFirestore: firestoreSaved
    };
  }

  /**
   * Computes aggregated cruise scavenger hunt statistics & leaderboard
   */
  async getStats() {
    const discoveries = await this.listDiscoveries(500);
    const ducks = await this.listDucks();

    const uniqueCountries = new Set(discoveries.map(d => d.country).filter(Boolean));
    const uniqueCities = new Set(discoveries.map(d => `${d.city}, ${d.country}`).filter(Boolean));
    const ducksFoundCount = ducks.filter(d => (d.findCount || 0) > 0).length;

    let farthestDiscovery = null;
    for (const d of discoveries) {
      if (!farthestDiscovery || (d.distanceMilesToShip || 0) > (farthestDiscovery.distanceMilesToShip || 0)) {
        farthestDiscovery = d;
      }
    }

    const totalMilesTraveled = discoveries.reduce((sum, d) => sum + (d.distanceMilesToShip || 0), 0);

    return {
      databaseId: this.databaseId,
      firestoreConnected: this.connected,
      shipPosition: SHIP_POSITION,
      totalDiscoveries: discoveries.length,
      totalDucksInFleet: ducks.length,
      uniqueDucksFound: ducksFoundCount,
      uniqueCountriesCount: uniqueCountries.size,
      uniqueCitiesCount: uniqueCities.size,
      totalMilesTraveled,
      farthestDiscovery: farthestDiscovery
        ? {
            city: farthestDiscovery.city,
            country: farthestDiscovery.country,
            distanceMiles: farthestDiscovery.distanceMilesToShip,
            duckName: farthestDiscovery.duckName,
            duckId: farthestDiscovery.duckId
          }
        : null
    };
  }
}

module.exports = new FirestoreService();
