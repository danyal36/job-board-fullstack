const SKILL_OPTIONS = [
  'TypeScript', 'JavaScript', 'React', 'Node.js', 'Python',
  'SQL', 'PostgreSQL', 'Docker', 'AWS', 'Kubernetes', 'Git', 'Tailwind CSS',
];

interface Props {
  selected: string[];
  onChange: (skills: string[]) => void;
}

export function SkillsFilter({ selected, onChange }: Props) {
  const toggle = (skill: string) => {
    const updated = selected.includes(skill)
      ? selected.filter((s) => s !== skill)
      : [...selected, skill];
    onChange(updated);
  };

  return (
    <div className="flex flex-wrap gap-1.5">
      {SKILL_OPTIONS.map((skill) => {
        const active = selected.includes(skill);
        return (
          <button
            key={skill}
            type="button"
            onClick={() => toggle(skill)}
            className={`rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors ${
              active
                ? 'border-brand-600 bg-brand-600 text-white'
                : 'border-slate-300 bg-white text-slate-700 hover:border-brand-500 hover:text-brand-600'
            }`}
          >
            {skill}
          </button>
        );
      })}
    </div>
  );
}
