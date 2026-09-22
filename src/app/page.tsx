'use client';

import { useState } from 'react';
import ItemFormModal from '@/components/item_form_modal/item_form_modal';
import Button from '@/components/button/button';
import type { ItemFormData } from '@/types/item';
import type { Category } from '@/types/category';
import type { Location } from '@/types/location';

const categories: Category[] = [
  { id: '1', name: 'Electronics' },
  { id: '2', name: 'Clothing' },
  { id: '3', name: 'Accessories' },
];

const locations: Location[] = [
  { id: '1', name: 'Library' },
  { id: '2', name: 'Cafeteria' },
  { id: '3', name: 'Gym' },
];

export default function Home() {
  const [itemModal, setItemModal] = useState<'lost' | 'found' | null>(null);

  function handleItemSubmit(item: ItemFormData) {
    console.log(item);

    setItemModal(null);
  }

  return (
    <>
      <Button buttonName="Report Lost Item" onClick={() => setItemModal('lost')} />

      <Button buttonName="Report Found Item" onClick={() => setItemModal('found')} />

      <ItemFormModal
        mode={itemModal ?? 'lost'}
        categories={categories}
        locations={locations}
        open={itemModal !== null}
        onClose={() => setItemModal(null)}
        onSubmit={handleItemSubmit}
      />
    </>
  );
}
