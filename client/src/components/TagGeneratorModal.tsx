import React, { useState } from 'react';
import { Printer, QrCode, ShieldCheck, Sparkles, X } from 'lucide-react';
import { Duck } from '../types/duck';

interface TagGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  ducks: Duck[];
}

export const TagGeneratorModal: React.FC<TagGeneratorModalProps> = ({
  isOpen,
  onClose,
  ducks
}) => {
  const [selectedCount, setSelectedCount] = useState<number>(12);

  if (!isOpen) return null;

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://cruiseduck-tracker.run.app';

  const handlePrintTags = () => {
    window.print();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="caribbean-modal tag-studio-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header-tropical no-print">
          <div>
            <div className="modal-header-badge">
              <QrCode size={16} />
              <span>PHYSICAL WATERPROOF QR TAG STUDIO</span>
            </div>
            <h2 className="modal-title">Printable 1.5" × 1.5" Waterproof Duck Tags</h2>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose} aria-label="Close tag studio">
            <X size={20} />
          </button>
        </div>

        <div className="tag-studio-controls no-print">
          <div className="tag-spec-summary">
            <ShieldCheck size={16} />
            <span>
              <strong>Marine Waterproof Spec:</strong> 1.5"×1.5" PVC/Vinyl die-cut label • QR Error Correction Level H (30% recovery) • Includes cryptographic HMAC signature (<code>?id=DUCK-XXX&amp;sig=...</code>).
            </span>
          </div>
          <div className="tag-studio-actions">
            <select
              className="tropical-input tag-count-select"
              value={selectedCount}
              onChange={e => setSelectedCount(Number(e.target.value))}
            >
              <option value={6}>Show First 6 Tags</option>
              <option value={12}>Show First 12 Tags</option>
              <option value={25}>Show All 25 Tags</option>
            </select>
            <button type="button" className="btn-caribbean-primary" onClick={handlePrintTags}>
              <Printer size={16} />
              <span>Print Waterproof Tag Sheet</span>
            </button>
          </div>
        </div>

        {/* Printable Waterproof Tag Grid */}
        <div className="printable-tag-sheet">
          {ducks.slice(0, selectedCount).map(duck => {
            const qrTargetUrl = `${baseUrl}/?id=${duck.duckId}&sig=${duck.signatureHash}`;
            const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&ecc=H&data=${encodeURIComponent(
              qrTargetUrl
            )}`;
            return (
              <div key={duck.duckId} className="waterproof-tag-card">
                <div className="tag-hole-punch" title="3mm Zip-Tie / Stainless Loop Punch" />
                <div className="tag-card-header">
                  <span className="tag-ahoy">AHOY! YOU FOUND ME! 🦆🌴</span>
                  <strong className="tag-duck-id">{duck.duckId}</strong>
                </div>

                <div className="tag-qr-box">
                  <img
                    src={qrImageUrl}
                    alt={`QR code for ${duck.duckId}`}
                    className="tag-qr-img"
                    loading="lazy"
                  />
                </div>

                <div className="tag-card-footer">
                  <div className="tag-duck-name">{duck.name}</div>
                  <p className="tag-call-to-action">
                    Scan me to pin your hometown on our 3D Cruise Duck Globe!
                  </p>
                  <span className="tag-signature">
                    Operation Rubber Duck • Sig: {duck.signatureHash}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
