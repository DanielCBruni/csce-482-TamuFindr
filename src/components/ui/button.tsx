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
  style,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      style={{
        ...(variant === 'default'
          ? {
              backgroundColor: 'var(--color-primary-muted)',
              border: '1px solid var(--color-accent)',
              borderRadius: '4px',
              color: 'var(--color-secondary)',
              cursor: 'pointer',
              padding: '8px 16px',
            }
          : {
              backgroundColor: 'transparent',
              border: 0,
              color: 'inherit',
              cursor: 'pointer',
              padding: variant === 'icon' ? '8px' : '8px 16px',
            }),
        ...style,
      }}
    >
      {children ?? buttonName}
    </button>
  );
}
