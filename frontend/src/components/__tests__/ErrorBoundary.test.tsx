import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ErrorBoundary } from '../ErrorBoundary';

let throwError = false;

function MaybeThrow() {
  if (throwError) throw new Error('Test render error');
  return <div>Child content</div>;
}

beforeEach(() => {
  throwError = false;
  vi.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('ErrorBoundary', () => {
  it('renders children when no error occurs', () => {
    render(
      <ErrorBoundary>
        <MaybeThrow />
      </ErrorBoundary>
    );
    expect(screen.getByText('Child content')).toBeInTheDocument();
  });

  it('renders fallback UI when a child throws', () => {
    throwError = true;
    render(
      <ErrorBoundary>
        <MaybeThrow />
      </ErrorBoundary>
    );
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument();
  });

  it('resets error state when Try again is clicked', async () => {
    throwError = true;
    render(
      <ErrorBoundary>
        <MaybeThrow />
      </ErrorBoundary>
    );

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();

    throwError = false;
    await userEvent.click(screen.getByRole('button', { name: /try again/i }));

    expect(screen.getByText('Child content')).toBeInTheDocument();
  });

  it('renders custom fallback when fallback prop is provided', () => {
    throwError = true;
    render(
      <ErrorBoundary fallback={() => <div>Custom fallback</div>}>
        <MaybeThrow />
      </ErrorBoundary>
    );
    expect(screen.getByText('Custom fallback')).toBeInTheDocument();
  });
});
