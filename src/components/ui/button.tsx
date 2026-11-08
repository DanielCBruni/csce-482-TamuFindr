'use client';

import type { ComponentPropsWithRef } from 'react';

type ButtonProps = ComponentPropsWithRef<'button'> & {
  buttonName?: string;
  variant?: 'default' | 'secondary' | 'icon' | 'menu' | 'unstyled';
};

export default function Button({
  buttonName,
  children,
  variant = 'default',
  className = '',
  style,
  ...props
}: ButtonProps) {
  const variantClass =
    variant === 'default'
      ? 'inline-flex min-h-11 items-center justify-center rounded-xl border border-[var(--button-primary)] bg-[var(--button-primary)] px-5 py-2.5 font-semibold text-[var(--button-primary-text)] shadow-sm transition-all hover:-translate-y-px hover:bg-[var(--button-primary-hover)] hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus-ring)]'
      : variant === 'secondary'
        ? 'inline-flex min-h-11 items-center justify-center rounded-xl border border-primary-muted/30 bg-[var(--surface-raised)] px-4 py-2.5 font-semibold text-[var(--text-primary)] shadow-sm transition-all hover:-translate-y-px hover:bg-[var(--surface-hover)] hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus-ring)]'
        : '';

  return (
    <button
      {...props}
      className={`${variantClass} cursor-pointer disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      style={{
        ...(variant === 'icon' || variant === 'menu'
          ? {
              backgroundColor: 'transparent',
              border: 0,
              color: 'inherit',
              padding: variant === 'icon' ? '8px' : '8px 16px',
            }
          : {}),
        ...style,
      }}
    >
      {children ?? buttonName}
    </button>
  );
}
