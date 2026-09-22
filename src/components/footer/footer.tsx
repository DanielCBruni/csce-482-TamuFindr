import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full bg-primary text-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-8 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="text-xs font-bold tracking-[0.15em] text-secondary/90 uppercase">
            Texas A&M University
          </div>
          <div className="mt-1 text-2xl font-extrabold tracking-tight">TAMUfindr</div>
        </div>

        <nav
          className="flex flex-wrap items-center gap-5 text-sm font-medium"
          aria-label="Footer navigation"
        >
          <Link href="/home" className="transition-opacity hover:opacity-80">
            Home
          </Link>
          <Link href="/report" className="transition-opacity hover:opacity-80">
            Report
          </Link>
          <Link href="/activity" className="transition-opacity hover:opacity-80">
            Activity
          </Link>
          <Link href="/help" className="transition-opacity hover:opacity-80">
            Help
          </Link>
        </nav>
      </div>
    </footer>
  );
}
