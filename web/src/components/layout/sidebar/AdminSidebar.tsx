"use client";

import React, { useState, useRef, useEffect } from "react";
import { LayoutDashboard, Users, GraduationCap } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { useAppSelector } from "@/store/hooks";

export const AdminSidebar: React.FC = () => {
    const pathname = usePathname();
    const [isExpanded, setIsExpanded] = useState(false);
    const [isLocked, setIsLocked] = useState(false);
    const sidebarRef = useRef<HTMLDivElement>(null);

    const user = useAppSelector((state) => state.profile.fetchUser.user);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                sidebarRef.current &&
                !sidebarRef.current.contains(event.target as Node)
            ) {
                setIsExpanded(false);
                setIsLocked(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

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
        }
    ];

    return (
        <aside
            ref={sidebarRef}
            className={`hidden md:flex border-r border-slate-200 bg-gray-50 h-screen sticky top-0 flex-col transition-all duration-300 overflow-hidden ${isExpanded ? "w-72" : "w-20"
                }`}
            onMouseEnter={() => !isLocked && setIsExpanded(true)}
            onMouseLeave={() => !isLocked && setIsExpanded(false)}
            onClick={() => setIsLocked(!isLocked)}
        >
            {/* Logo Header */}
            <div className="px-5 py-5 border-b border-slate-200">
                <Link href="/admin/dashboard" className="flex items-center gap-3">
                    <div className="relative bg-linear-to-br from-[#399aef] to-[#2b8ad8] p-2 rounded-lg text-white shadow-lg">
                        <GraduationCap size={24} />
                    </div>

                    <AnimatePresence>
                        {isExpanded && (
                            <motion.span
                                initial={{ opacity: 0, width: 0 }}
                                animate={{ opacity: 1, width: "100%" }}
                                exit={{ opacity: 0, width: 0 }}
                                className="flex items-center text-2xl font-bold tracking-tight text-slate-900 whitespace-nowrap"
                            >
                                <span className="bg-linear-to-r from-[#111518] via-[#399aef] to-[#111518] bg-clip-text text-transparent">
                                    Class
                                </span>
                                <span className="text-[#399aef]">Flow</span>
                            </motion.span>
                        )}
                    </AnimatePresence>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto overflow-x-hidden">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive =
                        pathname === item.href || pathname.startsWith(`${item.href}/`);

                    return (
                        <Link
                            key={item.id}
                            href={item.href}
                            className={`relative flex items-center gap-4 px-4 py-3 rounded-sm transition-all duration-200 ${isActive
                                ? "text-primary cursor-default"
                                : "text-slate-500 hover:text-slate-800 hover:bg-slate-200/60"
                                }`}
                            title={!isExpanded ? item.label : undefined}
                        >
                            {/* Active left bar */}
                            {isActive && (
                                <motion.div
                                    layoutId="admin-active-bar"
                                    className="absolute left-0 top-2 bottom-2 w-1 rounded-full bg-primary"
                                    transition={{
                                        type: "spring",
                                        stiffness: 400,
                                        damping: 30,
                                    }}
                                />
                            )}

                            <Icon
                                size={22}
                                strokeWidth={isActive ? 2.5 : 2}
                                className="shrink-0"
                            />

                            <AnimatePresence>
                                {isExpanded && (
                                    <motion.span
                                        initial={{ opacity: 0, width: 0 }}
                                        animate={{ opacity: 1, width: "100%" }}
                                        exit={{ opacity: 0, width: 0 }}
                                        className={`text-sm whitespace-nowrap ${isActive ? "font-semibold" : "font-medium"
                                            }`}
                                    >
                                        {item.label}
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </Link>
                    );
                })}
            </nav>

            {/* Bottom Section */}
            <Link href="/profile" className="border-t border-slate-200">
                <div className="px-4 py-4">
                    <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 bg-primary/50">
                            <AvatarImage
                                src={user?.avatarUrl || "/default-avatar.png"}
                                alt="User Avatar"
                            />
                            <AvatarFallback className="bg-primary text-white uppercase font-bold tracking-widest">
                                {user?.name
                                    ? user.name
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")
                                    : "NA"}
                            </AvatarFallback>
                        </Avatar>
                        <AnimatePresence>
                            {isExpanded && (
                                <motion.div
                                    initial={{ opacity: 0, width: 0 }}
                                    animate={{ opacity: 1, width: "100%" }}
                                    exit={{ opacity: 0, width: 0 }}
                                    className="flex-1 overflow-hidden"
                                >
                                    <p className="text-sm font-semibold truncate text-slate-900">
                                        {user?.name ?? "No Name"}
                                    </p>
                                    <p className="text-xs text-slate-500 truncate">
                                        {user?.email ?? "No Email"}
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </Link>
        </aside>
    );
};

export default AdminSidebar;
