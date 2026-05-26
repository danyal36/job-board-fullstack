import { Link } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Bookmark, Trash2 } from 'lucide-react';
import { savedJobsService } from '../services/savedJobs.service';
import { JobCard } from './JobCard';
import { Skeleton } from './ui/Skeleton';
import { EmptyState } from './ui/EmptyState';

export function SavedJobsList() {
  const queryClient = useQueryClient();

  const { data, isPending, isError, error } = useQuery({
    queryKey: ['saved-jobs'],
    queryFn: () => savedJobsService.getSavedJobs(),
  });

  const unsaveMutation = useMutation({
    mutationFn: (jobId: string) => savedJobsService.unsaveJob(jobId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['saved-jobs'] }),
  });

  if (isPending) return <ListSkeleton />;
  if (isError) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-sm text-red-800">
        <p className="font-medium">Failed to load saved jobs</p>
        <p className="mt-1 text-red-700">{(error as Error).message}</p>
      </div>
    );
  }

  const saved = data.data;
  if (saved.length === 0) {
    return (
      <EmptyState
        icon={<Bookmark className="h-8 w-8" />}
        title="No saved jobs"
        description="Save jobs you're interested in to revisit them here later."
        action={
          <Link
            to="/jobs"
            className="inline-block rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-brand-700"
          >
            Browse Jobs
          </Link>
        }
      />
    );
  }

  return (
    <ul className="space-y-3">
      {saved.map(item => (
        <li key={item.id} className="relative">
          <JobCard job={item.job} />
          <button
            type="button"
            onClick={() => unsaveMutation.mutate(item.jobId)}
            disabled={unsaveMutation.isPending}
            aria-label={`Remove ${item.job.title} from saved`}
            className="absolute right-3 top-3 rounded-md bg-white/90 p-1.5 text-slate-500 shadow-sm ring-1 ring-slate-200 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </li>
      ))}
    </ul>
  );
}

function ListSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <Skeleton key={i} variant="rect" className="h-32 w-full border border-slate-200 bg-white" />
      ))}
    </div>
  );
}
