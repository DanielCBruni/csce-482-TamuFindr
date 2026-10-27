import 'server-only';

import { redirect } from 'next/navigation';
import { UserRole } from '@/generated/prisma/enums';
import { getCurrentUser } from './current-user';

export class AuthorizationError extends Error {
  constructor() {
    super('Administrator access is required.');
    this.name = 'AuthorizationError';
  }
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) redirect('/');
  return user;
}

export async function requireAdmin() {
  const user = await requireUser();
  if (user.role !== UserRole.ADMIN) throw new AuthorizationError();
  return user;
}
