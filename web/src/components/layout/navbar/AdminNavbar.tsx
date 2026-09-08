"use client";

import Link from "next/link";
import { GraduationCap } from "lucide-react";

import { useAppSelector } from "@/store/hooks";

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar";

export default function AdminNavbar() {
    const user = useAppSelector(
        (state) => state.profile.fetchUser.user,
    );

    const initials = user?.name
        ? user.name
            .split(" ")
            .map((name) => name.charAt(0))
            .join("")
            .slice(0, 2)
            .toUpperCase()
        : "NA";

    return (
        <header className="md:hidden sticky top-0 z-40 h-16 border-b border-slate-200 bg-white">
            <div className="flex h-full items-center justify-between px-4 md:px-6">

                {/* Logo */}
                <Link
                    href="/admin/dashboard"
                    className="flex items-center gap-3"
                >
                    <div className="flex size-9 items-center justify-center rounded-lg bg-linear-to-br from-[#399aef] to-[#2b8ad8] text-white shadow-sm">
                        <GraduationCap size={20} />
                    </div>

                    <span className="text-xl font-bold tracking-tight text-slate-900">
                        <span className="bg-linear-to-r from-[#111518] via-[#399aef] to-[#111518] bg-clip-text text-transparent">
                            Class
                        </span>

                        <span className="text-[#399aef]">
                            Flow
                        </span>
                    </span>
                </Link>

                {/* Profile */}
                <Link
                    href="/profile"
                    className="flex items-center gap-3"
                >
                    <div className=" text-right block">
                        <p className="text-sm font-semibold text-slate-900">
                            {user?.name ?? "No Name"}
                        </p>

                        <p className="text-xs text-slate-500">
                            Admin
                        </p>
                    </div>

                    <Avatar className="size-9">
                        <AvatarImage
                            src={user?.avatarUrl || undefined}
                            alt={user?.name || "User"}
                        />

                        <AvatarFallback className="bg-primary text-sm font-semibold uppercase text-white">
                            {initials}
                        </AvatarFallback>
                    </Avatar>
                </Link>
            </div>
        </header>
    );
}