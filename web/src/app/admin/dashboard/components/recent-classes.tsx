import Link from 'next/link';
import { ArrowRight, BookOpen, Users } from 'lucide-react';
import { EmptyState } from '@/components/ui/EmptyState';
import type { AdminDashboardClass } from '@/store/services/admin-dashboard.api';

export default function RecentClasses({
    classes,
}: {
    classes: AdminDashboardClass[];
}) {
    return (
        <div className="rounded-lg border border-border bg-card">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
                <div>
                    <h2 className="font-semibold">
                        Recent Classes
                    </h2>

                    <p className="mt-1 text-sm text-muted-foreground">
                        Recently created classes.
                    </p>
                </div>

                <Link
                    href="/admin/classes"
                    className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                >
                    View all
                    <ArrowRight className="size-4" />
                </Link>
            </div>

            {/* Table */}
            {classes.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-border text-left text-muted-foreground">
                                <th className="px-5 py-3 font-medium">
                                    Class
                                </th>

                                <th className="px-5 py-3 font-medium">
                                    Department
                                </th>

                                <th className="px-5 py-3 font-medium">
                                    Semester
                                </th>

                                <th className="px-5 py-3 font-medium">
                                    Status
                                </th>

                                <th className="px-5 py-3 font-medium">
                                    Enrollment
                                </th>

                                <th className="px-5 py-3 font-medium">
                                    Created
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {classes.map((item) => (
                                <tr
                                    key={item.id}
                                    className="border-b border-border last:border-0 hover:bg-muted/40"
                                >
                                    {/* Class */}
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-3">
                                            {/* Cover */}
                                            <div
                                                className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-md"
                                                style={{
                                                    backgroundColor:
                                                        item.themeColor || '#3f97e4',
                                                }}
                                            >
                                                {item.coverImage ? (
                                                    <img
                                                        src={item.coverImage}
                                                        alt={item.className}
                                                        className="size-full object-cover"
                                                    />
                                                ) : (
                                                    <BookOpen className="size-5 text-white" />
                                                )}
                                            </div>

                                            {/* Name */}
                                            <div className="min-w-0">
                                                <p className="truncate font-medium">
                                                    {item.className}
                                                </p>

                                                <p className="mt-0.5 text-xs text-muted-foreground">
                                                    Class ID: {item.id}
                                                </p>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Department */}
                                    <td className="px-5 py-4 text-muted-foreground">
                                        {item.department || '—'}
                                    </td>

                                    {/* Semester */}
                                    <td className="px-5 py-4 text-muted-foreground">
                                        {item.semester || '—'}
                                    </td>

                                    {/* Status */}
                                    <td className="px-5 py-4">
                                        <span
                                            className={[
                                                'inline-flex items-center rounded-md px-2 py-1 text-xs font-medium',
                                                item.status === 'ACTIVE'
                                                    ? 'bg-primary/10 text-primary'
                                                    : 'bg-muted text-muted-foreground',
                                            ].join(' ')}
                                        >
                                            {item.status}
                                        </span>
                                    </td>

                                    {/* Enrollment */}
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-2">
                                            <Users className="size-4 text-muted-foreground" />

                                            <span
                                                className={
                                                    item.allowEnroll
                                                        ? 'text-primary'
                                                        : 'text-muted-foreground'
                                                }
                                            >
                                                {item.allowEnroll
                                                    ? 'Open'
                                                    : 'Closed'}
                                            </span>
                                        </div>
                                    </td>

                                    {/* Created */}
                                    <td className="whitespace-nowrap px-5 py-4 text-muted-foreground">
                                        {new Date(
                                            item.createdAt,
                                        ).toLocaleDateString('en-US', {
                                            month: 'short',
                                            day: 'numeric',
                                            year: 'numeric',
                                        })}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <EmptyState
                    size="sm"
                    icon={BookOpen}
                    title="No Classes Found"
                    description="There are no classes to display at the moment."
                />
            )}
        </div>
    );
}