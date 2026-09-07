import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseQuery = fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_API_PREFIX}`,
    credentials: "include"
})

export const baseApi = createApi({
    baseQuery,
    tagTypes: [
        "AdminDashboard",
        "AdminUsers",
        "AdminUser",
        "AdminUserActivity",
        "AdminClasses",
    ],
    reducerPath: "api",
    endpoints: () => ({}),
})