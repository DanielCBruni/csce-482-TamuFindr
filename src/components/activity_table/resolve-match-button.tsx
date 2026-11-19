'use client';

import { useState, useTransition } from 'react';
import type { FormEvent } from 'react';
import Button from '@/components/ui/button';
import type { ResolveAdminMatchResult } from '@/actions/resolve-admin-match';

export type ResolutionCandidate = {
  id: string;
  title: string;
  type: 'LOST' | 'FOUND';
  category: string;
  location: string;
  date: string;
  userId: string;
  userName: string;
  userEmail: string;
};

type ResolveMatchButtonProps = {
  itemId: string;
  itemTitle: string;
  itemType: 'LOST' | 'FOUND';
  candidates: ResolutionCandidate[];
  action: (formData: FormData) => Promise<ResolveAdminMatchResult>;
};

export default function ResolveMatchButton({
  itemId,
  itemTitle,
  itemType,
  candidates,
  action,
}: ResolveMatchButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedUserId, setSelectedUserId] = useState('');
  const [selectedId, setSelectedId] = useState('');
  const [error, setError] = useState<string>();
  const [isPending, startTransition] = useTransition();
  const oppositeType = itemType === 'LOST' ? 'FOUND' : 'LOST';
  const eligibleCandidates = candidates.filter(
    (candidate) => candidate.type === oppositeType && candidate.id !== itemId,
  );
  const candidateUsers = Array.from(
    new Map(
      eligibleCandidates.map((candidate) => [
        candidate.userId,
        { id: candidate.userId, name: candidate.userName, email: candidate.userEmail },
      ]),
    ).values(),
  ).sort((left, right) => left.name.localeCompare(right.name));
  const normalizedSearch = search.trim().toLowerCase();
  const visibleCandidates = eligibleCandidates.filter(
    (candidate) =>
      (selectedUserId === '' || candidate.userId === selectedUserId) &&
      [
        candidate.title,
        candidate.id,
        candidate.category,
        candidate.location,
        candidate.userName,
        candidate.userEmail,
      ]
        .join(' ')
        .toLowerCase()
        .includes(normalizedSearch),
  );

  function closeModal() {
    if (isPending) return;
    setIsOpen(false);
    setError(undefined);
  }

  function submitSelection(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(undefined);
    const formData = new FormData(event.currentTarget);
    startTransition(async () => {
      try {
        const result = await action(formData);
        if (result.success) {
          setIsOpen(false);
          setSelectedId('');
          setSearch('');
        } else {
          setError(result.error ?? 'Unable to resolve these tickets.');
        }
      } catch {
        setError('Unable to verify access or resolve these tickets. Please try again.');
      }
    });
  }

  return (
    <>
      <Button
        type="button"
        variant="secondary"
        onClick={() => {
          setError(undefined);
          setSelectedId('');
          setSearch('');
          setSelectedUserId('');
          setIsOpen(true);
        }}
      >
        Resolve match
      </Button>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeModal();
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby={`resolve-match-title-${itemId}`}
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-[var(--surface-raised)] p-6 text-left shadow-2xl"
            onKeyDown={(event) => {
              if (event.key === 'Escape') closeModal();
            }}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2
                  id={`resolve-match-title-${itemId}`}
                  className="text-2xl font-bold text-primary-dark"
                >
                  Match and resolve tickets
                </h2>
                <p className="mt-2 text-sm text-[var(--text-muted)]">
                  Select the ticket that matches <strong>{itemTitle}</strong>. Both tickets will be
                  marked resolved and retained for 30 days.
                </p>
              </div>
              <Button
                type="button"
                variant="secondary"
                onClick={closeModal}
                disabled={isPending}
                aria-label="Close dialog"
              >
                Close
              </Button>
            </div>

            {eligibleCandidates.length === 0 ? (
              <p className="mt-6 rounded-xl bg-[var(--surface-subtle)] p-4 text-sm">
                There are no active {oppositeType.toLowerCase()} tickets available to match.
              </p>
            ) : (
              <form className="mt-6 space-y-4" onSubmit={submitSelection}>
                <input type="hidden" name="itemId" value={itemId} />
                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="block text-sm font-semibold text-primary-dark">
                    Filter by submitter
                    <select
                      value={selectedUserId}
                      onChange={(event) => {
                        setSelectedUserId(event.target.value);
                        setSelectedId('');
                      }}
                      className="mt-1 w-full rounded-lg border border-primary-muted/30 bg-white px-3 py-2 font-normal"
                    >
                      <option value="">All users</option>
                      {candidateUsers.map((user) => (
                        <option key={user.id} value={user.id}>
                          {user.name} ({user.email})
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="block text-sm font-semibold text-primary-dark">
                    Search tickets or users
                    <input
                      type="search"
                      value={search}
                      onChange={(event) => {
                        setSearch(event.target.value);
                        setSelectedId('');
                      }}
                      placeholder="Title, category, location, name, or email"
                      className="mt-1 w-full rounded-lg border border-primary-muted/30 bg-white px-3 py-2 font-normal"
                    />
                  </label>
                </div>

                <div className="max-h-72 space-y-2 overflow-y-auto rounded-xl border border-primary-muted/20 p-2">
                  {visibleCandidates.length === 0 ? (
                    <p className="p-3 text-sm text-[var(--text-muted)]">
                      No tickets match that search.
                    </p>
                  ) : (
                    visibleCandidates.map((candidate) => (
                      <label
                        key={candidate.id}
                        className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 ${
                          selectedId === candidate.id
                            ? 'border-primary bg-[var(--surface-subtle)]'
                            : 'border-transparent hover:bg-[var(--surface-subtle)]'
                        }`}
                      >
                        <input
                          type="radio"
                          name="matchItemId"
                          value={candidate.id}
                          checked={selectedId === candidate.id}
                          onChange={() => setSelectedId(candidate.id)}
                          required
                          className="mt-1"
                        />
                        <span className="min-w-0">
                          <span className="block font-semibold text-primary-dark">
                            {candidate.title}
                          </span>
                          <span className="mt-1 block text-xs text-[var(--text-muted)]">
                            Ticket {candidate.id} · {candidate.category} · {candidate.location}
                          </span>
                          <span className="block text-xs text-[var(--text-muted)]">
                            Submitted by {candidate.userName} ({candidate.userEmail})
                          </span>
                          <span className="block text-xs text-[var(--text-muted)]">
                            Reported {candidate.date}
                          </span>
                        </span>
                      </label>
                    ))
                  )}
                </div>

                {error && (
                  <p role="alert" className="text-sm font-semibold text-red-700">
                    {error}
                  </p>
                )}
                <div className="flex justify-end gap-3">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={closeModal}
                    disabled={isPending}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={!selectedId || isPending}>
                    <span aria-hidden="true">✓</span>
                    {isPending ? ' Resolving…' : ' Confirm & resolve both'}
                  </Button>
                </div>
              </form>
            )}
          </section>
        </div>
      )}
    </>
  );
}
