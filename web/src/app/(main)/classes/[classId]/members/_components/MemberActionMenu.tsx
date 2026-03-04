"use client";

import React from "react";
import { MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type MemberRole = "admin" | "professor" | "student";

type Member = {
  user: { _id: string; name: string; email: string; avatarUrl: string };
  role: MemberRole;
  isBlocked: boolean;
};

type MemberActionMenuProps = {
  member: Member;
  isAdmin: boolean;
  // onAssignCoAdmin: (userId: string) => void;
  // onBlockUser: (userId: string) => void;
  // onUnblockUser: (userId: string) => void;
  // onRemoveCoAdmin: (userId: string) => void;
  // onRemoveMember: (userId: string) => void;
};

const MemberActionMenu: React.FC<MemberActionMenuProps> = ({
  member,
  isAdmin,
  // onAssignCoAdmin,
  // onBlockUser,
  // onUnblockUser,
  // onRemoveCoAdmin,
  // onRemoveMember,
}) => {
  const itemStyle =
    "flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-600 cursor-pointer transition-all duration-200 focus:bg-[#399aef]/10 focus:text-[#399aef] group outline-none";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="p-2 text-gray-400 hover:text-[#399aef] hover:bg-white rounded-xl transition-all outline-none">
          <MoreVertical size={18} strokeWidth={2.5} />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="w-48 p-1.5 bg-white border-slate-200 rounded-lg shadow-sm animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Header Section */}
        <div className="px-2 py-1.5 mb-1">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            Manage Member
          </span>
        </div>

        {/* 1. Assign Co-Admin Area */}
        {isAdmin && member.role === "admin" && (
          <DropdownMenuItem
            // onClick={() => onAssignCoAdmin(member.user._id)}
            className={itemStyle}
          >
            <div className="w-1.5 h-1.5 rounded-full bg-purple-500 group-hover:scale-125 transition-transform" />
            <span>Assign Co-Admin</span>
          </DropdownMenuItem>
        )}

        {/* 2. Block/Unblock Action */}
        <DropdownMenuItem
          // onClick={() =>
          //   member.isBlocked
          //     ? onUnblockUser(member.user._id)
          //     : onBlockUser(member.user._id)
          // }
          className={itemStyle}
        >
          <div
            className={`w-1.5 h-1.5 rounded-full ${
              member.isBlocked ? "bg-emerald-500" : "bg-amber-500"
            } group-hover:scale-125 transition-transform`}
          />
          <span>{member.isBlocked ? "Unblock Access" : "Restrict Access"}</span>
        </DropdownMenuItem>

        {/* 3. Role Management */}
        {member.role === "professor" && isAdmin && (
          <DropdownMenuItem
            // onClick={() => onRemoveCoAdmin(member.user._id)}
            className={itemStyle}
          >
            <div className="w-1.5 h-1.5 rounded-full bg-orange-500 group-hover:scale-125 transition-transform" />
            <span>Revoke Co-Admin</span>
          </DropdownMenuItem>
        )}

        {/* 4. Danger Zone */}
        <DropdownMenuItem
          // onClick={() => onRemoveMember(member.user._id)}
          className={itemStyle}
        >
          <div className="w-1.5 h-1.5 rounded-full bg-rose-500 group-hover:scale-125 transition-transform" />
          <span>Remove Member</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default MemberActionMenu;
