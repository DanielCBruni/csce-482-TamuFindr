'use server';

import { prisma } from '@/lib/prisma';
import { AuthorizationError, requireAdmin } from '@/lib/auth/guard';
import { retryOnConflict } from '@/lib/db/retry';
import { Prisma } from '@/generated/prisma/client';
import { UserRole } from '@/generated/prisma/enums';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

type RoleResult = { success: true } | { success: false; error: string };

const fail = (error: string): RoleResult => ({
  success: false,
  error,
});

export async function setUserRole(userId: string, role: UserRole): Promise<RoleResult> {
  let actor;

  try {
    actor = await requireAdmin();
  } catch (error) {
    if (error instanceof AuthorizationError) {
      return fail(error.message);
    }
    throw error;
  }

  if (!userId?.trim()) return fail('A user ID is required.');
  if (!Object.values(UserRole).includes(role)) {
    return fail('Invalid role.');
  }

  let result: RoleResult;

  try {
    result = await updateUserRole(actor.id, userId, role);
  } catch (error) {
    console.error('Failed to update user role:', error);
    return fail('Unable to update the role.');
  }

  if (!result.success) return result;

  revalidatePath('/admin/users');
  revalidatePath('/', 'layout');

  if (actor.id === userId && role === UserRole.USER) {
    redirect('/home');
  }

  return result;
}

async function updateUserRole(
  actorId: string,
  userId: string,
  role: UserRole,
): Promise<RoleResult> {
  return retryOnConflict(() =>
    prisma.$transaction(
      async (tx): Promise<RoleResult> => {
        const actor = await tx.user.findUnique({
          where: { id: actorId },
          select: { role: true },
        });

        if (actor?.role !== UserRole.ADMIN) {
          return fail('Administrator access is required.');
        }

        const user = await tx.user.findUnique({
          where: { id: userId },
          select: { role: true },
        });

        if (!user) return fail('User not found.');
        if (user.role === role) return { success: true };

        // Prevent removing the last administrator.
        if (user.role === UserRole.ADMIN && role === UserRole.USER) {
          const otherAdmins = await tx.user.count({
            where: {
              role: UserRole.ADMIN,
              id: { not: userId },
            },
          });

          if (otherAdmins === 0) {
            return fail('Cannot demote the last administrator.');
          }
        }

        await tx.user.update({
          where: { id: userId },
          data: { role },
        });

        return { success: true };
      },
      { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
    ),
  );
}
