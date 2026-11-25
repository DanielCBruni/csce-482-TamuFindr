'use server';

import { getCurrentUser } from '@/lib/auth/current-user';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function updateItemDescription(itemId: string, description: string) {
  if (typeof itemId !== 'string' || !itemId.trim() || typeof description !== 'string') {
    return { success: false as const, error: 'Invalid report or description.' };
  }
  const user = await getCurrentUser();
  if (!user) return { success: false as const, error: 'Please sign in again to edit your report.' };
  const value = description.trim() || null;
  try {
    const result = await prisma.item.updateMany({
      where: { id: itemId, userId: user.id, type: 'LOST', softDeletedAt: null },
      data: { description: value },
    });
    if (!result.count)
      return {
        success: false as const,
        error: 'This report is unavailable or does not belong to you.',
      };
  } catch {
    return { success: false as const, error: 'Unable to save your description. Please try again.' };
  }
  revalidatePath('/activity');
  revalidatePath('/home');
  revalidatePath('/admin');
  revalidatePath('/potential-matches');
  return { success: true as const, description: value };
}
