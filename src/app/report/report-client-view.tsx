// app/report/report-client-view.tsx
'use client';

import { useState } from 'react';
import ItemFormModal from '@/components/item_form_modal/item_form_modal';
import ConfirmationModal from '@/components/confirmation_modal/confirmation_modal';
import Button from '@/components/ui/button';
import type {
  Category,
  ItemCondition,
  Location,
  PrimaryColor,
} from '../../generated/prisma/browser';

type Props = {
  categories: Category[];
  locations: Location[];
  conditions: ItemCondition[];
  colors: PrimaryColor[];
};

export default function ReportClientView({ categories, locations, colors, conditions }: Props) {
  // 1. Controls opening/closing ItemFormModal
  const [formModalMode, setFormModalMode] = useState<'lost' | null>(null);

  // 2. Controls opening/closing ConfirmationModal + holds data
  const [confirmationData, setConfirmationData] = useState<{
    mode: 'lost' | 'found';
    itemTitle: string;
  } | null>(null);

  function handleFormSuccess(submittedTitle: string) {
    if (!formModalMode) return;

    // Set confirmation data to trigger the success modal
    setConfirmationData({
      mode: formModalMode,
      itemTitle: submittedTitle,
    });

    // Close form modal
    setFormModalMode(null);
  }

  function handleOpenForm() {
    // Ensures any previous confirmation data is cleared before opening the form
    setConfirmationData(null);
    setFormModalMode('lost');
  }

  return (
    <main className="flex flex-1 flex-col items-center justify-center bg-[var(--surface)] p-4 sm:p-6">
      <div className="mb-8 mt-8 w-full max-w-3xl space-y-3 text-center sm:mb-10 sm:mt-20">
        <h1 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">
          Report a lost item
        </h1>
        <p className="text-lg text-slate-600 max-w-xl mx-auto">
          Submit details about something you misplaced so it can be matched if it is found on
          campus.
        </p>
      </div>

      <div className="flex w-full max-w-3xl justify-center">
        {/* Report Lost Item CTA */}
        <Button
          variant="unstyled"
          type="button"
          onClick={handleOpenForm}
          className="report-action group relative flex w-full max-w-xl flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-sm transition-all duration-200 hover:border-amber-500/50 hover:shadow-md sm:p-8"
        >
          <div className="h-16 w-16 rounded-full bg-amber-50 flex items-center justify-center mb-4 text-amber-600 group-hover:scale-105 transition-transform duration-200">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-[var(--text-muted)] transition-colors">
            I Lost an Item
          </h2>
          <p className="mt-2 text-sm text-[var(--text-muted)]">
            Submit details about something you misplaced so we can help match it when found.
          </p>
        </Button>
      </div>

      {/* 1. INPUT FORM MODAL */}
      <ItemFormModal
        mode={formModalMode ?? 'lost'}
        categories={categories}
        locations={locations}
        colors={colors}
        conditions={conditions}
        open={formModalMode !== null}
        onClose={() => setFormModalMode(null)}
        onSuccess={handleFormSuccess}
      />

      {/* 2. CONFIRMATION MODAL */}
      <ConfirmationModal
        open={confirmationData !== null}
        mode={confirmationData?.mode ?? 'lost'}
        itemTitle={confirmationData?.itemTitle ?? ''}
        onClose={() => setConfirmationData(null)}
      />
    </main>
  );
}
