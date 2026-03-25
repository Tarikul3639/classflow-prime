"use client";

import { MoreVertical, Pin, PinOff, Pencil, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface UpdateActionMenuProps {
  isPinned?: boolean;
  onPin?: () => void;
  onUnpin?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function UpdateActionMenu({
  isPinned,
  onPin,
  onUnpin,
  onEdit,
  onDelete,
}: UpdateActionMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors cursor-pointer">
          <MoreVertical size={16} className="text-slate-500" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-40">
        {isPinned ? (
          <DropdownMenuItem onClick={onUnpin}>
            <PinOff size={14} />
            Unpin
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem onClick={onPin}>
            <Pin size={14} />
            Pin
          </DropdownMenuItem>
        )}

        <DropdownMenuItem onClick={onEdit}>
          <Pencil size={14} />
          Edit
        </DropdownMenuItem>

        <DropdownMenuSeparator /> 

        <DropdownMenuItem onClick={onDelete} className="text-red-500 focus:text-red-500">
          <Trash2 size={14} />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}