import { X } from 'lucide-react';
import type { JobType, SearchFilters } from '../types';
import { SkillsFilter } from './SkillsFilter';

const JOB_TYPES: { label: string; value: JobType }[] = [
  { label: 'Full-time', value: 'FULL_TIME' },
  { label: 'Part-time', value: 'PART_TIME' },
  { label: 'Contract', value: 'CONTRACT' },
  { label: 'Freelance', value: 'FREELANCE' },
  { label: 'Internship', value: 'INTERNSHIP' },
];

const SALARY_MAX = 200_000;
const SALARY_STEP = 5_000;

export const INITIAL_FILTERS: SearchFilters = {
  location: '',
  type: '',
  remote: false,
  salaryMin: 0,
  salaryMax: 0,
  skills: [],
};

interface Props {
  filters: SearchFilters;
  onChange: (f: SearchFilters) => void;
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">{children}</p>
  );
}

export function FilterSidebar({ filters, onChange }: Props) {
  const set = <K extends keyof SearchFilters>(k: K, v: SearchFilters[K]) =>
    onChange({ ...filters, [k]: v });

  const hasActive =
    filters.location !== '' || filters.type !== '' || filters.remote ||
    filters.salaryMin > 0 || filters.salaryMax > 0 || filters.skills.length > 0;

  const fmtSalary = (n: number) => (n === 0 ? 'Any' : `£${n.toLocaleString()}`);

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-900">Filters</h2>
        {hasActive && (
          <button
            type="button"
            onClick={() => onChange(INITIAL_FILTERS)}
            className="flex items-center gap-1 text-xs text-brand-600 hover:text-brand-700"
          >
            <X className="h-3 w-3" />
            Clear all
          </button>
        )}
      </div>

      <div className="mb-5">
        <SectionLabel>Location</SectionLabel>
        <input
          type="text"
          value={filters.location}
          onChange={(e) => set('location', e.target.value)}
          placeholder="City or country…"
          className="w-full rounded-md border border-slate-300 px-3 py-1.5 text-sm placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
        />
      </div>

      <div className="mb-5">
        <SectionLabel>Job type</SectionLabel>
        <div className="space-y-1.5">
          {JOB_TYPES.map(({ label, value }) => (
            <label key={value} className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
              <input
                type="radio"
                name="jobType"
                value={value}
                checked={filters.type === value}
                onChange={() => set('type', value)}
                className="accent-indigo-600"
              />
              {label}
            </label>
          ))}
          {filters.type && (
            <button type="button" onClick={() => set('type', '')} className="text-xs text-brand-600 hover:text-brand-700">
              Clear
            </button>
          )}
        </div>
      </div>

      <div className="mb-5">
        <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
          <input
            type="checkbox"
            checked={filters.remote}
            onChange={(e) => set('remote', e.target.checked)}
            className="accent-indigo-600"
          />
          <span className="font-medium">Remote only</span>
        </label>
      </div>

      <div className="mb-5">
        <SectionLabel>Salary range</SectionLabel>
        <div className="space-y-3">
          <div>
            <div className="mb-1 flex justify-between text-xs text-slate-500">
              <span>Min</span><span>{fmtSalary(filters.salaryMin)}</span>
            </div>
            <input type="range" min={0} max={SALARY_MAX} step={SALARY_STEP}
              value={filters.salaryMin}
              onChange={(e) => set('salaryMin', Number(e.target.value))}
              className="w-full accent-indigo-600"
            />
          </div>
          <div>
            <div className="mb-1 flex justify-between text-xs text-slate-500">
              <span>Max</span><span>{fmtSalary(filters.salaryMax)}</span>
            </div>
            <input type="range" min={0} max={SALARY_MAX} step={SALARY_STEP}
              value={filters.salaryMax}
              onChange={(e) => set('salaryMax', Number(e.target.value))}
              className="w-full accent-indigo-600"
            />
          </div>
        </div>
      </div>

      <div>
        <SectionLabel>Skills</SectionLabel>
        <SkillsFilter
          selected={filters.skills}
          onChange={(skills) => onChange({ ...filters, skills })}
        />
      </div>
    </div>
  );
}
