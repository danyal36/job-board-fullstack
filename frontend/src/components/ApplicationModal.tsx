import { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { X } from 'lucide-react';
import { applicationsService } from '../services/applications.service';

const schema = z.object({
  coverLetter: z
    .string()
    .trim()
    .min(50, 'Cover letter must be at least 50 characters')
    .max(2000, 'Cover letter must be 2000 characters or fewer'),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  jobId: string;
  jobTitle: string;
  onClose: () => void;
}

export function ApplicationModal({ jobId, jobTitle, onClose }: Props) {
  const dialogRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { coverLetter: '' },
  });

  const mutation = useMutation({
    mutationFn: (values: FormValues) =>
      applicationsService.apply({ jobId, coverLetter: values.coverLetter }),
    onSuccess: () => onClose(),
  });

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const charCount = watch('coverLetter')?.length ?? 0;
  const submitError = mutation.error as Error | null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="apply-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        ref={dialogRef}
        className="flex max-h-[90vh] w-full max-w-xl flex-col overflow-y-auto rounded-lg bg-white shadow-xl"
      >
        <div className="flex items-start justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <h2 id="apply-title" className="text-lg font-semibold text-slate-900">
              Apply for this role
            </h2>
            <p className="mt-0.5 text-sm text-slate-500">{jobTitle}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit((values) => mutation.mutate(values))}
          className="px-6 py-5"
          noValidate
        >
          <label htmlFor="coverLetter" className="block text-sm font-medium text-slate-900">
            Cover letter
          </label>
          <p className="mt-0.5 text-xs text-slate-500">
            Tell the employer why you're a good fit. Minimum 50 characters.
          </p>
          <textarea
            id="coverLetter"
            rows={8}
            {...register('coverLetter')}
            aria-invalid={errors.coverLetter ? 'true' : 'false'}
            aria-describedby={errors.coverLetter ? 'coverLetter-error' : undefined}
            className="mt-2 block w-full resize-y rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
            placeholder="Hi — I'm excited about this role because…"
          />
          <div className="mt-1 flex items-center justify-between text-xs">
            {errors.coverLetter ? (
              <p id="coverLetter-error" className="text-red-600">
                {errors.coverLetter.message}
              </p>
            ) : (
              <span />
            )}
            <span className="text-slate-400">{charCount} / 2000</span>
          </div>

          {submitError && (
            <p className="mt-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
              {submitError.message || 'Failed to submit application.'}
            </p>
          )}

          <div className="mt-5 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || mutation.isPending}
              className="rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {mutation.isPending ? 'Submitting…' : 'Submit application'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
