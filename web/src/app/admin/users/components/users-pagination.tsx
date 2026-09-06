import {
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface UsersPaginationProps {
  page: number;
  totalPages: number;
  total: number;
  limit: number;

  onPageChange: (page: number) => void;
}

export function UsersPagination({
  page,
  totalPages,
  total,
  limit,
  onPageChange,
}: UsersPaginationProps) {
  const start =
    total === 0 ? 0 : (page - 1) * limit + 1;

  const end = Math.min(page * limit, total);

  return (
    <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-muted-foreground">
        Showing {start}–{end} of {total} users
      </p>

      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="inline-flex size-9 items-center justify-center rounded-md border border-border disabled:pointer-events-none disabled:opacity-40"
        >
          <ChevronLeft className="size-4" />
        </button>

        <span className="px-2 text-sm">
          Page {page} of {totalPages || 1}
        </span>

        <button
          type="button"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          className="inline-flex size-9 items-center justify-center rounded-md border border-border disabled:pointer-events-none disabled:opacity-40"
        >
          <ChevronRight className="size-4" />
        </button>
      </div>
    </div>
  );
}