"use client";

import { Clock3, ShieldAlert, Users } from "lucide-react";
import type { AdminClass } from "@/store/services/admin-classes.api";
import { ImagePreview } from "@/components/ui/image-preview";
import { AdminClassActions } from "./admin-class-actions";

interface AdminClassesTableRowProps {
    classItem: AdminClass;
}

function getStatusClassName(status: string) {
    switch (status) {
        case "active":
            return "border-green-500/20 bg-green-500/10 text-green-600";
        case "ended":
            return "border-red-500/20 bg-red-500/10 text-red-600";
        case "upcoming":
            return "border-blue-500/20 bg-blue-500/10 text-blue-600";
        default:
            return "border-border bg-muted text-muted-foreground";
    }
}

function formatBlockedAt(blockedAt?: string | null) {
    if (!blockedAt) return null;

    const date = new Date(blockedAt);

    return Number.isNaN(date.getTime())
        ? null
        : new Intl.DateTimeFormat(undefined, {
            dateStyle: "medium",
            timeStyle: "short",
        }).format(date);
}

export function AdminClassesTableRow({ classItem }: AdminClassesTableRowProps) {
    const blockedAt = formatBlockedAt(classItem.blockedAt);

    return (
        <tr className="border-b border-border last:border-b-0 hover:bg-muted/30">
            {/* CLASS INFORMATION */}
            <td className="px-4 py-4">
                <div className="flex items-center gap-3">
                    {/* Cover Image / Theme Color */}
                    <div className="relative size-10 shrink-0 overflow-hidden rounded-sm">
                        {classItem.coverImage ? (
                            <ImagePreview
                                src={classItem.coverImage}
                                alt={classItem.className}
                                className="size-full object-cover"
                            />
                        ) : (
                            <div
                                className="size-full"
                                style={{ backgroundColor: classItem.themeColor }}
                            />
                        )}
                    </div>

                    {/* Class Details */}
                    <div className="min-w-0">
                        <p className="truncate font-medium">{classItem.className}</p>
                        <div className="mt-1 flex flex-wrap items-center gap-x-2 text-xs text-muted-foreground">
                            {classItem.department && <span>{classItem.department}</span>}
                            {classItem.semester && <span>{classItem.semester}</span>}
                        </div>
                    </div>
                </div>
            </td>

            {/* CREATOR */}
            <td className="px-4 py-4">
                {classItem.createdBy ? (
                    <div className="flex items-center gap-2">
                        {/* Creator Avatar */}
                        {classItem.createdBy.avatarUrl ? (
                            <ImagePreview
                                src={classItem.createdBy.avatarUrl}
                                alt={classItem.createdBy.name}
                                className="size-8 rounded-full object-cover"
                            />
                        ) : (
                            <div className="flex size-8 items-center justify-center rounded-full bg-muted text-xs font-medium">
                                {classItem.createdBy.name.charAt(0).toUpperCase()}
                            </div>
                        )}

                        {/* Creator Details */}
                        <div className="min-w-0">
                            <p className="truncate text-sm font-medium">
                                {classItem.createdBy.name}
                            </p>
                            <p className="truncate text-xs text-muted-foreground">
                                {classItem.createdBy.email}
                            </p>
                        </div>
                    </div>
                ) : (
                    <span className="text-sm text-muted-foreground">Unknown</span>
                )}
            </td>

            {/* CLASS STATUS */}
            <td className="px-4 py-4">
                <span
                    className={`inline-flex rounded-sm border px-2 py-1 text-xs font-medium capitalize ${getStatusClassName(
                        classItem.status,
                    )}`}
                >
                    {classItem.status}
                </span>

                {classItem.isBlocked && (
                    <div className="mt-2 max-w-56 rounded-sm border border-destructive/20 bg-destructive/5 p-2 text-xs text-destructive">
                        <div className="flex items-center gap-1 font-medium">
                            <ShieldAlert className="size-3.5 shrink-0" />
                            <span>Class blocked</span>
                        </div>

                        {classItem.blockedReason && (
                            <p className="mt-1 line-clamp-2 text-destructive/80" title={classItem.blockedReason}>
                                {classItem.blockedReason}
                            </p>
                        )}

                        {blockedAt && (
                            <p className="mt-1 flex items-center gap-1 text-destructive/70">
                                <Clock3 className="size-3 shrink-0" />
                                <span>Blocked {blockedAt}</span>
                            </p>
                        )}
                    </div>
                )}
            </td>

            {/* ENROLLMENT */}
            <td className="px-4 py-4">
                <span
                    className={
                        classItem.allowEnroll ? "text-green-600" : "text-muted-foreground"
                    }
                >
                    {classItem.allowEnroll ? "Open" : "Closed"}
                </span>
            </td>

            {/* MEMBERS */}
            <td className="px-4 py-4">
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1.5">
                        <Users className="size-3.5 text-muted-foreground" />
                        <span className="font-medium">{classItem.totalMembers}</span>
                        <span className="text-xs text-muted-foreground">Members</span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span>{classItem.totalTeachers} Teachers</span>
                        <span>{classItem.totalLearners} Learners</span>
                    </div>
                </div>
            </td>

            {/* CREATED DATE */}
            <td className="px-4 py-4 text-muted-foreground">
                {new Date(classItem.createdAt).toLocaleDateString()}
            </td>

            {/* ACTIONS */}
            <td className="w-16 whitespace-nowrap px-4 py-4 text-right">
                <AdminClassActions classItem={classItem} />
            </td>
        </tr>
    );
}
