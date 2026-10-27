import type { ComponentProps } from 'react';

export function Table({ className = '', ...props }: ComponentProps<'table'>) {
  return (
    <div className="ui-table w-full overflow-x-auto rounded-lg border border-[var(--surface-border)] bg-[var(--surface-raised)] shadow-sm">
      <table {...props} className={`w-full min-w-[720px] border-collapse text-left ${className}`} />
    </div>
  );
}

export function TableCaption({ className = '', ...props }: ComponentProps<'caption'>) {
  return <caption {...props} className={`sr-only ${className}`} />;
}

export function TableHeader({ className = '', ...props }: ComponentProps<'thead'>) {
  return (
    <thead
      {...props}
      className={`bg-[var(--surface-subtle)] text-xs uppercase tracking-wider text-[var(--text-muted)] ${className}`}
    />
  );
}

export function TableBody({ className = '', ...props }: ComponentProps<'tbody'>) {
  return (
    <tbody
      {...props}
      className={`divide-y divide-[var(--surface-border)] text-sm text-[var(--text-primary)] [&>tr]:transition [&>tr:hover]:bg-[var(--surface-hover)] ${className}`}
    />
  );
}

export function TableRow({ className = '', ...props }: ComponentProps<'tr'>) {
  return <tr {...props} className={className} />;
}

export function TableHead({ className = '', ...props }: ComponentProps<'th'>) {
  return <th scope="col" {...props} className={`px-5 py-4 font-semibold ${className}`} />;
}

export function TableCell({ className = '', ...props }: ComponentProps<'td'>) {
  return <td {...props} className={`px-5 py-4 ${className}`} />;
}
