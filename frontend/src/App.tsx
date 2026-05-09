import { useEffect } from 'react';
import { Navigate, Route, Routes, Link } from 'react-router-dom';
import JobsPage from './pages/JobsPage';
import JobDetailPage from './pages/JobDetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import { useAuthStore } from './store/auth.store';

export default function App() {
  const { user, isAuthenticated, logout, fetchMe } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) fetchMe();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
            {isAuthenticated ? (
              <>
                <span className="font-medium text-slate-800">
                  {user?.firstName} {user?.lastName}
                </span>
                <button
                  type="button"
                  onClick={logout}
                  className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-slate-900">
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="rounded-md bg-brand-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-brand-700"
                >
                  Register
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        <Routes>
          <Route path="/" element={<Navigate to="/jobs" replace />} />
          <Route path="/jobs" element={<JobsPage />} />
          <Route path="/jobs/:id" element={<JobDetailPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
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
