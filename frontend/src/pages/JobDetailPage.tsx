import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Briefcase, Building2, Globe, MapPin, Wallet } from 'lucide-react';
import { jobsService } from '../services/jobs.service';
import { Badge } from '../components/Badge';
import { ApplicationModal } from '../components/ApplicationModal';
import { formatJobType, formatSalary } from '../lib/format';
import type { Company } from '../types';

export default function JobDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [isApplyOpen, setApplyOpen] = useState(false);

  const { data, isPending, isError, error } = useQuery({
    queryKey: ['job', id],
    queryFn: () => jobsService.getJobById(id!),
    enabled: !!id,
  });

  if (isPending) return <DetailSkeleton />;
  if (isError) {
    return (
      <ErrorState message={(error as Error).message || 'Failed to load job.'} />
    );
  }

  const job = data.data;
  const isClosed = job.status === 'CLOSED';

  return (
    <article>
      <Link
        to="/jobs"
        className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-900"
      >
        <ArrowLeft className="h-4 w-4" /> Back to jobs
      </Link>

      <header className="mt-4 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <h1 className="text-2xl font-semibold text-slate-900">{job.title}</h1>
            <p className="mt-1 text-sm text-slate-600">
              {job.company?.name ?? 'Unknown company'}
            </p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              <Badge variant="brand">
                <Briefcase className="mr-1 h-3 w-3" />
                {formatJobType(job.type)}
              </Badge>
              {job.remote && <Badge variant="green">Remote</Badge>}
              {isClosed && <Badge>Closed</Badge>}
            </div>
          </div>
          <button
            type="button"
            onClick={() => setApplyOpen(true)}
            disabled={isClosed}
            className="rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isClosed ? 'Applications closed' : 'Apply now'}
          </button>
        </div>

        <dl className="mt-5 grid grid-cols-1 gap-2 text-sm text-slate-600 sm:grid-cols-2">
          <div className="flex items-center gap-1.5">
            <MapPin className="h-4 w-4 text-slate-400" />
            <dd>{job.location}</dd>
          </div>
          <div className="flex items-center gap-1.5">
            <Wallet className="h-4 w-4 text-slate-400" />
            <dd>{formatSalary(job.salaryMin, job.salaryMax, job.currency)}</dd>
          </div>
        </dl>
      </header>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Section title="Description">
            <p className="whitespace-pre-line text-sm leading-6 text-slate-700">
              {job.description}
            </p>
          </Section>

          {job.requirements.length > 0 && (
            <Section title="Requirements">
              <ul className="list-disc space-y-1 pl-5 text-sm text-slate-700">
                {job.requirements.map((req, i) => (
                  <li key={i}>{req}</li>
                ))}
              </ul>
            </Section>
          )}

          {job.skills.length > 0 && (
            <Section title="Skills">
              <ul className="flex flex-wrap gap-1.5">
                {job.skills.map((skill) => (
                  <li key={skill}>
                    <Badge>{skill}</Badge>
                  </li>
                ))}
              </ul>
            </Section>
          )}
        </div>

        <aside className="space-y-6">
          <CompanyCard company={job.company} />
        </aside>
      </div>

      {isApplyOpen && (
        <ApplicationModal
          jobId={job.id}
          jobTitle={job.title}
          onClose={() => setApplyOpen(false)}
        />
      )}
    </article>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-base font-semibold text-slate-900">{title}</h2>
      <div className="mt-3">{children}</div>
    </section>
  );
}

function CompanyCard({ company }: { company: Company }) {
  if (!company) return null;
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="flex items-center gap-2 text-base font-semibold text-slate-900">
        <Building2 className="h-4 w-4 text-slate-400" />
        About {company.name}
      </h2>
      {company.description && (
        <p className="mt-3 text-sm leading-6 text-slate-700">{company.description}</p>
      )}
      <dl className="mt-4 space-y-2 text-sm text-slate-600">
        {company.location && (
          <div className="flex items-center gap-1.5">
            <MapPin className="h-4 w-4 text-slate-400" />
            <dd>{company.location}</dd>
          </div>
        )}
        {company.website && (
          <div className="flex items-center gap-1.5">
            <Globe className="h-4 w-4 text-slate-400" />
            <dd>
              <a
                href={company.website}
                target="_blank"
                rel="noreferrer"
                className="text-brand-600 hover:underline"
              >
                {company.website.replace(/^https?:\/\//, '')}
              </a>
            </dd>
          </div>
        )}
      </dl>
    </section>
  );
}

function DetailSkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-4 w-24 animate-pulse rounded bg-slate-200" />
      <div className="h-32 animate-pulse rounded-lg border border-slate-200 bg-white" />
      <div className="h-64 animate-pulse rounded-lg border border-slate-200 bg-white" />
    </div>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-sm text-red-800">
      <p className="font-medium">Failed to load job</p>
      <p className="mt-1 text-red-700">{message}</p>
      <Link to="/jobs" className="mt-3 inline-block text-sm text-brand-600 hover:underline">
        Back to jobs
      </Link>
    </div>
  );
}
