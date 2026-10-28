import type { Metadata } from 'next';
import Link from 'next/link';
import { AuthorizationError, requireAdmin } from '@/lib/auth/guard';
import { prisma } from '@/lib/prisma';
import { UserRole } from '@/generated/prisma/enums';
import UserFilters from './user-filters';
import UsersTable from './users-table';

export const metadata: Metadata = {
  title: 'User Management | TAMUfindr',
  description: 'Search TAMUfindr users and manage account roles and administrator access.',
};

type Props = { searchParams: Promise<{ q?: string | string[]; role?: string | string[] }> };

export default async function UsersPage({ searchParams }: Props) {
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
  const query = typeof filters.q === 'string' ? filters.q.trim() : '';
  const role =
    filters.role === UserRole.ADMIN || filters.role === UserRole.USER ? filters.role : undefined;
  const users = await prisma.user.findMany({
    where: {
      ...(role ? { role } : {}),
      ...(query ? { email: { contains: query, mode: 'insensitive' } } : {}),
    },
    // PostgreSQL enum order follows the schema: USER, then ADMIN.
    orderBy: [{ role: 'desc' }, { email: 'asc' }, { id: 'asc' }],
    select: { id: true, name: true, email: true, role: true },
  });

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-12 text-left text-[var(--text-primary)] md:px-6 md:py-16">
      <Link href="/admin" className="text-sm underline">
        Back to admin panel
      </Link>
      <div className="mb-8 mt-4 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="pb-6 text-4xl font-bold text-primary md:text-5xl">User Management</h1>
          <p className="text-[var(--text-muted)]">
            Manage account roles and administrator access.
          </p>
        </div>
        <p className="text-sm font-semibold">
          {users.length} {users.length === 1 ? 'account' : 'accounts'}
        </p>
      </div>
      <UserFilters query={query} role={role} />
      <UsersTable users={users} />
    </main>
  );
}
