'use client';

import { useState } from 'react';

import { AdminUsersHeader } from './components/admin-users-header';
import { UsersStats } from './components/users-stats';
import { UsersToolbar } from './components/users-toolbar';
import {
    AdminUser,
    UsersTable,
} from './components/users-table';
import { UsersPagination } from './components/users-pagination';
import { UserDetailsDialog } from './components/user-details-dialog';

export default function AdminUsersPage() {
    const [search, setSearch] = useState('');
    const [role, setRole] = useState('');
    const [status, setStatus] = useState('');
    const [emailVerified, setEmailVerified] =
        useState('');

    const [page, setPage] = useState(1);

    const [selectedUser, setSelectedUser] =
        useState<AdminUser | null>(null);

    const [detailsOpen, setDetailsOpen] =
        useState(false);

    // Temporary data
    // Replace with RTK Query data.
    const stats = {
        totalUsers: 1248,
        verifiedUsers: 1024,
        unverifiedUsers: 224,
        adminUsers: 6,
        normalUsers: 1242,
    };

    const users: AdminUser[] = [
        {
            id: '1',
            name: 'John Doe',
            email: 'john.doe@example.com',
            role: 'admin',
            status: 'active',
            emailVerified: true,
            avatarUrl: null,
            bio: 'Software Engineer',
            createdAt: '2023-01-01',
            updatedAt: '2023-01-01',
        },
        {
            id: '2',
            name: 'Jane Smith',
            email: 'jane.smith@example.com',
            role: 'user',
            status: 'active',
            emailVerified: true,
            avatarUrl: null,
            bio: 'Product Manager',
            createdAt: '2023-01-01',
            updatedAt: '2023-01-01',
        }, {
            id: '3',
            name: 'Alice Johnson',
            email: 'alice.johnson@example.com',
            role: 'user',
            status: 'active',
            emailVerified: true,
            avatarUrl: null,
            bio: 'UX Designer',
            createdAt: '2023-01-01',
            updatedAt: '2023-01-01',
        }
    ];

    const total = 1248;
    const limit = 20;
    const totalPages = Math.ceil(total / limit);

    const handleViewUser = (user: AdminUser) => {
        setSelectedUser(user);
        setDetailsOpen(true);
    };

    return (
        <main className="min-h-full bg-background">
            <div className="mx-auto w-full">

                <AdminUsersHeader
                    totalUsers={stats.totalUsers}
                />

                <UsersStats
                    totalUsers={stats.totalUsers}
                    verifiedUsers={stats.verifiedUsers}
                    unverifiedUsers={stats.unverifiedUsers}
                    adminUsers={stats.adminUsers}
                    normalUsers={stats.normalUsers}
                />

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

                <UsersTable
                    users={users}
                    onView={handleViewUser}
                />

                <UsersPagination
                    page={page}
                    totalPages={totalPages}
                    total={total}
                    limit={limit}
                    onPageChange={setPage}
                />

                <UserDetailsDialog
                    user={selectedUser}
                    open={detailsOpen}
                    onClose={() => {
                        setDetailsOpen(false);
                        setSelectedUser(null);
                    }}
                />
            </div>
        </main>
    );
}