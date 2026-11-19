'use client';

import { useEffect, useRef, useState } from 'react';
import {
  Table,
  TableCaption,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import CancelTicketButton from './cancel_ticket_button';
import Button from '@/components/ui/button';
import { Link2 } from 'lucide-react';
import ResolveMatchButton, { type ResolutionCandidate } from './resolve-match-button';
import type { ResolveAdminMatchResult } from '@/actions/resolve-admin-match';

export interface ActivityItem {
  id: string;
  type: 'LOST' | 'FOUND';
  status: string;
  date: string | Date;
  location: string;
  item: string;
  itemType: string;
  softDeletedAt?: Date | null;
  details?: ActivityItemDetails;
  matchedTickets?: ActivityItemDetails[];
}

export interface ActivityItemDetails {
  id: string;
  title: string;
  type: 'LOST' | 'FOUND';
  status: string;
  submittedAt: string;
  incidentDate: string;
  category: string;
  description: string | null;
  primaryColor: string;
  secondaryColor: string | null;
  brand: string | null;
  condition: string;
  location: string;
  storageLocation: string;
  resolutionNotes: string | null;
  resolvedAt: string | null;
  softDeletedAt: string | null;
  submittedBy: { name: string; email: string };
  servicedBy: { name: string; email: string } | null;
  images: { id: string; imageKey: string; isPrimary: boolean; uploadedAt: string }[];
}

function formatDate(date: string | Date) {
  let parsedDate: Date;
  if (date instanceof Date) {
    parsedDate = date;
  } else if (/^\d{1,2}-\d{1,2}-\d{4}$/.test(date)) {
    const [month, day, year] = date.split('-').map(Number);
    parsedDate = new Date(year, month - 1, day);
  } else {
    parsedDate = new Date(date);
  }

  return parsedDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'America/Chicago',
  });
}

function formatStatus(status: string) {
  const normalizedStatus = status.toLowerCase();
  return normalizedStatus.charAt(0).toUpperCase() + normalizedStatus.slice(1);
}

export interface ActivityTableProps {
  items: ActivityItem[];
  emptyMessage?: string;
  resolveAction?: (formData: FormData) => Promise<void>;
  resolveMatchAction?: (formData: FormData) => Promise<ResolveAdminMatchResult>;
  resolutionCandidates?: ResolutionCandidate[];
  reopenAction?: (formData: FormData) => Promise<void>;
  cancelAction?: (formData: FormData) => Promise<void>;
  showRetention?: boolean;
}

