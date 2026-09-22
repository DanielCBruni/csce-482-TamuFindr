'use client';

import type { ButtonHTMLAttributes } from 'react';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  buttonName: string;
};

export default function Button({ buttonName, style, ...props }: ButtonProps) {
  return (
    <button
      {...props}
      style={{
        backgroundColor: 'var(--color-primary-muted)',
        border: '1px solid var(--color-accent)',
        borderRadius: '4px',
        color: 'var(--color-secondary)',
        cursor: 'pointer',
        padding: '8px 16px',
        ...style,
      }}
    >
      {buttonName}
    </button>
  );
}
