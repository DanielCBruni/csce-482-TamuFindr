import CancelTicketButton from './cancel_ticket_button';

export interface ActivityItem {
  id: string;
  type: string;
  status: string;
  date: string | Date;
  location: string;
  item: string;
  itemType: string;
}

function formatDate(date: string | Date) {
  if (date instanceof Date) {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      timeZone: 'America/Chicago',
    });
  }

  const [month, day, year] = date.split('-').map(Number);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(year, month - 1, day));
}

function formatStatus(status: string) {
  const normalizedStatus = status.toLowerCase();
  return normalizedStatus.charAt(0).toUpperCase() + normalizedStatus.slice(1);
}

export interface ActivityTableProps {
  items: ActivityItem[];
  emptyMessage?: string;
  resolveAction?: (formData: FormData) => Promise<void>;
  reopenAction?: (formData: FormData) => Promise<void>;
  cancelAction?: (formData: FormData) => Promise<void>;
}

export default function ActivityTable({
  items,
  emptyMessage = 'No tickets found',
  resolveAction,
  reopenAction,
  cancelAction,
}: ActivityTableProps) {
  const hasActions = Boolean(resolveAction || reopenAction || cancelAction);
  return (
    <div className="activity-table w-full overflow-x-auto rounded-lg border border-[var(--surface-border)] bg-[var(--surface-raised)] shadow-sm">
      <table className="w-full min-w-[720px] border-collapse text-left">
        <caption className="sr-only">Submitted lost and found items</caption>
        <thead className="bg-[var(--surface-subtle)] text-xs uppercase tracking-wider text-[var(--text-muted)]">
          <tr>
            <th className="px-5 py-4 font-semibold" scope="col">
              Item
            </th>
            <th className="px-5 py-4 font-semibold" scope="col">
              Type
            </th>
            <th className="px-5 py-4 font-semibold" scope="col">
              Status
            </th>
            <th className="px-5 py-4 font-semibold" scope="col">
              Category
            </th>
            <th className="px-5 py-4 font-semibold" scope="col">
              Location
            </th>
            <th className="px-5 py-4 font-semibold" scope="col">
              Submitted
            </th>
            {hasActions && (
              <th className="px-5 py-4 font-semibold" scope="col">
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--surface-border)] text-sm text-[var(--text-primary)]">
          {items.length === 0 ? (
            <tr>
              <td
                colSpan={hasActions ? 7 : 6}
                className="px-5 py-8 text-center text-[var(--text-muted)]"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            items.map((item) => (
              <tr key={item.id} className="transition hover:bg-[var(--surface-hover)]">
                <th className="px-5 py-4 font-semibold" scope="row">
                  {item.item}
                  <span className="mt-1 block text-xs font-normal text-[var(--text-muted)]">
                    Ticket {item.id}
                  </span>
                </th>
                <td className="px-5 py-4">{item.type === 'LOST' ? 'Lost' : 'Found'}</td>
                <td className="px-5 py-4">
                  <span className="inline-flex rounded-full bg-[var(--surface-subtle)] px-3 py-1 text-xs font-semibold text-[var(--text-muted)]">
                    {formatStatus(item.status)}
                  </span>
                </td>
                <td className="px-5 py-4">{item.itemType}</td>
                <td className="px-5 py-4">{item.location}</td>
                <td className="whitespace-nowrap px-5 py-4">{formatDate(item.date)}</td>
                {hasActions && (
                  <td className="whitespace-nowrap px-5 py-4">
                    {resolveAction && ['OPEN', 'MATCHED'].includes(item.status) && (
                      <form action={resolveAction}>
                        <input type="hidden" name="itemId" value={item.id} />
                        <button
                          type="submit"
                          className="activity-table-action rounded-md border border-[var(--surface-border)] bg-[var(--surface-raised)] px-3 py-1.5 font-semibold text-[var(--text-primary)] transition-colors hover:bg-[var(--surface-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus-ring)]"
                        >
                          Resolve
                        </button>
                      </form>
                    )}
                    {reopenAction && item.status === 'RESOLVED' && (
                      <form action={reopenAction}>
                        <input type="hidden" name="itemId" value={item.id} />
                        <button
                          type="submit"
                          className="activity-table-action rounded-md border border-[var(--surface-border)] bg-[var(--surface-raised)] px-3 py-1.5 font-semibold text-[var(--text-primary)] transition-colors hover:bg-[var(--surface-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus-ring)]"
                        >
                          Reopen
                        </button>
                      </form>
                    )}
                    {cancelAction && ['OPEN', 'MATCHED'].includes(item.status) && (
                      <CancelTicketButton
                        itemId={item.id}
                        itemName={item.item}
                        action={cancelAction}
                      />
                    )}
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
