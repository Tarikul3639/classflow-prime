function MemberCardSkeleton() {
    return (
        <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-200 shadow-xs max-w-sm animate-pulse">
            {/* Avatar — matches w-11 h-11 rounded-full */}
            <div className="w-11 h-11 rounded-full bg-slate-200 shrink-0" />

            <div className="flex-1 min-w-0 space-y-2">
                {/* Name + role badge row */}
                <div className="flex items-center gap-2">
                    <div className="h-3.5 w-28 bg-slate-200 rounded" />
                    <div className="h-4 w-16 bg-slate-200 rounded" />
                </div>
                {/* Email */}
                <div className="h-3 w-36 bg-slate-200 rounded" />
            </div>

            {/* Action menu placeholder */}
            <div className="w-6 h-6 rounded bg-slate-200 shrink-0" />
        </div>
    );
}

interface MembersSkeletonProps {
    adminCount?: number;
    studentCount?: number;
}

export function MembersSkeleton({
    adminCount = 2,
    studentCount = 6,
}: MembersSkeletonProps) {
    return (
        <div className="space-y-6">
            {/* Administrators group */}
            <section>
                <div className="h-3 w-36 bg-slate-200 rounded mb-3 px-1 animate-pulse" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Array.from({ length: adminCount }).map((_, i) => (
                        <MemberCardSkeleton key={i} />
                    ))}
                </div>
            </section>

            {/* Students group */}
            <section>
                <div className="h-3 w-28 bg-slate-200 rounded mb-3 px-1 animate-pulse" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Array.from({ length: studentCount }).map((_, i) => (
                        <MemberCardSkeleton key={i} />
                    ))}
                </div>
            </section>
        </div>
    );
}