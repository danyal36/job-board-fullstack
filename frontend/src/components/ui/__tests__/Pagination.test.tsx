import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Pagination } from '../Pagination';

describe('Pagination', () => {
  it('renders all page buttons for small page count without ellipsis', () => {
    // currentPage=2, totalPages=4: range=[2,3] → [1,2,3,4], no ellipsis
    render(<Pagination currentPage={2} totalPages={4} onPageChange={() => {}} />);
    for (let i = 1; i <= 4; i++) {
      expect(screen.getByLabelText(`Go to page ${i}`)).toBeInTheDocument();
    }
    expect(screen.queryByText('…')).not.toBeInTheDocument();
  });

  it('shows ellipsis when totalPages is greater than 7', () => {
    // currentPage=5, totalPages=10 → [1, …, 4, 5, 6, …, 10]
    render(<Pagination currentPage={5} totalPages={10} onPageChange={() => {}} />);
    const ellipses = screen.getAllByText('…');
    expect(ellipses.length).toBeGreaterThanOrEqual(2);
  });

  it('calls onPageChange with correct page number on button click', async () => {
    const onPageChange = vi.fn();
    // currentPage=3, totalPages=5 → all pages visible
    render(<Pagination currentPage={3} totalPages={5} onPageChange={onPageChange} />);
    await userEvent.click(screen.getByLabelText('Go to page 2'));
    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it('disables Previous button on page 1', () => {
    render(<Pagination currentPage={1} totalPages={5} onPageChange={() => {}} />);
    expect(screen.getByLabelText('Go to previous page')).toBeDisabled();
  });

  it('disables Next button on last page', () => {
    render(<Pagination currentPage={5} totalPages={5} onPageChange={() => {}} />);
    expect(screen.getByLabelText('Go to next page')).toBeDisabled();
  });

  it('marks the active page with aria-current="page"', () => {
    render(<Pagination currentPage={3} totalPages={5} onPageChange={() => {}} />);
    expect(screen.getByLabelText('Go to page 3')).toHaveAttribute('aria-current', 'page');
  });

  it('returns null when totalPages is 1', () => {
    const { container } = render(
      <Pagination currentPage={1} totalPages={1} onPageChange={() => {}} />
    );
    expect(container.firstChild).toBeNull();
  });
});
