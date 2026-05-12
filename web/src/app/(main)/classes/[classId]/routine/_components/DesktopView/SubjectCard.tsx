import type { RoutineSlot } from "@/types/routine.types";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

function getInitials(name: string): string {
    return name
        .split(" ")
        .filter(Boolean)
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();
}

interface SubjectCardProps {
    day: string;
    slot: RoutineSlot | undefined;
    onEdit: (day: string, slot: RoutineSlot) => void;
    onRemove: (slot: RoutineSlot) => void;
}

export function SubjectCard({ day, slot, onEdit, onRemove }: SubjectCardProps) {
    if (!slot) {
        return (
            <div className="h-full min-h-18 rounded-sm border border-dashed border-gray-200 flex items-center justify-center">
                <span className="text-[10px] text-gray-300 font-bold">—</span>
            </div>
        );
    }

    return (
        <div className="relative group px-3 py-2.5 min-h-18 rounded-sm text-gray-700 border border-primary/10 transition-colors">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <button
                        className={cn(
                            "absolute top-2 right-2 p-1.5 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer outline-none hover:bg-black/5",
                        )}
                        aria-label="More options"
                    >
                        <MoreVertical size={14} />
                    </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end">
                    <DropdownMenuItem
                        onClick={() => onEdit(day, slot)}
                        className="text-xs gap-2.5 cursor-pointer"
                    >
                        <Pencil size={10} className="text-muted-foreground" />
                        Edit
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem
                        onClick={() => onRemove(slot)}
                        className="gap-2.5 text-xs cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10"
                    >
                        <Trash2 size={10} />
                        Remove
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <p className="text-[12px] font-bold leading-tight pr-6 text-gray-800">
                {slot.subject}
            </p>

            {slot.room && (
                <p className="text-[10px] mt-0.5 text-gray-400">{slot.room}</p>
            )}

            <div className="flex items-center gap-1.5 mt-2">
                <div className="w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold shrink-0 bg-primary/20 text-primary">
                    {getInitials(slot.teacherName)}
                </div>
                <span className="text-[10px] truncate text-gray-500">
                    {slot.teacherName}
                </span>
            </div>
        </div>
    );
}