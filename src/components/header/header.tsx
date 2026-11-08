'use client';

import Link from 'next/link';
import AccountMenu from '@/components/account/account-menu';
import { usePathname } from 'next/navigation';
import SettingsMenu from '@/components/settings/settings-menu';
import { CircleHelp } from 'lucide-react';

export default function Header({ signedIn, isAdmin }: { signedIn: boolean; isAdmin: boolean }) {
  const pathname = usePathname();
  const linkClass = (path: string) => {
    const baseClass = 'text-[1.05rem] font-semibold no-underline transition-colors py-1';
    const isActive = pathname === path;
    return `${baseClass} ${isActive ? 'text-accent border-b-2 border-accent' : 'text-primary-muted hover:text-primary'}`;
  };

  return (
    <header className="sticky top-0 z-50 grid min-h-16.25 w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-x-2 gap-y-2 border-b border-[var(--surface-border)] bg-[var(--surface-header)] px-3 py-2 shadow-sm box-border sm:px-4 md:grid-cols-[1fr_auto_1fr] md:gap-x-4 md:px-7 md:py-4.5">
      {/* Left side - branding */}
      <Link
        href="/"
        className="col-start-1 row-start-1 flex flex-col justify-center hover:opacity-80"
      >
        <div className="text-[0.65rem] tracking-[0.12em] text-primary-muted font-bold whitespace-nowrap leading-tight">
          TEXAS A&M UNIVERSITY
        </div>
        <div className="text-xl font-extrabold text-primary tracking-tight leading-tight">
          TAMUfindr
        </div>
      </Link>

      {/* Middle - navbar */}
      <nav
        className="col-span-2 row-start-2 mx-auto flex max-w-full flex-wrap items-center justify-center gap-x-4 gap-y-1 md:col-span-1 md:col-start-2 md:row-start-1 md:gap-x-5.5 md:gap-y-2"
        aria-label="Main navigation"
      >
        {signedIn && (
          <>
            <Link href="/home" className={linkClass('/home')}>
              Home
            </Link>
            <Link href="/report" className={linkClass('/report')}>
              Report
            </Link>
            <Link href="/activity" className={linkClass('/activity')}>
              Activity
            </Link>
          </>
        )}
        {signedIn && (
          <Link href="/potential-matches" className={linkClass('/potential-matches')}>
            Matches
          </Link>
        )}
        {signedIn && isAdmin && (
          <>
            <Link href="/admin" className={linkClass('/admin')}>
              Admin
            </Link>
          </>
        )}
      </nav>

      <div className="relative col-start-2 row-start-1 flex items-center gap-2 justify-self-end md:col-start-3">
        <Link
          href="/help"
          className={`flex h-11 w-11 items-center justify-center transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${pathname === '/help' ? 'text-accent' : 'text-primary-muted'}`}
          aria-label="Help"
          title="Help"
          aria-current={pathname === '/help' ? 'page' : undefined}
        >
          <CircleHelp className="h-7 w-7" aria-hidden="true" />
        </Link>
        <SettingsMenu />
        <AccountMenu signedIn={signedIn} />
      </div>
    </header>
  );
}
