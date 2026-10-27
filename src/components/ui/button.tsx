'use client';

import type { ComponentPropsWithRef } from 'react';

type ButtonProps = ComponentPropsWithRef<'button'> & {
  buttonName?: string;
  variant?: 'default' | 'icon' | 'menu';
};

export default function Button({
  buttonName,
  children,
  variant = 'default',
  className = '',
  style,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      className={`${variant === 'default' ? 'ui-button rounded-md border border-[var(--surface-border)] bg-[var(--surface-raised)] px-3 py-1.5 font-semibold text-[var(--text-primary)] transition-colors hover:bg-[var(--surface-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus-ring)]' : ''} cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      style={{
        ...(variant === 'default'
          ? {}
          : {
              backgroundColor: 'transparent',
              border: 0,
              color: 'inherit',
              padding: variant === 'icon' ? '8px' : '8px 16px',
            }),
        ...style,
      }}
    >
      {children ?? buttonName}
    </button>
  );
}
