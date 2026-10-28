import type { Metadata } from 'next';
import Link from 'next/link';
import type { ItemStatus, ItemType } from '@/generated/prisma/enums';
import { resolveAdminTicket } from '@/actions/resolve-admin-ticket';
import { reopenAdminTicket } from '@/actions/reopen-admin-ticket';
import ActivityTable, { type ActivityItem } from '@/components/activity_table/activity_table';
import AdminFunctions, { type AdminExportItem } from './admin-functions';
import { prisma } from '@/lib/prisma';
import { AuthorizationError, requireAdmin } from '@/lib/auth/guard';

export const metadata: Metadata = {
  title: 'Admin | TAMUfindr',
  description:
    'Review lost-and-found reports, update ticket statuses, manage categories and locations, and export TAMUfindr activity.',
};

const statuses: ItemStatus[] = ['OPEN', 'MATCHED', 'RESOLVED', 'CANCELLED'];
const types: ItemType[] = ['LOST', 'FOUND'];

type AdminPageProps = {
  searchParams: Promise<{ status?: string; type?: string }>;
};

export default async function AdminPage({ searchParams }: AdminPageProps) {
  try {
    await requireAdmin();
  } catch (error) {
    if (!(error instanceof AuthorizationError)) throw error;
    return (
      <section className="mx-auto mt-16 max-w-6xl px-6 text-primary-dark">
        <h1 className="text-3xl font-bold text-primary">Access denied</h1>
        <p className="mt-3">Administrator access is required to view this page.</p>
      </section>
    );
  }

  const filters = await searchParams;
  const selectedStatus = statuses.find((status) => status === filters.status);
  const selectedType = types.find((type) => type === filters.type);
  const [items, categories, locations] = await Promise.all([
    prisma.item.findMany({
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
        incidentDate: true,
        description: true,
        primaryColor: true,
        condition: true,
        locationExtra: true,
        category: { select: { name: true } },
        location: { select: { name: true } },
      },
    }),
    prisma.category.findMany({ orderBy: { name: 'asc' }, select: { id: true, name: true } }),
    prisma.location.findMany({ orderBy: { name: 'asc' }, select: { id: true, name: true } }),
  ]);
  const activityItems: ActivityItem[] = items.map((item) => ({
    id: item.id,
    type: item.type,
    status: item.status,
    date: item.createdAt,
    location: [item.location.name, item.locationExtra].filter(Boolean).join(' · '),
    item: item.title,
    itemType: item.category.name,
  }));
  const exportItems: AdminExportItem[] = items.map((item) => ({
    id: item.id,
    title: item.title,
    type: item.type,
    status: item.status,
    createdAt: item.createdAt.toISOString().slice(0, 10),
    incidentDate: item.incidentDate.toISOString().slice(0, 10),
    description: item.description ?? '',
    primaryColor: item.primaryColor,
    condition: item.condition,
    locationExtra: item.locationExtra ?? '',
    category: item.category.name,
    location: item.location.name,
  }));

  const openCount = items.filter((item) => item.status === 'OPEN').length;
  const matchedCount = items.filter((item) => item.status === 'MATCHED').length;
  const resolvedCount = items.filter((item) => item.status === 'RESOLVED').length;

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-12 text-left md:px-6 md:py-16">
      <header className="mb-8">
        <h1 className="text-4xl font-bold leading-tight text-primary md:text-5xl">Admin Panel</h1>
        <p className="mt-3 max-w-2xl text-[var(--text-muted)]">
          Review reports, update ticket statuses, and manage TAMUfindr activity.
        </p>
      </header>

      <section aria-label="Ticket summary" className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4">
        {[
          ['Total tickets', items.length],
          ['Open', openCount],
          ['Matched', matchedCount],
          ['Resolved', resolvedCount],
        ].map(([label, count]) => (
          <div
            key={label}
            className="admin-panel rounded-2xl border border-primary-muted/20 bg-[var(--surface-raised)] px-5 py-4 shadow-sm"
          >
            <p className="text-xs font-semibold uppercase tracking-wider text-primary-muted">
              {label}
            </p>
            <p className="mt-2 text-3xl font-bold text-primary-dark">{count}</p>
          </div>
        ))}
      </section>

      <section className="admin-panel mb-8 overflow-hidden rounded-2xl border border-primary-muted/20 bg-[var(--surface-raised)] shadow-sm">
        <div className="px-5">
          <AdminFunctions categories={categories} locations={locations} items={exportItems} />

          <form action="/admin" method="get" className="flex flex-wrap items-end gap-3 py-5">
            <label className="flex flex-col gap-1 text-sm font-semibold text-primary-dark uppercase tracking-wider">
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
            <label className="flex flex-col gap-1 text-sm font-semibold text-primary-dark uppercase tracking-wider">
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
              className="inline-flex items-center rounded-xl border border-primary bg-primary px-4 py-2 font-semibold text-sm text-white shadow-sm transition-all hover:-translate-y-px hover:bg-accent hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              Apply filters
            </button>
            {(selectedStatus || selectedType) && (
              <Link
                href="/admin"
                className="rounded-[10px] border border-primary-muted/30 px-4 py-2 font-semibold text-primary-dark transition-colors hover:bg-[#f3f4f6] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                Clear filters
              </Link>
            )}
          </form>
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-end justify-between gap-4">
          <h2 className="mt-1 text-2xl font-bold text-primary">All Activity</h2>
          <p className="text-sm font-semibold text-primary-muted">Showing {items.length} tickets</p>
        </div>
        <ActivityTable
          items={activityItems}
          emptyMessage="No tickets match these filters"
          resolveAction={resolveAdminTicket}
          reopenAction={reopenAdminTicket}
        />
      </section>
    </main>
  );
}
