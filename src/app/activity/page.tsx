'use client';

import { useState } from 'react';
import ItemModal, { type ItemModalData } from '@/components/item_modal/item_modal';
import mockData from '../../../mockData.json';

const pageStyles = {
  shell: {
    minHeight: '100vh',
    background: '#f5f6f8',
    color: '#16253b',
    fontFamily: 'Arial, Helvetica, sans-serif',
  },
  content: {
    maxWidth: '1180px',
    margin: '0 auto',
    padding: '28px 28px 40px',
  },
  pageTitle: {
    margin: '0 0 26px',
    fontSize: '4rem',
    lineHeight: 1,
    fontWeight: 800,
    letterSpacing: '-0.07em',
    fontFamily: 'Georgia, serif',
    color: '#1f2f46',
  },
  alertCard: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '18px',
    background: '#edf7ff',
    border: '1px solid #bfd9f2',
    borderRadius: '16px',
    padding: '18px 22px',
    marginBottom: '28px',
    boxSizing: 'border-box' as const,
  },
  alertMain: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    flex: 1,
  },
  alertIcon: {
    width: '28px',
    height: '28px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    background: '#dfeeff',
    color: '#2f67c7',
    fontSize: '1.1rem',
  },
  alertText: {
    margin: 0,
    color: '#1f2f46',
    fontSize: '1.12rem',
    lineHeight: 1.5,
    fontWeight: 700,
  },
  alertSubText: {
    margin: '4px 0 0',
    color: '#5e6f85',
    fontSize: '0.95rem',
    lineHeight: 1.5,
    fontWeight: 500,
  },
  reviewButton: {
    background: '#2d7ff9',
    color: '#ffffff',
    border: '1px solid #2d7ff9',
    borderRadius: '12px',
    padding: '11px 18px',
    fontSize: '1rem',
    fontWeight: 700,
    cursor: 'pointer',
    minWidth: '140px',
  },
  section: {
    marginBottom: '26px',
  },
  sectionLabel: {
    margin: '0 0 12px',
    color: '#273548',
    fontSize: '0.9rem',
    lineHeight: 1.2,
    letterSpacing: '0.17em',
    textTransform: 'uppercase',
    fontWeight: 800,
  },
  rowList: {
    border: '1px solid #dfe7f0',
    borderRadius: '16px',
    background: '#f8fafc',
    overflow: 'hidden',
  },
  rowButton: {
    width: '100%',
    border: 0,
    borderBottom: '1px solid #dfe7f0',
    background: 'transparent',
    padding: '20px 18px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '16px',
    cursor: 'pointer',
    textAlign: 'left' as const,
    color: '#18283f',
  },
  rowTitle: {
    margin: 0,
    fontSize: '1.1rem',
    lineHeight: 1.4,
    fontWeight: 700,
    color: '#1f2f46',
  },
  rowMeta: {
    margin: '8px 0 0',
    fontSize: '0.98rem',
    color: '#697a8f',
    lineHeight: 1.5,
  },
  statusPill: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '130px',
    padding: '9px 14px',
    borderRadius: '999px',
    border: '1px solid #dfe7f0',
    fontSize: '0.94rem',
    fontWeight: 700,
    background: '#f4f7fb',
    color: '#2f425e',
    whiteSpace: 'nowrap' as const,
  },
  providedStyle: {
    background: '#edf7ff',
    borderColor: '#bfd9f2',
    color: '#2b598d',
  },
  reviewStyle: {
    background: '#fff5da',
    borderColor: '#efd28d',
    color: '#9d6b13',
  },
  accessPage: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '32px',
    background: '#f5f6f8',
    fontFamily: 'Arial, Helvetica, sans-serif',
  },
  accessCard: {
    maxWidth: '520px',
    width: '100%',
    background: '#ffffff',
    border: '1px solid #dfe7f0',
    borderRadius: '20px',
    boxShadow: '0 18px 50px rgba(15, 23, 42, 0.08)',
    padding: '32px',
  },
  accessTitle: {
    margin: '0 0 12px',
    fontSize: '2rem',
    color: '#1f2f46',
    fontWeight: 800,
  },
  accessText: {
    margin: 0,
    color: '#55667a',
    lineHeight: 1.7,
    fontSize: '1rem',
  },
};

const statusLabels: Record<ItemModalData['status'], string> = {
  open: 'Open',
  resolved: 'Resolved',
  'possible-match': 'Possible Match',
  'claim-under-review': 'Claim Under Review',
  reported: 'Reported',
};

