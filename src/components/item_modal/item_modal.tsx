'use client';

import { useEffect, type CSSProperties } from 'react';

export type ItemModalMode = 'home' | 'activity';

export interface ItemModalData {
  title: string;
  category: string;
  status: 'possible-match' | 'open' | 'claim-under-review' | 'reported';
  statusLabel: string;
  reportedDate: string;
  reportedBy?: string;
  location: string;
  itemId: string;
  description: string;
  imageUrl?: string;
  primaryActionLabel?: string;
  secondaryActionLabel?: string;
  matchSummary?: string;
  itemType?: string;
}

export interface ItemModalProps {
  isOpen?: boolean;
  item?: ItemModalData;
  mode?: ItemModalMode;
  onClose?: () => void;
}

const defaultItem: ItemModalData = {
  title: 'AirPods Pro Case',
  category: 'Lost item',
  status: 'possible-match',
  statusLabel: 'Possible Match',
  reportedDate: 'Reported Sep 5, 2026',
  reportedBy: 'You',
  location: 'LR-8821',
  itemId: 'LR-8821',
  description:
    'A black protective AirPods Pro case with a faint silver hinge and a small keychain clip. The case was found near the student center and appears to match the reported description from a recent lost item report.',
  imageUrl:
    'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?auto=format&fit=crop&w=1200&q=80',
  primaryActionLabel: 'Review Item',
  secondaryActionLabel: 'Not a match',
  matchSummary: 'A suggested match does not confirm ownership. Review the item and submit a claim if it looks right.',
  itemType: 'Accessory',
};

const styles: Record<string, CSSProperties> = {
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(15, 23, 42, 0.38)',
    backdropFilter: 'blur(2px)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '24px',
    zIndex: 999,
  },
  modal: {
    position: 'relative',
    width: 'min(100%, 980px)',
    borderRadius: '20px',
    background: '#ffffff',
    border: '1px solid #d4dee9',
    boxShadow: '0 18px 60px rgba(15, 23, 42, 0.18)',
    padding: '30px 28px 22px',
    color: '#1b2a3a',
    fontFamily: 'Arial, Helvetica, sans-serif',
  },
  topBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '18px',
  },
  title: {
    margin: 0,
    fontSize: '2.05rem',
    fontWeight: 800,
    letterSpacing: '-0.06em',
    color: '#132238',
  },
  closeButton: {
    width: '42px',
    height: '42px',
    borderRadius: '50%',
    border: '1px solid #d6dfeb',
    background: '#f6f8fb',
    color: '#1a2b3f',
    fontSize: '1.5rem',
    lineHeight: 1,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    display: 'grid',
    gridTemplateColumns: 'minmax(260px, 420px) minmax(0, 1fr)',
    gap: '26px',
    alignItems: 'stretch',
  },
  imageCard: {
    position: 'relative',
    minHeight: '360px',
    borderRadius: '18px',
    overflow: 'hidden',
    background: '#edf4fb',
    border: '1px solid #d7e2ee',
    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.75)',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
  },
  imageOverlay: {
    position: 'absolute',
    inset: 'auto 0 0 0',
    height: '120px',
    background: 'linear-gradient(180deg, rgba(10,21,36,0), rgba(10,21,36,0.34))',
  },
  detailCard: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    gap: '18px',
    padding: '8px 0',
  },
  badgeRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '12px',
    flexWrap: 'wrap',
  },
  categoryText: {
    fontSize: '0.76rem',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    color: '#4d647a',
  },
  statusPill: {
    display: 'inline-flex',
    alignItems: 'center',
    borderRadius: '999px',
    padding: '7px 12px',
    fontSize: '0.8rem',
    fontWeight: 700,
    background: '#edf5ff',
    color: '#1557af',
    border: '1px solid #cfe1fb',
  },
  itemName: {
    margin: 0,
    fontSize: '2.2rem',
    lineHeight: 1.1,
    letterSpacing: '-0.06em',
    color: '#16263d',
    fontWeight: 800,
  },
  metaLine: {
    display: 'flex',
    gap: '14px',
    flexWrap: 'wrap',
    fontSize: '0.94rem',
    color: '#55677a',
    lineHeight: 1.5,
  },
  metaItem: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
  },
  summaryBox: {
    background: '#f5f8fc',
    border: '1px solid #dfeaf4',
    borderRadius: '14px',
    padding: '14px 16px',
    color: '#2f4259',
    fontSize: '0.96rem',
    lineHeight: 1.6,
  },
  infoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, minmax(140px, 1fr))',
    gap: '12px 18px',
    marginTop: '4px',
  },
  infoBox: {
    background: '#f9fbfd',
    border: '1px solid #dde8f3',
    borderRadius: '12px',
    padding: '12px 14px',
  },
  infoLabel: {
    margin: 0,
    fontSize: '0.7rem',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    color: '#62748a',
    fontWeight: 700,
  },
  infoValue: {
    margin: '6px 0 0',
    fontSize: '0.96rem',
    fontWeight: 700,
    color: '#17283d',
  },
  description: {
    margin: 0,
    color: '#40546d',
    fontSize: '1rem',
    lineHeight: 1.7,
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    marginTop: '12px',
    flexWrap: 'wrap',
  },
  secondaryButton: {
    background: '#ffffff',
    color: '#1f2c3d',
    border: '1px solid #d7dfeb',
    borderRadius: '12px',
    padding: '12px 18px',
    fontWeight: 700,
    fontSize: '0.96rem',
    cursor: 'pointer',
    minWidth: '150px',
  },
  primaryButton: {
    background: '#2d7ff9',
    color: '#ffffff',
    border: '1px solid #2d7ff9',
    borderRadius: '12px',
    padding: '12px 18px',
    fontWeight: 700,
    fontSize: '0.96rem',
    cursor: 'pointer',
    minWidth: '160px',
    boxShadow: '0 10px 25px rgba(45, 127, 249, 0.18)',
  },
  warningButton: {
    background: '#fff7e7',
    color: '#9a6a08',
    border: '1px solid #f1d59a',
    borderRadius: '12px',
    padding: '12px 18px',
    fontWeight: 700,
    fontSize: '0.96rem',
    cursor: 'pointer',
    minWidth: '170px',
  },
};

