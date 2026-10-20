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
    <div className="w-full overflow-x-auto rounded-lg border border-primary-muted/20 bg-white shadow-sm">
      <table className="w-full min-w-[720px] border-collapse text-left">
        <caption className="sr-only">Submitted lost and found items</caption>
        <thead className="bg-secondary/40 text-xs uppercase tracking-wider text-primary-muted">
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
        <tbody className="divide-y divide-primary-muted/15 text-sm text-primary-dark">
          {items.length === 0 ? (
            <tr>
              <td colSpan={hasActions ? 7 : 6} className="px-5 py-8 text-center text-primary-muted">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            items.map((item) => (
              <tr key={item.id} className="transition hover:bg-secondary/20">
                <th className="px-5 py-4 font-semibold" scope="row">
                  {item.item}
                  <span className="mt-1 block text-xs font-normal text-primary-muted">
                    Ticket {item.id}
                  </span>
                </th>
                <td className="px-5 py-4">{item.type === 'LOST' ? 'Lost' : 'Found'}</td>
                <td className="px-5 py-4">
                  <span className="inline-flex rounded-full bg-primary-muted/10 px-3 py-1 text-xs font-semibold text-primary-muted">
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
                          className="rounded-md border border-primary px-3 py-1.5 font-semibold text-primary transition-colors hover:bg-primary hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
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
                          className="rounded-md border border-primary px-3 py-1.5 font-semibold text-primary transition-colors hover:bg-primary hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
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
