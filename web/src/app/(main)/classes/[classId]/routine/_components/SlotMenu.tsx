import { useEffect, useRef, useState } from 'react';
import { MoreVertical, Pencil, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

// ── Dropdown Menu ─────────────────────────────────────────────────────────

interface SlotMenuProps {
    isActive: boolean;
    onEdit?: () => void;
    onRemove?: () => void;
}

export function SlotMenu({ isActive, onEdit, onRemove }: SlotMenuProps) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    // outside click → close
    useEffect(() => {
        if (!open) return;
        function handler(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        }
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [open]);

    return (
        <div ref={ref} className="absolute top-2.5 right-2.5">
            {/* trigger */}
            <button
                onClick={() => setOpen((p) => !p)}
                className={cn(
                    'p-2 rounded-lg opacity-50 hover:opacity-100 transition-opacity cursor-pointer',
                    isActive ? 'hover:bg-white/10' : 'hover:bg-black/5',
                )}
                aria-label="More options"
            >
                <MoreVertical size={16} />
            </button>

            {/* dropdown */}
            {open && (
                <div className="absolute right-0 top-full mt-1 w-36 rounded-xl border border-border/60 bg-white shadow-md z-50 overflow-hidden py-1">
                    <button
                        onClick={() => { setOpen(false); onEdit?.(); }}
                        className="flex items-center gap-2.5 w-full px-3 py-2 text-[13px] text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                        <Pencil size={13} className="text-gray-400" />
                        Edit
                    </button>

                    <div className="mx-2 my-1 border-t border-border/40" />

                    <button
                        onClick={() => { setOpen(false); onRemove?.(); }}
                        className="flex items-center gap-2.5 w-full px-3 py-2 text-[13px] text-red-500 hover:bg-red-50 transition-colors"
                    >
                        <Trash2 size={13} />
                        Remove
                    </button>
                </div>
            )}
        </div>
    );
}