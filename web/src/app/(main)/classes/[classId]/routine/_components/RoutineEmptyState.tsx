import { CalendarDays, Plus } from 'lucide-react';


export function RoutineEmptyState({ isAdmin, onCreateClick }: { isAdmin: boolean; onCreateClick: () => void }) {
    return (
        <div className="h-full flex flex-col items-center justify-center py-20 px-6 text-center select-none">
            <div className="relative mb-6">
                <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <CalendarDays size={36} className="text-primary" />
                </div>
                <div className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-[#ECEAF8] border-2 border-white flex items-center justify-center">
                    <Plus size={12} className="text-primary" />
                </div>
            </div>

            <h3 className="text-[16px] font-bold text-gray-800 mb-1.5">No Routine Yet</h3>
            <p className="text-[13px] text-gray-400 max-w-65 leading-relaxed mb-6">
                Set up a weekly class routine by defining periods and assigning subjects.
            </p>

            {isAdmin && (
                <button
                    onClick={onCreateClick}
                    className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white text-[13px] font-semibold rounded-sm hover:bg-primary/90 transition-all shadow-md shadow-primary/25 active:scale-95 cursor-pointer"
                >
                    <Plus size={15} />
                    Create Routine
                </button>
            )}
        </div>
    );
}