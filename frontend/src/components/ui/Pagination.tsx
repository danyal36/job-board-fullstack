import { ChevronLeft, ChevronRight } from 'lucide-react';
import clsx from 'clsx';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

/**
 * Builds the page list with ellipsis gaps, e.g. [1, 'ellipsis', 4, 5, 6, 'ellipsis', 12].
 * Always shows the first and last page plus a window around the current page.
 */
function getPageItems(current: number, total: number): (number | 'ellipsis')[] {
  if (total <= 1) return [1];

  const delta = 1;
  const range: number[] = [];
  for (let i = Math.max(2, current - delta); i <= Math.min(total - 1, current + delta); i++) {
    range.push(i);
  }

  const items: (number | 'ellipsis')[] = [1];
  if (range.length && range[0] > 2) items.push('ellipsis');
  items.push(...range);
  if (range.length && range[range.length - 1] < total - 1) items.push('ellipsis');
  items.push(total);
  return items;
}

const navButtonClass =
  'inline-flex items-center gap-1 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50';

export function Pagination({ currentPage, totalPages, onPageChange, className }: PaginationProps) {
  if (totalPages <= 1) return null;

  const items = getPageItems(currentPage, totalPages);

  return (
    <nav
      aria-label="Pagination"
      className={clsx(
        'mt-6 flex items-center justify-between gap-2 border-t border-slate-200 pt-4',
        className
      )}
    >
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        aria-label="Go to previous page"
        className={navButtonClass}
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="hidden sm:inline">Previous</span>
      </button>

      <ul className="flex items-center gap-1">
        {items.map((item, i) =>
          item === 'ellipsis' ? (
            <li key={`ellipsis-${i}`} className="px-1 text-sm text-slate-400" aria-hidden="true">
              …
            </li>
          ) : (
            <li key={item}>
              <button
                type="button"
                onClick={() => onPageChange(item)}
                aria-label={`Go to page ${item}`}
                aria-current={item === currentPage ? 'page' : undefined}
                className={clsx(
                  'inline-flex h-9 min-w-9 items-center justify-center rounded-md px-2.5 text-sm font-medium',
                  item === currentPage
                    ? 'bg-brand-600 text-white'
                    : 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
                )}
              >
                {item}
              </button>
            </li>
          )
        )}
      </ul>

      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        aria-label="Go to next page"
        className={navButtonClass}
      >
        <span className="hidden sm:inline">Next</span>
        <ChevronRight className="h-4 w-4" />
      </button>
    </nav>
  );
}
