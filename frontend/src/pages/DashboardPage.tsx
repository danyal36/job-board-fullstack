import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Pencil, Plus, Trash2, Users } from 'lucide-react';
import { jobsService } from '../services/jobs.service';
import { Badge } from '../components/Badge';
import { JobFormModal } from '../components/JobFormModal';
import { formatJobType, formatSalary } from '../lib/format';
import type { EmployerJob, JobStatus } from '../types';

const statusVariant: Record<JobStatus, 'brand' | 'green' | 'default'> = {
  ACTIVE: 'green',
  DRAFT: 'brand',
  CLOSED: 'default',
};

const statusLabel: Record<JobStatus, string> = {
  ACTIVE: 'Active',
  DRAFT: 'Draft',
  CLOSED: 'Closed',
};

export default function DashboardPage() {
  const [modalJob, setModalJob] = useState<EmployerJob | null>(null);
  const [isCreating, setCreating] = useState(false);

  const { data, isPending, isError, error } = useQuery({
    queryKey: ['my-jobs'],
    queryFn: () => jobsService.getMyJobs(),
  });

  const queryClient = useQueryClient();
  const deleteMutation = useMutation({
    mutationFn: (id: string) => jobsService.deleteJob(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['my-jobs'] }),
  });

  const handleDelete = (job: EmployerJob) => {
    if (!confirm(`Delete "${job.title}"? This cannot be undone.`)) return;
    deleteMutation.mutate(job.id);
  };

  const jobs = data?.data.jobs ?? [];
  const total = data?.data.total ?? 0;

  return (
    <section>
      <header className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Employer dashboard</h1>
          <p className="mt-1 text-sm text-slate-500">
            {isPending ? 'Loading your jobs…' : `${total} job${total === 1 ? '' : 's'} posted`}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setCreating(true)}
          className="inline-flex items-center gap-1.5 rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-brand-700"
        >
          <Plus className="h-4 w-4" />
          Post new job
        </button>
      </header>

      {isPending ? (
        <TableSkeleton />
      ) : isError ? (
        <ErrorState message={(error as Error).message} />
      ) : jobs.length === 0 ? (
        <EmptyState onCreate={() => setCreating(true)} />
      ) : (
        <JobsTable
          jobs={jobs}
          onEdit={setModalJob}
          onDelete={handleDelete}
          isDeleting={deleteMutation.isPending}
        />
      )}

      {(isCreating || modalJob) && (
        <JobFormModal
          job={modalJob ?? undefined}
          onClose={() => {
            setCreating(false);
            setModalJob(null);
          }}
        />
      )}
    </section>
  );
}

function JobsTable({
  jobs,
  onEdit,
  onDelete,
  isDeleting,
}: {
  jobs: EmployerJob[];
  onEdit: (job: EmployerJob) => void;
  onDelete: (job: EmployerJob) => void;
  isDeleting: boolean;
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <table className="min-w-full divide-y divide-slate-200 text-sm">
        <thead className="bg-slate-50 text-left text-xs font-medium uppercase tracking-wide text-slate-500">
          <tr>
            <th className="px-4 py-3">Job</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Type</th>
            <th className="px-4 py-3">Salary</th>
            <th className="px-4 py-3">Applicants</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 text-slate-700">
          {jobs.map(job => (
            <tr key={job.id} className="hover:bg-slate-50">
              <td className="px-4 py-3">
                <Link
                  to={`/jobs/${job.id}`}
                  className="font-medium text-slate-900 hover:text-brand-600"
                >
                  {job.title}
                </Link>
                <p className="mt-0.5 text-xs text-slate-500">
                  {job.location}
                  {job.remote && ' · Remote'}
                </p>
              </td>
              <td className="px-4 py-3">
                <Badge variant={statusVariant[job.status]}>{statusLabel[job.status]}</Badge>
              </td>
              <td className="px-4 py-3 text-slate-600">{formatJobType(job.type)}</td>
              <td className="px-4 py-3 text-slate-600">
                {formatSalary(job.salaryMin, job.salaryMax, job.currency)}
              </td>
              <td className="px-4 py-3">
                <span className="inline-flex items-center gap-1 text-slate-600">
                  <Users className="h-4 w-4 text-slate-400" />
                  {job.applicantCount}
                </span>
              </td>
              <td className="px-4 py-3">
                <div className="flex justify-end gap-1">
                  <button
                    type="button"
                    onClick={() => onEdit(job)}
                    aria-label={`Edit ${job.title}`}
                    className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(job)}
                    disabled={isDeleting}
                    aria-label={`Delete ${job.title}`}
                    className="rounded-md p-1.5 text-slate-500 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TableSkeleton() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="h-14 animate-pulse rounded-lg border border-slate-200 bg-white" />
      ))}
    </div>
  );
}

function EmptyState({ onCreate }: { onCreate: () => void }) {
  return (
    <div className="rounded-lg border border-dashed border-slate-300 bg-white p-12 text-center">
      <p className="text-sm font-medium text-slate-900">No jobs yet</p>
      <p className="mt-1 text-sm text-slate-500">Post your first role to start receiving applications.</p>
      <button
        type="button"
        onClick={onCreate}
        className="mt-4 inline-flex items-center gap-1.5 rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-brand-700"
      >
        <Plus className="h-4 w-4" />
        Post new job
      </button>
    </div>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-sm text-red-800">
      <p className="font-medium">Failed to load your jobs</p>
      <p className="mt-1 text-red-700">{message}</p>
    </div>
  );
}
