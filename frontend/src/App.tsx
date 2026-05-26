import { useEffect, useState } from 'react';
import { Navigate, Route, Routes, Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import clsx from 'clsx';
import JobsPage from './pages/JobsPage';
import JobDetailPage from './pages/JobDetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import MyApplicationsPage from './pages/MyApplicationsPage';
import NotFound from './pages/NotFound';
import { ProtectedRoute } from './components/ProtectedRoute';
import { ErrorBoundary } from './components/ErrorBoundary';
import { useAuthStore } from './store/auth.store';

export default function App() {
  const { user, isAuthenticated, logout, fetchMe } = useAuthStore();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (isAuthenticated) fetchMe();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const closeMenu = () => setMenuOpen(false);

  const navLinks = (
    <>
      <Link to="/jobs" onClick={closeMenu} className="hover:text-slate-900">
        Jobs
      </Link>
      {isAuthenticated && user?.role === 'EMPLOYER' && (
        <Link to="/dashboard" onClick={closeMenu} className="hover:text-slate-900">
          Dashboard
        </Link>
      )}
      {isAuthenticated && user?.role === 'JOB_SEEKER' && (
        <Link to="/my-applications" onClick={closeMenu} className="hover:text-slate-900">
          My applications
        </Link>
      )}
      {isAuthenticated ? (
        <>
          <span className="font-medium text-slate-800">
            {user?.firstName} {user?.lastName}
          </span>
          <button
            type="button"
            onClick={() => {
              closeMenu();
              logout();
            }}
            className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
          >
            Sign out
          </button>
        </>
      ) : (
        <>
          <Link to="/login" onClick={closeMenu} className="hover:text-slate-900">
            Sign in
          </Link>
          <Link
            to="/register"
            onClick={closeMenu}
            className="rounded-md bg-brand-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-brand-700"
          >
            Register
          </Link>
        </>
      )}
    </>
  );

  return (
    <div className="min-h-full">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <Link to="/jobs" onClick={closeMenu} className="text-lg font-semibold text-slate-900">
            Job Board
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-4 text-sm text-slate-600 md:flex">{navLinks}</nav>

          {/* Mobile toggle */}
          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            className="rounded-md p-1.5 text-slate-600 hover:bg-slate-100 md:hidden"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile nav panel */}
        <nav
          className={clsx(
            'flex-col gap-3 border-t border-slate-200 px-4 py-4 text-sm text-slate-600 md:hidden',
            menuOpen ? 'flex' : 'hidden'
          )}
        >
          {navLinks}
        </nav>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        <Routes>
          <Route path="/" element={<Navigate to="/jobs" replace />} />
          <Route
            path="/jobs"
            element={
              <ErrorBoundary>
                <JobsPage />
              </ErrorBoundary>
            }
          />
          <Route
            path="/jobs/:id"
            element={
              <ErrorBoundary>
                <JobDetailPage />
              </ErrorBoundary>
            }
          />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute roles={['EMPLOYER', 'ADMIN']}>
                <ErrorBoundary>
                  <DashboardPage />
                </ErrorBoundary>
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-applications"
            element={
              <ProtectedRoute roles={['JOB_SEEKER']}>
                <ErrorBoundary>
                  <MyApplicationsPage />
                </ErrorBoundary>
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
}
