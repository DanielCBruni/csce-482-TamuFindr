'use server';

import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';

export async function login() {
  let url: string | undefined;
  try {
    const result = await auth.api.signInSocial({
      headers: await headers(),
      body: { provider: 'google', callbackURL: '/home', disableRedirect: true },
    });
    url = result.url;
  } catch {
    return { error: 'Unable to start Google sign-in. Please try again.' };
  }
  if (!url) return { error: 'Unable to start Google sign-in. Please try again.' };
  redirect(url);
}

export async function logout() {
  try {
    await auth.api.signOut({ headers: await headers() });
  } catch {
    return { error: 'Unable to log out. Please try again.' };
  }
  redirect('/');
}
