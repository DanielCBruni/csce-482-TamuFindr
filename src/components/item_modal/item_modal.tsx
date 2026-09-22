'use client';

import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import styles from './item_modal.module.css';

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
  isOpen: boolean;
  item: ItemModalData;
  mode?: ItemModalMode;
  onClose: () => void;
  onPrimaryAction?: (item: ItemModalData) => void;
  onSecondaryAction?: (item: ItemModalData) => void;
}

const statusStyles = {
  'possible-match': styles.match,
  open: styles.open,
  'claim-under-review': styles.review,
  reported: styles.open,
};

export function ItemStatus({ item }: { item: ItemModalData }) {
  return (
    <span className={`${styles.status} ${statusStyles[item.status]}`}>{item.statusLabel}</span>
  );
}

export default function ItemModal({
  isOpen,
  item,
  mode = 'home',
  onClose,
  onPrimaryAction,
  onSecondaryAction,
}: ItemModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!isOpen || !dialog) return;
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    dialog.showModal();
    document.body.style.overflow = 'hidden';
    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
      if (previousFocus instanceof HTMLElement) previousFocus.focus();
    };
  }, [isOpen]);

  return (
    <dialog
      ref={dialogRef}
      className={styles.modal}
      aria-labelledby={titleId}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          const bounds = event.currentTarget.getBoundingClientRect();
          if (
            event.clientX < bounds.left ||
            event.clientX > bounds.right ||
            event.clientY < bounds.top ||
            event.clientY > bounds.bottom
          )
            onClose();
        }
      }}
    >
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>{mode === 'activity' ? 'My activity' : 'Browse items'}</p>
          <h2>Item Details</h2>
        </div>
        <button
          autoFocus
          type="button"
          className={styles.close}
          aria-label="Close item details"
          onClick={onClose}
        >
          ×
        </button>
      </header>
      <div className={styles.body}>
        <div className={styles.imageCard}>
          <ItemPhoto key={item.imageUrl} item={item} />
        </div>
        <section className={styles.details}>
          <div className={styles.badges}>
            <span className={styles.eyebrow}>{item.category}</span>
            <ItemStatus item={item} />
          </div>
          <div>
            <h3 id={titleId}>{item.title}</h3>
            <p className={styles.meta}>
              {item.reportedDate} · {item.itemId}
            </p>
          </div>
          <div>
            <h4>Description</h4>
            <p className={styles.description}>{item.description}</p>
          </div>
          <dl className={styles.info}>
            <div>
              <dt>Location</dt>
              <dd>{item.location}</dd>
            </div>
            <div>
              <dt>Item type</dt>
              <dd>{item.itemType ?? 'Not specified'}</dd>
            </div>
            <div>
              <dt>Report ID</dt>
              <dd>{item.itemId}</dd>
            </div>
            <div>
              <dt>Reported by</dt>
              <dd>{item.reportedBy ?? 'Not provided'}</dd>
            </div>
          </dl>
        </section>
        {(item.matchSummary || item.status === 'possible-match') && (
          <aside className={styles.notice}>
            <strong>Possible match found</strong>
            <p>
              {item.matchSummary ??
                'A suggested match does not confirm ownership. Review the item and submit a claim if it looks right.'}
            </p>
          </aside>
        )}
        {item.status === 'claim-under-review' && (
          <aside className={`${styles.notice} ${styles.reviewNotice}`}>
            <strong>Claim under review</strong>
            <p>Your claim is awaiting review. Ownership has not yet been confirmed.</p>
          </aside>
        )}
      </div>
      <footer className={styles.actions}>
        <button type="button" className={styles.secondary} onClick={onClose}>
          {mode === 'home' ? 'Keep browsing' : 'Back to activity'}
        </button>
        {onSecondaryAction && (
          <button
            type="button"
            className={styles.secondary}
            onClick={() => onSecondaryAction(item)}
          >
            {item.secondaryActionLabel ?? 'Not a match'}
          </button>
        )}
        {onPrimaryAction && (
          <button type="button" className={styles.primary} onClick={() => onPrimaryAction(item)}>
            {item.primaryActionLabel ??
              (item.status === 'possible-match' ? 'Review Item' : 'View report')}
          </button>
        )}
      </footer>
    </dialog>
  );
}

function ItemPhoto({ item }: { item: ItemModalData }) {
  const [failed, setFailed] = useState(false);
  return item.imageUrl && !failed ? (
    // Report photos may come from external storage providers.
    // eslint-disable-next-line @next/next/no-img-element
    <img src={item.imageUrl} alt={item.title} onError={() => setFailed(true)} />
  ) : (
    <div className={styles.placeholder}>
      <span aria-hidden="true">▧</span>
      <p>No photo available</p>
    </div>
  );
}

/** Use inside a home card or an activity row; owns the open/close state. */
export function ItemModalTrigger({
  item,
  mode = 'home',
  children,
  className,
  onPrimaryAction,
  onSecondaryAction,
}: Omit<ItemModalProps, 'isOpen' | 'onClose'> & { children?: ReactNode; className?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        className={className ?? styles.secondary}
        aria-haspopup="dialog"
        onClick={() => setIsOpen(true)}
      >
        {children ?? 'View details'}
      </button>
      <ItemModal
        isOpen={isOpen}
        item={item}
        mode={mode}
        onClose={() => setIsOpen(false)}
        onPrimaryAction={onPrimaryAction}
        onSecondaryAction={onSecondaryAction}
      />
    </>
  );
}
