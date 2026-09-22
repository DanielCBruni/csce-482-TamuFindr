'use client';

import { useRouter } from 'next/navigation';
import Button from '../../components/button/button';
import ActivityTable from '../../components/activity_table/activity_table';

export default function HomePage() {
  const router = useRouter();
  const userName = '$username$';

  return (
    <main className="min-h-screen bg-primary px-6 py-12 text-secondary sm:px-10">
      <div className="mx-auto flex max-w-5xl flex-col items-center text-center">
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-secondary/80">
          TamuFindr
        </p>
        <h1 className="text-5xl font-bold sm:text-7xl">Howdy, {userName}!</h1>
        <p className="mt-6 max-w-xl text-lg text-secondary/85 sm:text-xl">
          Let&apos;s get your lost and found items back where they belong.
        </p>

        <div className="mt-12 grid w-full max-w-2xl grid-cols-1 gap-5 sm:grid-cols-2">
          <Button
            buttonName="Lost an item"
            onClick={() => router.push('/report')}
            className="text-xl font-bold shadow-lg transition hover:-translate-y-1 hover:bg-white focus:outline-none focus:ring-4 focus:ring-secondary/50"
            style={{
              width: '100%',
              border: '2px solid var(--color-secondary)',
              backgroundColor: 'var(--color-secondary)',
              color: 'var(--color-primary-dark)',
              padding: '28px 24px',
            }}
          />
          <Button
            buttonName="Found an item"
            onClick={() => router.push('/report')}
            className="text-xl font-bold shadow-lg transition hover:-translate-y-1 hover:bg-white focus:outline-none focus:ring-4 focus:ring-secondary/50"
            style={{
              width: '100%',
              border: '2px solid var(--color-secondary)',
              backgroundColor: 'var(--color-secondary)',
              color: 'var(--color-primary-dark)',
              padding: '28px 24px',
            }}
          />
        </div>

        <section className="mt-16 w-full text-left">
          <h2 className="mb-4 text-2xl font-bold text-secondary">Your Activity</h2>
          <ActivityTable />
        </section>
      </div>
    </main>
  );
}
