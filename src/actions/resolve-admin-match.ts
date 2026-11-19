'use server';

import { revalidatePath } from 'next/cache';
import { Prisma } from '@/generated/prisma/client';
import { requireAdmin } from '@/lib/auth/guard';
import { prisma } from '@/lib/prisma';
import { retryOnConflict } from '@/lib/db/retry';

export type ResolveAdminMatchResult = {
  success: boolean;
  error?: string;
};

class ResolutionConflictError extends Error {}

export async function resolveAdminMatch(formData: FormData): Promise<ResolveAdminMatchResult> {
  const { id: userId } = await requireAdmin();
  const itemId = formData.get('itemId');
  const matchItemId = formData.get('matchItemId');
  if (
    typeof itemId !== 'string' ||
    !itemId.trim() ||
    typeof matchItemId !== 'string' ||
    !matchItemId.trim() ||
    itemId === matchItemId
  ) {
    return { success: false, error: 'Select two different tickets to resolve together.' };
  }

  try {
    const result = await retryOnConflict(() =>
      prisma.$transaction(
        async (tx): Promise<ResolveAdminMatchResult> => {
          const items = await tx.item.findMany({
            where: { id: { in: [itemId, matchItemId] } },
            select: { id: true, type: true, status: true, softDeletedAt: true },
          });
          if (items.length !== 2) {
            return { success: false, error: 'One or both tickets could not be found.' };
          }

          const currentItem = items.find((item) => item.id === itemId);
          const selectedItem = items.find((item) => item.id === matchItemId);
          if (!currentItem || !selectedItem || currentItem.type === selectedItem.type) {
            return { success: false, error: 'Choose one lost ticket and one found ticket.' };
          }

          if (
            items.some(
              (item) => !['OPEN', 'MATCHED'].includes(item.status) || item.softDeletedAt !== null,
            )
          ) {
            return { success: false, error: 'Both tickets must still be active.' };
          }

          const lostItem = currentItem.type === 'LOST' ? currentItem : selectedItem;
          const foundItem = currentItem.type === 'FOUND' ? currentItem : selectedItem;
          const itemIds = [lostItem.id, foundItem.id];
          const resolvedAt = new Date();
          const updatedItems = await tx.item.updateMany({
            where: {
              id: { in: itemIds },
              status: { in: ['OPEN', 'MATCHED'] },
              softDeletedAt: null,
            },
            data: {
              status: 'RESOLVED',
              resolvedDate: resolvedAt,
              softDeletedAt: resolvedAt,
              servicedById: userId,
            },
          });
          if (updatedItems.count !== 2) {
            throw new ResolutionConflictError('Both tickets must still be active.');
          }

          await tx.itemMatch.upsert({
            where: {
              lostItemId_potentialMatchId: {
                lostItemId: lostItem.id,
                potentialMatchId: foundItem.id,
              },
            },
            create: {
              lostItemId: lostItem.id,
              potentialMatchId: foundItem.id,
              score: 0,
              scoreDetails: { source: 'ADMIN' },
              status: 'CONFIRMED',
            },
            update: {
              scoreDetails: { source: 'ADMIN' },
              status: 'CONFIRMED',
            },
          });

          await tx.itemMatch.updateMany({
            where: {
              status: 'PENDING',
              OR: [{ lostItemId: { in: itemIds } }, { potentialMatchId: { in: itemIds } }],
            },
            data: { status: 'EXPIRED' },
          });

          return { success: true };
        },
        { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
      ),
    );

    if (!result.success) return result;
  } catch (error) {
    if (error instanceof ResolutionConflictError) {
      return { success: false, error: error.message };
    }
    console.error('Failed to resolve matched tickets:', error);
    return { success: false, error: 'Unable to resolve these tickets. Please try again.' };
  }

  revalidatePath('/admin');
  revalidatePath('/home');
  revalidatePath('/activity');
  revalidatePath('/potential-matches');
  return { success: true };
}
