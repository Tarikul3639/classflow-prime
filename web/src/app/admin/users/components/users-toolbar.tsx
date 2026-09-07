'use client';

import { Search, SlidersHorizontal } from 'lucide-react';
import { UserStatus, UserRole } from '@/store/services/admin-users.api';

interface UsersToolbarProps {
  search: string;
  role: string;
  status: string;
  emailVerified: string;

  onSearchChange: (value: string) => void;
  onRoleChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onEmailVerifiedChange: (value: string) => void;
}

export function UsersToolbar({
  search,
  role,
  status,
  emailVerified,
  onSearchChange,
  onRoleChange,
  onStatusChange,
  onEmailVerifiedChange,
}: UsersToolbarProps) {
  return (
    <div className="mt-6 rounded-lg border border-border bg-card p-4">
      <div className="mb-4 flex items-center gap-2">
        <SlidersHorizontal className="size-4 text-muted-foreground" />

        <h2 className="text-sm font-medium">
          Filters
        </h2>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {/* Search */}
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

          <input
            value={search}
            onChange={(event) =>
              onSearchChange(event.target.value)
            }
            placeholder="Search by name or email..."
            className="h-10 w-full rounded-md border border-input bg-background pl-9 pr-3 text-sm outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
          />
        </div>

        {/* Role */}
        <select
          value={role}
          onChange={(event) =>
            onRoleChange(event.target.value)
          }
          className="h-10 rounded-md border border-input bg-background px-3 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
        >
          <option value="">All Roles</option>
          <option value={UserRole.USER}>User</option>
          <option value={UserRole.ADMIN}>Admin</option>
        </select>

        {/* Status */}
        <select
          value={status}
          onChange={(event) =>
            onStatusChange(event.target.value)
          }
          className="h-10 rounded-md border border-input bg-background px-3 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
        >
          <option value="">All Status</option>
          <option value={UserStatus.ACTIVE}>Active</option>
          <option value={UserStatus.SUSPENDED}>Suspended</option>
          <option value={UserStatus.BANNED}>Banned</option>
        </select>

        {/* Email Verification */}
        <select
          value={emailVerified}
          onChange={(event) =>
            onEmailVerifiedChange(event.target.value)
          }
          className="h-10 rounded-md border border-input bg-background px-3 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
        >
          <option value="">All Verification</option>
          <option value="true">Verified</option>
          <option value="false">Unverified</option>
        </select>
      </div>
    </div>
  );
}