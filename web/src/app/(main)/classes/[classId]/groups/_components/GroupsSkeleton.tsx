function GroupCardSkeleton() {
    return (
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex flex-col gap-4 animate-pulse">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                    {/* Platform icon — matches w-11 md:w-12 h-11 md:h-12 rounded-xl */}
                    <div className="w-11 md:w-12 h-11 md:h-12 rounded-xl bg-slate-200 shrink-0" />

                    <div className="space-y-2">
                        {/* Group name — matches text-[14px]~[16px] font-bold */}
                        <div className="h-4 w-32 bg-slate-200 rounded" />
                        {/* Platform badge — matches px-2 py-0.5 rounded-md */}
                        <div className="h-4 w-16 bg-slate-200 rounded-md" />
                    </div>
                </div>

                {/* Action menu placeholder */}
                <div className="w-6 h-6 rounded bg-slate-200 shrink-0 ml-auto" />
            </div>

            {/* Description — matches text-[12px]~[14px] leading-relaxed */}
            <div className="space-y-1.5">
                <div className="h-3 w-full bg-slate-200 rounded" />
                <div className="h-3 w-4/5 bg-slate-200 rounded" />
            </div>

            {/* Enroll button — matches w-full py-2.5 rounded-lg */}
            <div className="h-10 w-full bg-slate-200 rounded-lg" />
        </div>
    );
}

interface GroupsSkeletonProps {
    count?: number;
}

export function GroupsSkeleton({ count = 6 }: GroupsSkeletonProps) {
    return (
        <div className="flex-1">
            {/* Section title — matches "Active Communication Channels" */}
            <div className="mt-6 mb-3 px-1 animate-pulse">
                <div className="h-3 w-44 bg-slate-200 rounded px-1" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: count }).map((_, i) => (
                    <GroupCardSkeleton key={i} />
                ))}
            </div>
        </div>
    );
}