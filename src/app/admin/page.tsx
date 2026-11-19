import type { Metadata } from 'next';
import Link from 'next/link';
import type { Prisma } from '@/generated/prisma/client';
import type { ItemCondition, ItemStatus, ItemType, PrimaryColor } from '@/generated/prisma/enums';
import { resolveAdminTicket } from '@/actions/resolve-admin-ticket';
import { resolveAdminMatch } from '@/actions/resolve-admin-match';
import { reopenAdminTicket } from '@/actions/reopen-admin-ticket';
import ActivityTable, { type ActivityItem } from '@/components/activity_table/activity_table';
import type { ResolutionCandidate } from '@/components/activity_table/resolve-match-button';
import Button from '@/components/ui/button';
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
const conditions: ItemCondition[] = [
  'UNKNOWN',
  'NEW',
  'LIKE_NEW',
  'GOOD',
  'FAIR',
  'POOR',
  'DAMAGED',
];
const colors: PrimaryColor[] = [
  'BLACK',
  'WHITE',
  'SILVER',
  'GRAY',
  'RED',
  'BLUE',
  'GREEN',
  'YELLOW',
  'BROWN',
  'PURPLE',
  'PINK',
  'ORANGE',
  'OTHER',
];

function validDateFilter(value?: string) {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const date = new Date(`${value}T00:00:00.000Z`);
  return Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== value ? null : value;
}

function dateRange(from?: string, to?: string): Prisma.DateTimeFilter | undefined {
  const validFrom = validDateFilter(from);
  const validTo = validDateFilter(to);
  if (!validFrom && !validTo) return undefined;

  const endExclusive = validTo ? new Date(`${validTo}T00:00:00.000Z`) : undefined;
  endExclusive?.setUTCDate(endExclusive.getUTCDate() + 1);
  return {
    ...(validFrom ? { gte: new Date(`${validFrom}T00:00:00.000Z`) } : {}),
    ...(endExclusive ? { lt: endExclusive } : {}),
  };
}

const itemDetailsSelect = {
  id: true,
  title: true,
  type: true,
  status: true,
  createdAt: true,
  incidentDate: true,
  description: true,
  primaryColor: true,
  secondaryColor: true,
  brand: true,
  condition: true,
  locationExtra: true,
  storageLocationExtra: true,
  resolutionNotes: true,
  resolvedDate: true,
  softDeletedAt: true,
  category: { select: { name: true } },
  location: { select: { name: true } },
  storageLocation: { select: { name: true } },
  submitter: { select: { name: true, email: true } },
  servicedBy: { select: { name: true, email: true } },
  images: {
    orderBy: { uploadedAt: 'asc' as const },
    select: { id: true, imageKey: true, isPrimary: true, uploadedAt: true },
  },
} satisfies Prisma.ItemSelect;

