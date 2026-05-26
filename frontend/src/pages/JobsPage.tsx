import { useState, useEffect } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { SearchX, SlidersHorizontal, X } from 'lucide-react';
import { jobsService } from '../services/jobs.service';
import { JobCard } from '../components/JobCard';
import { SearchBar } from '../components/SearchBar';
import { FilterSidebar, INITIAL_FILTERS } from '../components/FilterSidebar';
import { Pagination } from '../components/ui/Pagination';
import { JobCardSkeleton } from '../components/ui/Skeleton';
import { EmptyState } from '../components/ui/EmptyState';
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
  const [drawerOpen, setDrawerOpen] = useState(false);
  const debouncedQuery = useDebounce(query, 400);

  useEffect(() => { setPage(1); }, [debouncedQuery]);

  const { data, isPending, isError, error } = useQuery({
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

      {/* Mobile filter trigger */}
      <button
        type="button"
        onClick={() => setDrawerOpen(true)}
        className="mt-4 inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 md:hidden"
      >
        <SlidersHorizontal className="h-4 w-4" />
        Filters
      </button>

      <div className="mt-6 flex gap-6">
        <aside className="sticky top-6 hidden w-64 flex-shrink-0 self-start md:block">
          <FilterSidebar filters={filters} onChange={handleFilterChange} />
        </aside>

        <div className="min-w-0 flex-1">
          {isPending ? (
            <JobListSkeleton />
          ) : isError ? (
            <ErrorState message={(error as Error).message} />
          ) : jobs.length === 0 ? (
            <EmptyState
              icon={<SearchX className="h-8 w-8" />}
              title="No jobs found"
              description="No jobs match your search. Try adjusting your filters."
            />
          ) : (
            <ul className="grid grid-cols-1 gap-3">
              {jobs.map((job) => (
                <li key={job.id}>
                  <JobCard job={job} />
                </li>
              ))}
            </ul>
          )}

          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      </div>

      {/* Mobile filter drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-40 md:hidden" role="dialog" aria-modal="true" aria-label="Filters">
          <div
            className="absolute inset-0 bg-slate-900/50"
            onClick={() => setDrawerOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 flex w-80 max-w-[85%] flex-col overflow-y-auto bg-slate-50 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3">
              <h2 className="text-sm font-semibold text-slate-900">Filters</h2>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                aria-label="Close filters"
                className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-4">
              <FilterSidebar filters={filters} onChange={handleFilterChange} />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function JobListSkeleton() {
  return (
    <ul className="grid grid-cols-1 gap-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <li key={i}>
          <JobCardSkeleton />
        </li>
      ))}
    </ul>
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
