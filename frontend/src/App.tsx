import { Navigate, Route, Routes, Link } from 'react-router-dom';
import JobsPage from './pages/JobsPage';
import JobDetailPage from './pages/JobDetailPage';

export default function App() {
  return (
    <div className="min-h-full">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <Link to="/jobs" className="text-lg font-semibold text-slate-900">
            Job Board
          </Link>
          <nav className="flex items-center gap-4 text-sm text-slate-600">
            <Link to="/jobs" className="hover:text-slate-900">
              Jobs
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        <Routes>
          <Route path="/" element={<Navigate to="/jobs" replace />} />
          <Route path="/jobs" element={<JobsPage />} />
          <Route path="/jobs/:id" element={<JobDetailPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
}

function NotFound() {
  return (
    <div className="text-center text-slate-500">
      <p>Page not found.</p>
      <Link to="/jobs" className="mt-2 inline-block text-brand-600 hover:underline">
        Back to jobs
      </Link>
    </div>
  );
}
