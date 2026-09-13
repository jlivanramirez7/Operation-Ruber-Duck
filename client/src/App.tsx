import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Anchor,
  Award,
  Clock,
  Compass,
  Database,
  Globe2,
  MapPin,
  Navigation,
  PlusCircle,
  QrCode,
  RefreshCw,
  ShieldCheck,
  Ship,
  Sparkles,
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
          if (!selectedDiscovery && discData.discoveries.length > 0) {
            setSelectedDiscovery(discData.discoveries[0]);
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

  return (
    <div className="caribbean-app-shell">
      {/* Top Tropical Navigation Bar */}
      <header className="caribbean-navbar">
        <div className="navbar-brand">
          <div className="brand-logo-circle">🦆</div>
          <div>
            <div className="brand-eyebrow">
              <span>OPERATION RUBBER DUCK • CARIBBEAN CRUISE 2026</span>
            </div>
            <h1 className="brand-title">CruiseDuck Tracker</h1>
          </div>
        </div>

        <div className="navbar-actions">
          <div className="db-status-pill" title="Connected to Google Cloud Firestore (operationruberduck-db)">
            <Database size={13} />
            <span>DB: {stats?.databaseId || 'operationruberduck-db'}</span>
          </div>

          <button
            type="button"
            className="nav-btn-secondary"
            onClick={() => setIsCatalogModalOpen(true)}
          >
            <Award size={16} />
            <span>Duck Roster ({ducks.length})</span>
          </button>

          <button
            type="button"
            className="nav-btn-secondary"
            onClick={() => setIsTagStudioOpen(true)}
          >
            <QrCode size={16} />
            <span>QR Tag Studio</span>
          </button>

          <button
            type="button"
            className="nav-btn-found-cta"
            onClick={() => setIsFindModalOpen(true)}
          >
            <PlusCircle size={17} />
            <span>I Found a Duck! Pin Hometown</span>
          </button>
        </div>
      </header>

      {/* Main Mobile-First Split Hero & 3D Globe Experience */}
      <main className="caribbean-main">
        {/* Hero Welcome Banner for QR Scanners */}
        <section className="caribbean-hero-banner">
          <div className="hero-banner-content">
            <div className="hero-pill">
              <Sparkles size={14} />
              <span>AHOY FELLOW DUCK HUNTERS! WELCOME ABOARD!</span>
            </div>
            <h2 className="hero-headline">
              Found a hidden rubber duck on the ship? Pin your hometown on our 3D World Globe!
            </h2>
            <p className="hero-subtext">
              My son Lucas and I hid custom waterproof QR ducks across the cruise ship decks. Scan any duck tag or tap below to pin your hometown city and see how far around the world our fellow cruisers traveled!
            </p>
            <div className="hero-cta-row">
              <button
                type="button"
                className="btn-caribbean-primary btn-large"
                onClick={() => setIsFindModalOpen(true)}
              >
                <MapPin size={18} />
                <span>Pin My Hometown Now (No Login Required)</span>
              </button>
              <button
                type="button"
                className="btn-glass-outline"
                onClick={() => setIsCatalogModalOpen(true)}
              >
                <Compass size={17} />
                <span>View All {ducks.length} Ship Ducks</span>
              </button>
            </div>
          </div>

          {/* Farthest Traveler Highlight Card */}
          {stats?.farthestDiscovery && (
            <div className="farthest-traveler-card">
              <div className="trophy-badge">
                <Trophy size={18} />
                <span>FARTHEST HOMETOWN TRAVELER</span>
              </div>
              <div className="farthest-city">
                {stats.farthestDiscovery.city}, {stats.farthestDiscovery.country}
              </div>
              <div className="farthest-miles">
                {stats.farthestDiscovery.distanceMiles.toLocaleString()} miles to our Cruise Ship!
              </div>
              <div className="farthest-duck">
                Spotted <strong>{stats.farthestDiscovery.duckId}</strong> ({stats.farthestDiscovery.duckName})
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
                <h3>Interactive 3D Duck Hunter World Globe</h3>
              </div>
              <div className="ship-coord-tag">
                <Ship size={14} />
                <span>Ship Position: 21.47°N, 71.14°W (Caribbean Sea)</span>
              </div>
            </div>

            <GlobeView
              discoveries={discoveries}
              shipPosition={shipPosition}
              selectedDiscovery={selectedDiscovery}
              onSelectDiscovery={d => setSelectedDiscovery(d)}
            />

            {/* Quick Telemetry KPI Strip */}
            <div className="telemetry-kpi-strip">
              <div className="kpi-box">
                <span className="kpi-value">{stats?.totalDiscoveries || discoveries.length}</span>
                <span className="kpi-label">Total Duck Sightings</span>
              </div>
              <div className="kpi-box">
                <span className="kpi-value">{stats?.uniqueCountriesCount || 1}</span>
                <span className="kpi-label">Countries & Territories</span>
              </div>
              <div className="kpi-box">
                <span className="kpi-value">{stats?.uniqueDucksFound || 1}/{ducks.length}</span>
                <span className="kpi-label">Unique Ducks Spotted</span>
              </div>
              <div className="kpi-box">
                <span className="kpi-value">
                  {((stats?.totalMilesTraveled || 0) / 1000).toFixed(1)}k mi
                </span>
                <span className="kpi-label">Total Distance to Ship</span>
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
        onSelectDuckToLog={(duckId, sig) => {
          setIsCatalogModalOpen(false);
          setScannedDuckId(duckId);
          setScannedSignature(sig);
          setIsFindModalOpen(true);
        }}
      />

      <TagGeneratorModal
        isOpen={isTagStudioOpen}
        onClose={() => setIsTagStudioOpen(false)}
        ducks={ducks}
      />
    </div>
  );
};
