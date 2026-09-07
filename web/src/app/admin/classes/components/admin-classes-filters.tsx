"use client";

import { Search, RotateCcw, SlidersHorizontal } from "lucide-react";

import {
    AdminClassQueryParams,
    ClassStatus,
} from "@/store/services/admin-classes.api";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface AdminClassesFiltersProps {
    filters: AdminClassQueryParams;
    onFiltersChange: (filters: AdminClassQueryParams) => void;
}

export function AdminClassesFilters({
    filters,
    onFiltersChange,
}: AdminClassesFiltersProps) {
    const updateFilter = (
        key: keyof AdminClassQueryParams,
        value: string | boolean | undefined,
    ) => {
        onFiltersChange({
            ...filters,
            [key]: value,
            page: 1,
        });
    };

    const handleReset = () => {
        onFiltersChange({
            page: 1,
            limit: filters.limit ?? 10,
        });
    };

    return (
        <div className="flex flex-col rounded-sm border border-border bg-background p-4">
            {/* Header */}
            <div className="mb-4 flex items-center gap-2">
                <SlidersHorizontal className="size-4 text-muted-foreground" />
                <h2 className="text-sm font-medium">
                    Filters
                </h2>
            </div>

            <div className="flex flex-1 flex-col gap-4 lg:flex-row lg:items-center lg:gap-2">
                {/* Search */}
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                    <Input
                        value={filters.search ?? ""}
                        onChange={(event) =>
                            updateFilter("search", event.target.value || undefined)
                        }
                        placeholder="Search classes..."
                        className="pl-9 h-10 rounded-sm"
                    />
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    {/* Status */}
                    <select
                        value={filters.status ?? ""}
                        onChange={(event) =>
                            updateFilter(
                                "status",
                                event.target.value
                                    ? (event.target.value as ClassStatus)
                                    : undefined,
                            )
                        }
                        className="h-9 rounded-sm border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                    >
                        <option value="">All Status</option>
                        <option value={ClassStatus.ACTIVE}>Active</option>
                        <option value={ClassStatus.ENDED}>Ended</option>
                        <option value={ClassStatus.UPCOMING}>Upcoming</option>
                    </select>

                    {/* Block Status */}

                    <select
                        value={
                            filters.isBlocked === undefined ? "" : String(filters.isBlocked)
                        }
                        onChange={(event) => {
                            const value = event.target.value;

                            updateFilter(
                                "isBlocked",
                                value === "" ? undefined : value === "true",
                            );
                        }}
                        className="h-9 rounded-sm border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                    >
                        <option value="">All Classes</option>
                        <option value="false">Unblocked</option>
                        <option value="true">Blocked</option>
                    </select>

                    {/* Enrollment */}

                    <select
                        value={
                            filters.allowEnroll === undefined
                                ? ""
                                : String(filters.allowEnroll)
                        }
                        onChange={(event) => {
                            const value = event.target.value;

                            updateFilter(
                                "allowEnroll",
                                value === "" ? undefined : value === "true",
                            );
                        }}
                        className="h-9 rounded-sm border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                    >
                        <option value="">All Enrollment</option>
                        <option value="true">Enrollment Open</option>
                        <option value="false">Enrollment Closed</option>
                    </select>

                    {/* Reset */}
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleReset}
                        className="gap-2 cursor-pointer border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring rounded-sm"
                    >
                        <RotateCcw className="size-4" />
                        Reset
                    </Button>
                </div>
            </div>
        </div>
    );
}
