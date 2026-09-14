import React, { useEffect, useState } from 'react';
import { CheckCircle2, Globe2, MapPin, ShieldCheck, Sparkles, X } from 'lucide-react';
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

const QUICK_VIBE_NOTES = [
  { emoji: '🍦', text: 'Found hiding by the soft serve ice cream machine!' },
  { emoji: '🍹', text: 'Chilling out by the sunny Lido pool bar!' },
  { emoji: '🤫', text: 'Secretly re-hidden on deck for the next hunter!' },
  { emoji: '☀️', text: 'Having the best family Caribbean cruise vacation ever!' }
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
      ).slice(0, 6)
    : BUNDLED_WORLD_CITIES.slice(0, 6);

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
      // Auto-select top matching city if user typed their city and pressed Submit directly
      cityToPin = filteredCities[0];
      setSelectedCity(cityToPin);
    }

    if (!cityToPin) {
      setErrorMessage('Please choose one of the city options below! 📍');
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
    <div className="modal-backdrop" onClick={onClose}>
      <div className="caribbean-modal" onClick={e => e.stopPropagation()}>
        {/* Wordless Pictographic Header Strip */}
        <div className="modal-header-tropical">
          <div className="modal-header-badge">
            <Sparkles size={16} />
            <span>Step 1: 📍 City ➔ Step 2: 💬 Vibe ➔ Step 3: 🌍 Submit!</span>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          {/* Locked Duck Identity Badge (Dictated strictly by QR Code) */}
          <div className="duck-id-banner">
            <div className="duck-id-icon">🦆</div>
            <div className="duck-id-details">
              <span className="duck-select-label">🦆 Duck Scanned</span>
              <div className="duck-locked-title">
                {activeDuck.duckId} • {activeDuck.name}
              </div>
            </div>
            <span className="verified-tag-pill" title="Authentic Waterproof QR Tag Scanned">
              <ShieldCheck size={14} /> ✓ QR Tag
            </span>
          </div>

          {/* Step 1: Hometown City Picker */}
          <div className="form-group">
            <label className="form-label">
              <span className="step-pill">Step 1</span>
              <Globe2 size={16} /> 📍 Your Hometown City
            </label>
            <input
              type="text"
              className="tropical-input"
              placeholder="🔍 Type city (e.g. Miami, Orlando, Galveston, Toronto...)"
              value={cityQuery}
              onChange={e => {
                setCityQuery(e.target.value);
                setSelectedCity(null);
              }}
            />

            {/* Helper Prompt to make tapping a city option unmistakable */}
            <div className="city-helper-hint">
              <span>👇 Choose one of these:</span>
            </div>

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
                      {c.city}{c.region ? `, ${c.region}` : ''} ({c.countryCode})
                    </span>
                    {isSelected && <CheckCircle2 size={14} className="chip-check" />}
                  </button>
                );
              })}
            </div>

            {/* Custom Town Lookup (only if not in bundled list) */}
            {!selectedCity && cityQuery.length > 2 && filteredCities.length === 0 && (
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
          </div>

          {/* 1-Line Visual Spacer Separating Location Question from Optional Message */}
          <div className="form-step-divider" aria-hidden="true" />

          {/* Step 2: Optional 10-Word Note (Background Vertex AI Moderation runs silently on submit) */}
          <div className="form-group">
            <div className="form-label-row">
              <label className="form-label">
                <span className="step-pill">Step 2</span> 💬 10-Word Vibe (Optional)
              </label>
              <span className={`char-counter ${wordCount >= 10 ? 'word-limit-reached' : ''}`}>
                {wordCount}/10 words
              </span>
            </div>

            <input
              type="text"
              maxLength={90}
              className="tropical-input"
              placeholder="✍️ Max 10 words (e.g. Found hiding by the soft serve ice cream machine! 🍦)"
              value={note}
              onChange={e => handleNoteChange(e.target.value)}
            />

            {/* 1-Tap Emoji Mood Chips (Under text box to mirror Hometown City layout) */}
            <div className="quick-vibe-chips">
              {QUICK_VIBE_NOTES.map(v => (
                <button
                  key={v.text}
                  type="button"
                  className="vibe-chip-btn"
                  onClick={() => setNote(v.text)}
                >
                  <span>{v.emoji}</span>
                  <span>{v.text}</span>
                </button>
              ))}
            </div>
          </div>

          {errorMessage && <div className="form-error-alert">{errorMessage}</div>}

          <div className="modal-actions modal-actions-step3">
            <span className="step-pill step-pill-submit">Step 3 (Submit!)</span>
            <button type="submit" className="btn-caribbean-primary btn-full-width" disabled={isSubmitting}>
              {isSubmitting ? '🌍 Pinning...' : '🌴 Pin to 3D Globe!'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
