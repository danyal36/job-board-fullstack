import clsx from 'clsx';
import type { ReactNode } from 'react';

interface EmptyStateProps {
  /** Inline SVG illustration / icon. */
  icon: ReactNode;
  title: string;
  description: string;
  /** Optional CTA, e.g. a <Link> or <button>. */
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={clsx(
        'flex flex-col items-center rounded-lg border border-dashed border-slate-300 bg-white px-6 py-12 text-center',
        className
      )}
    >
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-brand-50 text-brand-600">
        {icon}
      </div>
      <h3 className="text-base font-semibold text-slate-900">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-slate-500">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
