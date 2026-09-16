import React, { useEffect, useState } from 'react';
import { CheckCircle2, Globe2, MapPin, X } from 'lucide-react';
import { BUNDLED_WORLD_CITIES } from '../data/worldCities';
import { Duck, WorldCity } from '../types/duck';
import {
  checkLocalDuckCooldown,
  getDeviceFingerprintHash,
  hasDeviceSubmittedBefore,
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

const QUICK_VIBE_NOTES = [
  { emoji: '🍦', label: 'Ice cream spot!', text: 'Found hiding by the soft serve ice cream machine!' },
  { emoji: '🍹', label: 'Pool deck!', text: 'Chilling out by the sunny Lido pool bar!' },
  { emoji: '🤫', label: 'Re-hiding it!', text: 'Secretly re-hidden on deck for the next hunter!' }
];

function countWords(text: string): number {
  if (!text || !text.trim()) return 0;
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function capToTenWords(text: string): string {
  const words = text.trim().split(/\s+/).filter(Boolean);
  if (words.length <= 10) return text;
  return words.slice(0, 10).join(' ');
}

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
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [canDismiss, setCanDismiss] = useState<boolean>(false);

  useEffect(() => {
    if (initialDuckId) {
      setSelectedDuckId(initialDuckId.toUpperCase().trim());
    }
  }, [initialDuckId]);

  useEffect(() => {
    if (isOpen) {
      // Check if this device has ever submitted a duck before.
      // Only devices that have previously submitted get the 'X' button to dismiss without submitting.
      setCanDismiss(hasDeviceSubmittedBefore());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const activeDuck = ducks.find(d => d.duckId === selectedDuckId) || {
    duckId: selectedDuckId,
    name: `Sir Quacks-a-Lot`,
    theme: 'Pirate Booty Boss',
    originDeck: 'Cruise Ship Deck'
  };

  // Filter bundled world cities (limit to 4 clean suggestions to avoid visual clutter)
  const filteredCities = cityQuery.trim()
    ? BUNDLED_WORLD_CITIES.filter(
        c =>
          c.city.toLowerCase().includes(cityQuery.toLowerCase()) ||
          c.country.toLowerCase().includes(cityQuery.toLowerCase()) ||
          c.region.toLowerCase().includes(cityQuery.toLowerCase())
      ).slice(0, 4)
    : BUNDLED_WORLD_CITIES.slice(0, 4);

  const handleSelectBundledCity = (c: WorldCity) => {
    setSelectedCity(c);
    setCityQuery(`${c.city}, ${c.region ? c.region + ', ' : ''}${c.country}`);
    setErrorMessage(null);
  };

  // Fallback Nominatim lookup for smaller towns not in the bundled list
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
        setErrorMessage('Could not locate town. Pick nearest city!');
      }
    } catch {
      setErrorMessage('Satellite lookup timed out. Pick nearest city!');
    } finally {
      setIsSearchingGeocoder(false);
    }
  };

  const handleNoteChange = (val: string) => {
    const words = val.trim().split(/\s+/).filter(Boolean);
    if (words.length > 10 && val.endsWith(' ')) {
      setNote(capToTenWords(val));
    } else {
      setNote(val);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cooldown = checkLocalDuckCooldown(selectedDuckId);
    if (!cooldown.allowed) {
      setErrorMessage(`Already pinned ${selectedDuckId}! Wait ${cooldown.minutesLeft}m.`);
      return;
    }

    let cityToPin = selectedCity;
    if (!cityToPin && cityQuery.trim().length > 0 && filteredCities.length > 0) {
      cityToPin = filteredCities[0];
      setSelectedCity(cityToPin);
    }

    if (!cityToPin) {
      setErrorMessage('Please tap one of the city options below! 📍');
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
          city: cityToPin.city,
          region: cityToPin.region,
          country: cityToPin.country,
          countryCode: cityToPin.countryCode,
          lat: cityToPin.lat,
          lng: cityToPin.lng,
          note: capToTenWords(note.trim()),
          deckFound: activeDuck.originDeck || 'Cruise Ship Deck',
          fingerprintHash
        })
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Could not save duck discovery.');
      }

      recordLocalDuckSubmission(selectedDuckId);
      setCanDismiss(true);
      onSubmissionSuccess(data.discovery);
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Could not record discovery.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const wordCount = countWords(note);

  return (
    <div
      className="modal-backdrop"
      onClick={() => {
        if (canDismiss) onClose();
      }}
    >
      <div className="caribbean-modal simplified-intake-modal" onClick={e => e.stopPropagation()}>
        {/* Clean Single Header Bar */}
        <div className="modal-header-tropical">
          <div className="duck-header-title">
            <span className="duck-emoji-badge">🦆</span>
            <div>
              <div className="duck-found-eyebrow">{activeDuck.duckId} • FOUND!</div>
              <h2 className="duck-found-name">{activeDuck.name}</h2>
            </div>
          </div>
          {canDismiss && (
            <button
              type="button"
              className="modal-close-btn"
              onClick={onClose}
              aria-label="Close modal"
              title="Close form"
            >
              <X size={20} />
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="modal-form simplified-form">
          {/* Step 1: Hometown City Picker */}
          <div className="form-group">
            <label className="form-label">
              <span className="step-pill">Step 1</span>
              <Globe2 size={15} /> 📍 Your Hometown City
            </label>

            {selectedCity ? (
              <div className="selected-city-card">
                <div className="selected-city-info">
                  <CheckCircle2 size={18} className="selected-city-check" />
                  <span>
                    <strong>{selectedCity.city}</strong>
                    {selectedCity.region ? `, ${selectedCity.region}` : ''} ({selectedCity.country})
                  </span>
                </div>
                <button
                  type="button"
                  className="btn-change-city"
                  onClick={() => {
                    setSelectedCity(null);
                    setCityQuery('');
                  }}
                >
                  Change
                </button>
              </div>
            ) : (
              <>
                <input
                  type="text"
                  className="tropical-input"
                  placeholder="🔍 Type your city (e.g. Miami, Toronto...)"
                  value={cityQuery}
                  onChange={e => {
                    setCityQuery(e.target.value);
                    setSelectedCity(null);
                  }}
                />

                <div className="city-helper-hint">
                  <span>👇 Choose one of these:</span>
                </div>

                <div className="city-suggestions-grid">
                  {filteredCities.map(c => (
                    <button
                      key={`${c.city}-${c.country}-${c.lat}`}
                      type="button"
                      className="city-chip"
                      onClick={() => handleSelectBundledCity(c)}
                    >
                      <MapPin size={13} />
                      <span>
                        {c.city}
                        {c.region ? `, ${c.region}` : ''} ({c.countryCode})
                      </span>
                    </button>
                  ))}
                </div>

                {cityQuery.length > 2 && filteredCities.length === 0 && (
                  <div className="custom-town-box">
                    <div className="custom-town-row">
                      <input
                        type="text"
                        className="tropical-input"
                        placeholder="City Name"
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
                        {isSearchingGeocoder ? '...' : '📍 Pin'}
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Step 2: Optional 10-Word Note */}
          <div className="form-group">
            <div className="form-label-row">
              <label className="form-label">
                <span className="step-pill">Step 2</span> 💬 Short Vibe (Optional)
              </label>
              <span className={`char-counter ${wordCount >= 10 ? 'word-limit-reached' : ''}`}>
                {wordCount}/10 words
              </span>
            </div>

            <input
              type="text"
              maxLength={90}
              className="tropical-input"
              placeholder="✍️ Optional note (max 10 words)"
              value={note}
              onChange={e => handleNoteChange(e.target.value)}
            />

            <div className="quick-vibe-chips-compact">
              {QUICK_VIBE_NOTES.map(v => (
                <button
                  key={v.label}
                  type="button"
                  className="vibe-chip-compact-btn"
                  onClick={() => setNote(v.text)}
                >
                  <span>{v.emoji}</span>
                  <span>{v.label}</span>
                </button>
              ))}
            </div>
          </div>

          {errorMessage && <div className="form-error-alert">{errorMessage}</div>}

          <div className="modal-actions-step3">
            <button type="submit" className="btn-caribbean-primary btn-full-width btn-step3-submit" disabled={isSubmitting}>
              <span className="step-pill step-pill-inline">Step 3 (Submit!)</span>
              <span>{isSubmitting ? '🌍 Pinning...' : '🌴 Pin to 3D Globe!'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
