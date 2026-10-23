'use server';

import { revalidatePath } from 'next/cache';
import { requireUser } from '@/lib/auth/guard';
import { prisma } from '@/lib/prisma';

export async function cancelItem(formData: FormData): Promise<void> {
  const itemId = formData.get('itemId');
  if (typeof itemId !== 'string' || !itemId.trim()) {
    return;
  }

  const { id: userId } = await requireUser();
  await prisma.item.updateMany({
    where: { id: itemId, userId, status: { in: ['OPEN', 'MATCHED'] } },
    data: { status: 'CANCELLED' },
  });

  revalidatePath('/home');
  revalidatePath('/activity');
}
