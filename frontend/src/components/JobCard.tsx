import { Link } from 'react-router-dom';
import { Briefcase, MapPin, Wallet } from 'lucide-react';
import type { Job } from '../types';
import { formatJobType, formatSalary } from '../lib/format';
import { Badge } from './Badge';

export function JobCard({ job }: { job: Job }) {
  const companyName = job.company?.name ?? 'Unknown company';

  return (
    <Link
      to={`/jobs/${job.id}`}
      className="block rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
    >
    <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:border-brand-200 hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="truncate text-base font-semibold text-slate-900">{job.title}</h3>
          <p className="mt-0.5 text-sm text-slate-600">{companyName}</p>
        </div>
        <div className="flex flex-shrink-0 flex-wrap justify-end gap-1.5">
          <Badge variant="brand">
            <Briefcase className="mr-1 h-3 w-3" />
            {formatJobType(job.type)}
          </Badge>
          {job.remote && <Badge variant="green">Remote</Badge>}
        </div>
      </div>

      <dl className="mt-4 grid grid-cols-1 gap-y-1.5 text-sm text-slate-600 sm:grid-cols-2">
        <div className="flex items-center gap-1.5">
          <MapPin className="h-4 w-4 text-slate-400" />
          <dd>{job.location}</dd>
        </div>
        <div className="flex items-center gap-1.5">
          <Wallet className="h-4 w-4 text-slate-400" />
          <dd>{formatSalary(job.salaryMin, job.salaryMax, job.currency)}</dd>
        </div>
      </dl>
    </article>
    </Link>
  );
}
