import clsx from 'clsx';

type SkeletonVariant = 'text' | 'rect' | 'circle';

interface SkeletonProps {
  width?: number | string;
  height?: number | string;
  className?: string;
  variant?: SkeletonVariant;
}

const variantClasses: Record<SkeletonVariant, string> = {
  text: 'rounded',
  rect: 'rounded-md',
  circle: 'rounded-full',
};

export function Skeleton({ width, height, className, variant = 'text' }: SkeletonProps) {
  return (
    <span
      aria-hidden="true"
      className={clsx('block animate-pulse bg-slate-200', variantClasses[variant], className)}
      style={{ width, height }}
    />
  );
}

/** Composite skeleton matching the shape of a <JobCard />. */
export function JobCardSkeleton() {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1 space-y-2">
          <Skeleton variant="text" className="h-5 w-2/3" />
          <Skeleton variant="text" className="h-4 w-1/3" />
        </div>
        <Skeleton variant="rect" className="h-6 w-24 flex-shrink-0" />
      </div>
      <div className="mt-4 grid grid-cols-1 gap-y-1.5 sm:grid-cols-2">
        <Skeleton variant="text" className="h-4 w-32" />
        <Skeleton variant="text" className="h-4 w-28" />
      </div>
    </div>
  );
}
