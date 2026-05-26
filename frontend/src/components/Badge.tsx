import clsx from 'clsx';
import type { ReactNode } from 'react';

type Variant = 'default' | 'brand' | 'green' | 'amber' | 'blue' | 'red';

const variants: Record<Variant, string> = {
  default: 'bg-slate-100 text-slate-700 ring-slate-200',
  brand: 'bg-brand-50 text-brand-700 ring-brand-100',
  green: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
  amber: 'bg-amber-50 text-amber-700 ring-amber-100',
  blue: 'bg-blue-50 text-blue-700 ring-blue-100',
  red: 'bg-red-50 text-red-700 ring-red-100',
};

export function Badge({
  children,
  variant = 'default',
}: {
  children: ReactNode;
  variant?: Variant;
}) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset',
        variants[variant]
      )}
    >
      {children}
    </span>
  );
}
