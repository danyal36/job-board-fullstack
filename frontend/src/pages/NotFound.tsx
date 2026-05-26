import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <p className="text-7xl font-bold tracking-tight text-brand-600 sm:text-8xl">404</p>
      <h1 className="mt-4 text-xl font-semibold text-slate-900 sm:text-2xl">Page not found</h1>
      <p className="mt-2 max-w-sm text-sm text-slate-500">
        This page doesn't exist or has been moved.
      </p>
      <Link
        to="/"
        className="mt-6 rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-brand-700"
      >
        Back to Home
      </Link>
    </div>
  );
}
