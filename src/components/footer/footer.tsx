import Link from 'next/link';

export default function Footer({ signedIn }: { signedIn: boolean }) {
  return (
    <footer className="site-footer w-full border-t border-[var(--surface-border)] bg-[var(--surface-footer)] text-[var(--text-primary)]">
      <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-6 sm:px-6 sm:py-8 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="text-xs font-bold tracking-[0.15em] text-[var(--text-muted)] uppercase">
            Texas A&M University
          </div>
          <div className="mt-1 text-2xl font-extrabold tracking-tight">TAMUfindr</div>
        </div>

        <nav
          className="flex flex-wrap items-center gap-x-4 gap-y-3 text-sm font-medium sm:gap-5"
          aria-label="Footer navigation"
        >
          {signedIn && (
            <>
              <Link href="/home" className="transition-opacity hover:opacity-80">
                Home
              </Link>
              <Link href="/report" className="transition-opacity hover:opacity-80">
                Report
              </Link>
              <Link href="/activity" className="transition-opacity hover:opacity-80">
                Activity
              </Link>
            </>
          )}
          <Link href="/help" className="transition-opacity hover:opacity-80">
            Help
          </Link>
        </nav>
      </div>
    </footer>
  );
}
