import { useState } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { jobsService } from '../services/jobs.service';
import { JobCard } from '../components/JobCard';

const PAGE_SIZE = 10;

export default function JobsPage() {
  const [page, setPage] = useState(1);

  const { data, isPending, isError, error, isFetching } = useQuery({
    queryKey: ['jobs', { page, limit: PAGE_SIZE }],
    queryFn: () => jobsService.getJobs({ page, limit: PAGE_SIZE }),
    placeholderData: keepPreviousData,
  });

  const jobs = data?.data.jobs ?? [];
  const total = data?.data.total ?? 0;
  const totalPages = data?.data.totalPages ?? 0;

  return (
    <section>
      <header className="mb-6 flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Jobs</h1>
          <p className="mt-1 text-sm text-slate-600">
            {isPending ? 'Loading…' : `${total} role${total === 1 ? '' : 's'} available`}
          </p>
        </div>
      </header>

      {isPending ? (
        <JobListSkeleton />
      ) : isError ? (
        <ErrorState message={(error as Error).message} />
      ) : jobs.length === 0 ? (
        <EmptyState />
      ) : (
        <ul className="grid grid-cols-1 gap-3">
          {jobs.map((job) => (
            <li key={job.id}>
              <JobCard job={job} />
            </li>
          ))}
        </ul>
      )}

      {totalPages > 1 && (
        <Pagination
          page={page}
          totalPages={totalPages}
          isFetching={isFetching}
          onChange={setPage}
        />
      )}
    </section>
  );
}

function Pagination({
  page,
  totalPages,
  isFetching,
  onChange,
}: {
  page: number;
  totalPages: number;
  isFetching: boolean;
  onChange: (p: number) => void;
}) {
  return (
    <nav className="mt-6 flex items-center justify-between border-t border-slate-200 pt-4">
      <button
        type="button"
        onClick={() => onChange(page - 1)}
        disabled={page <= 1 || isFetching}
        className="inline-flex items-center gap-1 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <ChevronLeft className="h-4 w-4" />
        Previous
      </button>
      <span className="text-sm text-slate-600">
        Page {page} of {totalPages}
      </span>
      <button
        type="button"
        onClick={() => onChange(page + 1)}
        disabled={page >= totalPages || isFetching}
        className="inline-flex items-center gap-1 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Next
        <ChevronRight className="h-4 w-4" />
      </button>
    </nav>
  );
}

function JobListSkeleton() {
  return (
    <ul className="grid grid-cols-1 gap-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <li
          key={i}
          className="h-32 animate-pulse rounded-lg border border-slate-200 bg-white"
        />
      ))}
    </ul>
  );
}

function EmptyState() {
  return (
    <div className="rounded-lg border border-dashed border-slate-300 bg-white p-12 text-center">
      <p className="text-sm font-medium text-slate-900">No jobs found</p>
      <p className="mt-1 text-sm text-slate-500">Check back soon — new roles are posted often.</p>
    </div>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-sm text-red-800">
      <p className="font-medium">Failed to load jobs</p>
      <p className="mt-1 text-red-700">{message}</p>
    </div>
  );
}
