import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Anchor,
  Award,
  Clock,
  Compass,
  Globe2,
  MapPin,
  Navigation,
  PlusCircle,
  QrCode,
  RefreshCw,
  Ship,
  Trash2,
  Trophy
} from 'lucide-react';
import { GlobeView } from './components/GlobeView';
import { FindSubmissionModal } from './components/FindSubmissionModal';
import { DuckCatalogModal } from './components/DuckCatalogModal';
import { TagGeneratorModal } from './components/TagGeneratorModal';
import { CruiseStats, Discovery, Duck, ShipPosition } from './types/duck';
import { formatPinnedTimestamp } from './utils/timeFormat';

const LOCAL_CACHE_KEY = 'cruiseduck_offline_discoveries_cache_v1';

export const App: React.FC = () => {
  const [discoveries, setDiscoveries] = useState<Discovery[]>([]);
  const [ducks, setDucks] = useState<Duck[]>([]);
  const [stats, setStats] = useState<CruiseStats | null>(null);
  const [selectedDiscovery, setSelectedDiscovery] = useState<Discovery | null>(null);
  const [isFindModalOpen, setIsFindModalOpen] = useState(false);
  const [isCatalogModalOpen, setIsCatalogModalOpen] = useState(false);
  const [isTagStudioOpen, setIsTagStudioOpen] = useState(false);
  const [scannedDuckId, setScannedDuckId] = useState<string>('DUCK-001');
  const [scannedSignature, setScannedSignature] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [confirmClearDb, setConfirmClearDb] = useState<boolean>(false);
  const [isClearingDb, setIsClearingDb] = useState<boolean>(false);

  const shipPosition: ShipPosition = stats?.shipPosition || {
    name: 'Caribbean Sea (Grand Turk / St. Thomas Corridor)',
    lat: 21.4691,
    lng: -71.1399
  };

  const fetchAllData = async () => {
    try {
      setIsLoading(true);
      const [discRes, ducksRes, statsRes] = await Promise.all([
        fetch('/api/discoveries?limit=250'),
        fetch('/api/ducks'),
        fetch('/api/stats')
      ]);

      if (discRes.ok) {
        const discData = await discRes.json();
        if (Array.isArray(discData.discoveries)) {
          setDiscoveries(discData.discoveries);
          localStorage.setItem(LOCAL_CACHE_KEY, JSON.stringify(discData.discoveries));
          if (discData.discoveries.length > 0) {
            setSelectedDiscovery(discData.discoveries[0]);
          } else {
            setSelectedDiscovery(null);
          }
        }
      }

      if (ducksRes.ok) {
        const ducksData = await ducksRes.json();
        if (Array.isArray(ducksData.ducks)) {
          setDucks(ducksData.ducks);
        }
      }

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }
    } catch {
      // Offline grace: restore cached discoveries if satellite Wi-Fi drops
      const cached = localStorage.getItem(LOCAL_CACHE_KEY);
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          setDiscoveries(parsed);
        } catch {
          // ignore
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();

    // Check URL query string for QR scan (?id=DUCK-042&sig=...)
    const params = new URLSearchParams(window.location.search);
    const qrId = params.get('id');
    const qrSig = params.get('sig') || '';

    if (qrId) {
      const cleanQrId = qrId.toUpperCase().trim();
      setScannedDuckId(cleanQrId);
      setScannedSignature(qrSig);
      setIsFindModalOpen(true);
    }
  }, []);

  const handleNewDiscoverySuccess = (newDiscovery: Discovery) => {
    setDiscoveries(prev => [newDiscovery, ...prev]);
    setSelectedDiscovery(newDiscovery);
    fetchAllData();

    // Launch Caribbean celebration confetti!
    confetti({
      particleCount: 85,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#00D2B8', '#FFC83B', '#FF7A59', '#FFFFFF']
    });
  };

  const handleClearDatabase = async () => {
    if (!confirmClearDb) {
      setConfirmClearDb(true);
      setTimeout(() => setConfirmClearDb(false), 5000);
      return;
    }

    setIsClearingDb(true);
    try {
      const res = await fetch('/api/admin/clear-db', { method: 'POST' });
      if (res.ok) {
        localStorage.removeItem('cruiseduck_submissions_v1');
        localStorage.removeItem(LOCAL_CACHE_KEY);
        setSelectedDiscovery(null);
        setDiscoveries([]);
        await fetchAllData();
      }
    } catch {
      // ignore
    } finally {
      setIsClearingDb(false);
      setConfirmClearDb(false);
    }
  };

  return (
    <div className="caribbean-app-shell">
      {/* Top Tropical Navigation Bar (Zero Reading Fatigue) */}
      <header className="caribbean-navbar">
        <div className="navbar-brand">
          <div className="brand-logo-circle">🦆</div>
          <div>
            <div className="brand-eyebrow">
              <span>CARIBBEAN CRUISE 2026</span>
            </div>
            <h1 className="brand-title">CruiseDuck</h1>
          </div>
        </div>

        <div className="navbar-actions">
          <button
            type="button"
            className="nav-btn-secondary"
            onClick={() => setIsCatalogModalOpen(true)}
            aria-label="View Duck Roster"
          >
            <Award size={16} />
            <span>30 Ducks</span>
          </button>

          <button
            type="button"
            className="nav-btn-secondary"
            onClick={() => setIsTagStudioOpen(true)}
            aria-label="Open QR Tag Studio"
          >
            <QrCode size={16} />
            <span>QR Tags</span>
          </button>

          {/* Pre-Cruise Testing DB Clear Button (Remove right before cruise departure) */}
          <button
            type="button"
            className={`nav-btn-secondary ${confirmClearDb ? 'nav-btn-danger-confirm' : 'nav-btn-danger'}`}
            onClick={handleClearDatabase}
            disabled={isClearingDb}
            title="Clear all discoveries and reset all 30 ducks to 0 finds (keeps schema intact)"
          >
            <Trash2 size={15} />
            <span>
              {isClearingDb
                ? 'Clearing...'
                : confirmClearDb
                ? '⚠️ Tap to Confirm Wipe!'
                : 'Clear DB'}
            </span>
          </button>

          {Boolean(scannedSignature) && (
            <button
              type="button"
              className="nav-btn-found-cta"
              onClick={() => setIsFindModalOpen(true)}
            >
              <PlusCircle size={17} />
              <span>📍 Pin {scannedDuckId}</span>
            </button>
          )}
        </div>
      </header>

      {/* Main Mobile-First Split Hero & 3D Globe Experience */}
      <main className="caribbean-main">
        {/* Wordless Pictographic Hero Strip + Nano Banana Graphic */}
        <section className="caribbean-hero-banner wordless-hero-banner">
          <div className="hero-banner-content">
            <div className="wordless-step-strip">
              <div className="wordless-step-pill">
                <span className="step-num">①</span>
                <span>📷 Scan</span>
              </div>
              <span className="step-arrow">➔</span>
              <div className="wordless-step-pill">
                <span className="step-num">②</span>
                <span>📍 City</span>
              </div>
              <span className="step-arrow">➔</span>
              <div className="wordless-step-pill">
                <span className="step-num">③</span>
                <span>🌍 3D Globe</span>
              </div>
            </div>

            <div className="hero-cta-row">
              {Boolean(scannedSignature) ? (
                <button
                  type="button"
                  className="btn-caribbean-primary btn-large"
                  onClick={() => setIsFindModalOpen(true)}
                >
                  <MapPin size={18} />
                  <span>Pin Scanned {scannedDuckId}!</span>
                </button>
              ) : (
                <div className="scan-qr-hint-pill">
                  <QrCode size={18} />
                  <span>📷 Scan Duck QR Tag on Ship to Pin!</span>
                </div>
              )}
              <button
                type="button"
                className="btn-glass-outline"
                onClick={() => setIsCatalogModalOpen(true)}
              >
                <Compass size={17} />
                <span>30 Ducks</span>
              </button>
            </div>
          </div>

          {/* Nano Banana Wordless Graphic Guide */}
          <div className="nano-banana-graphic-card">
            <img
              src="/wordless_duck_guide.jpg"
              alt="Scan Duck QR -> Pin Hometown -> Spin 3D Globe"
              className="nano-banana-img"
            />
          </div>

          {/* Compact Farthest Traveler Trophy Pill */}
          {stats?.farthestDiscovery && (
            <div className="farthest-traveler-card">
              <div className="trophy-badge">
                <Trophy size={16} />
                <span>🏆 FARTHEST PIN</span>
              </div>
              <div className="farthest-city">
                {stats.farthestDiscovery.city}, {stats.farthestDiscovery.country}
              </div>
              <div className="farthest-miles">
                📏 {stats.farthestDiscovery.distanceMiles.toLocaleString()} mi
              </div>
              <div className="farthest-duck">
                🦆 <strong>{stats.farthestDiscovery.duckId}</strong>
              </div>
            </div>
          )}
        </section>

        {/* 3D Spinning Globe + Live Discovery Feed Grid */}
        <section className="globe-and-feed-grid">
          {/* Left/Top: Interactive 3D Spinning Globe */}
          <div className="globe-panel-card">
            <div className="panel-card-header">
              <div className="panel-title-group">
                <Globe2 size={18} className="turquoise-icon" />
                <h3>🌍 3D Duck Hunter Globe</h3>
              </div>
              <div className="ship-coord-tag">
                <Ship size={14} />
                <span>🚢 21.47°N, 71.14°W</span>
              </div>
            </div>

            <GlobeView
              discoveries={discoveries}
              shipPosition={shipPosition}
              selectedDiscovery={selectedDiscovery}
              onSelectDiscovery={d => setSelectedDiscovery(d)}
            />

            {/* Quick Pictographic Telemetry Strip */}
            <div className="telemetry-kpi-strip">
              <div className="kpi-box">
                <span className="kpi-value">🦆 {stats?.totalDiscoveries || discoveries.length}</span>
                <span className="kpi-label">Pins</span>
              </div>
              <div className="kpi-box">
                <span className="kpi-value">🌐 {stats?.uniqueCountriesCount || 1}</span>
                <span className="kpi-label">Nations</span>
              </div>
              <div className="kpi-box">
                <span className="kpi-value">🏷️ {stats?.uniqueDucksFound || 1}/{ducks.length}</span>
                <span className="kpi-label">Ducks</span>
              </div>
              <div className="kpi-box">
                <span className="kpi-value">
                  📏 {((stats?.totalMilesTraveled || 0) / 1000).toFixed(1)}k mi
                </span>
                <span className="kpi-label">Distance</span>
              </div>
            </div>
          </div>

          {/* Right/Bottom: Live Shipboard Discovery Feed */}
          <div className="feed-panel-card">
            <div className="panel-card-header">
              <div className="panel-title-group">
                <Anchor size={18} className="gold-icon" />
                <h3>Live Shipboard Duck Sightings</h3>
              </div>
              <button
                type="button"
                className="refresh-icon-btn"
                onClick={fetchAllData}
                title="Refresh Live Discoveries from Cloud Firestore"
              >
                <RefreshCw size={15} className={isLoading ? 'spin-anim' : ''} />
              </button>
            </div>

            <div className="discoveries-feed-list">
              {discoveries.map(item => {
                const isActive = selectedDiscovery?.id === item.id;
                const timeInfo = formatPinnedTimestamp(item.createdAt);
                return (
                  <div
                    key={item.id}
                    className={`discovery-feed-card ${isActive ? 'feed-card-active' : ''}`}
                    onClick={() => setSelectedDiscovery(item)}
                  >
                    <div className="feed-card-top">
                      <span className="feed-duck-pill">
                        🦆 {item.duckId}: {item.duckName}
                      </span>
                      <span className="feed-miles-badge">
                        <Navigation size={12} /> {item.distanceMilesToShip.toLocaleString()} mi
                      </span>
                    </div>

                    <div className="feed-card-hometown">
                      <MapPin size={15} className="pin-icon" />
                      <strong>
                        {item.city}
                        {item.region ? `, ${item.region}` : ''}
                      </strong>
                      <span className="feed-country">{item.country}</span>
                    </div>

                    <p className="feed-card-note">"{item.note}"</p>

                    <div className="feed-card-bottom">
                      <span className="feed-deck">📍 {item.deckFound}</span>
                      <span className="feed-timestamp" title={`Exact Pinned Time: ${timeInfo.fullDateTime}`}>
                        <Clock size={12} /> {timeInfo.shortDateTime}
                        {timeInfo.relative ? ` (${timeInfo.relative})` : ''}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      {/* Modals */}
      <FindSubmissionModal
        isOpen={isFindModalOpen}
        onClose={() => setIsFindModalOpen(false)}
        ducks={ducks}
        initialDuckId={scannedDuckId}
        initialSignature={scannedSignature}
        onSubmissionSuccess={handleNewDiscoverySuccess}
      />

      <DuckCatalogModal
        isOpen={isCatalogModalOpen}
        onClose={() => setIsCatalogModalOpen(false)}
        ducks={ducks}
        discoveries={discoveries}
      />

      <TagGeneratorModal
        isOpen={isTagStudioOpen}
        onClose={() => setIsTagStudioOpen(false)}
        ducks={ducks}
      />
    </div>
  );
};
