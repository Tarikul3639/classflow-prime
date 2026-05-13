// NotificationsSkeleton.tsx

function NotificationItemSkeleton() {
    return (
        <div className="relative flex items-start gap-3 px-3 py-3 rounded-lg bg-white animate-pulse">
            {/* Icon — matches w-10 md:w-11 h-10 md:h-11 rounded-lg */}
            <div className="shrink-0 w-10 md:w-11 h-10 md:h-11 rounded-lg bg-slate-200" />

            {/* Content — matches flex-1 min-w-0 mr-10 */}
            <div className="flex-1 min-w-0 mr-10 space-y-2">
                {/* Title — matches text-sm font-bold */}
                <div className="h-3.5 w-3/4 bg-slate-200 rounded" />
                {/* Message — matches text-sm line-clamp-2 */}
                <div className="space-y-1.5">
                    <div className="h-3 w-full bg-slate-200 rounded" />
                    <div className="h-3 w-4/5 bg-slate-200 rounded" />
                </div>
                {/* Time — matches text-[11px] mt-1 */}
                <div className="h-2.5 w-20 bg-slate-200 rounded" />
            </div>

            {/* Action menu placeholder — matches absolute top-1/2 right-3.5 */}
            <div className="absolute top-1/2 right-3.5 -translate-y-1/2 w-8 h-8 rounded-md bg-slate-200" />
        </div>
    );
}

function NotificationGroupSkeleton({ count = 3 }: { count?: number }) {
    return (
        <section className="animate-pulse">
            {/* Date header — matches text-xs uppercase tracking-wider */}
            <div className="mb-3">
                <div className="h-3 w-16 bg-slate-200 rounded" />
            </div>

            {/* Items */}
            <div className="space-y-1">
                {Array.from({ length: count }).map((_, i) => (
                    <NotificationItemSkeleton key={i} />
                ))}
            </div>
        </section>
    );
}

export function NotificationsSkeleton() {
    return (
        <div className="space-y-8">
            <NotificationGroupSkeleton count={3} />
            <NotificationGroupSkeleton count={4} />
            <NotificationGroupSkeleton count={2} />
        </div>
    );
}