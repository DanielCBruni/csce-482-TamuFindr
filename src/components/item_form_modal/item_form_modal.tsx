'use client';

import { useState } from 'react';
import type { ItemFormData } from '@/types/item';
import type { Category } from '@/types/category';
import type { Location } from '@/types/location';
import Button from '@/components/button/button';

type ItemFormModalProps = {
  mode: 'lost' | 'found';
  categories: Category[];
  locations: Location[];
  open: boolean;
  onClose: () => void;
  onSubmit: (item: ItemFormData) => void;
};

export default function ItemFormModal({
  mode,
  categories,
  locations,
  open,
  onClose,
  onSubmit,
}: ItemFormModalProps) {
  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [description, setDescription] = useState('');
  const [locationId, setLocationId] = useState('');
  const [locationAdditional, setLocationAdditional] = useState('');
  const [incidentDate, setIncidentDate] = useState('');

  if (!open) return null;

  function resetForm() {
    setTitle('');
    setCategoryId('');
    setDescription('');
    setLocationId('');
    setLocationAdditional('');
    setIncidentDate('');
  }

  function handleClose() {
    resetForm();
    onClose();
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const item: ItemFormData = {
      type: mode === 'lost' ? 'LOST' : 'FOUND',
      title,
      categoryId,
      description,
      locationId,
      locationAdditional,
      incidentDate,
    };

    onSubmit(item);
    resetForm();
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
        <h2 className="mb-1 text-2xl font-bold text-primary">
          Report {isLost ? 'Lost' : 'Found'} Item
        </h2>

        <p className="mb-6 text-sm text-gray-600">
          Enter the details of the {isLost ? 'lost' : 'found'} item.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="mb-1 block text-sm font-medium">Item Title</label>

            <input
              type="text"
              placeholder="Blue Owala Water Bottle"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              required
              className="w-full rounded border border-gray-300 px-3 py-2 outline-none focus:border-accent"
            />
          </div>

          {/* Category */}
          <div>
            <label className="mb-1 block text-sm font-medium">Category</label>

            <select
              value={categoryId}
              onChange={(event) => setCategoryId(event.target.value)}
              required
              className="w-full rounded border border-gray-300 px-3 py-2 outline-none focus:border-accent"
            >
              <option value="">Select a category</option>

              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="mb-1 block text-sm font-medium">Description</label>

            <textarea
              placeholder="Color, brand, identifying details, etc."
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={4}
              className="w-full resize-none rounded border border-gray-300 px-3 py-2 outline-none focus:border-accent"
            />
          </div>

          {/* Location */}
          <div>
            <label className="mb-1 block text-sm font-medium">
              {isLost ? 'Last Seen Location' : 'Found Location'}
            </label>

            <select
              value={locationId}
              onChange={(event) => setLocationId(event.target.value)}
              required
              className="w-full rounded border border-gray-300 px-3 py-2 outline-none focus:border-accent"
            >
              <option value="">Select a location</option>

              {locations.map((location) => (
                <option key={location.id} value={location.id}>
                  {location.name}
                </option>
              ))}
            </select>
          </div>

          {/* Additional Location Details */}
          <div>
            <label className="mb-1 block text-sm font-medium">Additional Location Details</label>

            <input
              type="text"
              placeholder="Room 350, men's bathroom, front entrance, etc."
              value={locationAdditional}
              onChange={(event) => setLocationAdditional(event.target.value)}
              className="w-full rounded border border-gray-300 px-3 py-2 outline-none focus:border-accent"
            />
          </div>

          {/* Incident Date */}
          <div>
            <label className="mb-1 block text-sm font-medium">
              Date {isLost ? 'Lost' : 'Found'}
            </label>

            <input
              type="date"
              value={incidentDate}
              onChange={(event) => setIncidentDate(event.target.value)}
              required
              className="w-full rounded border border-gray-300 px-3 py-2 outline-none focus:border-accent"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-2">
            <Button buttonName="Cancel" type="button" onClick={handleClose} />

            <Button buttonName={`Report ${isLost ? 'Lost' : 'Found'} Item`} type="submit" />
          </div>
        </form>
      </div>
    </div>
  );
}
