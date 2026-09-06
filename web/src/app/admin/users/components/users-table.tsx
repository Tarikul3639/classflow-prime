import { Users } from 'lucide-react';

import { UsersTableRow } from './users-table-row';
import { EmptyState } from '@/components/ui/EmptyState';

export interface AdminUser {
    id: string;
    name: string;
    email: string;
    role: string;
    status: string;
    emailVerified: boolean;
    avatarUrl: string | null;
    bio?: string;
    createdAt: string;
    updatedAt: string;
}

interface UsersTableProps {
    users: AdminUser[];
    onView: (user: AdminUser) => void;
}

export function UsersTable({
    users,
    onView,
}: UsersTableProps) {
    return (
        <div className="mt-6 overflow-hidden rounded-lg border border-border bg-card">
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-border bg-muted/30 text-left">
                            <th className="px-5 py-3 font-medium">
                                User
                            </th>

                            <th className="px-5 py-3 font-medium">
                                Role
                            </th>

                            <th className="px-5 py-3 font-medium">
                                Status
                            </th>

                            <th className="px-5 py-3 font-medium">
                                Verification
                            </th>

                            <th className="px-5 py-3 font-medium">
                                Joined
                            </th>

                            <th className="px-5 py-3 text-right font-medium">
                                Action
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {users.length > 0 ? (
                            users.map((user) => (
                                <UsersTableRow
                                    key={user.id}
                                    user={user}
                                    onView={onView}
                                />
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan={6}
                                    className="h-48 text-center"
                                >
                                    <EmptyState
                                        size="sm"
                                        icon={Users}
                                        title="No users found"
                                        description="There are no users to display. Please adjust your filters or try again later."
                                    />
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}