export default function ItemModal({
  isOpen = true,
  item = defaultItem,
  mode = 'activity',
  onClose = () => undefined,
}: ItemModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  const primaryLabel =
    item.primaryActionLabel ??
    (mode === 'home' ? 'Review Item' : item.status === 'possible-match' ? 'Possible Match' : 'Open');

  const secondaryLabel =
    item.secondaryActionLabel ?? (mode === 'home' ? 'Not a match' : 'Keep exploring');

  const showWarning = item.status === 'claim-under-review';

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="item-modal-title"
        style={styles.modal}
        onClick={(event) => event.stopPropagation()}
      >
        <div style={styles.topBar}>
          <h2 style={styles.title}>Item Details</h2>
          <button
            type="button"
            aria-label="Close item details"
            style={styles.closeButton}
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <div style={styles.content}>
          <div style={styles.imageCard}>
            {item.imageUrl ? (
              <img src={item.imageUrl} alt={item.title} style={styles.image} />
            ) : (
              <div
                style={{
                  ...styles.image,
                  background: 'linear-gradient(135deg, #dfeaf8, #f5f9ff)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#4a6682',
                  fontWeight: 700,
                  fontSize: '1.1rem',
                }}
              >
                No image available
              </div>
            )}
            <div style={styles.imageOverlay} />
          </div>

          <div style={styles.detailCard}>
            <div style={styles.badgeRow}>
              <span style={styles.categoryText}>{item.category}</span>
              <span style={styles.statusPill}>{item.statusLabel}</span>
            </div>

            <div>
              <h3 id="item-modal-title" style={styles.itemName}>
                {item.title}
              </h3>

              <div style={styles.metaLine}>
                <span style={styles.metaItem}>{item.reportedDate}</span>
                <span style={styles.metaItem}>•</span>
                <span style={styles.metaItem}>{item.location}</span>
              </div>
            </div>

            {item.matchSummary ? <div style={styles.summaryBox}>{item.matchSummary}</div> : null}

            <p style={styles.description}>{item.description}</p>

            <div style={styles.infoGrid}>
              <div style={styles.infoBox}>
                <p style={styles.infoLabel}>Item type</p>
                <p style={styles.infoValue}>{item.itemType ?? 'Accessory'}</p>
              </div>
              <div style={styles.infoBox}>
                <p style={styles.infoLabel}>Report ID</p>
                <p style={styles.infoValue}>{item.itemId}</p>
              </div>
              <div style={styles.infoBox}>
                <p style={styles.infoLabel}>Reported by</p>
                <p style={styles.infoValue}>{item.reportedBy ?? 'Anonymous'}</p>
              </div>
              <div style={styles.infoBox}>
                <p style={styles.infoLabel}>Location</p>
                <p style={styles.infoValue}>{item.location}</p>
              </div>
            </div>

            <div style={styles.actions}>
              <button type="button" style={styles.secondaryButton} onClick={onClose}>
                {secondaryLabel}
              </button>
              <button
                type="button"
                style={showWarning ? styles.warningButton : styles.primaryButton}
                onClick={onClose}
              >
                {primaryLabel}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ItemModalPreview() {
  const sampleItem: ItemModalData = {
    title: 'Navy Umbrella',
    category: 'Found item',
    status: 'open',
    statusLabel: 'Open',
    reportedDate: 'Reported Sep 12, 2026',
    reportedBy: 'Student Services',
    location: 'FR-4421',
    itemId: 'FR-4421',
    description:
      'A navy umbrella with a silver handle and a small tear near the lower edge. It was left near the engineering courtyard and is currently pending owner review.',
    imageUrl:
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1200&q=80',
    primaryActionLabel: 'Open',
    secondaryActionLabel: 'Keep browsing',
    itemType: 'Umbrella',
  };

  return (
    <div style={{ padding: '40px', background: '#edf2f7', minHeight: '100vh' }}>
      <button
        type="button"
        onClick={() => {
          const preview = document.getElementById('item-modal-preview-root');
          if (preview) {
            preview.style.display = preview.style.display === 'none' ? 'block' : 'none';
          }
        }}
        style={{
          background: '#2d7ff9',
          color: '#fff',
          border: 'none',
          borderRadius: '12px',
          padding: '10px 18px',
          fontWeight: 700,
          cursor: 'pointer',
          marginBottom: '20px',
        }}
      >
        Toggle preview
      </button>

      <div id="item-modal-preview-root">
        <ItemModal isOpen={true} item={sampleItem} mode="home" onClose={() => undefined} />
      </div>
    </div>
  );
}
