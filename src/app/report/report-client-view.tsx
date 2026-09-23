// app/report/report-client-view.tsx
'use client';

import { useState } from 'react';
import ItemFormModal from '@/components/item_form_modal/item_form_modal';
import ConfirmationModal from '@/components/confirmation_modal/confirmation_modal';
import type { Category, Location } from '../../generated/prisma/browser';

type Props = {
  categories: Category[];
  locations: Location[];
};

export default function ReportClientView({ categories, locations }: Props) {
  // 1. Controls opening/closing ItemFormModal
  const [formModalMode, setFormModalMode] = useState<'lost' | 'found' | null>(null);

  // 2. Controls opening/closing ConfirmationModal + holds data
  const [confirmationData, setConfirmationData] = useState<{
    mode: 'lost' | 'found';
    itemTitle: string;
  } | null>(null);

  function handleFormSuccess(submittedTitle: string) {
    if (!formModalMode) return;

    // Capture submitted data for the confirmation modal
    setConfirmationData({
      mode: formModalMode,
      itemTitle: submittedTitle,
    });

    // Close the form modal
    setFormModalMode(null);
  }

  return (
    <main className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center p-6 bg-slate-50">
      <div className="max-w-3xl w-full text-center space-y-3 mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          What would you like to report?
        </h1>
        <p className="text-base text-slate-600 max-w-xl mx-auto">
          Select an option below to submit a lost item report or turn in something you've found on campus.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl w-full">
        {/* Report Lost Item CTA */}
        <button
          type="button"
          onClick={() => setFormModalMode('lost')}
          className="group relative flex flex-col items-center justify-center p-8 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md hover:border-amber-500/50 transition-all duration-200 text-center"
        >
          <div className="h-16 w-16 rounded-full bg-amber-50 flex items-center justify-center mb-4 text-amber-600 group-hover:scale-105 transition-transform duration-200">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-slate-900 group-hover:text-amber-600 transition-colors">
            I Lost an Item
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Submit details about something you misplaced so we can help match it when found.
          </p>
        </button>

        {/* Report Found Item CTA */}
        <button
          type="button"
          onClick={() => setFormModalMode('found')}
          className="group relative flex flex-col items-center justify-center p-8 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md hover:border-emerald-500/50 transition-all duration-200 text-center"
        >
          <div className="h-16 w-16 rounded-full bg-emerald-50 flex items-center justify-center mb-4 text-emerald-600 group-hover:scale-105 transition-transform duration-200">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-slate-900 group-hover:text-emerald-600 transition-colors">
            I Found an Item
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Log an item you discovered to assist in returning it safely to its owner.
          </p>
        </button>
      </div>

      {/* 1. INPUT FORM MODAL */}
      <ItemFormModal
        mode={formModalMode ?? 'lost'}
        categories={categories}
        locations={locations}
        open={formModalMode !== null}
        onClose={() => setFormModalMode(null)}
        onSuccess={handleFormSuccess}
      />

      {/* 2. CONFIRMATION MODAL PLUGGED IN HERE */}
      <ConfirmationModal
        open={confirmationData !== null}
        mode={confirmationData?.mode ?? 'lost'}
        itemTitle={confirmationData?.itemTitle ?? ''}
        onClose={() => setConfirmationData(null)}
      />
    </main>
  );
}