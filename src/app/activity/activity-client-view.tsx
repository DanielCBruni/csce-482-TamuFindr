'use client';

import { useState } from 'react';
import ItemModal, { type ItemModalData } from '@/components/item_modal/item_modal';
import Button from '@/components/ui/button';

const statusPillClasses: Record<ItemModalData['status'], string> = {
  open: 'border-slate-200 bg-white text-slate-700',
  'possible-match': 'border-emerald-200 bg-emerald-100 text-emerald-800',
  resolved: 'status-neutral',
  cancelled: 'status-neutral',
  'claim-under-review': 'border-slate-200 bg-white text-slate-700',
  reported: 'border-slate-200 bg-white text-slate-700',
};

export default function ActivityClientView({ activityItems }: { activityItems: ItemModalData[] }) {
  const [selectedItem, setSelectedItem] = useState<ItemModalData | null>(null);

  const alertItem = activityItems.find((item) => item.status === 'possible-match');
  const activeItems = activityItems.filter(
    (item) => item.status === 'open' || item.status === 'possible-match',
  );
  const inactiveItems = activityItems.filter(
    (item) => item.status === 'resolved' || item.status === 'cancelled',
  );

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-12 md:py-16">
      <div className="mb-8 w-full text-left">
        <h1 className="pb-6 text-4xl font-bold text-primary md:text-5xl">My Activity</h1>

        {alertItem && (
          <aside className="mb-8 flex flex-col justify-between gap-4 rounded-2xl border border-sky-200 bg-sky-50 p-4 sm:p-5 md:flex-row md:items-center">
            <div className="flex min-w-0 flex-1 items-start gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-100 text-base font-bold text-[#2f67c7]">
                ◔
              </div>
              <div>
                <p className="text-base font-bold leading-6 text-primary">
                  Possible match found for &quot;{alertItem.title}&quot;
                </p>
                <p className="mt-1 text-sm leading-5 text-slate-600">
                  A suggested match does not confirm ownership. Review the item details and compare
                  them with your report.
                </p>
              </div>
            </div>
            <Button
              variant="unstyled"
              type="button"
              onClick={() => setSelectedItem(alertItem)}
              className="w-full min-w-35 rounded-xl border border-[#2d7ff9] bg-[#2d7ff9] px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-[#246de0] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary md:w-auto"
            >
              Review Item
            </Button>
          </aside>
        )}

        <section className="mb-7">
          <p className="mb-2 font-semibold uppercase tracking-wider text-accent">
            Active Lost Reports
          </p>
          <div className="activity-panel overflow-hidden rounded-2xl border border-slate-200 bg-white">
            {activeItems.length === 0 && (
              <p className="p-5 text-sm text-slate-600">No active lost reports.</p>
            )}
            {activeItems.map((item, index) => (
              <Button
                variant="unstyled"
                key={item.itemId}
                type="button"
                onClick={() => setSelectedItem(item)}
                className={`activity-row flex w-full flex-col items-start justify-between gap-3 bg-[var(--surface-raised)] px-4 py-4 text-left transition-colors hover:bg-[var(--surface-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:flex-row sm:items-center sm:gap-4 sm:px-5 sm:py-5 ${
                  index < activeItems.length - 1 ? 'border-b border-slate-200' : ''
                }`}
              >
                <div className="min-w-0">
                  <h3 className="text-lg font-bold text-primary">{item.title}</h3>
                  <p className="mt-2 text-sm leading-5 text-slate-600">
                    {item.reportedDate} · {item.itemId}
                  </p>
                </div>
                <span
                  className={`inline-flex max-w-full items-center justify-center rounded-full border px-3 py-2 text-xs font-bold sm:min-w-32.5 ${statusPillClasses[item.status]}`}
                >
                  {item.statusLabel}
                </span>
              </Button>
            ))}
          </div>
        </section>

        <section className="mb-7">
          <p className="mb-2 font-semibold uppercase tracking-wider text-accent">
            Inactive Lost Reports
          </p>
          <div className="activity-panel overflow-hidden rounded-2xl border border-slate-200 bg-white">
            {inactiveItems.length === 0 && (
              <p className="p-5 text-sm text-slate-600">No inactive lost reports.</p>
            )}
            {inactiveItems.map((item, index) => (
              <Button
                variant="unstyled"
                key={item.itemId}
                type="button"
                onClick={() => setSelectedItem(item)}
                className={`activity-row flex w-full flex-col items-start justify-between gap-3 bg-[var(--surface-raised)] px-4 py-4 text-left transition-colors hover:bg-[var(--surface-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:flex-row sm:items-center sm:gap-4 sm:px-5 sm:py-5 ${
                  index < inactiveItems.length - 1 ? 'border-b border-slate-200' : ''
                }`}
              >
                <div className="min-w-0">
                  <h3 className="text-lg font-bold text-primary">{item.title}</h3>
                  <p className="mt-2 text-sm leading-5 text-slate-600">
                    {item.reportedDate} · {item.itemId}
                  </p>
                </div>
                <span
                  className={`inline-flex max-w-full items-center justify-center rounded-full border px-3 py-2 text-xs font-bold sm:min-w-32.5 ${statusPillClasses[item.status]}`}
                >
                  {item.statusLabel}
                </span>
              </Button>
            ))}
          </div>
        </section>
      </div>

      {selectedItem && (
        <ItemModal
          isOpen={true}
          item={selectedItem}
          mode="activity"
          onClose={() => setSelectedItem(null)}
        />
      )}
    </main>
  );
}
