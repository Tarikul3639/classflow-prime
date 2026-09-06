import { Users } from 'lucide-react';

interface AdminUsersHeaderProps {
  totalUsers?: number;
}

export function AdminUsersHeader({
  totalUsers = 0,
}: AdminUsersHeaderProps) {
  return (
    <header className="mb-6 flex flex-col gap-4 border-b border-border pb-5 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div className="flex items-center gap-2">
          <Users className="size-5 text-primary" />

          <h1 className="text-2xl font-semibold tracking-tight">
            Users
          </h1>
        </div>

        <p className="mt-1 text-sm text-muted-foreground">
          Manage and monitor ClassFlow Prime users.
        </p>
      </div>

      <div className="hidden sm:block rounded-md border border-border bg-card px-4 py-2">
        <p className="text-xs text-muted-foreground">
          Total Users
        </p>

        <p className="text-lg font-semibold">
          {totalUsers.toLocaleString()}
        </p>
      </div>
    </header>
  );
}