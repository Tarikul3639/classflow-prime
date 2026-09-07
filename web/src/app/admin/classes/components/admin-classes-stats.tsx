"use client";

import {
    BookOpen,
    CheckCircle2,
    CalendarCheck,
    CalendarClock,
    Ban,
} from "lucide-react";

import { AdminClassStats } from "@/store/services/admin-classes.api";

interface StatCardProps {
    title: string;
    value: number;
    icon: React.ElementType;
    description: string;
}

function StatCard({ title, value, icon: Icon, description }: StatCardProps) {
    return (
        <div className="rounded-sm border border-border bg-background p-5">
            {" "}
            <div className="flex items-start justify-between">
                {" "}
                <div>
                    {" "}
                    <p className="text-sm font-medium text-muted-foreground">{title} </p>
                    <h3 className="mt-2 text-2xl font-semibold tracking-tight">
                        {value}
                    </h3>
                    <p className="mt-1 text-xs text-muted-foreground">{description}</p>
                </div>
                <div className="rounded-sm border border-border p-2">
                    <Icon className="size-5 text-muted-foreground" />
                </div>
            </div>
        </div>
    );
}

function StatsSkeleton() {
    return (
        <>
            {Array.from({ length: 5 }).map((_, index) => (
                <div
                    key={index}
                    className="h-33 animate-pulse rounded-sm border border-border bg-muted/40"
                />
            ))}
        </>
    );
}

export function AdminClassesStats({
    data: stats,
    isLoading,
    isError,
}: {
    data: AdminClassStats | undefined;
    isLoading: boolean;
    isError: boolean;
}) {

    if (isError) {
        return (
            <div className="rounded-sm border border-destructive/30 p-4">
                {" "}
                <p className="text-sm text-destructive">
                    Failed to load class statistics.{" "}
                </p>{" "}
            </div>
        );
    }

    const statItems = [
        {
            title: "Total Classes",
            value: stats?.totalClasses ?? 0,
            icon: BookOpen,
            description: "All classes in the platform",
        },
        {
            title: "Active Classes",
            value: stats?.activeClasses ?? 0,
            icon: CheckCircle2,
            description: "Currently active classes",
        },
        {
            title: "Ended Classes",
            value: stats?.endedClasses ?? 0,
            icon: CalendarCheck,
            description: "Classes that have ended",
        },
        {
            title: "Upcoming Classes",
            value: stats?.upcomingClasses ?? 0,
            icon: CalendarClock,
            description: "Classes starting soon",
        },
        {
            title: "Blocked Classes",
            value: stats?.blockedClasses ?? 0,
            icon: Ban,
            description: "Restricted by administrators",
        },
    ];

    return (
        <section>
            {" "}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                {isLoading ? (
                    <StatsSkeleton />
                ) : (
                    statItems.map((item) => (
                        <StatCard
                            key={item.title}
                            title={item.title}
                            value={item.value}
                            icon={item.icon}
                            description={item.description}
                        />
                    ))
                )}{" "}
            </div>{" "}
        </section>
    );
}
