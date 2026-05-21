import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import { X } from 'lucide-react';
import { jobsService } from '../services/jobs.service';
import type { EmployerJob, JobFormPayload, JobType, JobStatus } from '../types';

const JOB_TYPES: JobType[] = ['FULL_TIME', 'PART_TIME', 'CONTRACT', 'FREELANCE', 'INTERNSHIP'];
const JOB_STATUSES: JobStatus[] = ['ACTIVE', 'DRAFT', 'CLOSED'];

const jobTypeLabel: Record<JobType, string> = {
  FULL_TIME: 'Full-time',
  PART_TIME: 'Part-time',
  CONTRACT: 'Contract',
  FREELANCE: 'Freelance',
  INTERNSHIP: 'Internship',
};

const schema = z
  .object({
    title: z.string().trim().min(3, 'Title must be at least 3 characters').max(200),
    description: z.string().trim().min(10, 'Description must be at least 10 characters'),
    requirements: z.string().trim().default(''),
    skills: z.string().trim().default(''),
    location: z.string().trim().min(1, 'Location is required'),
    remote: z.boolean().default(false),
    salaryMin: z
      .union([z.string(), z.number()])
      .optional()
      .transform(v => (v === '' || v == null ? undefined : Number(v)))
      .refine(v => v === undefined || (Number.isInteger(v) && v > 0), {
        message: 'Salary min must be a positive integer',
      }),
    salaryMax: z
      .union([z.string(), z.number()])
      .optional()
      .transform(v => (v === '' || v == null ? undefined : Number(v)))
      .refine(v => v === undefined || (Number.isInteger(v) && v > 0), {
        message: 'Salary max must be a positive integer',
      }),
    currency: z.string().trim().min(1).default('GBP'),
    type: z.enum(['FULL_TIME', 'PART_TIME', 'CONTRACT', 'FREELANCE', 'INTERNSHIP']),
    status: z.enum(['ACTIVE', 'DRAFT', 'CLOSED']),
  })
  .refine(d => !(d.salaryMin && d.salaryMax && d.salaryMax < d.salaryMin), {
    message: 'Salary max must be greater than or equal to salary min',
    path: ['salaryMax'],
  });

type FormValues = z.input<typeof schema>;
type ParsedValues = z.output<typeof schema>;

interface Props {
  job?: EmployerJob;
  onClose: () => void;
}

function splitList(raw: string): string[] {
  return raw
    .split(/\r?\n|,/)
    .map(s => s.trim())
    .filter(Boolean);
}

function joinList(items: string[] | undefined): string {
  return items?.join('\n') ?? '';
}

