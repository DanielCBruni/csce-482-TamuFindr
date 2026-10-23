import 'server-only';

import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const userSelect = { id: true, name: true, email: true, role: true } as const;

export async function getCurrentUser() {
  const devEmail = process.env.DEV_USER_EMAIL?.trim();

  if (process.env.NODE_ENV === 'development' && devEmail) {
    const user = await prisma.user.findUnique({
      where: { email: devEmail },
      select: userSelect,
    });

    if (!user) {
      throw new Error('DEV_USER_EMAIL must identify an existing user. Run pnpm db:seed.');
    }

    return user;
  }

  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return null;

  return prisma.user.findUnique({
    where: { id: session.user.id },
    select: userSelect,
  });
}
