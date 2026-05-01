import clsx from 'clsx';
import type { ReactNode } from 'react';

type Variant = 'default' | 'brand' | 'green';

const variants: Record<Variant, string> = {
  default: 'bg-slate-100 text-slate-700 ring-slate-200',
  brand: 'bg-brand-50 text-brand-700 ring-brand-100',
  green: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
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
