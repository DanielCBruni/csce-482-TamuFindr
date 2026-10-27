'use client';

import { authClient } from '@/lib/auth-client';
import Button from '@/components/button/button';

export function LoginButton() {
  return (
    <Button
      buttonName="Continue with Google"
      onClick={() =>
        authClient.signIn.social({
          provider: 'google',
          callbackURL: '/home',
        })
      }
    ></Button>
  );
}
