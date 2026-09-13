import React, { useEffect, useState } from 'react';
import { CheckCircle2, Compass, Globe2, MapPin, ShieldCheck, Sparkles, X } from 'lucide-react';
import { BUNDLED_WORLD_CITIES } from '../data/worldCities';
import { Duck, WorldCity } from '../types/duck';
import {
  checkLocalDuckCooldown,
  getDeviceFingerprintHash,
  recordLocalDuckSubmission
} from '../utils/deviceFingerprint';

interface FindSubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  ducks: Duck[];
  initialDuckId: string;
  initialSignature: string;
  onSubmissionSuccess: (newDiscovery: any) => void;
}

const DECK_OPTIONS = [
  'Deck 11 - Lido Pool & Tiki Bar',
  'Deck 10 - Serenity Sun Deck',
  'Deck 8 - Central Park Promenade',
  'Deck 6 - Schooner Piano Bar',
  'Deck 5 - Guest Services Atrium',
  'Deck 12 - Mini Golf & Sports Deck',
  'Deck 14 - Observation Lounge',
  'Deck 15 - Solarium Hot Tubs',
  'Deck 4 - Casino Royale',
  'Other Cruise Ship Deck'
];

export const FindSubmissionModal: React.FC<FindSubmissionModalProps> = ({
  isOpen,
  onClose,
  ducks,
  initialDuckId,
  initialSignature,
  onSubmissionSuccess
}) => {
  const [selectedDuckId, setSelectedDuckId] = useState(initialDuckId || 'DUCK-001');
  const [cityQuery, setCityQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState<WorldCity | null>(null);
  const [customCityName, setCustomCityName] = useState('');
  const [customCountryName, setCustomCountryName] = useState('United States');
  const [isSearchingGeocoder, setIsSearchingGeocoder] = useState(false);
  const [deckFound, setDeckFound] = useState(DECK_OPTIONS[0]);
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (initialDuckId) {
      setSelectedDuckId(initialDuckId.toUpperCase().trim());
    }
  }, [initialDuckId]);

  if (!isOpen) return null;

  const activeDuck = ducks.find(d => d.duckId === selectedDuckId) || {
    duckId: selectedDuckId,
    name: `Cruise Duck ${selectedDuckId}`,
    theme: 'Caribbean Explorer Duck',
    originDeck: 'Cruise Ship Deck'
  };

  // Filter bundled world cities
  const filteredCities = cityQuery.trim()
    ? BUNDLED_WORLD_CITIES.filter(
        c =>
          c.city.toLowerCase().includes(cityQuery.toLowerCase()) ||
          c.country.toLowerCase().includes(cityQuery.toLowerCase()) ||
          c.region.toLowerCase().includes(cityQuery.toLowerCase())
      ).slice(0, 7)
    : BUNDLED_WORLD_CITIES.slice(0, 5);

  const handleSelectBundledCity = (c: WorldCity) => {
    setSelectedCity(c);
    setCityQuery(`${c.city}, ${c.region ? c.region + ', ' : ''}${c.country}`);
    setErrorMessage(null);
  };

  // Fallback Nominatim lookup for smaller towns not in the bundled top list
  const handleLookupCustomTown = async () => {
    if (!customCityName.trim()) return;
    setIsSearchingGeocoder(true);
    setErrorMessage(null);
    try {
      const q = encodeURIComponent(`${customCityName.trim()}, ${customCountryName.trim()}`);
      const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${q}&format=json&limit=1`);
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        const hit = data[0];
        const resolved: WorldCity = {
          city: customCityName.trim(),
          region: '',
          country: customCountryName.trim(),
          countryCode: 'UN',
          lat: parseFloat(hit.lat),
          lng: parseFloat(hit.lon)
        };
        setSelectedCity(resolved);
        setCityQuery(`${resolved.city}, ${resolved.country}`);
      } else {
        setErrorMessage('Could not locate coordinates for that town. Try picking your nearest major city!');
      }
    } catch {
      setErrorMessage('Satellite Wi-Fi lookup timed out. Please pick your nearest major city from the list!');
    } finally {
      setIsSearchingGeocoder(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cooldown = checkLocalDuckCooldown(selectedDuckId);
    if (!cooldown.allowed) {
      setErrorMessage(
        `Ahoy! Your device already pinned ${selectedDuckId} recently. Wait ${cooldown.minutesLeft} min or log another duck!`
      );
      return;
    }

    if (!selectedCity) {
      setErrorMessage('Please choose your hometown city from the quick list (or look up your town) first!');
      return;
    }

    setIsSubmitting(true);
    try {
      const fingerprintHash = getDeviceFingerprintHash();
      const response = await fetch('/api/discoveries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          duckId: selectedDuckId,
          sig: initialSignature,
          city: selectedCity.city,
          region: selectedCity.region,
          country: selectedCity.country,
          countryCode: selectedCity.countryCode,
          lat: selectedCity.lat,
          lng: selectedCity.lng,
          note: note.trim(),
          deckFound,
          fingerprintHash
        })
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Could not save duck discovery to database.');
      }

      recordLocalDuckSubmission(selectedDuckId);
      onSubmissionSuccess(data.discovery);
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Could not record discovery.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="caribbean-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header-tropical">
          <div className="modal-header-badge">
            <Sparkles size={16} />
            <span>AHOY! YOU FOUND A CRUISE DUCK!</span>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          {/* Selected Duck Banner */}
          <div className="duck-id-banner">
            <div className="duck-id-icon">🦆</div>
            <div className="duck-id-details">
              <label htmlFor="duckIdSelect" className="duck-select-label">
                Which Cruise Duck did you find?
              </label>
              <select
                id="duckIdSelect"
                className="duck-select-input"
                value={selectedDuckId}
                onChange={e => setSelectedDuckId(e.target.value)}
              >
                {ducks.map(d => (
                  <option key={d.duckId} value={d.duckId}>
                    {d.duckId} — {d.name} ({d.theme})
                  </option>
                ))}
              </select>
            </div>
            {initialSignature && (
              <span className="verified-tag-pill" title="Authentic Waterproof QR Tag Scanned">
                <ShieldCheck size={14} /> QR Verified
              </span>
            )}
          </div>

          {/* Step 1: Hometown City Picker */}
          <div className="form-group">
            <label className="form-label">
              <Globe2 size={16} /> Where are you cruising from? (Hometown City)
            </label>
            <input
              type="text"
              className="tropical-input"
              placeholder="Search city (e.g., Seattle, Toronto, London, Miami...)"
              value={cityQuery}
              onChange={e => {
                setCityQuery(e.target.value);
                setSelectedCity(null);
              }}
            />

            {/* Quick Autocomplete Chips */}
            <div className="city-suggestions-grid">
              {filteredCities.map(c => {
                const isSelected =
                  selectedCity?.city === c.city && selectedCity?.country === c.country;
                return (
                  <button
                    key={`${c.city}-${c.country}-${c.lat}`}
                    type="button"
                    className={`city-chip ${isSelected ? 'city-chip-selected' : ''}`}
                    onClick={() => handleSelectBundledCity(c)}
                  >
                    <MapPin size={13} />
                    <span>
                      {c.city}
                      {c.region ? `, ${c.region}` : ''} ({c.countryCode})
                    </span>
                    {isSelected && <CheckCircle2 size={14} className="chip-check" />}
                  </button>
                );
              })}
            </div>

            {/* Custom Town Lookup */}
            {!selectedCity && cityQuery.length > 2 && filteredCities.length === 0 && (
              <div className="custom-town-box">
                <p className="custom-town-hint">Town not in quick list? Enter City & Country:</p>
                <div className="custom-town-row">
                  <input
                    type="text"
                    className="tropical-input"
                    placeholder="Town / City Name"
                    value={customCityName}
                    onChange={e => setCustomCityName(e.target.value)}
                  />
                  <input
                    type="text"
                    className="tropical-input"
                    placeholder="Country"
                    value={customCountryName}
                    onChange={e => setCustomCountryName(e.target.value)}
                  />
                  <button
                    type="button"
                    className="lookup-btn"
                    onClick={handleLookupCustomTown}
                    disabled={isSearchingGeocoder}
                  >
                    {isSearchingGeocoder ? 'Locating...' : 'Pin Town'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Step 2: Deck Found */}
          <div className="form-group">
            <label className="form-label">
              <Compass size={16} /> Where on the ship did you spot {activeDuck.name}?
            </label>
            <select
              className="tropical-input"
              value={deckFound}
              onChange={e => setDeckFound(e.target.value)}
            >
              {DECK_OPTIONS.map(deck => (
                <option key={deck} value={deck}>
                  {deck}
                </option>
              ))}
            </select>
          </div>

          {/* Step 3: Optional Congratulatory Note */}
          <div className="form-group">
            <div className="form-label-row">
              <label className="form-label">Fun Cruise Note or Shout-out (Optional)</label>
              <span className="char-counter">{note.length}/100</span>
            </div>
            <input
              type="text"
              maxLength={100}
              className="tropical-input"
              placeholder="e.g., Found hiding by the soft-serve ice cream station! Re-hiding on Deck 8! 🌴🍦"
              value={note}
              onChange={e => setNote(e.target.value)}
            />
          </div>

          {/* Zero-PII & Anti-Spam Notice */}
          <div className="privacy-banner">
            <ShieldCheck size={16} className="privacy-icon" />
            <span>
              <strong>100% Zero-PII Scavenger Hunt:</strong> No email, login, or personal info collected.
              Your hometown pin is saved to Cloud Firestore (<code>operationruberduck-db</code>) for all fellow cruisers to see!
            </span>
          </div>

          {errorMessage && <div className="form-error-alert">{errorMessage}</div>}

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-caribbean-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Pinning to 3D Globe...' : '🌴 Pin My Hometown on the 3D Globe!'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
