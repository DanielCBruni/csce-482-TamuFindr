import { Prisma } from '@/generated/prisma/client';

export async function retryOnConflict<T>(operation: () => Promise<T>, retries = 2): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    const isConflict =
      error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2034';

    if (!isConflict || retries === 0) throw error;

    return retryOnConflict(operation, retries - 1);
  }
}
