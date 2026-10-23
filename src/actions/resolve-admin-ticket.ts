'use server';

import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/auth/guard';
import { prisma } from '@/lib/prisma';

export async function resolveAdminTicket(formData: FormData): Promise<void> {
  const { id: userId } = await requireAdmin();
  const itemId = formData.get('itemId');
  if (typeof itemId !== 'string' || !itemId.trim()) {
    return;
  }

  await prisma.item.updateMany({
    where: { id: itemId, status: { in: ['OPEN', 'MATCHED'] } },
    data: { status: 'RESOLVED', resolvedDate: new Date(), servicedById: userId },
  });

  revalidatePath('/admin');
}
