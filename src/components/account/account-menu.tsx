'use client';

import { useState, useTransition } from 'react';
import { login, logout } from '@/actions/account';
import Button from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { CircleUserRound } from 'lucide-react';

export default function AccountMenu({ signedIn }: { signedIn: boolean }) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function runAction(action: typeof login) {
    setError(null);

    startTransition(async () => {
      const result = await action();

      if (result?.error) {
        setError(result.error);
      }
    });
  }

  return (
    <div className="relative text-primary-muted">
      {signedIn ? (
        <DropdownMenu>
          <DropdownMenuTrigger
            variant="icon"
            aria-label="Profile"
            title="Profile"
            className="flex h-11 w-11 items-center justify-center rounded-full hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <CircleUserRound className="h-7 w-7" />
          </DropdownMenuTrigger>
          <DropdownMenuContent label="Account">
            <DropdownMenuItem disabled={pending} onClick={() => runAction(logout)}>
              {pending ? 'Logging out…' : 'Log out'}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Button
          disabled={pending}
          onClick={() => runAction(login)}
          className="whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-wait disabled:opacity-60"
        >
          {pending ? 'Signing in…' : 'Login'}
        </Button>
      )}
      {error && (
        <p
          role="alert"
          className="absolute right-0 top-full mt-2 w-64 rounded-md border border-[var(--surface-border)] bg-[var(--surface-raised)] p-3 text-sm text-[var(--text-primary)] shadow-lg"
        >
          {error}
        </p>
      )}
    </div>
  );
}
