'use client';

import ActivityTable from '../../components/activity_table/activity_table';
import Button from '../../components/button/button';

export default function HomePage() {

  return (
    
    <section className="mx-auto mt-16 w-full max-w-6xl px-6 pb-16 text-left text-primary-dark">
      <h2 className="mb-4 text-2xl font-bold text-primary-dark">Admin Panel</h2>
      <div className="mb-4 grid grid-cols-3 gap-4">
        <Button
          buttonName="[WIP]"
          style={{
            backgroundColor: 'var(--color-secondary)',
            color: 'var(--color-primary-dark)',
          }}
        />
        <Button
          buttonName="[WIP]"
          style={{
            backgroundColor: 'var(--color-secondary)',
            color: 'var(--color-primary-dark)',
          }}
        />
        <Button
          buttonName="[WIP]"
          style={{
            backgroundColor: 'var(--color-secondary)',
            color: 'var(--color-primary-dark)',
          }}
        />
      </div>
      <h2 className="mb-4 text-2xl font-bold text-primary-dark">All Activity</h2>
      <ActivityTable />
    </section>
  )
}