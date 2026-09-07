import type {
    AdminUser,
} from "@/store/services/admin-users.api";

import {
    ImagePreview,
} from "@/components/ui/image-preview";

import {
    UserRoleBadge,
} from "./user-role-badge";

import {
    UserStatusBadge,
} from "./user-status-badge";

import {
    UserActions,
} from "./user-actions";


interface UsersTableRowProps {

    user: AdminUser;

    onView: (
        user: AdminUser,
    ) => void;
}


export function UsersTableRow({
    user,
    onView,
}: UsersTableRowProps) {

    return (

        <tr className="border-b border-border last:border-0 hover:bg-muted/30">

            {/* User */}

            <td className="w-62.5 px-3 py-3">

                <div className="flex items-center gap-2.5">

                    {user.avatarUrl ? (

                        <ImagePreview
                            src={user.avatarUrl}
                            alt={user.name}
                            className="size-10 shrink-0 rounded-full object-cover"
                        />

                    ) : (

                        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">

                            {user.name
                                .charAt(0)
                                .toUpperCase()}

                        </div>

                    )}


                    <div className="min-w-0 max-w-45">

                        <button
                            type="button"
                            onClick={() => onView(user)}
                            className="block w-full truncate text-left text-sm font-medium hover:text-primary hover:underline"
                        >
                            {user.name}
                        </button>


                        <p className="truncate text-xs text-muted-foreground">

                            {user.email}

                        </p>

                    </div>

                </div>

            </td>


            {/* Role */}

            <td className="w-27.5 px-3 py-3">

                <UserRoleBadge
                    role={user.role}
                />

            </td>


            {/* Status */}

            <td className="w-30 px-3 py-3">

                <UserStatusBadge
                    status={user.status}
                />

            </td>


            {/* Verification */}

            <td className="w-27.5 px-3 py-3">

                <span
                    className={`text-xs font-medium ${
                        user.emailVerified
                            ? "text-primary"
                            : "text-muted-foreground"
                    }`}
                >

                    {user.emailVerified
                        ? "Verified"
                        : "Unverified"}

                </span>

            </td>


            {/* Joined */}

            <td className="w-32.5 whitespace-nowrap px-3 py-3 text-xs text-muted-foreground">

                {new Date(
                    user.createdAt,
                ).toLocaleDateString(
                    "en-US",
                    {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                    },
                )}

            </td>


            {/* Actions */}

            <td className="w-12.5 px-3 py-3 text-right">

                <UserActions
                    user={user}
                    onView={onView}
                />

            </td>

        </tr>
    );
}