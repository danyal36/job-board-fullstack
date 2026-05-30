import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import NotFound from '../NotFound';

function renderNotFound() {
  return render(
    <MemoryRouter>
      <NotFound />
    </MemoryRouter>
  );
}

describe('NotFound', () => {
  it('renders the 404 heading', () => {
    renderNotFound();
    expect(screen.getByRole('heading', { name: /page not found/i })).toBeInTheDocument();
  });

  it('renders the correct subtext', () => {
    renderNotFound();
    expect(
      screen.getByText(/this page doesn't exist or has been moved/i)
    ).toBeInTheDocument();
  });

  it('"Back to Home" link points to "/"', () => {
    renderNotFound();
    const link = screen.getByRole('link', { name: /back to home/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/');
  });
});
