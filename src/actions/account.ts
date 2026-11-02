'use server';

import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';

export async function login() {
  let url: string | undefined;
  try {
    const result = await auth.api.signInSSO({
      headers: await headers(),
      body: { providerId: 'tamu-entra', providerType: 'saml', callbackURL: '/home' },
    });
    url = result.url;
  } catch (error) {
    console.error('Unable to start TAMU sign-in:', error);
    return { error: 'Unable to start TAMU sign-in. Please try again.' };
  }
  if (!url) {
    console.error('Unable to start TAMU sign-in: SSO returned no redirect URL');
    return { error: 'Unable to start TAMU sign-in. Please try again.' };
  }
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
