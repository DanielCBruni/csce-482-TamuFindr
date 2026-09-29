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
}

export default function ActivityTable({
  items,
  emptyMessage = 'No tickets found',
}: ActivityTableProps) {
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
          </tr>
        </thead>
        <tbody className="divide-y divide-primary-muted/15 text-sm text-primary-dark">
          {items.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-5 py-8 text-center text-primary-muted">
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
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
