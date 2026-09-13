import React, { useState } from 'react';
import { Award, CheckCircle, Compass, MapPin, PlusCircle, Search, X } from 'lucide-react';
import { Duck } from '../types/duck';

interface DuckCatalogModalProps {
  isOpen: boolean;
  onClose: () => void;
  ducks: Duck[];
  onSelectDuckToLog: (duckId: string, sig: string) => void;
}

export const DuckCatalogModal: React.FC<DuckCatalogModalProps> = ({
  isOpen,
  onClose,
  ducks,
  onSelectDuckToLog
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'found' | 'hidden'>('all');

  if (!isOpen) return null;

  const filteredDucks = ducks.filter(d => {
    const matchesSearch =
      d.duckId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.theme.toLowerCase().includes(searchTerm.toLowerCase());
    if (!matchesSearch) return false;
    if (filterMode === 'found') return d.findCount > 0;
    if (filterMode === 'hidden') return d.findCount === 0;
    return true;
  });

  const foundCount = ducks.filter(d => d.findCount > 0).length;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="caribbean-modal catalog-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header-tropical">
          <div>
            <div className="modal-header-badge">
              <Award size={16} />
              <span>CAPTAIN IVAN & LUCAS'S FLEET ROSTER</span>
            </div>
            <h2 className="modal-title">Operation Rubber Duck Fleet ({foundCount}/{ducks.length} Spotted)</h2>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose} aria-label="Close roster">
            <X size={20} />
          </button>
        </div>

        <div className="catalog-toolbar">
          <div className="search-input-wrap">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              className="tropical-input"
              placeholder="Search duck ID or theme (e.g., DUCK-007, Pirate, Pineapple)..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="filter-tabs">
            <button
              type="button"
              className={`filter-tab ${filterMode === 'all' ? 'active' : ''}`}
              onClick={() => setFilterMode('all')}
            >
              All ({ducks.length})
            </button>
            <button
              type="button"
              className={`filter-tab ${filterMode === 'found' ? 'active' : ''}`}
              onClick={() => setFilterMode('found')}
            >
              Spotted ({foundCount})
            </button>
            <button
              type="button"
              className={`filter-tab ${filterMode === 'hidden' ? 'active' : ''}`}
              onClick={() => setFilterMode('hidden')}
            >
              Still Hidden ({ducks.length - foundCount})
            </button>
          </div>
        </div>

        <div className="duck-cards-grid">
          {filteredDucks.map(duck => (
            <div
              key={duck.duckId}
              className={`duck-roster-card ${duck.findCount > 0 ? 'duck-found' : 'duck-unfound'}`}
            >
              <div className="duck-roster-top">
                <span className="duck-id-pill">{duck.duckId}</span>
                <span className={`find-count-badge ${duck.findCount > 0 ? 'badge-gold' : 'badge-sea'}`}>
                  {duck.findCount > 0 ? `🎉 Found ${duck.findCount}x` : '🏝️ Still Hidden'}
                </span>
              </div>

              <h3 className="duck-roster-name">{duck.name}</h3>
              <p className="duck-roster-theme">{duck.theme}</p>

              <div className="duck-roster-meta">
                <div className="meta-line">
                  <Compass size={13} />
                  <span>Hint: {duck.originDeck}</span>
                </div>
                {duck.lastFoundByCity && (
                  <div className="meta-line last-found">
                    <MapPin size={13} />
                    <span>Last spotted by: {duck.lastFoundByCity}</span>
                  </div>
                )}
              </div>

              <button
                type="button"
                className="btn-log-this-duck"
                onClick={() => {
                  onSelectDuckToLog(duck.duckId, duck.signatureHash);
                }}
              >
                <PlusCircle size={15} />
                <span>I Found {duck.duckId}! Log Hometown</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
