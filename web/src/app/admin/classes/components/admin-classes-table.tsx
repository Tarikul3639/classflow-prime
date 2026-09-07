"use client";

import { Users } from "lucide-react";

import type { AdminClass, Pagination } from "@/store/services/admin-classes.api";
import { EmptyState } from "@/components/ui/EmptyState";
import { AdminClassesTableRow } from "./admin-classes-table-row";

interface AdminClassesTableProps {
    classes: AdminClass[];
    pagination?: Pagination;
    isLoading?: boolean;
    isError?: boolean;
    onPageChange?: (page: number) => void;
    onLimitChange?: (limit: number) => void;
}

function ClassesTableSkeleton() {
    return (
        <>
            {Array.from({ length: 6 }).map((_, index) => (
                <tr key={index} className="border-b border-border">
                    <td className="px-4 py-4">
                        <div className="h-4 w-40 animate-pulse rounded bg-muted" />
                        <div className="mt-2 h-3 w-24 animate-pulse rounded bg-muted" />
                    </td>
                    <td className="px-4 py-4">
                        <div className="h-8 w-32 animate-pulse rounded bg-muted" />
                    </td>
                    <td className="px-4 py-4">
                        <div className="h-5 w-20 animate-pulse rounded bg-muted" />
                    </td>
                    <td className="px-4 py-4">
                        <div className="h-5 w-20 animate-pulse rounded bg-muted" />
                    </td>
                    <td className="px-4 py-4">
                        <div className="h-4 w-24 animate-pulse rounded bg-muted" />
                    </td>
                    <td className="px-4 py-4">
                        <div className="h-4 w-20 animate-pulse rounded bg-muted" />
                    </td>
                    <td className="px-4 py-4">
                        <div className="ml-auto h-8 w-8 animate-pulse rounded bg-muted" />
                    </td>
                </tr>
            ))}
        </>
    );
}

export function AdminClassesTable({
    classes,
    pagination,
    isLoading = false,
    isError = false,
    onPageChange,
    onLimitChange,
}: AdminClassesTableProps) {
    /* ============================================
        ERROR STATE
    ============================================ */
    if (isError) {
        return (
            <EmptyState
                icon={Users}
                title="Failed to load classes"
                description="Something went wrong while loading classes."
            />
        );
    }

    /* ============================================
        EMPTY STATE
    ============================================ */
    if (!isLoading && classes.length === 0) {
        return (
            <EmptyState
                icon={Users}
                title="No classes found"
                description="There are no classes matching your current filters."
            />
        );
    }

    return (
        <div className="overflow-hidden rounded-sm border border-border bg-background">
            {/* TABLE */}
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    {/* TABLE HEADER */}
                    <thead className="border-b border-border bg-muted/40">
                        <tr>
                            <th className="px-4 py-3 text-left font-medium">Class</th>
                            <th className="px-4 py-3 text-left font-medium">Creator</th>
                            <th className="px-4 py-3 text-left font-medium">Status</th>
                            <th className="px-4 py-3 text-left font-medium">Enrollment</th>
                            <th className="px-4 py-3 text-left font-medium">Members</th>
                            <th className="px-4 py-3 text-left font-medium">Created</th>
                            <th className="px-4 py-3 text-right font-medium">Actions</th>
                        </tr>
                    </thead>

                    {/* TABLE BODY */}
                    <tbody>
                        {isLoading ? (
                            <ClassesTableSkeleton />
                        ) : (
                            classes.map((classItem) => (
                                <AdminClassesTableRow key={classItem._id} classItem={classItem}  />
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* PAGINATION */}
            {!isLoading && pagination && (
                <div className="flex flex-col gap-4 border-t border-border px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm text-muted-foreground">
                        Showing page {pagination.page} of {pagination.totalPages} ({pagination.total} classes)
                    </p>

                    <div className="flex items-center gap-3">
                        {/* LIMIT */}
                        {onLimitChange && (
                            <select
                                value={pagination.limit}
                                onChange={(event) => onLimitChange(Number(event.target.value))}
                                className="h-8 rounded-sm border border-border bg-background px-2 text-sm"
                            >
                                <option value={5}>5</option>
                                <option value={10}>10</option>
                                <option value={20}>20</option>
                                <option value={50}>50</option>
                            </select>
                        )}

                        {/* PREVIOUS */}
                        <button
                            type="button"
                            disabled={pagination.page <= 1}
                            onClick={() => onPageChange?.(pagination.page - 1)}
                            className="h-8 rounded-sm border border-border px-3 text-sm hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Previous
                        </button>

                        {/* NEXT */}
                        <button
                            type="button"
                            disabled={pagination.page >= pagination.totalPages}
                            onClick={() => onPageChange?.(pagination.page + 1)}
                            className="h-8 rounded-sm border border-border px-3 text-sm hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}