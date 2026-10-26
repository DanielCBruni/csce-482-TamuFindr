'use client';

import { useEffect, useId, useRef } from 'react';
import { ItemModalTrigger, type ItemModalData } from '../item_modal/item_modal';

export interface PotentialMatchReport {
  id: string;
  title: string;
  reportedDate: string;
  matches: { id: string; score: number; incidentDate: string; item: ItemModalData }[];
}

export default function PotentialMatchesModal({
  report,
  onClose,
}: {
  report: PotentialMatchReport;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const previousFocus = document.activeElement;
    const overflow = document.body.style.overflow;
    dialog.showModal();
    document.body.style.overflow = 'hidden';
    return () => {
      dialog.close();
      document.body.style.overflow = overflow;
      if (previousFocus instanceof HTMLElement) previousFocus.focus();
    };
  }, []);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      className="m-auto max-h-[90dvh] w-[calc(100%-2rem)] max-w-3xl overflow-y-auto rounded-2xl border border-[var(--surface-border)] bg-[var(--surface-raised)] p-6 text-[var(--text-primary)] shadow-xl backdrop:bg-black/50"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target !== event.currentTarget) return;
        const rect = event.currentTarget.getBoundingClientRect();
        if (
          event.clientX < rect.left ||
          event.clientX > rect.right ||
          event.clientY < rect.top ||
          event.clientY > rect.bottom
        )
          onClose();
      }}
    >
      <header className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h2 id={titleId} className="text-2xl font-bold">
            Matches for {report.title}
          </h2>
          <p className="mt-2 text-[var(--text-muted)]">
            Top {report.matches.length} suggestions, ranked by similarity. Scores do not confirm
            ownership.
          </p>
        </div>
        <button
          autoFocus
          type="button"
          aria-label="Close potential matches"
          className="rounded border px-3 py-2 focus-visible:outline-2"
          onClick={onClose}
        >
          ×
        </button>
      </header>
      {report.matches.length === 0 ? (
        <p>No potential matches yet. Check back after new reports are compared.</p>
      ) : (
        <ol className="space-y-4">
          {report.matches.map((match, index) => (
            <li key={match.id} className="rounded-xl border border-[var(--surface-border)] p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <h3 className="text-lg font-semibold">
                  {index + 1}. {match.item.title}
                </h3>
                <span className="rounded-full bg-[var(--surface-subtle)] px-3 py-1 font-semibold">
                  {(match.score * 100).toFixed(1)}/100 similarity
                </span>
              </div>
              <p className="mt-2 text-[var(--text-muted)]">
                {match.item.itemType} · {match.item.location}
              </p>
              <p className="mt-1 text-sm text-[var(--text-muted)]">Found {match.incidentDate}</p>
              <div className="mt-4">
                <ItemModalTrigger item={match.item}>View item details</ItemModalTrigger>
              </div>
            </li>
          ))}
        </ol>
      )}
    </dialog>
  );
}
