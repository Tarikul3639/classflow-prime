import { baseApi } from './base-api';

export enum ClassStatus {
    ACTIVE = 'active',
    ENDED = 'ended',
    UPCOMING = 'upcoming',
}

export enum EnrollmentRole {
    INSTRUCTOR = 'instructor',
    LEARNER = 'learner',
}

export enum UserStatus {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
    BANNED = 'banned',
    SUSPENDED = 'suspended',
}

// ============================================
// API RESPONSE
// ============================================

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    status: number;
    data: T;
}

// ============================================
// PAGINATION
// ============================================

export interface Pagination {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

export interface AdminClassCreator {
    _id: string;
    name: string;
    email: string;
    avatarUrl: string | null;
}

// ============================================
// ADMIN CLASS
// ============================================

export interface AdminClass {
    _id: string;
    className: string;
    enrollCode: string;
    department?: string;
    semester?: string;
    themeColor: string;
    coverImage?: string | null;
    status: ClassStatus;
    allowEnroll: boolean;

    isBlocked: boolean;
    blockedReason?: string | null;
    blockedAt?: string | null;

    createdBy?: AdminClassCreator;
    
    createdAt: string;
    updatedAt: string;
    totalMembers: number;
    totalTeachers: number;
    totalLearners: number;
}

// ============================================
// ADMIN CLASSES
// ============================================

export interface AdminClassesData {
    classes: AdminClass[];
    pagination: Pagination;
}

export type AdminClassesResponse = ApiResponse<AdminClassesData>;

// ============================================
// ADMIN CLASS STATS
// ============================================

export interface AdminClassStats {
    totalClasses: number;
    activeClasses: number;
    endedClasses: number;
    upcomingClasses: number;
    blockedClasses: number;
}

export type AdminClassStatsResponse = ApiResponse<AdminClassStats>;

// ============================================
// CLASS MEMBERS
// ============================================

export interface AdminClassMember {
    enrollmentId: string;
    userId: string;
    name: string;
    email: string;
    avatarUrl: string | null;
    emailVerified: boolean;
    userStatus: UserStatus;
    role: EnrollmentRole;
    enrolledAt: string;
}

export interface AdminClassMembersData {
    members: AdminClassMember[];
    pagination: Pagination;
}

export type AdminClassMembersResponse = ApiResponse<AdminClassMembersData>;

// ============================================
// QUERY
// ============================================

export interface AdminClassQueryParams {
    page?: number;
    limit?: number;
    search?: string;
    status?: ClassStatus;
    isBlocked?: boolean;
    allowEnroll?: boolean;
    department?: string;
    semester?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

// ============================================
// MUTATION REQUEST TYPES
// ============================================

export interface BlockAdminClassRequest {
    classId: string;
    isBlocked: boolean;
    blockedReason?: string;
}

export interface UnblockAdminClassRequest {
    classId: string;
    isBlocked: boolean;
}

export interface UpdateAdminClassStatusRequest {
    classId: string;
    status: ClassStatus;
}

export interface UpdateAdminClassEnrollmentRequest {
    classId: string;
    allowEnroll: boolean;
}

export interface UpdateAdminClassMemberRoleRequest {
    classId: string;
    memberId: string;
    role: EnrollmentRole;
}

// ============================================
// RTK QUERY API ENDPOINTS
// ============================================

export const adminClassesApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAdminClassStats: builder.query<AdminClassStats, void>({
            query: () => ({
                url: '/admin/classes/stats',
                method: 'GET',
            }),

            // Pick out data and prevent nested properties in a hook or selector
            transformResponse: (response: AdminClassStatsResponse) => response.data,

            providesTags: ['AdminClasses'],
        }),

        getAdminClasses: builder.query<AdminClassesData, AdminClassQueryParams | void>({
            query: (params) => ({
                url: '/admin/classes',
                method: 'GET',
                params: params ?? undefined,
            }),

            // Pick out data and prevent nested properties in a hook or selector
            transformResponse: (response: AdminClassesResponse) => response.data,

            providesTags: ['AdminClasses'],
        }),

        getAdminClassMembers: builder.query<AdminClassMembersData, string>({
            query: (classId) => ({
                url: `/admin/classes/${classId}/members`,
                method: 'GET',
            }),

            // Pick out data and prevent nested properties in a hook or selector
            transformResponse: (response: AdminClassMembersResponse) => response.data,

            providesTags: ['AdminClasses'],
        }),

        blockAdminClass: builder.mutation<void, BlockAdminClassRequest>({
            query: ({ classId, ...body }) => ({
                url: `/admin/classes/${classId}/block`,
                method: 'PATCH',
                body,
            }),
            invalidatesTags: ['AdminClasses'],
        }),

        unblockAdminClass: builder.mutation<void, UnblockAdminClassRequest>({
            query: ({ classId, isBlocked }) => ({
                url: `/admin/classes/${classId}/unblock`,
                method: 'PATCH',
                body: { isBlocked },
            }),
            invalidatesTags: ['AdminClasses'],
        }),

        updateAdminClassStatus: builder.mutation<void, UpdateAdminClassStatusRequest>({
            query: ({ classId, status }) => ({
                url: `/admin/classes/${classId}/status`,
                method: 'PATCH',
                body: { status },
            }),
            invalidatesTags: ['AdminClasses'],
        }),

        updateAdminClassEnrollment: builder.mutation<void, UpdateAdminClassEnrollmentRequest>({
            query: ({ classId, allowEnroll }) => ({
                url: `/admin/classes/${classId}/enrollment`,
                method: 'PATCH',
                body: { allowEnroll },
            }),
            invalidatesTags: ['AdminClasses'],
        }),

        updateAdminClassMemberRole: builder.mutation<void, UpdateAdminClassMemberRoleRequest>({
            query: ({ classId, memberId, role }) => ({
                url: `/admin/classes/${classId}/members/${memberId}/role`,
                method: 'PATCH',
                body: { role },
            }),
            invalidatesTags: ['AdminClasses'],
        }),
    }),
});

export const {
    useGetAdminClassStatsQuery,
    useGetAdminClassesQuery,
    useGetAdminClassMembersQuery,
    useBlockAdminClassMutation,
    useUnblockAdminClassMutation,
    useUpdateAdminClassStatusMutation,
    useUpdateAdminClassEnrollmentMutation,
    useUpdateAdminClassMemberRoleMutation,
} = adminClassesApi;
