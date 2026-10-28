import Link from 'next/link';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import Select from '@/components/ui/select';
import type { UserRole } from '@/generated/prisma/enums';

export default function UserFilters({ query, role }: { query: string; role?: UserRole }) {
  return (
    <form
      action="/admin/users"
      method="get"
      className="mb-6 flex flex-wrap items-end gap-3 rounded-lg border border-[var(--surface-border)] bg-[var(--surface-raised)] p-4"
    >
      <label className="flex flex-col gap-1 text-sm font-semibold">
        Search by email
        <Input
          key={query}
          name="q"
          type="search"
          defaultValue={query}
          placeholder="Search email addresses"
          className="w-full sm:w-72"
        />
      </label>
      <label className="flex flex-col gap-1 text-sm font-semibold">
        Role
        <Select key={role ?? ''} name="role" defaultValue={role ?? ''}>
          <option value="">All roles</option>
          <option value="ADMIN">Admin</option>
          <option value="USER">User</option>
        </Select>
      </label>
      <Button
        type="submit"
        className="inline-flex items-center rounded-xl border border-primary bg-primary px-4 py-2 font-semibold text-sm text-white shadow-sm transition-all hover:-translate-y-px hover:bg-accent hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        Apply filters
      </Button>
      {(query || role) && (
        <Link href="/admin/users" className="px-3 py-2 underline">
          Clear filters
        </Link>
      )}
    </form>
  );
}
