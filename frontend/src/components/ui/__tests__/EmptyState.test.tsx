import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EmptyState } from '../EmptyState';

const icon = <svg data-testid="icon" />;

describe('EmptyState', () => {
  it('renders heading and description', () => {
    render(<EmptyState icon={icon} title="No results" description="Try adjusting your search." />);
    expect(screen.getByText('No results')).toBeInTheDocument();
    expect(screen.getByText('Try adjusting your search.')).toBeInTheDocument();
  });

  it('renders action slot when action prop is provided', async () => {
    const onCta = vi.fn();
    render(
      <EmptyState
        icon={icon}
        title="Empty"
        description="Nothing here."
        action={<button onClick={onCta}>Post a job</button>}
      />
    );
    const btn = screen.getByRole('button', { name: 'Post a job' });
    expect(btn).toBeInTheDocument();
    await userEvent.click(btn);
    expect(onCta).toHaveBeenCalledTimes(1);
  });

  it('does not render action slot when action prop is omitted', () => {
    render(<EmptyState icon={icon} title="Empty" description="Nothing here." />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});
