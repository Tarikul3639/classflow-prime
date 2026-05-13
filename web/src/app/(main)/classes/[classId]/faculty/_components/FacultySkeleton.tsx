// _components/FacultySkeleton.tsx

function FacultyCardSkeleton() {
    return (
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 flex flex-col gap-4 animate-pulse">
            {/* Faculty Info */}
            <div className="flex items-center gap-4">
                {/* Avatar — matches w-14~16 rounded-full */}
                <div className="w-14 h-14 rounded-full bg-slate-200 shrink-0" />

                <div className="flex-1 min-w-0 space-y-2">
                    {/* Name */}
                    <div className="h-4 w-36 bg-slate-200 rounded" />
                    {/* Designation */}
                    <div className="h-3.5 w-28 bg-slate-200 rounded" />
                    {/* Location */}
                    <div className="h-3 w-24 bg-slate-200 rounded" />
                </div>

                {/* Action menu placeholder */}
                <div className="w-6 h-6 rounded bg-slate-200 shrink-0 ml-auto" />
            </div>

            {/* Contact Info — matches border-t grid */}
            <div className="grid grid-cols-1 gap-2 pt-2 border-t border-slate-200">
                {/* Email row */}
                <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded bg-slate-200 shrink-0" />
                    <div className="h-3 w-40 bg-slate-200 rounded" />
                </div>

                {/* Phone row */}
                <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded bg-slate-200 shrink-0" />
                    <div className="h-3 w-28 bg-slate-200 rounded" />
                </div>

                {/* Classroom code row */}
                <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded bg-slate-200 shrink-0" />
                    <div className="h-3 w-48 bg-slate-200 rounded" />
                </div>
            </div>
        </div>
    );
}

interface FacultySkeletonProps {
    count?: number;
}

export function FacultySkeleton({ count = 6 }: FacultySkeletonProps) {
    return (
        <div className="flex-1">
            {/* Section header — matches "Class Faculty" label */}
            <div className="mt-6 mb-3 px-1 animate-pulse">
                <div className="h-3 w-24 bg-slate-200 rounded px-1" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: count }).map((_, i) => (
                    <FacultyCardSkeleton key={i} />
                ))}
            </div>
        </div>
    );
}