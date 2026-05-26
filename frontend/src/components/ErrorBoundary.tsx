import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
  /** Optional custom fallback. Receives a reset callback. */
  fallback?: (reset: () => void, error: Error | null) => ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Catches unexpected render-time JS errors and shows a recoverable fallback.
 * React Query data errors are handled inline at the query level — this is for
 * genuinely unexpected exceptions only.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // eslint-disable-next-line no-console
    console.error('ErrorBoundary caught an error:', error, info.componentStack);
  }

  reset = () => this.setState({ hasError: false, error: null });

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback(this.reset, this.state.error);
      return <DefaultFallback onReset={this.reset} />;
    }
    return this.props.children;
  }
}

function DefaultFallback({ onReset }: { onReset: () => void }) {
  return (
    <div className="flex flex-col items-center rounded-lg border border-slate-200 bg-white px-6 py-12 text-center shadow-sm">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-600">
        <AlertTriangle className="h-8 w-8" />
      </div>
      <h2 className="text-base font-semibold text-slate-900">Something went wrong</h2>
      <p className="mt-1 max-w-sm text-sm text-slate-500">
        An unexpected error occurred while rendering this page. You can try again.
      </p>
      <button
        type="button"
        onClick={onReset}
        className="mt-5 rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-brand-700"
      >
        Try again
      </button>
    </div>
  );
}
