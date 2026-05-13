// ── ClassInfoCard Skeleton ─────────────────────────────────────────────────

function ClassInfoCardSkeleton() {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 md:p-6 animate-pulse">
            <div className="flex items-start gap-4">
                {/* Icon — matches w-10 md:w-12 h-10 md:h-12 rounded-xl */}
                <div className="w-10 md:w-12 h-10 md:h-12 rounded-xl bg-slate-200 shrink-0" />

                <div className="flex-1 min-w-0 space-y-3">
                    {/* Class name — matches text-base md:text-lg font-bold */}
                    <div className="h-5 w-48 bg-slate-200 rounded" />

                    {/* Class code section */}
                    <div className="space-y-2">
                        <div className="h-3.5 w-36 bg-slate-200 rounded" />
                        <div className="flex items-center gap-2">
                            <div className="h-6 w-16 bg-slate-200 rounded-md" />
                            <div className="h-6 w-24 bg-slate-200 rounded-md" />
                        </div>
                    </div>

                    {/* Learners count — matches flex items-center gap-2 */}
                    <div className="h-3.5 w-28 bg-slate-200 rounded" />
                </div>
            </div>

            {/* Footer — matches border-t mt-4 pt-4 */}
            <div className="mt-4 pt-4 border-t border-slate-100 space-y-2">
                {/* Creator row */}
                <div className="flex items-center justify-between">
                    <div className="h-3.5 w-14 bg-slate-200 rounded" />
                    <div className="h-3.5 w-28 bg-slate-200 rounded" />
                </div>
                {/* Semester row */}
                <div className="flex items-center justify-between">
                    <div className="h-3.5 w-16 bg-slate-200 rounded" />
                    <div className="h-3.5 w-20 bg-slate-200 rounded" />
                </div>
            </div>
        </div>
    );
}

// ── DangerZone Skeleton ────────────────────────────────────────────────────

function ActionRowSkeleton({ redBorder = false }: { redBorder?: boolean }) {
    return (
        <div
            className={`border rounded-lg p-4 ${redBorder ? "border-red-200 bg-red-50/30" : "border-slate-200"
                }`}
        >
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                    {/* Icon — matches p-1.5 rounded-sm */}
                    <div className="w-8 h-8 rounded-sm bg-slate-200 shrink-0" />
                    <div className="space-y-1.5 min-w-0">
                        {/* Title — matches text-sm font-semibold */}
                        <div className="h-3.5 w-32 bg-slate-200 rounded" />
                        {/* Description — matches text-xs */}
                        <div className="h-3 w-48 bg-slate-200 rounded" />
                    </div>
                </div>
                {/* Button — matches px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg */}
                <div className="h-8 w-20 bg-slate-200 rounded-lg shrink-0" />
            </div>
        </div>
    );
}

function DangerZoneSkeleton() {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-red-200 p-4 md:p-6 animate-pulse">
            {/* Header — matches flex items-center gap-2 mb-1 */}
            <div className="flex items-center gap-2 mb-1">
                <div className="w-5 h-5 rounded bg-slate-200 shrink-0" />
                <div className="h-4 w-24 bg-slate-200 rounded" />
            </div>
            {/* Subtitle */}
            <div className="h-3 w-56 bg-slate-200 rounded mb-4" />

            {/* Action rows */}
            <div className="space-y-3">
                <ActionRowSkeleton />
                <ActionRowSkeleton />
                <ActionRowSkeleton redBorder />
            </div>
        </div>
    );
}

// ── ClassSettingsSkeleton (exported) ───────────────────────────────────────

export function ClassSettingsSkeleton() {
    return (
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
            <ClassInfoCardSkeleton />
            <DangerZoneSkeleton />
        </div>
    );
}