'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Button from '../button/button';

export default function Header() {
  const pathname = usePathname();

  const linkClass = (path: string) => {
    const baseClass = 'text-[1.05rem] font-semibold no-underline transition-colors py-1';
    const isActive = pathname === path;
    return `${baseClass} ${isActive ? 'text-accent border-b-2 border-accent' : 'text-primary-muted hover:text-primary'}`;
  };

  return (
    <header className="sticky top-0 z-50 relative flex items-center justify-center min-h-[65px] px-7 py-[18px] bg-[#fdfdfd] border-b border-[#dfe7f0] box-border w-full">
      {/* Left side - branding */}
      <Link href="/" className="absolute left-7 flex flex-col justify-center hover:opacity-80">
        <div className="text-[0.65rem] tracking-[0.12em] text-primary-muted font-bold whitespace-nowrap leading-tight">
          TEXAS A&M UNIVERSITY
        </div>
        <div className="text-xl font-extrabold text-primary tracking-tight leading-tight">
          TAMUfindr
        </div>
      </Link>

      {/* Middle - navbar */}
      <nav
        className="flex items-center justify-center gap-[22px] flex-wrap mx-auto"
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
        <Link href="/help" className={linkClass('/help')}>
          Help
        </Link>
      </nav>

      {/* Right side - Log out */}
      <div className="absolute right-7">
        <Button buttonName="Log out" className="text-sm font-bold bg-primary text-white" style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-white)' }}/>
      </div>
    </header>
  );
}
