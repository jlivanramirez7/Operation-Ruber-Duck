/**
 * Express API & Static Web Server for CruiseDuck Tracker ("Operation Rubber Duck")
 * Containerized for Google Cloud Run with Google Cloud Firestore (`operationruberduck-db`)
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
const firestoreService = require('./services/firestoreService');
const { verifyQrSignature } = require('./services/antiSpamService');
const { generateDuckSignature, SHIP_POSITION } = require('./data/seedDucks');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json({ limit: '2mb' }));

// Attempt background Firestore connection & seeding on startup
firestoreService.verifyConnectionAndSeed().catch(err => {
  console.warn('[Server] Initial Firestore ping warning:', err.message);
});

// ============================================================================
// API ROUTES
// ============================================================================

/**
 * GET /api/health
 * Health check endpoint verifying database target (`operationruberduck-db`)
 */
app.get('/api/health', async (req, res) => {
  const stats = await firestoreService.getStats();
  res.json({
    status: 'healthy',
    service: 'cruiseduck-tracker',
    databaseId: firestoreService.databaseId,
    firestoreConnected: firestoreService.connected,
    shipPosition: SHIP_POSITION,
    totalDiscoveriesRecorded: stats.totalDiscoveries,
    timestamp: new Date().toISOString()
  });
});

/**
 * GET /api/stats
 * Aggregated Scavenger Hunt telemetry and leaderboard
 */
app.get('/api/stats', async (req, res) => {
  try {
    const stats = await firestoreService.getStats();
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/ducks
 * Returns full catalog of hidden ducks (DUCK-001 through DUCK-025+)
 */
app.get('/api/ducks', async (req, res) => {
  try {
    const ducks = await firestoreService.listDucks();
    res.json({ ducks });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/ducks/:duckId
 * Lookup specific duck details and verify QR signature if provided
 */
app.get('/api/ducks/:duckId', async (req, res) => {
  try {
    const duckId = String(req.params.duckId || '').toUpperCase().trim();
    const sig = req.query.sig ? String(req.query.sig) : '';
    const duck = await firestoreService.getDuckById(duckId);
    if (!duck) {
      return res.status(404).json({ error: `Duck ${duckId} not found in fleet catalog.` });
    }
    const verifiedQr = verifyQrSignature(duckId, sig);
    res.json({
      duck,
      verifiedQrSignature: verifiedQr,
      expectedSignature: generateDuckSignature(duckId)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/discoveries
 * Lists all verified duck sightings across the world for the 3D spinning globe
 */
app.get('/api/discoveries', async (req, res) => {
  try {
    const limit = Math.min(Number(req.query.limit) || 250, 500);
    const discoveries = await firestoreService.listDiscoveries(limit);
    res.json({
      databaseId: firestoreService.databaseId,
      count: discoveries.length,
      discoveries
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * POST /api/discoveries
 * Submits a new duck discovery with Cruise-Ship NAT-aware anti-spam protection,
 * Zero-PII sanitization, and permanent persistence to `operationruberduck-db`.
 */
app.post('/api/discoveries', async (req, res) => {
  try {
    const result = await firestoreService.recordDiscovery(req.body);
    res.status(201).json({
      success: true,
      message: `Ahoy! Your hometown (${result.discovery.city}, ${result.discovery.country}) has been pinned to the 3D Globe!`,
      ...result
    });
  } catch (err) {
    const status = err.statusCode || 500;
    res.status(status).json({
      success: false,
      error: err.message || 'Could not record duck discovery.'
    });
  }
});

/**
 * GET /api/verify-qr
 * Helper endpoint for QR Tag Studio to verify or generate HMAC signatures
 */
app.get('/api/verify-qr', async (req, res) => {
  const duckId = String(req.query.id || 'DUCK-001').toUpperCase().trim();
  const sig = String(req.query.sig || '');
  const expectedSig = generateDuckSignature(duckId);
  const valid = verifyQrSignature(duckId, sig);
  const duck = await firestoreService.getDuckById(duckId);
  res.json({
    duckId,
    valid,
    expectedSignature: expectedSig,
    duck
  });
});

/**
 * POST /api/moderate-note
 * Background Gemini AI Moderator & 5-Word Family-Safe Scrubber
 */
const { moderateAndRewriteNote } = require('./services/geminiNoteModerator');
app.post('/api/moderate-note', async (req, res) => {
  try {
    const rawNote = String(req.body?.note || '');
    const result = await moderateAndRewriteNote(rawNote);
    res.json({
      success: true,
      ...result
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

// ============================================================================
// STATIC REACT FRONTEND SERVING (Cloud Run Unified Container)
// ============================================================================
const publicDir = path.join(__dirname, 'public');
app.use(express.static(publicDir));

app.get('*', (req, res) => {
  const indexFile = path.join(publicDir, 'index.html');
  res.sendFile(indexFile, err => {
    if (err) {
      res.status(200).send('CruiseDuck Tracker API Server is running. Build frontend to view UI.');
    }
  });
});

if (require.main === module) {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🦆 CruiseDuck Tracker server running on http://0.0.0.0:${PORT} (Database: ${firestoreService.databaseId})`);
  });
}

module.exports = app;
