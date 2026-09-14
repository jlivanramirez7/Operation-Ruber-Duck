import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { Printer, QrCode, ShieldCheck, X } from 'lucide-react';
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
  const [qrDataUrls, setQrDataUrls] = useState<Record<string, string>>({});

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://cruiseduck-tracker.run.app';

  useEffect(() => {
    if (!isOpen || !ducks || ducks.length === 0) return;

    let cancelled = false;
    async function generateAllQrCodes() {
      const map: Record<string, string> = {};
      for (const duck of ducks) {
        const qrTargetUrl = `${baseUrl}/?id=${duck.duckId}&sig=${duck.signatureHash}`;
        try {
          const dataUrl = await QRCode.toDataURL(qrTargetUrl, {
            errorCorrectionLevel: 'H',
            width: 240,
            margin: 1,
            color: {
              dark: '#041826',
              light: '#FFFFFF'
            }
          });
          map[duck.duckId] = dataUrl;
        } catch (err) {
          // fallback if needed
        }
      }
      if (!cancelled) {
        setQrDataUrls(map);
      }
    }

    generateAllQrCodes();
    return () => {
      cancelled = true;
    };
  }, [isOpen, ducks, baseUrl]);

  if (!isOpen) return null;

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
              <span>PHYSICAL WATERPROOF QR TAG STUDIO (ALL 30 DUCKS)</span>
            </div>
            <h2 className="modal-title">
              Printable Waterproof Duck Tags (DUCK-001 to DUCK-030)
            </h2>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose} aria-label="Close tag studio">
            <X size={20} />
          </button>
        </div>

        <div className="tag-studio-controls no-print">
          <div className="tag-spec-summary">
            <ShieldCheck size={16} />
            <span>
              <strong>All 30 Ducks Ready to Print:</strong> DUCK-001 through DUCK-030 with cryptographic HMAC signatures • Zero page-cut protection enabled for Print Preview.
            </span>
          </div>
          <div className="tag-studio-actions">
            <button type="button" className="btn-caribbean-primary" onClick={handlePrintTags}>
              <Printer size={16} />
              <span>Print All {ducks.length} Waterproof Tags</span>
            </button>
          </div>
        </div>

        {/* Printable Waterproof Tag Grid (All 30 Ducks with Page-Break Protection) */}
        <div className="printable-tag-sheet">
          {ducks.map(duck => {
            const qrTargetUrl = `${baseUrl}/?id=${duck.duckId}&sig=${duck.signatureHash}`;
            const qrImgSrc =
              qrDataUrls[duck.duckId] ||
              `https://api.qrserver.com/v1/create-qr-code/?size=200x200&ecc=H&data=${encodeURIComponent(
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
                    src={qrImgSrc}
                    alt={`QR code for ${duck.duckId}`}
                    className="tag-qr-img"
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
