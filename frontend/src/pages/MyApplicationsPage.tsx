import { useState } from 'react';
import clsx from 'clsx';
import { ApplicationsList } from '../components/ApplicationsList';
import { SavedJobsList } from '../components/SavedJobsList';

type Tab = 'applications' | 'saved';

const tabs: { id: Tab; label: string }[] = [
  { id: 'applications', label: 'Applications' },
  { id: 'saved', label: 'Saved Jobs' },
];

export default function MyApplicationsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('applications');

  return (
    <section>
      <header className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-900">My applications</h1>
        <p className="mt-1 text-sm text-slate-500">
          Track the status of your applications and revisit jobs you've saved.
        </p>
      </header>

      <div className="mb-6 border-b border-slate-200">
        <nav className="-mb-px flex gap-6" role="tablist" aria-label="My applications tabs">
          {tabs.map(tab => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={clsx(
                'border-b-2 px-1 pb-3 text-sm font-medium transition',
                activeTab === tab.id
                  ? 'border-brand-600 text-brand-700'
                  : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700'
              )}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {activeTab === 'applications' ? <ApplicationsList /> : <SavedJobsList />}
    </section>
  );
}
