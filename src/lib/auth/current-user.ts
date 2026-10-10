import 'server-only';

export async function requireCurrentUserId(): Promise<string> {
  const userId = process.env.DEFAULT_USER_ID;

  if (!userId?.trim()) {
    throw new Error('DEFAULT_USER_ID must be configured.');
  }

  return userId;
}
