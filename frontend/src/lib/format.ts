import type { JobType } from '../types';

const currencySymbols: Record<string, string> = {
  GBP: '£',
  USD: '$',
  EUR: '€',
};

export function formatSalary(min?: number, max?: number, currency = 'GBP'): string {
  if (min == null && max == null) return 'Salary not specified';
  const symbol = currencySymbols[currency] ?? `${currency} `;
  const fmt = (n: number) => `${symbol}${n.toLocaleString()}`;
  if (min != null && max != null) return `${fmt(min)} – ${fmt(max)}`;
  if (min != null) return `${fmt(min)}+`;
  return `Up to ${fmt(max!)}`;
}

const jobTypeLabels: Record<JobType, string> = {
  FULL_TIME: 'Full-time',
  PART_TIME: 'Part-time',
  CONTRACT: 'Contract',
  FREELANCE: 'Freelance',
  INTERNSHIP: 'Internship',
};

export function formatJobType(type: JobType): string {
  return jobTypeLabels[type] ?? type;
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}