type AdminPageProps = {
  searchParams: Promise<{
    status?: string;
    type?: string;
    view?: string;
    q?: string;
    submitter?: string;
    category?: string;
    location?: string;
    submittedFrom?: string;
    submittedTo?: string;
    incidentFrom?: string;
    incidentTo?: string;
    condition?: string;
    color?: string;
  }>;
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
  const showSoftDeleted = filters.view === 'deleted';
  const visibleStatuses = statuses.filter((status) =>
    showSoftDeleted ? status === 'RESOLVED' : status !== 'RESOLVED',
  );
  const selectedStatus = visibleStatuses.find((status) => status === filters.status);
  const selectedType = types.find((type) => type === filters.type);
  const searchTerm = filters.q?.trim().slice(0, 100) ?? '';
  const submitterTerm = filters.submitter?.trim().slice(0, 100) ?? '';
  const selectedCategory = filters.category ?? '';
  const selectedLocation = filters.location ?? '';
  const submittedFrom = validDateFilter(filters.submittedFrom) ?? '';
  const submittedTo = validDateFilter(filters.submittedTo) ?? '';
  const incidentFrom = validDateFilter(filters.incidentFrom) ?? '';
  const incidentTo = validDateFilter(filters.incidentTo) ?? '';
  const selectedCondition = conditions.find((condition) => condition === filters.condition);
  const selectedColor = colors.find((color) => color === filters.color);
  const itemFilters = {
    ...(selectedStatus ? { status: selectedStatus } : {}),
    ...(selectedType ? { type: selectedType } : {}),
    ...(selectedCondition ? { condition: selectedCondition } : {}),
    ...(selectedColor ? { primaryColor: selectedColor } : {}),
    ...(selectedCategory ? { categoryId: selectedCategory } : {}),
    ...(selectedLocation ? { locationId: selectedLocation } : {}),
    ...(dateRange(submittedFrom, submittedTo)
      ? { createdAt: dateRange(submittedFrom, submittedTo) }
      : {}),
    ...(dateRange(incidentFrom, incidentTo)
      ? { incidentDate: dateRange(incidentFrom, incidentTo) }
      : {}),
    ...(searchTerm
      ? {
          OR: [
            { id: { contains: searchTerm, mode: 'insensitive' as const } },
            { title: { contains: searchTerm, mode: 'insensitive' as const } },
            { description: { contains: searchTerm, mode: 'insensitive' as const } },
            { brand: { contains: searchTerm, mode: 'insensitive' as const } },
            {
              submitter: {
                is: {
                  OR: [
                    { name: { contains: searchTerm, mode: 'insensitive' as const } },
                    { email: { contains: searchTerm, mode: 'insensitive' as const } },
                  ],
                },
              },
            },
            { category: { is: { name: { contains: searchTerm, mode: 'insensitive' as const } } } },
            { location: { is: { name: { contains: searchTerm, mode: 'insensitive' as const } } } },
            { locationExtra: { contains: searchTerm, mode: 'insensitive' as const } },
          ],
        }
      : {}),
    ...(submitterTerm
      ? {
          submitter: {
            is: {
              OR: [
                { name: { contains: submitterTerm, mode: 'insensitive' as const } },
                { email: { contains: submitterTerm, mode: 'insensitive' as const } },
              ],
            },
          },
        }
      : {}),
  };
  const [items, categories, locations, candidateItems] = await Promise.all([
    prisma.item.findMany({
      where: {
        softDeletedAt: showSoftDeleted ? { not: null } : null,
        ...itemFilters,
      },
      orderBy: [{ createdAt: 'desc' }, { id: 'asc' }],
      select: {
        ...itemDetailsSelect,
        lostMatches: {
          where: {
            status: 'CONFIRMED',
            potentialMatch: { softDeletedAt: { not: null } },
          },
          select: {
            potentialMatch: { select: itemDetailsSelect },
          },
        },
        foundMatches: {
          where: {
            status: 'CONFIRMED',
            lostItem: { softDeletedAt: { not: null } },
          },
          select: {
            lostItem: { select: itemDetailsSelect },
          },
        },
      },
    }),
    prisma.category.findMany({ orderBy: { name: 'asc' }, select: { id: true, name: true } }),
    prisma.location.findMany({ orderBy: { name: 'asc' }, select: { id: true, name: true } }),
    prisma.item.findMany({
      where: {
        status: { in: ['OPEN', 'MATCHED'] },
        softDeletedAt: null,
      },
      orderBy: [{ createdAt: 'desc' }, { id: 'asc' }],
      select: {
        id: true,
        title: true,
        type: true,
        createdAt: true,
        userId: true,
        submitter: { select: { name: true, email: true } },
        locationExtra: true,
        category: { select: { name: true } },
        location: { select: { name: true } },
      },
    }),
  ]);
  const activityItems: ActivityItem[] = items.map((item) => ({
    id: item.id,
    type: item.type,
    status: item.status,
    date: item.createdAt,
    softDeletedAt: item.softDeletedAt,
    location: [item.location.name, item.locationExtra].filter(Boolean).join(' · '),
    item: item.title,
    itemType: item.category.name,
    details: {
      id: item.id,
      title: item.title,
      type: item.type,
      status: item.status,
      submittedAt: item.createdAt.toISOString(),
      incidentDate: item.incidentDate.toISOString(),
      category: item.category.name,
      description: item.description,
      primaryColor: item.primaryColor,
      secondaryColor: item.secondaryColor,
      brand: item.brand,
      condition: item.condition,
      location: [item.location.name, item.locationExtra].filter(Boolean).join(' · '),
      storageLocation: [item.storageLocation?.name, item.storageLocationExtra]
        .filter(Boolean)
        .join(' · '),
      resolutionNotes: item.resolutionNotes,
      resolvedAt: item.resolvedDate?.toISOString() ?? null,
      softDeletedAt: item.softDeletedAt?.toISOString() ?? null,
      submittedBy: item.submitter,
      servicedBy: item.servicedBy,
      images: item.images.map((image) => ({
        ...image,
        uploadedAt: image.uploadedAt.toISOString(),
      })),
    },
    matchedTickets: [
      ...item.lostMatches.map((match) => match.potentialMatch),
      ...item.foundMatches.map((match) => match.lostItem),
    ].map((match) => ({
      id: match.id,
      title: match.title,
      type: match.type,
      status: match.status,
      submittedAt: match.createdAt.toISOString(),
      incidentDate: match.incidentDate.toISOString(),
      category: match.category.name,
      description: match.description,
      primaryColor: match.primaryColor,
      secondaryColor: match.secondaryColor,
      brand: match.brand,
      condition: match.condition,
      location: [match.location.name, match.locationExtra].filter(Boolean).join(' · '),
      storageLocation: [match.storageLocation?.name, match.storageLocationExtra]
        .filter(Boolean)
        .join(' · '),
      resolutionNotes: match.resolutionNotes,
      resolvedAt: match.resolvedDate?.toISOString() ?? null,
      softDeletedAt: match.softDeletedAt?.toISOString() ?? null,
      submittedBy: match.submitter,
      servicedBy: match.servicedBy,
      images: match.images.map((image) => ({
        ...image,
        uploadedAt: image.uploadedAt.toISOString(),
      })),
    })),
  }));
  const resolutionCandidates: ResolutionCandidate[] = candidateItems.map((item) => ({
    id: item.id,
    title: item.title,
    type: item.type,
    category: item.category.name,
    location: [item.location.name, item.locationExtra].filter(Boolean).join(' · '),
    date: item.createdAt.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      timeZone: 'America/Chicago',
    }),
    userId: item.userId,
    userName: item.submitter.name,
    userEmail: item.submitter.email,
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
              Ticket view
              <select
                name="view"
                defaultValue={showSoftDeleted ? 'deleted' : 'active'}
                className="min-w-44 rounded border border-primary-muted/30 bg-white px-3 py-2 font-normal"
              >
                <option value="active">Active tickets</option>
                <option value="deleted">Soft deleted (30 days)</option>
              </select>
            </label>
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
              Category
              <select
                name="category"
                defaultValue={selectedCategory}
                className="min-w-40 rounded border border-primary-muted/30 bg-white px-3 py-2 font-normal"
              >
                <option value="">All categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-1 text-sm font-semibold text-primary-dark uppercase tracking-wider">
              Location
              <select
                name="location"
                defaultValue={selectedLocation}
                className="min-w-40 rounded border border-primary-muted/30 bg-white px-3 py-2 font-normal"
              >
                <option value="">All locations</option>
                {locations.map((location) => (
                  <option key={location.id} value={location.id}>
                    {location.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-1 text-sm font-semibold text-primary-dark uppercase tracking-wider">
              Condition
              <select
                name="condition"
                defaultValue={selectedCondition ?? ''}
                className="min-w-36 rounded border border-primary-muted/30 bg-white px-3 py-2 font-normal"
              >
                <option value="">All conditions</option>
                {conditions.map((condition) => (
                  <option key={condition} value={condition}>
                    {condition.replaceAll('_', ' ')}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-1 text-sm font-semibold text-primary-dark uppercase tracking-wider">
              Primary color
              <select
                name="color"
                defaultValue={selectedColor ?? ''}
                className="min-w-36 rounded border border-primary-muted/30 bg-white px-3 py-2 font-normal"
              >
                <option value="">All colors</option>
                {colors.map((color) => (
                  <option key={color} value={color}>
                    {color.charAt(0) + color.slice(1).toLowerCase()}
                  </option>
                ))}
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
                {visibleStatuses.map((status) => (
                  <option key={status} value={status}>
                    {status.charAt(0) + status.slice(1).toLowerCase()}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex min-w-56 flex-col gap-1 text-sm font-semibold text-primary-dark uppercase tracking-wider">
              Search tickets
              <input
                type="search"
                name="q"
                defaultValue={searchTerm}
                placeholder="Item, ticket ID, brand, details..."
                className="rounded border border-primary-muted/30 bg-white px-3 py-2 font-normal normal-case tracking-normal"
              />
            </label>
            <label className="flex min-w-56 flex-col gap-1 text-sm font-semibold text-primary-dark uppercase tracking-wider">
              Submitted by
              <input
                type="search"
                name="submitter"
                defaultValue={submitterTerm}
                placeholder="Name or email"
                className="rounded border border-primary-muted/30 bg-white px-3 py-2 font-normal normal-case tracking-normal"
              />
            </label>
            <fieldset className="flex flex-wrap items-end gap-2">
              <legend className="mb-1 text-sm font-semibold uppercase tracking-wider text-primary-dark">
                Submitted date
              </legend>
              <label className="flex flex-col gap-1 text-xs text-primary-muted">
                From
                <input
                  type="date"
                  name="submittedFrom"
                  defaultValue={submittedFrom}
                  className="rounded border border-primary-muted/30 bg-white px-3 py-2 text-sm text-primary-dark"
                />
              </label>
              <label className="flex flex-col gap-1 text-xs text-primary-muted">
                To
                <input
                  type="date"
                  name="submittedTo"
                  defaultValue={submittedTo}
                  className="rounded border border-primary-muted/30 bg-white px-3 py-2 text-sm text-primary-dark"
                />
              </label>
            </fieldset>
            <fieldset className="flex flex-wrap items-end gap-2">
              <legend className="mb-1 text-sm font-semibold uppercase tracking-wider text-primary-dark">
                Incident date
              </legend>
              <label className="flex flex-col gap-1 text-xs text-primary-muted">
                From
                <input
                  type="date"
                  name="incidentFrom"
                  defaultValue={incidentFrom}
                  className="rounded border border-primary-muted/30 bg-white px-3 py-2 text-sm text-primary-dark"
                />
              </label>
              <label className="flex flex-col gap-1 text-xs text-primary-muted">
                To
                <input
                  type="date"
                  name="incidentTo"
                  defaultValue={incidentTo}
                  className="rounded border border-primary-muted/30 bg-white px-3 py-2 text-sm text-primary-dark"
                />
              </label>
            </fieldset>
            <Button type="submit">Apply filters</Button>
            {(selectedStatus ||
              selectedType ||
              selectedCondition ||
              selectedColor ||
              selectedCategory ||
              selectedLocation ||
              searchTerm ||
              submitterTerm ||
              submittedFrom ||
              submittedTo ||
              incidentFrom ||
              incidentTo ||
              showSoftDeleted) && (
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
          <h2 className="mt-1 text-2xl font-bold text-primary">
            {showSoftDeleted ? 'Soft-deleted tickets' : 'Active tickets'}
          </h2>
          <p className="text-sm font-semibold text-primary-muted">Showing {items.length} tickets</p>
        </div>
        <ActivityTable
          items={activityItems}
          emptyMessage="No tickets match these filters"
          resolveAction={resolveAdminTicket}
          resolveMatchAction={resolveAdminMatch}
          resolutionCandidates={resolutionCandidates}
          reopenAction={reopenAdminTicket}
          showRetention={showSoftDeleted}
        />
      </section>
    </main>
  );
}
