import { useState, useEffect } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { jobsService } from '../services/jobs.service';
import { JobCard } from '../components/JobCard';
import { SearchBar } from '../components/SearchBar';
import { FilterSidebar, INITIAL_FILTERS } from '../components/FilterSidebar';
import { Pagination } from '../components/Pagination';
import { useDebounce } from '../hooks/useDebounce';
import type { JobType, SearchFilters, SearchParams } from '../types';

const PAGE_SIZE = 10;

function toApiParams(query: string, f: SearchFilters, page: number): SearchParams {
  return {
    ...(query && { query }),
    ...(f.location && { location: f.location }),
    ...(f.type && { type: f.type as JobType }),
    ...(f.remote && { remote: true }),
    ...(f.salaryMin && { salaryMin: f.salaryMin }),
    ...(f.salaryMax && { salaryMax: f.salaryMax }),
    ...(f.skills.length && { skills: f.skills }),
    page,
    limit: PAGE_SIZE,
  };
}

export default function JobsPage() {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>(INITIAL_FILTERS);
  const [page, setPage] = useState(1);
  const debouncedQuery = useDebounce(query, 400);

  useEffect(() => { setPage(1); }, [debouncedQuery]);

  const { data, isPending, isError, error, isFetching } = useQuery({
    queryKey: ['jobs-search', debouncedQuery, filters, page],
    queryFn: () => jobsService.searchJobs(toApiParams(debouncedQuery, filters, page)),
    placeholderData: keepPreviousData,
  });

  const jobs = data?.data.jobs ?? [];
  const total = data?.data.total ?? 0;
  const totalPages = data?.data.totalPages ?? 0;

  const handleFilterChange = (f: SearchFilters) => {
    setFilters(f);
    setPage(1);
  };

  return (
    <section>
      <header className="mb-4">
        <h1 className="text-2xl font-semibold text-slate-900">Find your next role</h1>
        <p className="mt-1 text-sm text-slate-500">
          {isPending ? 'Searching…' : `${total} role${total === 1 ? '' : 's'} found`}
        </p>
      </header>

      <SearchBar value={query} onChange={setQuery} />

      <div className="mt-6 flex gap-6">
        <aside className="w-64 flex-shrink-0 self-start sticky top-6">
          <FilterSidebar filters={filters} onChange={handleFilterChange} />
        </aside>

        <div className="min-w-0 flex-1">
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
        </div>
      </div>
    </section>
  );
}

function JobListSkeleton() {
  return (
    <ul className="grid grid-cols-1 gap-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <li key={i} className="h-32 animate-pulse rounded-lg border border-slate-200 bg-white" />
      ))}
    </ul>
  );
}

function EmptyState() {
  return (
    <div className="rounded-lg border border-dashed border-slate-300 bg-white p-12 text-center">
      <p className="text-sm font-medium text-slate-900">No jobs found</p>
      <p className="mt-1 text-sm text-slate-500">Try adjusting your search or filters.</p>
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
