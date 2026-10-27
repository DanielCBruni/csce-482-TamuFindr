import type { ComponentProps } from 'react';

export default function Input({ className = '', ...props }: ComponentProps<'input'>) {
  return (
    <input
      {...props}
      className={`rounded border border-[var(--surface-border)] bg-[var(--surface-raised)] px-3 py-2 text-[var(--text-primary)] focus-visible:outline-2 focus-visible:outline-[var(--focus-ring)] ${className}`}
    />
  );
}
