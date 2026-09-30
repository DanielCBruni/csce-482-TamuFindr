'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { claimItem } from '@/actions/claim-item';
import ItemModal, { type ItemModalData } from '@/components/item_modal/item_modal';

const statusPillClasses: Record<ItemModalData['status'], string> = {
  open: 'border-slate-200 bg-white text-slate-700',
  'possible-match': 'border-emerald-200 bg-emerald-100 text-emerald-800',
  resolved: 'border-slate-200 bg-slate-200 text-slate-600',
  cancelled: 'border-slate-200 bg-slate-200 text-slate-600',
  'claim-under-review': 'border-slate-200 bg-white text-slate-700',
  reported: 'border-slate-200 bg-white text-slate-700',
};

export default function ActivityClientView({ activityItems }: { activityItems: ItemModalData[] }) {
  const router = useRouter();
  const claiming = useRef(false);
  const [isPending, setIsPending] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [claimedIds, setClaimedIds] = useState<string[]>([]);
  const [selectedItem, setSelectedItem] = useState<ItemModalData | null>(null);

  const visibleItems = activityItems.filter((item) => !claimedIds.includes(item.itemId));
  const alertItem = visibleItems.find((item) => item.status === 'possible-match');
  const lostItems = visibleItems.filter((item) => item.category === 'Lost item');
  const foundItems = visibleItems.filter((item) => item.category === 'Found item');

  async function handleClaim(item: ItemModalData) {
    if (claiming.current) return;
    claiming.current = true;
    setIsPending(true);
    setActionError(null);
    try {
      const result = await claimItem(item.itemId);
      if (!result.success) {
        setActionError(result.error ?? 'Unable to claim this item.');
        return;
      }
      setClaimedIds((ids) => [...ids, item.itemId]);
      setSelectedItem(null);
      router.refresh();
    } catch {
      setActionError('Unable to claim this item. Please try again.');
    } finally {
      claiming.current = false;
      setIsPending(false);
    }
  }

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-12 md:px-6 md:py-16">
      <div className="mb-8 w-full text-left">
        <h1 className="pb-6 text-4xl font-bold text-primary md:text-5xl">My Activity</h1>

        {alertItem && (
          <aside className="mb-8 flex flex-col items-start justify-between gap-4 rounded-2xl border border-sky-200 bg-sky-50 p-5 md:flex-row md:items-center">
            <div className="flex flex-1 items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-100 text-base font-bold text-[#2f67c7]">
                ◔
              </div>
              <div>
                <p className="text-base font-bold leading-6 text-primary">
                  Possible match found for &quot;{alertItem.title}&quot;
                </p>
                <p className="mt-1 text-sm leading-5 text-slate-600">
                  A suggested match does not confirm ownership. Review the item and submit a claim
                  if it looks right.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setSelectedItem(alertItem)}
              className="min-w-35 rounded-xl border border-[#2d7ff9] bg-[#2d7ff9] px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-[#246de0] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              Review Item
            </button>
          </aside>
        )}

        <section className="mb-7">
          <p className="mb-2 font-semibold uppercase tracking-wider text-accent">Lost Reports</p>
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            {lostItems.length === 0 && (
              <p className="p-5 text-sm text-slate-600">No lost reports yet.</p>
            )}
            {lostItems.map((item, index) => (
              <button
                key={item.itemId}
                type="button"
                onClick={() => setSelectedItem(item)}
                className={`flex w-full items-center justify-between gap-4 bg-white px-5 py-5 text-left transition-colors hover:bg-accent/2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                  index < lostItems.length - 1 ? 'border-b border-slate-200' : ''
                }`}
              >
                <div>
                  <h3 className="text-lg font-bold text-primary">{item.title}</h3>
                  <p className="mt-2 text-sm leading-5 text-slate-600">
                    {item.reportedDate} · {item.itemId}
                  </p>
                </div>
                <span
                  className={`inline-flex min-w-32.5 items-center justify-center rounded-full border px-3 py-2 text-xs font-bold ${statusPillClasses[item.status]}`}
                >
                  {item.statusLabel}
                </span>
              </button>
            ))}
          </div>
        </section>

        <section className="mb-7">
          <p className="mb-2 font-semibold uppercase tracking-wider text-accent">Found Reports</p>
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            {foundItems.length === 0 && (
              <p className="p-5 text-sm text-slate-600">No found reports yet.</p>
            )}
            {foundItems.map((item, index) => (
              <button
                key={item.itemId}
                type="button"
                onClick={() => setSelectedItem(item)}
                className={`flex w-full items-center justify-between gap-4 bg-white px-5 py-5 text-left transition-colors hover:bg-accent/2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                  index < foundItems.length - 1 ? 'border-b border-slate-200' : ''
                }`}
              >
                <div>
                  <h3 className="text-lg font-bold text-primary">{item.title}</h3>
                  <p className="mt-2 text-sm leading-5 text-slate-600">
                    {item.reportedDate} · {item.itemId}
                  </p>
                </div>
                <span
                  className={`inline-flex min-w-32.5 items-center justify-center rounded-full border px-3 py-2 text-xs font-bold ${statusPillClasses[item.status]}`}
                >
                  {item.statusLabel}
                </span>
              </button>
            ))}
          </div>
        </section>
      </div>

      {selectedItem && (
        <ItemModal
          isOpen={true}
          item={{ ...selectedItem, primaryActionLabel: 'Claim Item' }}
          mode="activity"
          onClose={() => {
            if (!claiming.current) {
              setSelectedItem(null);
              setActionError(null);
            }
          }}
          onPrimaryAction={
            selectedItem.status === 'open' || selectedItem.status === 'possible-match'
              ? handleClaim
              : undefined
          }
          isPending={isPending}
          actionError={actionError}
        />
      )}
    </main>
  );
}
