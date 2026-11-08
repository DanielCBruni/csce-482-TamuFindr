'use client';

import { useState } from 'react';
import Image from 'next/image';
import Button from '@/components/ui/button';
import { createItemReport } from '../../actions/report-action';
import type { Category, Location } from '../../generated/prisma/browser';
import type { PrimaryColor, ItemCondition } from '../../generated/prisma/browser';

type ItemFormModalProps = {
  mode: 'lost' | 'found';
  categories: Category[];
  locations: Location[];
  colors: PrimaryColor[];
  conditions: ItemCondition[];
  open: boolean;
  onClose: () => void;
  onSuccess: (submittedTitle: string) => void;
};

export default function ItemFormModal({
  mode,
  categories,
  locations,
  colors,
  conditions,
  open,
  onClose,
  onSuccess,
}: ItemFormModalProps) {
  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [description, setDescription] = useState('');
  const [primaryColor, setPrimaryColor] = useState<PrimaryColor | ''>('');
  const [secondaryColor, setSecondaryColor] = useState<PrimaryColor | ''>('');
  const [brand, setBrand] = useState('');
  const [condition, setCondition] = useState<ItemCondition | ''>('');
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
    setPrimaryColor('');
    setSecondaryColor('');
    setBrand('');
    setCondition('');
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
    if (!primaryColor.trim()) {
      setError('Please provide at least a primary color.');
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
    if (!condition.trim()) {
      setError('Please provide the item\`s last known condition.');
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
      primaryColor: primaryColor as PrimaryColor,
      secondaryColor: secondaryColor || null,
      brand: brand.trim() ? brand.trim().toLowerCase() : null,
      itemCondition: condition as ItemCondition,
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#10182880] p-2 backdrop-blur-[3px] sm:p-4"
      onClick={handleDismiss}
    >
      <div
        className="max-h-[calc(100dvh-16px)] w-full max-w-[860px] overflow-hidden rounded-[20px] border border-[var(--surface-border)] bg-[var(--surface-raised)] text-[var(--text-primary)] shadow-[0_24px_80px_rgba(16,24,40,0.28)] sm:max-h-[calc(100dvh-32px)]"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <header className="flex items-center justify-between gap-3 border-b border-[var(--surface-border)] px-4 py-3 sm:gap-5 sm:px-6 sm:py-4">
          <div>
            <p className="m-0 text-[12px] font-bold uppercase tracking-[0.1em] text-accent">
              {isLost ? 'Report lost item' : 'Report found item'}
            </p>
            <h2
              className="mt-0 text-2xl font-bold text-[var(--text-primary)] sm:text-[30px]"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              Item Details
            </h2>
          </div>
          <Button
            variant="unstyled"
            type="button"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[var(--surface-border)] bg-[var(--surface-subtle)] text-[26px] text-[var(--text-muted)] transition-colors hover:bg-[var(--surface-hover)] focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-[var(--focus-ring)]"
            aria-label="Close report form"
            onClick={handleDismiss}
          >
            x
          </Button>
        </header>

        <form
          onSubmit={handleSubmit}
          className="flex max-h-[calc(100dvh-88px)] flex-col overflow-y-auto sm:max-h-[calc(100dvh-120px)]"
        >
          <div className="grid gap-4 p-4 sm:gap-5 sm:p-5 md:grid-cols-[0.7fr_1.3fr]">
            <div className="flex flex-col items-center justify-center">
              <div className="w-full max-w-[260px] overflow-hidden rounded-[14px] border border-slate-200 bg-[var(--surface-subtle)]">
                {photoPreview ? (
                  <Image
                    src={photoPreview}
                    alt="Selected item preview"
                    width={260}
                    height={347}
                    unoptimized
                    className="aspect-[3/4] w-full object-cover"
                  />
                ) : (
                  <div className="flex aspect-[3/4] w-full flex-col items-center justify-center gap-3 text-[var(--text-primary)]">
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
                  className="block w-full cursor-pointer rounded-xl border border-slate-300 bg-[var(--surface-subtle)] px-3 py-2.5 text-sm text-primary-muted file:mr-3 file:rounded-md file:border-0 file:bg-primary file:px-3 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:brightness-110 focus:outline-none focus:ring-4 focus:ring-blue-100"
                />
              </div>
            </div>

            <section className="flex min-w-0 flex-col gap-3">
              {error && (
                <div className="rounded-xl border border-[var(--danger-border)] bg-[var(--danger-surface)] px-3 py-3 text-sm text-[var(--danger-text)]">
                  {error}
                </div>
              )}

              <div className="flex flex-col gap-2">
                <label
                  htmlFor="item-title"
                  className="text-sm font-bold text-[var(--text-primary)]"
                >
                  Item title
                </label>
                <input
                  id="item-title"
                  type="text"
                  placeholder="Blue Owala Water Bottle"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-3 text-base text-primary-muted placeholder:text-primary-muted focus:border-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-100"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="item-category"
                    className="text-sm font-bold text-[var(--text-primary)]"
                  >
                    Category
                  </label>
                  <select
                    id="item-category"
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-3 text-base text-primary-muted focus:border-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-100"
                  >
                    <option value="" className="text-primary-muted">
                      Select category
                    </option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id} className="text-primary-muted">
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="item-date"
                    className="text-sm font-bold text-[var(--text-primary)]"
                  >
                    Date {isLost ? 'lost' : 'found'}
                  </label>
                  <input
                    id="item-date"
                    type="date"
                    value={incidentDate}
                    onChange={(e) => setIncidentDate(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-3 text-base text-primary-muted focus:border-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-100"
                  />
                </div>
              </div>

              {/* Brand & Item Condition */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="item-brand"
                    className="text-sm font-bold text-[var(--text-primary)]"
                  >
                    Brand
                  </label>
                  <input
                    id="item-brand"
                    type="text"
                    placeholder="Apple, Nike, Owala..."
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-3 text-base text-primary-muted placeholder:text-primary-muted focus:border-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-100"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="item-condition"
                    className="text-sm font-bold text-[var(--text-primary)]"
                  >
                    Condition
                  </label>
                  <select
                    id="item-condition"
                    value={condition}
                    onChange={(e) => setCondition(e.target.value as ItemCondition)}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-3 text-base text-primary-muted focus:border-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-100"
                  >
                    <option value="" className="text-primary-muted">
                      Select condition
                    </option>
                    {conditions.map((cond) => (
                      <option key={cond} value={cond} className="text-primary-muted">
                        {cond}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Primary & Secondary Color */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="primary-color"
                    className="text-sm font-bold text-[var(--text-primary)]"
                  >
                    Primary Color
                  </label>
                  <select
                    id="primary-color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value as PrimaryColor)}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-3 text-base text-primary-muted focus:border-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-100"
                  >
                    <option value="" className="text-primary-muted">
                      Select primary color
                    </option>
                    {colors.map((color) => (
                      <option key={color} value={color} className="text-primary-muted">
                        {color}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="secondary-color"
                    className="text-sm font-bold text-[var(--text-primary)]"
                  >
                    Secondary Color
                  </label>
                  <select
                    id="secondary-color"
                    value={secondaryColor}
                    onChange={(e) => setSecondaryColor(e.target.value as PrimaryColor)}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-3 text-base text-primary-muted focus:border-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-100"
                  >
                    <option value="" className="text-primary-muted">
                      Select secondary color
                    </option>
                    {colors.map((color) => (
                      <option key={color} value={color} className="text-primary-muted">
                        {color}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label
                  htmlFor="item-description"
                  className="text-sm font-bold text-[var(--text-primary)]"
                >
                  Description
                </label>
                <textarea
                  id="item-description"
                  placeholder="Any other identifying details"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="min-h-[90px] w-full resize-y rounded-xl border border-slate-300 bg-white px-3.5 py-3 text-base text-primary-muted placeholder:text-primary-muted focus:border-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-100"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label
                  htmlFor="item-location"
                  className="text-sm font-bold text-[var(--text-primary)]"
                >
                  {isLost ? 'Last seen location' : 'Found location'}
                </label>
                <select
                  id="item-location"
                  value={locationId}
                  onChange={(e) => setLocationId(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-3 text-base text-primary-muted focus:border-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-100"
                >
                  <option value="" className="text-primary-muted">
                    Select a location
                  </option>
                  {locations.map((loc) => (
                    <option key={loc.id} value={loc.id} className="text-primary-muted">
                      {loc.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label
                  htmlFor="location-additional"
                  className="text-sm font-bold text-[var(--text-primary)]"
                >
                  Additional location details
                </label>
                <input
                  id="location-additional"
                  type="text"
                  placeholder="Room 350, men's bathroom, etc."
                  value={locationAdditional}
                  onChange={(e) => setLocationAdditional(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-3 text-base text-primary-muted placeholder:text-primary-muted focus:border-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-100"
                />
              </div>
            </section>
          </div>

          <footer className="flex flex-col gap-3 border-t border-slate-200 px-4 pb-4 pt-3 sm:flex-row sm:justify-end sm:px-6 sm:pb-5 sm:pt-4">
            <Button variant="secondary" type="button" onClick={handleDismiss} buttonName="Cancel" />
            <Button
              type="submit"
              disabled={isSubmitting}
              buttonName={
                isSubmitting ? 'Submitting...' : `Report ${isLost ? 'Lost' : 'Found'} Item`
              }
            />
          </footer>
        </form>
      </div>
    </div>
  );
}