const activityItems: ItemModalData[] = mockData.item.map((item) => {
  const status = Object.prototype.hasOwnProperty.call(statusLabels, item.status)
    ? (item.status as ItemModalData['status'])
    : 'reported';

  return {
    title: item.item,
    category: item.type === 'LOST' ? 'Lost item' : 'Found item',
    status,
    statusLabel: statusLabels[status],
    reportedDate: `Reported ${item.date}`,
    reportedBy: item.user,
    location: item.location,
    itemId: item.id,
    description: item.description,
    itemType: item.itemType,
  };
});

const alertItem = activityItems.find((item) => item.status === 'possible-match');

export default function ActivityPage() {
  const [selectedItem, setSelectedItem] = useState<ItemModalData | null>(null);

  const lostItems = activityItems.filter((item) => item.category === 'Lost item');
  const foundItems = activityItems.filter((item) => item.category === 'Found item');
  const claims = activityItems.filter((item) => item.category === 'My claim');

  return (
    <main style={pageStyles.shell}>
      <div style={pageStyles.content}>
        <h1 style={pageStyles.pageTitle}>My Activity</h1>

        {alertItem && (
          <aside style={pageStyles.alertCard}>
            <div style={pageStyles.alertMain}>
              <div style={pageStyles.alertIcon}>◔</div>
              <div>
                <p style={pageStyles.alertText}>
                  Possible match found for &quot;{alertItem.title}&quot;
                </p>
                <p style={pageStyles.alertSubText}>
                  A suggested match does not confirm ownership. Review the item and submit a claim
                  if it looks right.
                </p>
              </div>
            </div>
            <button
              type="button"
              style={pageStyles.reviewButton}
              onClick={() => setSelectedItem(alertItem)}
            >
              Review Item
            </button>
          </aside>
        )}

        <section style={pageStyles.section}>
          <h2 style={pageStyles.sectionLabel}>Lost Reports</h2>
          <div style={pageStyles.rowList}>
            {lostItems.map((item) => (
              <button
                key={item.itemId}
                type="button"
                style={pageStyles.rowButton}
                onClick={() => setSelectedItem(item)}
              >
                <div>
                  <h3 style={pageStyles.rowTitle}>{item.title}</h3>
                  <p style={pageStyles.rowMeta}>
                    {item.reportedDate} · {item.itemId}
                  </p>
                </div>
                <span
                  style={{
                    ...pageStyles.statusPill,
                    ...(item.status === 'possible-match'
                      ? pageStyles.providedStyle
                      : pageStyles.statusPill),
                  }}
                >
                  {item.statusLabel}
                </span>
              </button>
            ))}
          </div>
        </section>

        <section style={pageStyles.section}>
          <h2 style={pageStyles.sectionLabel}>Found Reports</h2>
          <div style={pageStyles.rowList}>
            {foundItems.map((item) => (
              <button
                key={item.itemId}
                type="button"
                style={pageStyles.rowButton}
                onClick={() => setSelectedItem(item)}
              >
                <div>
                  <h3 style={pageStyles.rowTitle}>{item.title}</h3>
                  <p style={pageStyles.rowMeta}>
                    {item.reportedDate} · {item.itemId}
                  </p>
                </div>
                <span
                  style={{
                    ...pageStyles.statusPill,
                    ...(item.status === 'open' ? pageStyles.statusPill : pageStyles.statusPill),
                  }}
                >
                  {item.statusLabel}
                </span>
              </button>
            ))}
          </div>
        </section>

        <section style={pageStyles.section}>
          <h2 style={pageStyles.sectionLabel}>My Claims</h2>
          <div style={pageStyles.rowList}>
            {claims.map((item) => (
              <button
                key={item.itemId}
                type="button"
                style={pageStyles.rowButton}
                onClick={() => setSelectedItem(item)}
              >
                <div>
                  <h3 style={pageStyles.rowTitle}>{item.title}</h3>
                  <p style={pageStyles.rowMeta}>
                    {item.reportedDate} · {item.itemId}
                  </p>
                </div>
                <span style={{ ...pageStyles.statusPill, ...pageStyles.reviewStyle }}>
                  {item.statusLabel}
                </span>
              </button>
            ))}
          </div>
        </section>
      </div>

      {selectedItem && (
        <ItemModal
          isOpen={true}
          item={selectedItem}
          mode="activity"
          onClose={() => setSelectedItem(null)}
          onPrimaryAction={() => setSelectedItem(null)}
          onSecondaryAction={() => setSelectedItem(null)}
        />
      )}
    </main>
  );
}
