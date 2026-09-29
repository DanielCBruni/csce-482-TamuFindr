import Link from 'next/link';
import type { ItemStatus, ItemType } from '@/generated/prisma/enums';
import ActivityTable, { type ActivityItem } from '@/components/activity_table/activity_table';
import { prisma } from '@/lib/prisma';

const statuses: ItemStatus[] = ['OPEN', 'MATCHED', 'RESOLVED', 'CANCELLED'];
const types: ItemType[] = ['LOST', 'FOUND'];

type AdminPageProps = {
  searchParams: Promise<{ status?: string; type?: string }>;
};

export default async function AdminPage({ searchParams }: AdminPageProps) {
  const filters = await searchParams;
  const selectedStatus = statuses.find((status) => status === filters.status);
  const selectedType = types.find((type) => type === filters.type);
  const items = await prisma.item.findMany({
    where: {
      ...(selectedStatus ? { status: selectedStatus } : {}),
      ...(selectedType ? { type: selectedType } : {}),
    },
    orderBy: [{ createdAt: 'desc' }, { id: 'asc' }],
    select: {
      id: true,
      title: true,
      type: true,
      status: true,
      createdAt: true,
      locationExtra: true,
      category: { select: { name: true } },
      location: { select: { name: true } },
    },
  });
  const activityItems: ActivityItem[] = items.map((item) => ({
    id: item.id,
    type: item.type,
    status: item.status,
    date: item.createdAt,
    location: [item.location.name, item.locationExtra].filter(Boolean).join(' · '),
    item: item.title,
    itemType: item.category.name,
  }));

  return (
    <section className="mx-auto mt-16 w-full max-w-6xl px-6 pb-16 text-left text-primary-dark">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary-dark">Admin Panel</h1>
          <p className="mt-1 text-sm text-primary-muted">All tickets from all users</p>
        </div>
        <p className="text-sm font-semibold text-primary-muted">{items.length} tickets</p>
      </div>

      <form
        action="/admin"
        method="get"
        className="mb-6 flex flex-wrap items-end gap-3 rounded-lg border border-primary-muted/20 bg-white p-4 shadow-sm"
      >
        <label className="flex flex-col gap-1 text-sm font-semibold text-primary-dark">
          Type
          <select
            name="type"
            defaultValue={selectedType ?? ''}
            className="min-w-36 rounded border border-primary-muted/30 bg-white px-3 py-2 font-normal"
          >
            <option value="">All types</option>
            <option value="LOST">Lost</option>
            <option value="FOUND">Found</option>
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm font-semibold text-primary-dark">
          Status
          <select
            name="status"
            defaultValue={selectedStatus ?? ''}
            className="min-w-40 rounded border border-primary-muted/30 bg-white px-3 py-2 font-normal"
          >
            <option value="">All statuses</option>
            <option value="OPEN">Open</option>
            <option value="MATCHED">Matched</option>
            <option value="RESOLVED">Resolved</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </label>
        <button
          type="submit"
          className="rounded border border-primary bg-primary px-4 py-2 font-semibold text-white transition-colors hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          Apply filters
        </button>
        {(selectedStatus || selectedType) && (
          <Link
            href="/admin"
            className="rounded border border-primary-muted/30 px-4 py-2 font-semibold text-primary-dark transition-colors hover:bg-secondary/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            Clear filters
          </Link>
        )}
      </form>

      <h2 className="mb-4 text-2xl font-bold text-primary-dark">All Activity</h2>
      <ActivityTable items={activityItems} emptyMessage="No tickets match these filters" />
    </section>
  );
}
