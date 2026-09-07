import { baseApi } from "./base-api";

export interface AdminUserStats {
    totalUsers: number;
    verifiedUsers: number;
    unverifiedUsers: number;
    adminUsers: number;
    normalUsers: number;
    bannedUsers: number;
}

export interface AdminUserQuery {
    page?: number;
    limit?: number;

    search?: string;

    role?: UserRole;
    status?: UserStatus;
    emailVerified?: boolean;

    sortBy?: 'createdAt' | 'name' | 'email';
    sortOrder?: 'asc' | 'desc';
}

export interface ApiResponse<T> {
    data: T;
    success: boolean;
    status: number;
    message: string;
}

export enum UserRole {
    USER = 'user',
    ADMIN = 'admin',
    SUPER_ADMIN = 'super_admin'
}

export enum UserStatus {
    ACTIVE = 'ACTIVE',
    SUSPENDED = 'SUSPENDED',
    BANNED = 'BANNED',
}

export interface AdminUser {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    emailVerified: boolean;
    avatarUrl: string | null;
    bio: string;
    status: UserStatus
    createdAt: Date;
    updatedAt: Date;
}

export interface AdminUserResponse {
    users: AdminUser[];

    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export const adminUsersApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAdminUsers: builder.query<AdminUserResponse, AdminUserQuery>({
            query: (query) => {
                // Filter out key-value pairs where the value is empty string, null, or undefined
                const cleanParams = Object.fromEntries(
                    Object.entries(query).filter(
                        ([_, value]) => value !== '' && value !== null && value !== undefined
                    )
                );

                return {
                    url: '/admin/users',
                    method: 'GET',
                    params: cleanParams,
                };
            },

            providesTags: ["AdminUsers"],

            // Pick out data and prevent nested properties in a hook or selector
            transformResponse: (response: ApiResponse<AdminUserResponse>) => response.data,
        }),
        getAdminUser: builder.query({
            query: (userId: string) => ({
                url: `/admin/users/${userId}`,
                method: "GET",
            }),

            providesTags: ["AdminUsers"],
        }),
        updateAdminUserStatus: builder.mutation({
            query: ({ userId, status }) => ({
                url: `/admin/users/${userId}/status`,
                method: "PATCH",
                body: { status },
            }),

            invalidatesTags: ["AdminUsers"],
        }),

        updateAdminUserRole: builder.mutation({
            query: ({ userId, role }) => ({
                url: `/admin/users/${userId}/role`,
                method: "PATCH",
                body: { role },
            }),

            invalidatesTags: ["AdminUsers"],
        }),

        verifyAdminUserEmail: builder.mutation({
            query: (userId: string) => ({
                url: `/admin/users/${userId}/verify-email`,
                method: "PATCH",
            }),

            invalidatesTags: ["AdminUsers"],
        }),

        sendVerificationEmail: builder.mutation({
            query: (userId: string) => ({
                url: `/admin/users/${userId}/send-verification-email`,
                method: "POST",
            }),

            invalidatesTags: ["AdminUsers"],
        }),

        sendPasswordResetEmail: builder.mutation({
            query: (userId: string) => ({
                url: `/admin/users/${userId}/send-password-reset-email`,
                method: "POST",
            }),

            invalidatesTags: ["AdminUsers"],
        }),

        getAdminUserActivity: builder.query({
            query: (userId: string) => ({
                url: `/admin/users/${userId}/activity`,
                method: "GET",
            }),

            providesTags: ["AdminUsers"],
        }),

        getAdminUserStats: builder.query<AdminUserStats, void>({
            query: () => ({
                url: "/admin/users/stats",
                method: "GET",
            }),

            // Pick out data and prevent nested properties in a hook or selector
            transformResponse: (response: ApiResponse<AdminUserStats>) => response.data,

            providesTags: ["AdminUsers"],
        }),
    }),
});

export const {
    useGetAdminUsersQuery,
    useGetAdminUserQuery,
    useUpdateAdminUserStatusMutation,
    useUpdateAdminUserRoleMutation,
    useGetAdminUserActivityQuery,
    useGetAdminUserStatsQuery,
    useVerifyAdminUserEmailMutation,
    useSendVerificationEmailMutation,
    useSendPasswordResetEmailMutation,
} = adminUsersApi;
