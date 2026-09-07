"use client";

import { useState } from "react";

import { AdminUsersHeader } from "./components/admin-users-header";
import { UsersStats } from "./components/users-stats";
import { UsersToolbar } from "./components/users-toolbar";
import { UsersTable } from "./components/users-table";
import { UsersPagination } from "./components/users-pagination";
import { UserDetailsDialog } from "./components/user-details-dialog";

import {
    useGetAdminUsersQuery,
    useGetAdminUserStatsQuery,
} from "@/store/services/admin-users.api";

import type { AdminUser } from "@/store/services/admin-users.api";

export default function AdminUsersPage() {
    // =========================
    // Filters & Pagination
    // =========================
    const [search, setSearch] = useState("");
    const [role, setRole] = useState("");
    const [status, setStatus] = useState("");
    const [emailVerified, setEmailVerified] = useState("");
    const [page, setPage] = useState(1);

    // =========================
    // User Details Dialog
    // =========================
    const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
    const [detailsOpen, setDetailsOpen] = useState(false);

    // =========================
    // API Queries
    // =========================
    const { data: stats, isLoading: statsLoading } =
        useGetAdminUserStatsQuery();

    const { data: usersData, isLoading: usersLoading } = useGetAdminUsersQuery({
        page,
        limit: 20,
        search,
        role: role as any,
        status: status as any,
        emailVerified:
            emailVerified === ""
                ? undefined
                : emailVerified === "true",
    });

    // =========================
    // Handlers
    // =========================
    const handleViewUser = (user: AdminUser) => {
        setSelectedUser(user);
        setDetailsOpen(true);
    };

    return (
        <main className="min-h-full bg-background">
            <div className="mx-auto w-full">
                {/* Header */}
                <AdminUsersHeader totalUsers={stats?.totalUsers} />

                {/* Statistics */}
                <UsersStats
                    isLoading={statsLoading}
                    totalUsers={stats?.totalUsers ?? 0}
                    verifiedUsers={stats?.verifiedUsers ?? 0}
                    unverifiedUsers={stats?.unverifiedUsers ?? 0}
                    adminUsers={stats?.adminUsers ?? 0}
                    normalUsers={stats?.normalUsers ?? 0}
                    bannedUsers={stats?.bannedUsers ?? 0}
                />

                {/* Toolbar */}
                <UsersToolbar
                    search={search}
                    role={role}
                    status={status}
                    emailVerified={emailVerified}
                    onSearchChange={(value) => {
                        setSearch(value);
                        setPage(1);
                    }}
                    onRoleChange={(value) => {
                        setRole(value);
                        setPage(1);
                    }}
                    onStatusChange={(value) => {
                        setStatus(value);
                        setPage(1);
                    }}
                    onEmailVerifiedChange={(value) => {
                        setEmailVerified(value);
                        setPage(1);
                    }}
                />

                {/* Users Table */}
                <UsersTable
                    users={usersData?.users ?? []}
                    onView={handleViewUser}
                />

                {/* Pagination */}
                <UsersPagination
                    page={page}
                    totalPages={usersData?.totalPages ?? 1}
                    total={usersData?.total ?? 0}
                    limit={usersData?.limit ?? 20}
                    onPageChange={setPage}
                />

                {/* User Details */}
                <UserDetailsDialog
                    user={selectedUser}
                    open={detailsOpen}
                    onClose={() => {
                        setDetailsOpen(false);
                        setSelectedUser(null);
                    }}
                />

                {/* Loading State */}
                {usersLoading && (
                    <div className="py-4 text-center text-sm text-muted-foreground">
                        Loading users...
                    </div>
                )}
            </div>
        </main>
    );
}