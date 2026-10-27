import 'server-only';

import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const userSelect = { id: true, name: true, email: true, role: true } as const;

export async function getCurrentUser() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return null;

  return prisma.user.findUnique({
    where: { id: session.user.id },
    select: userSelect,
  });
}
