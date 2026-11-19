'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth/guard';

export async function reopenAdminTicket(formData: FormData): Promise<void> {
  await requireAdmin();
  const itemId = formData.get('itemId');
  if (typeof itemId !== 'string' || !itemId.trim()) {
    return;
  }

  await prisma.item.updateMany({
    where: { id: itemId, status: 'RESOLVED', softDeletedAt: { not: null } },
    data: { status: 'OPEN', resolvedDate: null, softDeletedAt: null, servicedById: null },
  });

  revalidatePath('/admin');
  if (formData.get('view') === 'deleted') redirect('/admin');
}
