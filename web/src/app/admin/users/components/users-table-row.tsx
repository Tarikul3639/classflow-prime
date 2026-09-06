import { Eye } from 'lucide-react';

import { AdminUser } from './users-table';

interface UsersTableRowProps {
    user: AdminUser;
    onView: (user: AdminUser) => void;
}

export function UsersTableRow({
    user,
    onView,
}: UsersTableRowProps) {
    return (
        <tr className="border-b border-border last:border-0 hover:bg-muted/30">
            {/* User */}
            <td className="px-5 py-4">
                <div className="flex items-center gap-3">
                    {user.avatarUrl ? (
                        <img
                            src={user.avatarUrl}
                            alt={user.name}
                            className="size-9 rounded-full object-cover"
                        />
                    ) : (
                        <div className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
                            {user.name.charAt(0).toUpperCase()}
                        </div>
                    )}

                    <div className="min-w-0">
                        <p className="truncate font-medium">
                            {user.name}
                        </p>

                        <p className="truncate text-xs text-muted-foreground">
                            {user.email}
                        </p>
                    </div>
                </div>
            </td>

            {/* Role */}
            <td className="px-5 py-4">
                <span className="rounded-md bg-muted px-2 py-1 text-xs font-medium">
                    {user.role}
                </span>
            </td>

            {/* Status */}
            <td className="px-5 py-4">
                <span
                    className={[
                        'rounded-md px-2 py-1 text-xs font-medium',
                        user.status === 'ACTIVE' &&
                        'bg-primary/10 text-primary',
                        user.status === 'SUSPENDED' &&
                        'bg-yellow-100 text-yellow-700',
                        user.status === 'BANNED' &&
                        'bg-red-100 text-red-700',
                    ]
                        .filter(Boolean)
                        .join(' ')}
                >
                    {user.status}
                </span>
            </td>

            {/* Verification */}
            <td className="px-5 py-4">
                <span
                    className={
                        user.emailVerified
                            ? 'text-primary'
                            : 'text-muted-foreground'
                    }
                >
                    {user.emailVerified
                        ? 'Verified'
                        : 'Unverified'}
                </span>
            </td>

            {/* Joined */}
            <td className="whitespace-nowrap px-5 py-4 text-muted-foreground">
                {new Date(user.createdAt).toLocaleDateString(
                    'en-US',
                    {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                    },
                )}
            </td>

            {/* Action */}
            <td className="px-5 py-4 text-right">
                <button
                    type="button"
                    onClick={() => onView(user)}
                    className="inline-flex size-8 items-center justify-center rounded-md border border-border text-muted-foreground transition hover:bg-muted hover:text-foreground cursor-pointer"
                    aria-label={`View ${user.name}`}
                >
                    <Eye className="size-4" />
                </button>
            </td>
        </tr>
    );
}