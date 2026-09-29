import Link from 'next/link';
import ActivityTable, { type ActivityItem } from '@/components/activity_table/activity_table';
import { requireCurrentUserId } from '@/lib/auth/current-user';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const userId = await requireCurrentUserId();
  const items = await prisma.item.findMany({
    where: { userId, status: { in: ['OPEN', 'MATCHED'] } },
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
  const userName = '$username$';

  return (
    <main className="min-h-screen bg-primary px-6 py-12 text-white sm:px-10">
      <div className="mx-auto flex max-w-5xl flex-col items-center text-center">
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-white/80">
          TamuFindr
        </p>
        <h1 className="text-5xl font-bold sm:text-7xl">Howdy, {userName}!</h1>
        <p className="mt-6 max-w-xl text-lg text-white/85 sm:text-xl">
          Let&apos;s get your lost and found items back where they belong.
        </p>

        <div className="mt-12 grid w-full max-w-2xl grid-cols-1 gap-12 sm:grid-cols-2">
          <Link
            href="/report"
            className="transition-all duration-200 hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-white/40"
            style={{
              display: 'block',
              width: '100%',
              border: '1px solid rgba(255,255,255,0.9)',
              borderRadius: '22px',
              backgroundColor: '#f8fafc',
              color: 'var(--color-primary-dark)',
              padding: '30px 22px',
              boxShadow: '0 20px 48px rgba(15, 23, 42, 0.18)',
              fontSize: '1.4rem',
              fontWeight: 700,
              letterSpacing: '-0.03em',
              lineHeight: 1.2,
            }}
          >
            Lost an item
          </Link>
          <Link
            href="/report"
            className="transition-all duration-200 hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-white/40"
            style={{
              display: 'block',
              width: '100%',
              border: '1px solid rgba(255,255,255,0.9)',
              borderRadius: '22px',
              backgroundColor: '#f8fafc',
              color: 'var(--color-primary-dark)',
              padding: '30px 22px',
              boxShadow: '0 20px 48px rgba(15, 23, 42, 0.18)',
              fontSize: '1.4rem',
              fontWeight: 700,
              letterSpacing: '-0.03em',
              lineHeight: 1.2,
            }}
          >
            Found an item
          </Link>
        </div>

        <section className="mt-16 w-full text-left">
          <h2 className="mb-4 text-2xl font-bold text-white">Your Activity</h2>
          <ActivityTable items={activityItems} emptyMessage="No active tickets" />
        </section>
      </div>
    </main>
  );
}
