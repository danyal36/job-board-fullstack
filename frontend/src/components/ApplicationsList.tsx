import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { MapPin } from 'lucide-react';
import { applicationsService } from '../services/applications.service';
import { Badge } from './Badge';
import { formatDate, formatJobType } from '../lib/format';
import type { ApplicationStatus } from '../types';

type BadgeVariant = 'default' | 'brand' | 'green' | 'amber' | 'blue' | 'red';

const statusMeta: Record<ApplicationStatus, { label: string; variant: BadgeVariant }> = {
  PENDING: { label: 'Pending', variant: 'amber' },
  REVIEWING: { label: 'Reviewing', variant: 'blue' },
  SHORTLISTED: { label: 'Shortlisted', variant: 'brand' },
  REJECTED: { label: 'Rejected', variant: 'red' },
  ACCEPTED: { label: 'Accepted', variant: 'green' },
};

export function ApplicationsList() {
  const { data, isPending, isError, error } = useQuery({
    queryKey: ['my-applications'],
    queryFn: () => applicationsService.getMyApplications(),
  });

  if (isPending) return <ListSkeleton />;
  if (isError) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-sm text-red-800">
        <p className="font-medium">Failed to load your applications</p>
        <p className="mt-1 text-red-700">{(error as Error).message}</p>
      </div>
    );
  }

  const applications = data.data;
  if (applications.length === 0) {
    return (
      <EmptyState
        title="No applications yet"
        body="When you apply to a job it will show up here so you can track its status."
      />
    );
  }

  return (
    <ul className="space-y-3">
      {applications.map(app => {
        const meta = statusMeta[app.status];
        return (
          <li
            key={app.id}
            className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:border-brand-200"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <Link
                  to={`/jobs/${app.jobId}`}
                  className="text-base font-semibold text-slate-900 hover:text-brand-600"
                >
                  {app.job?.title ?? 'Job'}
                </Link>
                <p className="mt-0.5 text-sm text-slate-600">
                  {app.job?.company?.name ?? 'Unknown company'}
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                  {app.job && (
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-slate-400" />
                      {app.job.location}
                      {app.job.remote && ' · Remote'}
                    </span>
                  )}
                  {app.job && <span>{formatJobType(app.job.type)}</span>}
                  <span>Applied {formatDate(app.createdAt)}</span>
                </div>
              </div>
              <Badge variant={meta.variant}>{meta.label}</Badge>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

function ListSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="h-24 animate-pulse rounded-lg border border-slate-200 bg-white" />
      ))}
    </div>
  );
}

export function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-lg border border-dashed border-slate-300 bg-white p-12 text-center">
      <p className="text-sm font-medium text-slate-900">{title}</p>
      <p className="mt-1 text-sm text-slate-500">{body}</p>
      <Link
        to="/jobs"
        className="mt-4 inline-block rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-brand-700"
      >
        Browse jobs
      </Link>
    </div>
  );
}
