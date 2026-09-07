import { Users } from "lucide-react";

import type {
    AdminUser,
} from "@/store/services/admin-users.api";

import { EmptyState } from "@/components/ui/EmptyState";

import {
    UsersTableRow,
} from "./users-table-row";


interface UsersTableProps {

    users: AdminUser[];

    onView: (
        user: AdminUser,
    ) => void;
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

                            {/* User */}

                            <th className="px-3 py-3 font-medium">
                                User
                            </th>


                            {/* Role */}

                            <th className="px-3 py-3 font-medium">
                                Role
                            </th>


                            {/* Status */}

                            <th className="px-3 py-3 font-medium">
                                Status
                            </th>


                            {/* Joined */}

                            <th className="px-3 py-3 font-medium">
                                Joined
                            </th>


                            {/* Action */}

                            <th className="px-3 py-3 text-right font-medium">
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
                                    colSpan={5}
                                    className="h-48 text-center"
                                >

                                    <EmptyState
                                        size="sm"
                                        icon={Users}
                                        title="No users found"
                                        description="There are no users to display."
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