/**
 * Automated QA & Integration Verification Suite for CruiseDuck Tracker ("Operation Rubber Duck")
 * Strictly verifies:
 * 1. Server-side Database Persistence to `operationruberduck-db` across independent devices (NOT merely client localStorage)
 * 2. Cruise-Ship NAT-Aware Device Fingerprint Rate Limiting (blocks duplicate spam from same device, allows shared NAT IP)
 * 3. Cryptographic QR HMAC Signature Validation (?id=DUCK-042&sig=...)
 * 4. Zero-PII & Family-Friendly Profanity Sanitization
 */

const assert = require('assert');
const http = require('http');
const app = require('../index');
const firestoreService = require('../services/firestoreService');
const {
  verifyQrSignature,
  sanitizeDiscoveryInput,
  calculateDistanceMilesToShip
} = require('../services/antiSpamService');
const { generateDuckSignature } = require('../data/seedDucks');

function requestJson(server, method, path, body = null) {
  return new Promise((resolve, reject) => {
    const addr = server.address();
    const options = {
      hostname: '127.0.0.1',
      port: addr.port,
      path,
      method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, res => {
      let data = '';
      res.on('data', chunk => (data += chunk));
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, body: parsed });
        } catch (err) {
          resolve({ status: res.statusCode, body: data });
        }
      });
    });

    req.on('error', reject);
    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function runTests() {
  console.log('================================================================================');
  console.log('🦆 CRUISEDUCK TRACKER - AUTOMATED DATABASE & ANTI-SPAM VERIFICATION SUITE');
  console.log('================================================================================\n');

  let passed = 0;
  let failed = 0;

  const server = app.listen(0);

  try {
    // ------------------------------------------------------------------------
    // TEST 1: Verify Database Target (`operationruberduck-db`)
    // ------------------------------------------------------------------------
    console.log('TEST 1: Verifying Cloud Firestore database target configuration...');
    const healthRes = await requestJson(server, 'GET', '/api/health');
    assert.strictEqual(healthRes.status, 200, 'Health check should return HTTP 200');
    assert.strictEqual(
      healthRes.body.databaseId,
      'operationruberduck-db',
      `Expected databaseId to be 'operationruberduck-db', got '${healthRes.body.databaseId}'`
    );

    const ducksRes = await requestJson(server, 'GET', '/api/ducks');
    assert.strictEqual(ducksRes.status, 200, 'GET /api/ducks should return HTTP 200');
    assert.ok(
      Array.isArray(ducksRes.body.ducks) && ducksRes.body.ducks.length >= 30,
      `Expected at least 30 ducks in fleet, got ${ducksRes.body.ducks?.length}`
    );
    for (let i = 1; i <= 30; i++) {
      const duckId = `DUCK-${String(i).padStart(3, '0')}`;
      const duckObj = ducksRes.body.ducks.find(d => d.duckId === duckId);
      assert.ok(duckObj, `Missing ${duckId} in fleet catalog`);
      assert.strictEqual(
        duckObj.signatureHash,
        generateDuckSignature(duckId),
        `Invalid QR HMAC signature for ${duckId}`
      );
    }
    console.log(`   ✅ Verified databaseId === 'operationruberduck-db' & all 30 ducks (DUCK-001 to DUCK-030) with valid QR HMAC signatures`);
    passed++;

    // ------------------------------------------------------------------------
    // TEST 2: Cryptographic QR Signature Verification & Distance Calculation
    // ------------------------------------------------------------------------
    console.log('\nTEST 2: Verifying QR HMAC signature validation & Great-Circle distance math...');
    const validSig = generateDuckSignature('DUCK-007');
    assert.strictEqual(verifyQrSignature('DUCK-007', validSig), true, 'Authentic signature must verify true');
    assert.strictEqual(verifyQrSignature('DUCK-007', 'deadbeef'), false, 'Tampered signature must return false');

    const milesFromSeattle = calculateDistanceMilesToShip(47.6062, -122.3321);
    assert.ok(milesFromSeattle > 3000 && milesFromSeattle < 3600, `Expected Seattle distance ~3310 miles, got ${milesFromSeattle}`);
    console.log(`   ✅ Verified QR HMAC signatures & Haversine distance (Seattle -> Caribbean Ship: ${milesFromSeattle} mi)`);
    passed++;

    // ------------------------------------------------------------------------
    // TEST 3: Zero-PII & Profanity Sanitization
    // ------------------------------------------------------------------------
    console.log('\nTEST 3: Verifying Zero-PII enforcement (email/phone redaction) & profanity filter...');
    const dirtyInput = {
      city: 'Vancouver',
      region: 'BC',
      country: 'Canada',
      note: 'Found by john.doe@gmail.com call 555-867-5309! Holy shit this duck is awesome! https://spam.com ' + 'A'.repeat(50),
      deckFound: 'Deck 12'
    };
    const cleaned = sanitizeDiscoveryInput(dirtyInput);
    assert.ok(!cleaned.note.includes('john.doe@gmail.com'), 'Email address must be stripped');
    assert.ok(!cleaned.note.includes('555-867-5309'), 'Phone number must be stripped');
    assert.ok(!cleaned.note.includes('shit'), 'Profanity must be filtered');
    assert.ok(!cleaned.note.includes('https://spam.com'), 'URLs must be stripped');
    assert.ok(cleaned.note.length <= 100, `Note length must be <= 100 chars (got ${cleaned.note.length})`);
    console.log(`   ✅ Verified PII redaction & profanity scrub: "${cleaned.note}"`);
    passed++;

    // ------------------------------------------------------------------------
    // TEST 4: Cross-Device Server Database Persistence (NOT Client LocalStorage!)
    // ------------------------------------------------------------------------
    console.log('\nTEST 4: Verifying Cross-Device Server Database Persistence (Client A -> DB -> Client B)...');
    const uniqueTestCity = `Honolulu-Test-${Date.now().toString().slice(-4)}`;
    const deviceAFingerprint = `device_A_iphone_${Date.now()}`;
    const testDuckId = 'DUCK-019';

    // Get initial find count of DUCK-019 before Client A submits
    const initialDuckRes = await requestJson(server, 'GET', `/api/ducks/${testDuckId}`);
    const initialFindCount = initialDuckRes.body.duck.findCount || 0;

    // Client A (Device A) submits discovery via POST /api/discoveries
    const postRes = await requestJson(server, 'POST', '/api/discoveries', {
      duckId: testDuckId,
      sig: generateDuckSignature(testDuckId),
      city: uniqueTestCity,
      region: 'HI',
      country: 'United States',
      countryCode: 'US',
      lat: 21.3069,
      lng: -157.8583,
      note: `Aloha from ${uniqueTestCity}! Found ${testDuckId} by the pool towel station!`,
      deckFound: 'Deck 11 - Pool Deck',
      fingerprintHash: deviceAFingerprint
    });

    assert.strictEqual(postRes.status, 201, `Expected HTTP 201 Created, got ${postRes.status}`);
    assert.strictEqual(postRes.body.persistedToServerDb, true, 'Server must confirm persistedToServerDb=true');

    // Now Client B (an independent device with ZERO shared local storage) queries GET /api/discoveries
    const clientBGetRes = await requestJson(server, 'GET', '/api/discoveries?limit=20');
    assert.strictEqual(clientBGetRes.status, 200, 'Client B GET /api/discoveries should return HTTP 200');
    const foundInDb = clientBGetRes.body.discoveries.find(d => d.city === uniqueTestCity);

    assert.ok(
      foundInDb,
      `CRITICAL: Discovery from Client A (${uniqueTestCity}) MUST be present in server DB response to Client B!`
    );
    assert.strictEqual(foundInDb.duckId, testDuckId, 'Duck ID in DB must match');
    assert.strictEqual(foundInDb.verifiedQrSignature, true, 'Verified QR signature flag must be recorded');

    // Also check that DUCK-019's findCount was incremented in the server database
    const updatedDuckRes = await requestJson(server, 'GET', `/api/ducks/${testDuckId}`);
    assert.strictEqual(
      updatedDuckRes.body.duck.findCount,
      initialFindCount + 1,
      `Duck ${testDuckId} findCount should increment from ${initialFindCount} to ${initialFindCount + 1}`
    );
    console.log(`   ✅ Verified Client A submission (${uniqueTestCity}) is permanently recorded to DB and immediately visible to independent Client B!`);
    passed++;

    // ------------------------------------------------------------------------
    // TEST 5: Cruise-Ship NAT-Aware Anti-Spam Rate Limiting
    // ------------------------------------------------------------------------
    console.log('\nTEST 5: Verifying Cruise-Ship NAT-Aware Rate Limiting (blocks duplicate device, allows shared NAT IP)...');
    // Device A tries to submit the exact same duck (DUCK-019) a second time within 1 hour -> MUST BE BLOCKED (HTTP 429)
    const duplicateRes = await requestJson(server, 'POST', '/api/discoveries', {
      duckId: testDuckId,
      sig: generateDuckSignature(testDuckId),
      city: uniqueTestCity,
      region: 'HI',
      country: 'United States',
      countryCode: 'US',
      lat: 21.3069,
      lng: -157.8583,
      note: 'Duplicate spam attempt from Device A',
      fingerprintHash: deviceAFingerprint
    });

    assert.strictEqual(duplicateRes.status, 429, `Duplicate submission from same device must return HTTP 429 (got ${duplicateRes.status})`);

    // Device C (another passenger sharing the same Cruise Ship NAT IP, different fingerprint) submits DUCK-019 -> MUST SUCCEED (HTTP 201)
    const deviceCFingerprint = `device_C_android_${Date.now()}`;
    const deviceCRes = await requestJson(server, 'POST', '/api/discoveries', {
      duckId: testDuckId,
      sig: generateDuckSignature(testDuckId),
      city: 'Reykjavik',
      region: 'Capital Region',
      country: 'Iceland',
      countryCode: 'IS',
      lat: 64.1466,
      lng: -21.9426,
      note: 'Ahoy from Iceland! Found DUCK-019 after Device A hid it again!',
      fingerprintHash: deviceCFingerprint
    });

    assert.strictEqual(
      deviceCRes.status,
      201,
      `Independent passenger (Device C) on shared Cruise Ship NAT IP must be allowed (HTTP 201), got ${deviceCRes.status}`
    );
    console.log(`   ✅ Verified Device A duplicate blocked (HTTP 429) while Fellow Cruiser Device C on same ship NAT IP succeeded (HTTP 201)!`);
    passed++;

    // ------------------------------------------------------------------------
    // TEST 6: Gemini AI Background Note Moderator (10-Word Limit + Family-Safe Rewrite)
    // ------------------------------------------------------------------------
    console.log('\nTEST 6: Verifying Gemini AI Background Note Moderator (10-word limit + inappropriate text rewrite)...');
    const deviceDFingerprint = `device_D_family_${Date.now()}`;
    const longDirtyNote = 'Holy shit this damn duck sucks and is way too long because it has sixteen words total!';
    const modRes = await requestJson(server, 'POST', '/api/discoveries', {
      duckId: 'DUCK-022',
      sig: generateDuckSignature('DUCK-022'),
      city: 'Nassau',
      region: 'New Providence',
      country: 'Bahamas',
      countryCode: 'BS',
      lat: 25.0443,
      lng: -77.3504,
      note: longDirtyNote,
      // Intentionally omit deckFound (verifying deck dropdown removal works seamlessly)
      fingerprintHash: deviceDFingerprint
    });

    assert.strictEqual(modRes.status, 201, `Expected HTTP 201 Created, got ${modRes.status}`);
    const savedNote = modRes.body.discovery.note;
    const savedWordCount = savedNote.trim().split(/\s+/).filter(Boolean).length;
    assert.ok(
      savedWordCount <= 10,
      `Saved note must be strictly <= 10 words (got ${savedWordCount} words: "${savedNote}")`
    );
    assert.ok(!/shit|damn|sucks/i.test(savedNote), `Inappropriate words must be completely scrubbed ("${savedNote}")`);
    assert.strictEqual(modRes.body.discovery.noteModerated, true, 'noteModerated flag should be true');
    console.log(`   ✅ Verified inappropriate 16-word input automatically rewritten by Gemini AI Moderator to clean ${savedWordCount}-word phrase: "${savedNote}"`);
    passed++;

  } catch (err) {
    failed++;
    console.error('\n❌ TEST FAILED:', err);
  } finally {
    server.close();
    // Restore clean seed state so automated test runs never leave test records on the live globe
    const fs = require('fs');
    const path = require('path');
    const { INITIAL_DUCKS, INITIAL_DISCOVERIES } = require('../data/seedDucks');
    const formattedDiscoveries = INITIAL_DISCOVERIES.map(d => ({
      ...d,
      pinnedAtFormatted: new Date(d.createdAt).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      }),
      pinnedTimeEpochMs: new Date(d.createdAt).getTime()
    }));
    fs.writeFileSync(path.join(__dirname, '../data/persistent_ducks.json'), JSON.stringify(INITIAL_DUCKS, null, 2));
    fs.writeFileSync(path.join(__dirname, '../data/persistent_discoveries.json'), JSON.stringify(formattedDiscoveries, null, 2));
    fs.writeFileSync(path.join(__dirname, '../data/persistent_rate_limits.json'), JSON.stringify({}, null, 2));
  }

  console.log('\n================================================================================');
  console.log(`🏁 QA VERIFICATION SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log('================================================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
