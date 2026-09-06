import { baseApi } from "./base-api";

/*
    API Response type
    This is a generic type that can be used to type the response from any API endpoint.
    It contains a success flag, a message, a status code, and the actual data returned from the API.
 */
export interface ApiResponse<T> {
    success: boolean;
    message: string | null;
    status: number | string | null;
    data: T;
}

/*
    Admin Dashboard types
 */
export interface AdminDashboardStats {
    totalUsers: number;
    totalClasses: number;
    activeClasses: number;
    totalEnrollments: number;
    totalFaculty: number;
    totalAgents: number;
    activeAgents: number;
}
export interface AdminDashboardUser {
    id: string;
    name: string;
    email: string;
    role: string;
    status: string;
    emailVerified: boolean;
    avatarUrl: string | null;
    createdAt: string;
}
export interface AdminDashboardClass {
    id: string;
    className: string;
    department?: string;
    semester?: string;
    themeColor: string;
    coverImage: string | null;
    status: string;
    allowEnroll: boolean;
    createdAt: string;
}

export interface AdminDashboardUserVerification {
    verified: number;
    unverified: number;
}

export interface UserStatisticsItem {
    month: string;
    users: number;
}
export interface AdminDashboardResponse {
    stats: AdminDashboardStats;
    recentUsers: AdminDashboardUser[];
    recentClasses: AdminDashboardClass[];
    userStatistics: UserStatisticsItem[];
    userVerification: AdminDashboardUserVerification;
}

export interface AdminDashboardQueryParams {
    recentUsersLimit?: number;
    recentClassesLimit?: number;
}

export const adminDashboardApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAdminDashboard: builder.query<
            AdminDashboardResponse,
            AdminDashboardQueryParams
        >({
            query: (params) => ({ url: "/admin/dashboard", method: "GET", params }),
            // Pick out data and prevent nested properties in a hook or selector
            transformResponse: (
                response: ApiResponse<AdminDashboardResponse>,
            ): AdminDashboardResponse => {
                return response.data;
            },

            providesTags: ["AdminDashboard"],
        }),
    }),
});

export const { useGetAdminDashboardQuery } = adminDashboardApi;
