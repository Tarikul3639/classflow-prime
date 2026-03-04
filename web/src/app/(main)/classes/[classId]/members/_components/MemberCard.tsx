"use client";

import React from "react";
import { MoreHorizontal, ShieldCheck } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import MemberActionMenu from "./MemberActionMenu";
import { isAdmin } from "@/redux/selectors/selectors";

interface Member {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  initials?: string;
  role: "admin" | "professor" | "student";
  verified?: boolean;
  avatarBg?: string;
  avatarText?: string;
}

interface MemberCardProps {
  member: Member;
  onMenuClick?: (memberId: string) => void;
}

export default function MemberCard({ member, onMenuClick }: MemberCardProps) {
  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return (
          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-primary uppercase">
            Admin
          </span>
        );
      case "professor":
        return (
          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-primary uppercase">
            Professor
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="group flex items-center gap-3 p-4 bg-white rounded-xl border border-slate-200 hover:border-primary/30 transition-all shadow-sm">
      <div className="relative">
        {member.avatar ? (
          <img
            alt={member.name}
            className="w-11 h-11 rounded-full object-cover"
            src={member.avatar}
          />
        ) : (
          <div
            className={`w-11 h-11 rounded-full ${member.avatarBg} flex items-center justify-center ${member.avatarText} font-bold text-sm`}
          >
            {member.initials}
          </div>
        )}
        {member.verified && (
          <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5">
            <ShieldCheck
              className="text-primary bg-blue-100 rounded-full p-0.5"
              size={14}
            />
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-[13px] md:text-[14px] lg:text-[15px] font-bold truncate">
            {member.name}
          </p>
          {getRoleBadge(member.role)}
        </div>
        <p className="text-[12px] md:text-[13px] lg:text-[14px] text-slate-500 truncate">
          {member.email}
        </p>
      </div>

      <MemberActionMenu
        member={member as any} // Replace with actual member object
        isAdmin={null as any} // Replace with actual isAdmin value
      />
    </div>
  );
}
