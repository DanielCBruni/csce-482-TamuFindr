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
    setError(null);
  }

  function handleClose() {
    resetForm();
    const submittedTitle = title;
    onSuccess(submittedTitle);
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

  async function handleSubmit(event: React.SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    // Call Server Action
    const result = await createItemReport({
      /* TODO: This is hardcoded as of now, need to dynamically fetch user's id from session */
      userId: 'sample-user-id',
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

    handleClose();
  }

  const isLost = mode === 'lost';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={handleClose}
    >
      <div
        className="w-full max-w-lg rounded-lg bg-white p-6 shadow-lg"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <h2 className="mb-1 text-2xl font-bold text-slate-900">
          Report {isLost ? 'Lost' : 'Found'} Item
        </h2>
        <p className="mb-4 text-sm text-slate-600">
          Enter the details of the {isLost ? 'lost' : 'found'} item.
        </p>

        {/* Local Validation Banner */}
        {error && (
          <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700 border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Item Title</label>
            <input
              type="text"
              placeholder="Blue Owala Water Bottle"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded border border-gray-300 px-3 py-2 outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Category</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full rounded border border-gray-300 px-3 py-2 outline-none focus:border-amber-500"
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Description</label>
            <textarea
              placeholder="Color, brand, identifying details, etc."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full resize-none rounded border border-gray-300 px-3 py-2 outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              {isLost ? 'Last Seen Location' : 'Found Location'}
            </label>
            <select
              value={locationId}
              onChange={(e) => setLocationId(e.target.value)}
              className="w-full rounded border border-gray-300 px-3 py-2 outline-none focus:border-amber-500"
            >
              <option value="">Select a location</option>
              {locations.map((loc) => (
                <option key={loc.id} value={loc.id}>
                  {loc.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Additional Location Details</label>
            <input
              type="text"
              placeholder="Room 350, men's bathroom, etc."
              value={locationAdditional}
              onChange={(e) => setLocationAdditional(e.target.value)}
              className="w-full rounded border border-gray-300 px-3 py-2 outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Date {isLost ? 'Lost' : 'Found'}
            </label>
            <input
              type="date"
              value={incidentDate}
              onChange={(e) => setIncidentDate(e.target.value)}
              className="w-full rounded border border-gray-300 px-3 py-2 outline-none focus:border-amber-500"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button buttonName="Cancel" type="button" onClick={handleClose} />
            <Button
              buttonName={isSubmitting ? 'Submitting...' : `Report ${isLost ? 'Lost' : 'Found'} Item`}
              type="submit"
            />
          </div>
        </form>
      </div>
    </div>
  );
}