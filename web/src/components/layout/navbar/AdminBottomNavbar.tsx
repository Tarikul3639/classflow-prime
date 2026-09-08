"use client";

import React from "react";
import { LayoutDashboard, Users, GraduationCap, User } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function AdminBottomNavbar() {
    const pathname = usePathname();

    const menuItems = [
        {
            id: "dashboard",
            label: "Dashboard",
            icon: LayoutDashboard,
            href: "/admin/dashboard",
        },
        {
            id: "users",
            label: "Users",
            icon: Users,
            href: "/admin/users",
        },
        {
            id: "classes",
            label: "Classes",
            icon: GraduationCap,
            href: "/admin/classes",
        },
        {
            id: "profile",
            label: "Profile",
            icon: User,
            href: "/profile",
        },
    ];

    return (
        <nav className="fixed bottom-0 left-0 z-50 w-full border-t border-gray-200 bg-white pt-1 md:hidden">
            <div className="flex items-center justify-evenly">
                {menuItems.map((item) => {
                    const Icon = item.icon;

                    const isActive =
                        pathname === item.href ||
                        (item.href !== "/profile" && pathname.startsWith(`${item.href}/`));

                    return (
                        <Link
                            key={item.id}
                            href={item.href}
                            className={`flex flex-col items-center justify-center gap-1 py-2 transition-colors ${isActive ? "text-primary" : "text-gray-400 hover:text-primary"
                                }`}
                        >
                            <Icon
                                size={24}
                                fill={
                                    item.id === "profile" && isActive ? "currentColor" : "none"
                                }
                            />
                            <span className="text-[10px] font-medium">{item.label}</span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
};