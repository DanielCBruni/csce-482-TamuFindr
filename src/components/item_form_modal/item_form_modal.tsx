'use client';

import { useState } from 'react';
import Button from '@/components/button/button';
import { createItemReport } from '../../actions/report-action';
import type { Category, Location } from '../../generated/prisma/browser';

type ItemFormModalProps = {
  mode: 'lost' | 'found';
  categories: Category[];
  locations: Location[];
  open: boolean;
  onClose: () => void;
  onSuccess: (submittedTitle: string) => void;
};

export default function ItemFormModal({
  mode,
  categories,
  locations,
  open,
  onClose,
  onSuccess,
}: ItemFormModalProps) {
  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [description, setDescription] = useState('');
  const [locationId, setLocationId] = useState('');
  const [locationAdditional, setLocationAdditional] = useState('');
  const [incidentDate, setIncidentDate] = useState('');
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  // Validation and Status States
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!open) return null;

  function resetForm() {
    setTitle('');
    setCategoryId('');
    setDescription('');
    setLocationId('');
    setLocationAdditional('');
    setIncidentDate('');
    setPhotoPreview(null);
    setError(null);
  }

  // Pure dismiss handler (Cancel button, backdrop click)
  function handleDismiss() {
    resetForm();
    onClose();
  }

  // Local Client-Side Validation
  function validateForm(): boolean {
    if (!title.trim() || title.trim().length < 3) {
      setError('Title must be at least 3 characters.');
      return false;
    }
    if (!categoryId) {
      setError('Please select a category.');
      return false;
    }
    if (!description.trim()) {
      setError('Please provide a brief description.');
      return false;
    }
    if (!locationId) {
      setError('Please select a location.');
      return false;
    }
    if (!incidentDate) {
      setError('Please select the date.');
      return false;
    }

    const selectedDate = new Date(incidentDate);
    if (selectedDate > new Date()) {
      setError('Incident date cannot be in the future.');
      return false;
    }

    setError(null);
    return true;
  }

  function handlePhotoChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      setPhotoPreview(null);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === 'string' ? reader.result : null;
      setPhotoPreview(result ?? URL.createObjectURL(file));
    };
    reader.readAsDataURL(file);
  }

  async function handleSubmit(event: React.SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    // Call Server Action
    const result = await createItemReport({
      type: mode === 'lost' ? 'LOST' : 'FOUND',
      title,
      categoryId,
      description,
      locationId,
      locationAdditional,
      incidentDate,
    });

    setIsSubmitting(false);

    if (!result.success) {
      setError(result.error || 'Failed to submit report.');
      return;
    }

    const submittedTitle = title;
    resetForm();
    onClose();
    onSuccess(submittedTitle);
  }

  const isLost = mode === 'lost';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#10182880] p-4 backdrop-blur-[3px]"
      onClick={handleDismiss}
    >
      <div
        className="w-full max-w-[860px] max-h-[calc(100vh-32px)] overflow-hidden rounded-[20px] border border-slate-200 bg-white shadow-[0_24px_80px_rgba(16,24,40,0.28)]"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <header className="flex items-center justify-between gap-5 border-b border-slate-200 px-6 py-4">
          <div>
            <p className="m-0 text-[12px] font-bold uppercase tracking-[0.1em] text-slate-500">
              {isLost ? 'Report lost item' : 'Report found item'}
            </p>
            <h2
              className="mt-0 text-[30px] font-bold text-[#101828]"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              Item Details
            </h2>
          </div>
          <button
            type="button"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-[26px] text-slate-600 transition-colors hover:bg-slate-100 focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-blue-600"
            aria-label="Close report form"
            onClick={handleDismiss}
          >
            ×
          </button>
        </header>

        <form
          onSubmit={handleSubmit}
          className="flex max-h-[calc(100vh-120px)] flex-col overflow-y-auto"
        >
          <div className="grid gap-5 p-5 md:grid-cols-[0.7fr_1.3fr]">
            <div className="flex flex-col items-center justify-center">
              <div className="w-full max-w-[260px] overflow-hidden rounded-[14px] border border-slate-200 bg-slate-100">
                {photoPreview ? (
                  <img
                    src={photoPreview}
                    alt="Selected item preview"
                    className="aspect-[3/4] w-full object-cover"
                  />
                ) : (
                  <div className="flex aspect-[3/4] w-full flex-col items-center justify-center gap-3 text-slate-500">
                    <span aria-hidden="true" className="text-[40px]">
                      ▧
                    </span>
                    <p className="text-sm">Photo preview</p>
                  </div>
                )}
              </div>

              <div className="mt-3 w-full max-w-[260px]">
                <label htmlFor="item-photo" className="sr-only">
                  Add photo
                </label>
                <input
                  id="item-photo"
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="block w-full cursor-pointer rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm text-slate-600 file:mr-3 file:rounded-md file:border-0 file:bg-slate-200 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-slate-700 hover:file:bg-slate-300 focus:outline-none focus:ring-4 focus:ring-blue-100"
                />
              </div>
            </div>

            <section className="flex min-w-0 flex-col gap-3">
              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <div className="flex flex-col gap-2">
                <label htmlFor="item-title" className="text-sm font-bold text-[#101828]">
                  Item title
                </label>
                <input
                  id="item-title"
                  type="text"
                  placeholder="Blue Owala Water Bottle"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-3 text-base text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-100"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <label htmlFor="item-category" className="text-sm font-bold text-[#101828]">
                    Category
                  </label>
                  <select
                    id="item-category"
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className={`w-full rounded-xl border border-slate-300 bg-white px-3.5 py-3 text-base focus:border-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-100 ${
                      categoryId ? 'text-slate-900' : 'text-slate-400'
                    }`}
                  >
                    <option value="" className="text-slate-400">
                      Select
                    </option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id} className="text-slate-900">
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="item-date" className="text-sm font-bold text-[#101828]">
                    Date {isLost ? 'lost' : 'found'}
                  </label>
                  <input
                    id="item-date"
                    type="date"
                    value={incidentDate}
                    onChange={(e) => setIncidentDate(e.target.value)}
                    className={`w-full rounded-xl border border-slate-300 bg-white px-3.5 py-3 text-base focus:border-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-100 ${
                      incidentDate ? 'text-slate-900' : 'text-slate-400'
                    }`}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="item-description" className="text-sm font-bold text-[#101828]">
                  Description
                </label>
                <textarea
                  id="item-description"
                  placeholder="Color, brand, identifying details, etc."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="min-h-[90px] w-full resize-y rounded-xl border border-slate-300 bg-white px-3.5 py-3 text-base text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-100"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="item-location" className="text-sm font-bold text-[#101828]">
                  {isLost ? 'Last seen location' : 'Found location'}
                </label>
                <select
                  id="item-location"
                  value={locationId}
                  onChange={(e) => setLocationId(e.target.value)}
                  className={`w-full rounded-xl border border-slate-300 bg-white px-3.5 py-3 text-base focus:border-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-100 ${
                    locationId ? 'text-slate-900' : 'text-slate-400'
                  }`}
                >
                  <option value="" className="text-slate-400">
                    Select a location
                  </option>
                  {locations.map((loc) => (
                    <option key={loc.id} value={loc.id} className="text-slate-900">
                      {loc.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="location-additional" className="text-sm font-bold text-[#101828]">
                  Additional location details
                </label>
                <input
                  id="location-additional"
                  type="text"
                  placeholder="Room 350, men's bathroom, etc."
                  value={locationAdditional}
                  onChange={(e) => setLocationAdditional(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-3 text-base text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-100"
                />
              </div>
            </section>
          </div>

          <footer className="flex flex-wrap justify-end gap-3 border-t border-slate-200 px-6 pb-5 pt-4">
            <Button
              type="button"
              onClick={handleDismiss}
              buttonName="Cancel"
              style={{
                backgroundColor: 'white',
                border: '1px solid #d6d9df',
                borderRadius: '10px',
                color: '#475467',
                fontWeight: 700,
                fontSize: '0.875rem',
                lineHeight: 1.2,
                padding: '10px 15px',
                minHeight: '42px',
                transition: 'background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease',
              }}
              onMouseEnter={(event) => {
                event.currentTarget.style.backgroundColor = '#f3f4f6';
              }}
              onMouseLeave={(event) => {
                event.currentTarget.style.backgroundColor = 'white';
              }}
            />
            <Button
              type="submit"
              disabled={isSubmitting}
              buttonName={
                isSubmitting ? 'Submitting...' : `Report ${isLost ? 'Lost' : 'Found'} Item`
              }
              style={{
                backgroundColor: 'var(--color-primary)',
                border: '1px solid var(--color-primary)',
                borderRadius: '10px',
                color: 'white',
                fontWeight: 700,
                fontSize: '0.875rem',
                lineHeight: 1.2,
                padding: '10px 15px',
                minHeight: '42px',
                transition: 'background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease',
              }}
              onMouseEnter={(event) => {
                event.currentTarget.style.backgroundColor = 'var(--color-accent)';
              }}
              onMouseLeave={(event) => {
                event.currentTarget.style.backgroundColor = 'var(--color-primary)';
              }}
            />
          </footer>
        </form>
      </div>
    </div>
  );
}
