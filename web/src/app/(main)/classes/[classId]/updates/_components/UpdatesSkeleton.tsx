// _components/UpdatesSkeleton.tsx

function DateHeaderSkeleton() {
    return (
        <div className="flex items-center gap-4 py-4 pt-2 animate-pulse">
            <div className="h-4 w-20 bg-slate-200 rounded" />
            <div className="h-px flex-1 bg-slate-200" />
        </div>
    );
}

function UpdateCardSkeleton() {
    return (
        <article className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col gap-3 overflow-hidden animate-pulse">
            {/* Header */}
            <div className="flex justify-between items-start gap-2">
                <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 shrink-0 rounded-full bg-slate-200" />
                    <div className="space-y-1.5 min-w-0">
                        <div className="h-3.5 w-44 bg-slate-200 rounded" />
                        <div className="h-3 w-32 bg-slate-200 rounded" />
                    </div>
                </div>
                <div className="w-6 h-6 rounded bg-slate-200 shrink-0" />
            </div>

            {/* Description */}
            <div className="py-1 px-2 space-y-2">
                <div className="h-3 w-full bg-slate-200 rounded" />
                <div className="h-3 w-5/6 bg-slate-200 rounded" />
                <div className="h-3 w-3/4 bg-slate-200 rounded" />
            </div>

            {/* Posted By */}
            <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
                <div className="w-5 h-5 rounded-full bg-slate-200 shrink-0" />
                <div className="h-3 w-24 bg-slate-200 rounded" />
            </div>
        </article>
    );
}

interface UpdatesSkeletonProps {
    groups?: number;
    cardsPerGroup?: number;
}

export function UpdatesSkeleton({
    groups = 2,
    cardsPerGroup = 3,
}: UpdatesSkeletonProps) {
    return (
        <div className="space-y-8">
            {Array.from({ length: groups }).map((_, gi) => (
                <section key={gi} className="space-y-3">
                    <DateHeaderSkeleton />
                    <div className="space-y-3">
                        {Array.from({ length: cardsPerGroup }).map((_, ci) => (
                            <UpdateCardSkeleton key={ci} />
                        ))}
                    </div>
                </section>
            ))}
        </div>
    );
}