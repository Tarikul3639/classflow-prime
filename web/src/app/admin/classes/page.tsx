"use client";

import { useState } from "react";

import { AdminClassesHeader } from "./components/admin-classes-header";
import { AdminClassesStats } from "./components/admin-classes-stats";
import { AdminClassesFilters } from "./components/admin-classes-filters";
import { AdminClassesTable } from "./components/admin-classes-table";

import {
    AdminClassQueryParams,
    ClassStatus,
    useGetAdminClassesQuery,
    useGetAdminClassStatsQuery,
} from "@/store/services/admin-classes.api";

export default function AdminClassesPage() {
    const [filters, setFilters] = useState<AdminClassQueryParams>({
        page: 1,
        limit: 10,
    });

    const {
        data: classesData,
        isLoading: isClassesLoading,
        isError: isClassesError,
    } = useGetAdminClassesQuery(filters);

    const {
        data: statsData,
        isLoading: isStatsLoading,
        isError: isStatsError,
    } = useGetAdminClassStatsQuery();

    const handlePageChange = (page: number) => {
        setFilters((prev) => ({
            ...prev,
            page,
        }));
    };

    const handleLimitChange = (limit: number) => {
        setFilters((prev) => ({
            ...prev,
            limit,
            page: 1,
        }));
    };

    return (
        <div className="min-w-0 space-y-6">
            <AdminClassesHeader />

            <AdminClassesStats
                data={statsData}
                isLoading={isStatsLoading}
                isError={isStatsError}
            />

            <AdminClassesFilters
                filters={filters}
                onFiltersChange={setFilters}
            />

            <AdminClassesTable
                classes={classesData?.classes ?? []}
                pagination={classesData?.pagination}
                isLoading={isClassesLoading}
                isError={isClassesError}
                onPageChange={handlePageChange}
                onLimitChange={handleLimitChange}
            />
        </div>
    );
}
