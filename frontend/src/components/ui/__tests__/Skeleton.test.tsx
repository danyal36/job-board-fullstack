import { render } from '@testing-library/react';
import { Skeleton } from '../Skeleton';

describe('Skeleton', () => {
  it('renders with default props', () => {
    const { container } = render(<Skeleton />);
    const el = container.firstChild as HTMLElement;
    expect(el).toBeInTheDocument();
    expect(el.getAttribute('aria-hidden')).toBe('true');
    expect(el).toHaveClass('animate-pulse');
  });

  it('applies correct class for variant: text', () => {
    const { container } = render(<Skeleton variant="text" />);
    expect(container.firstChild).toHaveClass('rounded');
  });

  it('applies correct class for variant: rect', () => {
    const { container } = render(<Skeleton variant="rect" />);
    expect(container.firstChild).toHaveClass('rounded-md');
  });

  it('applies correct class for variant: circle', () => {
    const { container } = render(<Skeleton variant="circle" />);
    expect(container.firstChild).toHaveClass('rounded-full');
  });

  it('accepts and applies custom className', () => {
    const { container } = render(<Skeleton className="custom-class" />);
    expect(container.firstChild).toHaveClass('custom-class');
  });
});
