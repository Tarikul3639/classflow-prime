import type { UserRole } from "@/store/services/admin-users.api";

interface UserRoleBadgeProps {
    role: UserRole;
}

export function UserRoleBadge({ role }: UserRoleBadgeProps) {
    const styles = {
        user: "bg-muted text-muted-foreground",
        admin: "bg-blue-100 text-blue-700",
        super_admin: "bg-purple-100 text-purple-700",
    };

    const labels = {
        user: "User",
        admin: "Admin",
        super_admin: "Super Admin",
    };

    return (
        <span
            className={[
                "rounded-md px-2 py-1 text-xs font-medium",
                styles[role],
            ].join(" ")}
        >
            {labels[role]}
        </span>
    );
}
