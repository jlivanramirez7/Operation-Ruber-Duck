import React, { useState } from 'react';
import { Award, Clock, MapPin, Search, Users, X } from 'lucide-react';
import { Discovery, Duck } from '../types/duck';
import { formatPinnedTimestamp } from '../utils/timeFormat';

interface DuckCatalogModalProps {
  isOpen: boolean;
  onClose: () => void;
  ducks: Duck[];
  discoveries: Discovery[];
}

export const DuckCatalogModal: React.FC<DuckCatalogModalProps> = ({
  isOpen,
  onClose,
  ducks,
  discoveries
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
              <span>OPERATION RUBBER DUCK • 30 SHIP DUCKS</span>
            </div>
            <h2 className="modal-title">
              30 Ship Ducks ({foundCount}/{ducks.length} Spotted)
            </h2>
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
              placeholder="Search duck # or name (e.g. DUCK-007, Barnaby, Captain)..."
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
          {filteredDucks.map(duck => {
            const duckFinds = discoveries.filter(disc => disc.duckId === duck.duckId);
            const totalFindsCount = Math.max(duck.findCount || 0, duckFinds.length);

            return (
              <div
                key={duck.duckId}
                className={`duck-roster-card ${totalFindsCount > 0 ? 'duck-found' : 'duck-unfound'}`}
              >
                <div className="duck-roster-top">
                  <span className="duck-id-pill">{duck.duckId}</span>
                  <span
                    className={`find-count-badge ${
                      totalFindsCount > 0 ? 'badge-gold' : 'badge-sea'
                    }`}
                  >
                    {totalFindsCount > 0 ? `🎉 Found ${totalFindsCount}x` : '🏝️ Still Hidden'}
                  </span>
                </div>

                <h3 className="duck-roster-name">{duck.name}</h3>
                <p className="duck-roster-theme">{duck.theme}</p>

                <div className="duck-roster-meta">
                  <div className="meta-line">
                    <Users size={13} />
                    <strong>
                      {totalFindsCount > 0
                        ? `Spotted by ${totalFindsCount} fellow ${
                            totalFindsCount === 1 ? 'cruiser' : 'cruisers'
                          }:`
                        : 'Waiting to be discovered on deck'}
                    </strong>
                  </div>

                  {/* List of Hometowns where Finders were from */}
                  {duckFinds.length > 0 ? (
                    <div className="duck-finders-hometown-list">
                      {duckFinds.map(find => (
                        <div key={find.id} className="duck-finder-hometown-pill">
                          <MapPin size={12} className="pin-icon" />
                          <span>
                            <strong>
                              {find.city}
                              {find.region ? `, ${find.region}` : ''}
                            </strong>{' '}
                            ({find.country})
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : duck.lastFoundByCity ? (
                    <div className="duck-finders-hometown-list">
                      <div className="duck-finder-hometown-pill">
                        <MapPin size={12} className="pin-icon" />
                        <span>
                          <strong>{duck.lastFoundByCity}</strong>
                        </span>
                      </div>
                    </div>
                  ) : null}

                  {duck.lastFoundAt && (
                    <div className="meta-line last-found-time">
                      <Clock size={13} />
                      <span>
                        Last Pinned: {formatPinnedTimestamp(duck.lastFoundAt).shortDateTime}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
