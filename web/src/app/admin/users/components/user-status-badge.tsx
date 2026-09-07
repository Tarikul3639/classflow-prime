import type { UserStatus } from "@/store/services/admin-users.api";

interface UserStatusBadgeProps {
    status: UserStatus;
}

export function UserStatusBadge({ status }: UserStatusBadgeProps) {
    const styles = {
        ACTIVE: "bg-primary/10 text-primary",
        SUSPENDED: "bg-yellow-100 text-yellow-700",
        BANNED: "bg-red-100 text-red-700",
    };

    const labels = {
        ACTIVE: "Active",
        SUSPENDED: "Suspended",
        BANNED: "Banned",
    };

    return (
        <span
            className={[
                "rounded-md px-2 py-1 text-xs font-medium",
                styles[status],
            ].join(" ")}
        >
            {labels[status]}
        </span>
    );
}
