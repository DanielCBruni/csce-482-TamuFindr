import { prisma } from '@/lib/prisma';
import { requireCurrentUserId } from '@/lib/auth/current-user';
import type { ItemStatus } from '@/generated/prisma/enums';
import type { ItemModalData } from '@/components/item_modal/item_modal';
import ActivityClientView from './activity-client-view';

// Read current reports on each request instead of prerendering database data.
export const dynamic = 'force-dynamic';

const statusDisplay: Record<ItemStatus, { status: ItemModalData['status']; statusLabel: string }> =
  {
    OPEN: { status: 'open', statusLabel: 'Open' },
    MATCHED: { status: 'possible-match', statusLabel: 'Possible Match' },
    RESOLVED: { status: 'resolved', statusLabel: 'Resolved' },
    CANCELLED: { status: 'cancelled', statusLabel: 'Cancelled' },
  };

export default async function ActivityPage() {
  const userId = await requireCurrentUserId();
  const items = await prisma.item.findMany({
    where: { userId },
    orderBy: [{ createdAt: 'desc' }, { id: 'asc' }],
    select: {
      id: true,
      title: true,
      type: true,
      status: true,
      description: true,
      createdAt: true,
      locationExtra: true,
      category: { select: { name: true } },
      location: { select: { name: true } },
      submitter: { select: { firstName: true, lastName: true } },
    },
  });

  const activityItems: ItemModalData[] = items.map((item) => ({
    itemId: item.id,
    title: item.title,
    category: item.type === 'LOST' ? 'Lost item' : 'Found item',
    ...statusDisplay[item.status],
    description: item.description,
    reportedDate: `Reported ${item.createdAt.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      timeZone: 'America/Chicago',
    })}`,
    reportedBy: `${item.submitter.firstName} ${item.submitter.lastName}`.trim(),
    location: [item.location.name, item.locationExtra].filter(Boolean).join(' · '),
    itemType: item.category.name,
  }));

  return <ActivityClientView activityItems={activityItems} />;
}