export function JobFormModal({ job, onClose }: Props) {
  const queryClient = useQueryClient();
  const isEdit = !!job;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: job?.title ?? '',
      description: job?.description ?? '',
      requirements: joinList(job?.requirements),
      skills: joinList(job?.skills),
      location: job?.location ?? '',
      remote: job?.remote ?? false,
      salaryMin: job?.salaryMin ?? '',
      salaryMax: job?.salaryMax ?? '',
      currency: job?.currency ?? 'GBP',
      type: job?.type ?? 'FULL_TIME',
      status: job?.status ?? 'ACTIVE',
    },
  });

  const mutation = useMutation({
    mutationFn: (values: ParsedValues) => {
      const payload: JobFormPayload = {
        title: values.title,
        description: values.description,
        requirements: splitList(values.requirements ?? ''),
        skills: splitList(values.skills ?? ''),
        location: values.location,
        remote: values.remote,
        salaryMin: values.salaryMin,
        salaryMax: values.salaryMax,
        currency: values.currency,
        type: values.type,
        status: values.status,
      };
      return isEdit
        ? jobsService.updateJob(job!.id, payload)
        : jobsService.createJob(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-jobs'] });
      onClose();
    },
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

  const submitError = mutation.error as Error | null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="job-form-title"
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-900/50 p-4"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="my-8 w-full max-w-2xl rounded-lg bg-white shadow-xl">
        <div className="flex items-start justify-between border-b border-slate-200 px-6 py-4">
          <h2 id="job-form-title" className="text-lg font-semibold text-slate-900">
            {isEdit ? 'Edit job' : 'Post a new job'}
          </h2>
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
          onSubmit={handleSubmit(values => mutation.mutate(values as ParsedValues))}
          className="space-y-4 px-6 py-5"
          noValidate
        >
          <Field label="Title" error={errors.title?.message} htmlFor="title">
            <input
              id="title"
              type="text"
              {...register('title')}
              className={inputClass}
              placeholder="Senior TypeScript Engineer"
            />
          </Field>

          <Field label="Description" error={errors.description?.message} htmlFor="description">
            <textarea
              id="description"
              rows={6}
              {...register('description')}
              className={inputClass}
              placeholder="Describe the role, responsibilities, and what success looks like."
            />
          </Field>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field
              label="Requirements"
              hint="One per line or comma-separated"
              error={errors.requirements?.message}
              htmlFor="requirements"
            >
              <textarea
                id="requirements"
                rows={4}
                {...register('requirements')}
                className={inputClass}
                placeholder="5+ years TypeScript&#10;Node.js expertise"
              />
            </Field>

            <Field
              label="Skills"
              hint="One per line or comma-separated"
              error={errors.skills?.message}
              htmlFor="skills"
            >
              <textarea
                id="skills"
                rows={4}
                {...register('skills')}
                className={inputClass}
                placeholder="TypeScript&#10;React"
              />
            </Field>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Location" error={errors.location?.message} htmlFor="location">
              <input
                id="location"
                type="text"
                {...register('location')}
                className={inputClass}
                placeholder="London, UK"
              />
            </Field>

            <Field label="Job type" error={errors.type?.message} htmlFor="type">
              <select id="type" {...register('type')} className={inputClass}>
                {JOB_TYPES.map(t => (
                  <option key={t} value={t}>
                    {jobTypeLabel[t]}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Field label="Salary min" error={errors.salaryMin?.message} htmlFor="salaryMin">
              <input
                id="salaryMin"
                type="number"
                min={0}
                {...register('salaryMin')}
                className={inputClass}
                placeholder="50000"
              />
            </Field>

            <Field label="Salary max" error={errors.salaryMax?.message} htmlFor="salaryMax">
              <input
                id="salaryMax"
                type="number"
                min={0}
                {...register('salaryMax')}
                className={inputClass}
                placeholder="80000"
              />
            </Field>

            <Field label="Currency" error={errors.currency?.message} htmlFor="currency">
              <select id="currency" {...register('currency')} className={inputClass}>
                <option value="GBP">GBP £</option>
                <option value="USD">USD $</option>
                <option value="EUR">EUR €</option>
              </select>
            </Field>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Status" error={errors.status?.message} htmlFor="status">
              <select id="status" {...register('status')} className={inputClass}>
                {JOB_STATUSES.map(s => (
                  <option key={s} value={s}>
                    {s.charAt(0) + s.slice(1).toLowerCase()}
                  </option>
                ))}
              </select>
            </Field>

            <label className="flex items-end gap-2 pb-2 text-sm text-slate-700">
              <input
                type="checkbox"
                {...register('remote')}
                className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
              />
              Remote-friendly
            </label>
          </div>

          {submitError && (
            <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
              {submitError.message || 'Failed to save job.'}
            </p>
          )}

          <div className="flex justify-end gap-2 border-t border-slate-200 pt-4">
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
              {mutation.isPending ? 'Saving…' : isEdit ? 'Save changes' : 'Post job'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const inputClass =
  'mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500';

function Field({
  label,
  hint,
  error,
  htmlFor,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="block text-sm font-medium text-slate-900">
        {label}
      </label>
      {hint && <p className="mt-0.5 text-xs text-slate-500">{hint}</p>}
      {children}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
