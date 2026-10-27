'use client';

import Link from 'next/link';
import AccountMenu from '@/components/account/account-menu';
import { usePathname } from 'next/navigation';
import SettingsMenu from '@/components/settings/settings-menu';

export default function Header({ signedIn }: { signedIn: boolean }) {
  const pathname = usePathname();
  const linkClass = (path: string) => {
    const baseClass = 'text-[1.05rem] font-semibold no-underline transition-colors py-1';
    const isActive = pathname === path;
    return `${baseClass} ${isActive ? 'text-accent border-b-2 border-accent' : 'text-primary-muted hover:text-primary'}`;
  };

  return (
    <header className="sticky top-0 z-50 grid min-h-16.25 w-full grid-cols-[1fr_auto] items-center gap-x-4 gap-y-3 border-b border-[var(--surface-border)] bg-[var(--surface-header)] px-4 py-3 shadow-sm box-border md:grid-cols-[1fr_auto_1fr] md:px-7 md:py-4.5">
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
        className="col-span-2 row-start-2 mx-auto flex flex-wrap items-center justify-center gap-x-5.5 gap-y-2 md:col-span-1 md:col-start-2 md:row-start-1"
        aria-label="Main navigation"
      >
        <Link href="/home" className={linkClass('/home')}>
          Home
        </Link>
        <Link href="/report" className={linkClass('/report')}>
          Report
        </Link>
        <Link href="/activity" className={linkClass('/activity')}>
          Activity
        </Link>
        <Link href="/potential-matches" className={linkClass('/potential-matches')}>
          Potential Matches
        </Link>
        <Link href="/help" className={linkClass('/help')}>
          Help
        </Link>
      </nav>

      <div className="relative col-start-2 row-start-1 flex items-center gap-2 justify-self-end md:col-start-3">
        <SettingsMenu />
        <AccountMenu signedIn={signedIn} />
      </div>
    </header>
  );
}