export default function ActivityTable({
  items,
  emptyMessage = 'No tickets found',
  resolveAction,
  resolveMatchAction,
  resolutionCandidates = [],
  reopenAction,
  cancelAction,
  showRetention = false,
}: ActivityTableProps) {
  const [selectedDetails, setSelectedDetails] = useState<ActivityItemDetails | null>(null);
  const detailsDialogRef = useRef<HTMLDialogElement>(null);
  const hasActions = Boolean(resolveAction || resolveMatchAction || reopenAction || cancelAction);

  useEffect(() => {
    const dialog = detailsDialogRef.current;
    if (!selectedDetails || !dialog) return;
    const previousOverflow = document.body.style.overflow;
    dialog.showModal();
    document.body.style.overflow = 'hidden';
    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
    };
  }, [selectedDetails]);

  return (
    <>
      <Table>
        <TableCaption>Submitted lost and found items</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Item</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Submitted</TableHead>
            {showRetention && <TableHead>Permanently deletes</TableHead>}
            {hasActions && <TableHead>Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={6 + Number(showRetention) + Number(hasActions)}
                className="py-8 text-center text-[var(--text-muted)]"
              >
                {emptyMessage}
              </TableCell>
            </TableRow>
          ) : (
            items.map((item) => (
              <TableRow key={item.id} id={`ticket-${item.id}`}>
                <TableHead scope="row">
                  {item.details ? (
                    <button
                      type="button"
                      onClick={() => setSelectedDetails(item.details ?? null)}
                      className="text-left font-semibold text-primary underline decoration-primary/40 underline-offset-2 hover:decoration-primary focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                    >
                      {item.item}
                    </button>
                  ) : (
                    item.item
                  )}
                  <span className="mt-1 block text-xs font-normal text-[var(--text-muted)]">
                    Ticket {item.id}
                  </span>
                  {showRetention &&
                    item.matchedTickets?.map((match) => (
                      <button
                        key={match.id}
                        type="button"
                        onClick={() => setSelectedDetails(match)}
                        aria-label={`View matched ${match.type === 'LOST' ? 'lost' : 'found'} ticket: ${match.title}`}
                        title={`Matched ${match.type === 'LOST' ? 'lost' : 'found'} ticket`}
                        className="mt-2 inline-flex max-w-full items-center gap-1.5 text-xs font-medium text-primary underline decoration-primary/40 underline-offset-2 hover:decoration-primary focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                      >
                        <Link2 aria-hidden="true" size={14} className="shrink-0" />
                        <span className="truncate">{match.title}</span>
                      </button>
                    ))}
                </TableHead>
                <TableCell>{item.type === 'LOST' ? 'Lost' : 'Found'}</TableCell>
                <TableCell>
                  <span className="inline-flex rounded-full bg-[var(--surface-subtle)] px-3 py-1 text-xs font-semibold text-[var(--text-muted)]">
                    {formatStatus(item.status)}
                  </span>
                </TableCell>
                <TableCell>{item.itemType}</TableCell>
                <TableCell>{item.location}</TableCell>
                <TableCell className="whitespace-nowrap">{formatDate(item.date)}</TableCell>
                {showRetention && (
                  <TableCell className="whitespace-nowrap">
                    {item.softDeletedAt
                      ? formatDate(
                          new Date(item.softDeletedAt.getTime() + 30 * 24 * 60 * 60 * 1000),
                        )
                      : '—'}
                  </TableCell>
                )}
                {hasActions && (
                  <TableCell className="whitespace-nowrap">
                    {['OPEN', 'MATCHED'].includes(item.status) && (
                      <div className="flex flex-col items-start gap-2">
                        {resolveAction && (
                          <form action={resolveAction}>
                            <input type="hidden" name="itemId" value={item.id} />
                            <Button type="submit">Resolve ticket</Button>
                          </form>
                        )}
                        {resolveMatchAction && (
                          <ResolveMatchButton
                            itemId={item.id}
                            itemTitle={item.item}
                            itemType={item.type}
                            candidates={resolutionCandidates}
                            action={resolveMatchAction}
                          />
                        )}
                      </div>
                    )}
                    {reopenAction && item.status === 'RESOLVED' && (
                      <form action={reopenAction}>
                        <input type="hidden" name="itemId" value={item.id} />
                        {showRetention && <input type="hidden" name="view" value="deleted" />}
                        <Button type="submit">{showRetention ? 'Restore' : 'Reopen'}</Button>
                      </form>
                    )}
                    {cancelAction && ['OPEN', 'MATCHED'].includes(item.status) && (
                      <CancelTicketButton
                        itemId={item.id}
                        itemName={item.item}
                        action={cancelAction}
                      />
                    )}
                  </TableCell>
                )}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {selectedDetails && (
        <dialog
          ref={detailsDialogRef}
          aria-labelledby="admin-ticket-details-title"
          onClick={(event) => {
            if (event.target !== event.currentTarget) return;
            const bounds = event.currentTarget.getBoundingClientRect();
            if (
              event.clientX < bounds.left ||
              event.clientX > bounds.right ||
              event.clientY < bounds.top ||
              event.clientY > bounds.bottom
            ) {
              setSelectedDetails(null);
            }
          }}
          onCancel={(event) => {
            event.preventDefault();
            setSelectedDetails(null);
          }}
          className="m-auto max-h-[90vh] w-[calc(100%-2rem)] max-w-3xl overflow-y-auto rounded-2xl bg-[var(--surface-raised)] p-6 text-left shadow-2xl backdrop:bg-black/55"
        >
          <header className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-primary-muted">
                {selectedDetails.type === 'LOST' ? 'Lost ticket' : 'Found ticket'} ·{' '}
                {formatStatus(selectedDetails.status)}
              </p>
              <h2
                id="admin-ticket-details-title"
                className="mt-1 text-2xl font-bold text-primary-dark"
              >
                {selectedDetails.title}
              </h2>
              <p className="mt-1 text-sm text-[var(--text-muted)]">Ticket {selectedDetails.id}</p>
            </div>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setSelectedDetails(null)}
              aria-label="Close ticket details"
            >
              Close
            </Button>
          </header>

          <section className="mt-6">
            <h3 className="font-semibold text-primary-dark">Description</h3>
            <p className="mt-1 whitespace-pre-wrap text-sm text-[var(--text-primary)]">
              {selectedDetails.description || 'No description provided.'}
            </p>
          </section>

          <dl className="mt-6 grid gap-4 sm:grid-cols-2">
            {[
              ['Category', selectedDetails.category],
              ['Status', formatStatus(selectedDetails.status)],
              ['Submitted', formatDate(selectedDetails.submittedAt)],
              ['Incident date', formatDate(selectedDetails.incidentDate)],
              ['Location', selectedDetails.location],
              ['Storage location', selectedDetails.storageLocation],
              ['Primary color', selectedDetails.primaryColor],
              ['Secondary color', selectedDetails.secondaryColor],
              ['Brand', selectedDetails.brand],
              ['Condition', selectedDetails.condition],
              [
                'Submitted by',
                `${selectedDetails.submittedBy.name} (${selectedDetails.submittedBy.email})`,
              ],
              [
                'Serviced by',
                selectedDetails.servicedBy
                  ? `${selectedDetails.servicedBy.name} (${selectedDetails.servicedBy.email})`
                  : null,
              ],
              ['Resolved', selectedDetails.resolvedAt && formatDate(selectedDetails.resolvedAt)],
              [
                'Permanently deletes',
                selectedDetails.softDeletedAt &&
                  formatDate(
                    new Date(
                      new Date(selectedDetails.softDeletedAt).getTime() + 30 * 24 * 60 * 60 * 1000,
                    ),
                  ),
              ],
              ['Resolution notes', selectedDetails.resolutionNotes],
            ].map(([label, value]) => (
              <div key={label} className="rounded-lg bg-[var(--surface-subtle)] p-3">
                <dt className="text-xs font-semibold uppercase tracking-wide text-primary-muted">
                  {label}
                </dt>
                <dd className="mt-1 break-words text-sm text-[var(--text-primary)]">
                  {value || '—'}
                </dd>
              </div>
            ))}
          </dl>

          <section className="mt-6">
            <h3 className="font-semibold text-primary-dark">
              Images ({selectedDetails.images.length})
            </h3>
            {selectedDetails.images.length ? (
              <ul className="mt-2 space-y-1 text-sm">
                {selectedDetails.images.map((image) => (
                  <li key={image.id} className="break-all text-[var(--text-muted)]">
                    {image.isPrimary ? 'Primary · ' : ''}
                    {image.imageKey} · Uploaded {formatDate(image.uploadedAt)}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-1 text-sm text-[var(--text-muted)]">No images attached.</p>
            )}
          </section>
        </dialog>
      )}
    </>
  );
}
