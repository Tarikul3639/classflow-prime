// _components/RoutineSkeleton.tsx

// ── Header Skeleton ────────────────────────────────────────────────────────

function HeaderSkeleton() {
    return (
        <div className="w-full flex gap-4 flex-row items-center justify-between px-4 pt-6 pb-2.5 animate-pulse">

            {/* Left — matches flex-col min-w-24 */}
            <div className="flex flex-col min-w-24 gap-2">
                {/* formattedDate — matches text-sm text-gray-400 */}
                <div className="h-3.5 w-28 bg-slate-200 rounded" />
                {/* "Today" — matches text-3xl font-bold */}
                <div className="h-8 w-20 bg-slate-200 rounded" />
            </div>

            {/* Right — matches flex gap-2 (admin buttons) */}
            <div className="flex items-center justify-end gap-2 w-full sm:w-auto">
                {/* Delete button — matches px-4 py-2.5 rounded-sm */}
                <div className="h-9 w-20 sm:w-32 bg-slate-200 rounded-sm" />
                {/* Add button */}
                <div className="h-9 w-16 sm:w-36 bg-slate-200 rounded-sm" />
            </div>

        </div>
    );
}

// ── DayTabs Skeleton ───────────────────────────────────────────────────────

function DayTabsSkeleton() {
    return (
        <div
            className="grid gap-1.5 px-3 py-2 bg-background border-b border-border animate-pulse"
            style={{ gridTemplateColumns: "repeat(6, minmax(0, 1fr))" }}
        >
            {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex flex-col items-center gap-1 py-2 px-1">
                    {/* Day label — matches text-[10px] uppercase */}
                    <div className="h-2.5 w-6 bg-slate-200 rounded" />
                    {/* Date number — matches text-base font-bold */}
                    <div className="h-5 w-5 bg-slate-200 rounded" />
                    {/* Today dot — matches w-1 h-1 rounded-full */}
                    <div className="w-1 h-1 rounded-full bg-transparent" />
                </div>
            ))}
        </div>
    );
}

// ── PeriodSlotCard Skeleton ────────────────────────────────────────────────

function PeriodSlotCardSkeleton({ isLast = false }: { isLast?: boolean }) {
    return (
        <div className="flex gap-2 sm:gap-3 min-w-0 animate-pulse">

            {/* Time column — matches w-11 sm:w-14 */}
            <div className="flex flex-col items-center pt-3.5 w-11 sm:w-14 shrink-0 gap-1">
                <div className="h-3 w-8 bg-slate-200 rounded" />
                <div className="h-3 w-8 bg-slate-200 rounded" />
                <div className="h-2.5 w-5 bg-slate-200 rounded mt-0.5" />
            </div>

            {/* Spine column — matches w-4 sm:w-5 */}
            <div className="flex flex-col items-center w-4 sm:w-5 shrink-0">
                <div className="w-2.5 h-2.5 rounded-full border-2 mt-3.5 shrink-0 bg-slate-200 border-slate-200" />
                {!isLast && (
                    <div className="w-px flex-1 mt-1 min-h-4 rounded-full bg-slate-200" />
                )}
            </div>

            {/* Card — matches rounded-2xl p-3 sm:p-3.5 mb-3 */}
            <div className="flex-1 min-w-0 rounded-2xl p-3 sm:p-3.5 mb-3 bg-background border border-border">
                {/* Subject — matches text-sm sm:text-[15px] */}
                <div className="h-4 w-3/4 bg-slate-200 rounded" />
                {/* Room */}
                <div className="h-3 w-1/3 bg-slate-200 rounded mt-1.5" />
                {/* Teacher row — matches w-5 h-5 sm:w-6 sm:h-6 avatar */}
                <div className="flex items-center gap-1.5 sm:gap-2 mt-2.5">
                    <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-slate-200 shrink-0" />
                    <div className="h-3 w-24 bg-slate-200 rounded" />
                </div>
            </div>

        </div>
    );
}

// ── DesktopTable Skeleton ──────────────────────────────────────────────────

function DesktopTableSkeleton({
    periodCount = 6,
    dayCount = 6,
}: {
    periodCount?: number;
    dayCount?: number;
}) {
    return (
        <div className="overflow-x-auto rounded-2xl border border-[#ECEAF8] bg-white animate-pulse">
            <table
                className="w-full border-collapse"
                style={{ tableLayout: "fixed", minWidth: 720 }}
            >
                <thead>
                    <tr>
                        {/* Day column header — matches sticky pl-5 w-70px */}
                        <th
                            className="sticky top-0 pl-5 py-3 text-left border-b-2 border-[#ECEAF8] bg-white"
                            style={{ width: 70 }}
                        >
                            <div className="h-2.5 w-6 bg-slate-200 rounded" />
                        </th>

                        {Array.from({ length: periodCount }).map((_, i) => (
                            <th
                                key={i}
                                className="py-3 px-4.5 text-center border-b-2 border-[#ECEAF8] bg-white border-l border-l-[#ECEAF8]"
                            >
                                {/* startTime */}
                                <div className="h-3 w-10 bg-slate-200 rounded mx-auto" />
                                {/* endTime */}
                                <div className="h-2.5 w-8 bg-slate-200 rounded mx-auto mt-1" />
                                {/* label */}
                                <div className="h-2.5 w-6 bg-slate-200 rounded mx-auto mt-1" />
                            </th>
                        ))}
                    </tr>
                </thead>

                <tbody>
                    {Array.from({ length: dayCount }).map((_, i) => (
                        <tr key={i} className="border-b border-[#ECEAF8] last:border-0">
                            {/* Day cell — matches pr-2 py-2 */}
                            <td className="pr-2 py-2 align-middle">
                                <div className="h-3 w-7 bg-slate-200 rounded mx-auto" />
                            </td>

                            {Array.from({ length: periodCount }).map((_, j) => (
                                <td
                                    key={j}
                                    className="px-1.5 py-2 align-top border-l border-[#ECEAF8]"
                                >
                                    {/* SubjectCard — matches min-h-18 rounded-sm */}
                                    <div className="min-h-18 rounded-sm bg-slate-50 border border-slate-100 p-2.5 space-y-2">
                                        <div className="h-3 w-4/5 bg-slate-200 rounded" />
                                        <div className="h-2.5 w-1/2 bg-slate-200 rounded" />
                                        <div className="flex items-center gap-1.5 mt-1">
                                            <div className="w-5 h-5 rounded-full bg-slate-200 shrink-0" />
                                            <div className="h-2.5 w-14 bg-slate-200 rounded" />
                                        </div>
                                    </div>
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

// ── RoutineSkeleton (exported) ─────────────────────────────────────────────

export function RoutineSkeleton() {
    const slots = Array.from({ length: 5 });

    return (
        <div className="bg-[#F5F4FE]">
            <div className="h-full overflow-hidden bg-gray-50 md:px-4">

                {/* Header skeleton — always visible */}
                <HeaderSkeleton />

                {/* Desktop — matches hidden md:block px-4 py-6 */}
                <div className="hidden px-4 py-6 md:block">
                    <DesktopTableSkeleton periodCount={6} dayCount={6} />
                </div>

                {/* Mobile — matches md:hidden */}
                <div className="md:hidden">
                    <DayTabsSkeleton />
                    <div className="px-4 pb-24 pt-2 space-y-0">
                        {slots.map((_, i) => (
                            <PeriodSlotCardSkeleton key={i} isLast={i === slots.length - 1} />
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}