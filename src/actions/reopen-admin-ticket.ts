'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';

export async function reopenAdminTicket(formData: FormData): Promise<void> {
  const itemId = formData.get('itemId');
  if (typeof itemId !== 'string' || !itemId.trim()) {
    return;
  }

  await prisma.item.updateMany({
    where: { id: itemId, status: 'RESOLVED' },
    data: { status: 'OPEN', resolvedDate: null, servicedById: null },
  });

  revalidatePath('/admin');
}
