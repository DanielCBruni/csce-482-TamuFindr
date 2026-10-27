import type { ComponentProps } from 'react';

export function Table({ className = '', ...props }: ComponentProps<'table'>) {
  return (
    <div className="overflow-x-auto rounded-lg border border-[var(--surface-border)] bg-[var(--surface-raised)]">
      <table {...props} className={`w-full text-left text-sm ${className}`} />
    </div>
  );
}

export function TableHeader(props: ComponentProps<'thead'>) {
  return <thead {...props} />;
}

export function TableBody(props: ComponentProps<'tbody'>) {
  return <tbody {...props} />;
}

export function TableRow({ className = '', ...props }: ComponentProps<'tr'>) {
  return (
    <tr
      {...props}
      className={`border-b border-[var(--surface-border)] last:border-0 ${className}`}
    />
  );
}

export function TableHead({ className = '', ...props }: ComponentProps<'th'>) {
  return <th scope="col" {...props} className={`px-4 py-3 font-semibold ${className}`} />;
}

export function TableCell({ className = '', ...props }: ComponentProps<'td'>) {
  return <td {...props} className={`px-4 py-3 ${className}`} />;
}
