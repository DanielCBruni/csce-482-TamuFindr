'use client';

import { useState } from 'react';
import Link from 'next/link';
import PotentialMatchesModal, {
  type PotentialMatchReport,
} from '@/components/potential_matches_modal/potential_matches_modal';

export default function PotentialMatchesClientView({
  reports,
}: {
  reports: PotentialMatchReport[];
}) {
  const [selectedReport, setSelectedReport] = useState<PotentialMatchReport | null>(null);
  return (
    <main className="mx-auto min-h-[70vh] w-full max-w-5xl px-4 py-12 text-[var(--text-primary)] md:px-6 md:py-16">
      <div className="mb-6 w-full text-left">
        <h1 className="text-4xl font-bold text-primary md:text-5xl">Potential Matches</h1>
      </div>
      <p className="mb-8 text-[var(--text-muted)]">
        Explore up to five suggested found items for each open lost report. A similarity score is
        not proof of ownership.
      </p>
      {reports.length === 0 ? (
        <section className="rounded-2xl border border-[var(--surface-border)] bg-[var(--surface-raised)] p-8">
          <h2 className="text-xl font-semibold">No open lost reports</h2>
          <p className="mt-2 mb-4">
            Potential matches will appear when open lost reports are available.
          </p>
          <Link href="/report" className="font-semibold underline">
            Report a lost item
          </Link>
        </section>
      ) : (
        <ul className="space-y-4">
          {reports.map((report) => (
            <li
              key={report.id}
              className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[var(--surface-border)] bg-[var(--surface-raised)] p-6"
            >
              <div>
                <h2 className="text-xl font-semibold">{report.title}</h2>
                <p className="mt-1 text-sm text-[var(--text-muted)]">
                  Reported {report.reportedDate}
                </p>
                <p className="mt-2 text-sm">
                  {report.matches.length
                    ? `${report.matches.length} potential ${report.matches.length === 1 ? 'match' : 'matches'} available`
                    : 'No potential matches yet'}
                </p>
              </div>
              <button
                type="button"
                aria-haspopup="dialog"
                disabled={!report.matches.length}
                onClick={() => setSelectedReport(report)}
                className="rounded-xl bg-primary px-5 py-3 font-semibold text-white hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                View Matches
              </button>
            </li>
          ))}
        </ul>
      )}
      {selectedReport && (
        <PotentialMatchesModal report={selectedReport} onClose={() => setSelectedReport(null)} />
      )}
    </main>
  );
}
