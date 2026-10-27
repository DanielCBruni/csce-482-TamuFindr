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
          {hasActions && <TableHead>Actions</TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.length === 0 ? (
          <TableRow>
            <TableCell
              colSpan={hasActions ? 7 : 6}
              className="py-8 text-center text-[var(--text-muted)]"
            >
              {emptyMessage}
            </TableCell>
          </TableRow>
        ) : (
          items.map((item) => (
            <TableRow key={item.id}>
              <TableHead scope="row">
                {item.item}
                <span className="mt-1 block text-xs font-normal text-[var(--text-muted)]">
                  Ticket {item.id}
                </span>
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
              {hasActions && (
                <TableCell className="whitespace-nowrap">
                  {resolveAction && ['OPEN', 'MATCHED'].includes(item.status) && (
                    <form action={resolveAction}>
                      <input type="hidden" name="itemId" value={item.id} />
                      <Button type="submit">Resolve</Button>
                    </form>
                  )}
                  {reopenAction && item.status === 'RESOLVED' && (
                    <form action={reopenAction}>
                      <input type="hidden" name="itemId" value={item.id} />
                      <Button type="submit">Reopen</Button>
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
  );
}
