'use server';

import { revalidatePath } from 'next/cache';
import { requireUser } from '@/lib/auth/guard';
import { prisma } from '@/lib/prisma';

export async function claimItem(itemId: string) {
  if (typeof itemId !== 'string' || !itemId.trim()) {
    return { success: false, error: 'A report ID is required.' };
  }
  const { id: userId } = await requireUser();

  try {
    const result = await prisma.item.updateMany({
      where: { id: itemId, userId, status: { in: ['OPEN', 'MATCHED'] } },
      data: { status: 'RESOLVED', resolvedDate: new Date() },
    });
    if (result.count === 0) {
      return { success: false, error: 'This report is no longer available to claim.' };
    }
  } catch {
    return { success: false, error: 'Unable to claim this item. Please try again.' };
  }

  revalidatePath('/activity');
  return { success: true };
}
