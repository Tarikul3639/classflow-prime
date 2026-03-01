"use client";

import React, { useState, useRef, useEffect } from "react";
import { LayoutDashboard, GraduationCap, Bell, User, BookOpen } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLocked, setIsLocked] = useState(false); // click-to-lock state
  const sidebarRef = useRef<HTMLDivElement>(null);

  // detect clicks outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        setIsExpanded(false); // collapse if not locked
        setIsLocked(false); // optional: unlock on outside click
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      href: "/",
    },
    { id: "classes", label: "Classes", icon: BookOpen, href: "/classes" },
    {
      id: "notifications",
      label: "Notifications",
      icon: Bell,
      href: "/notifications",
    },
    { id: "profile", label: "Profile", icon: User, href: "/profile" },
  ];

  return (
    <aside
      ref={sidebarRef}
      className={`hidden lg:flex border-r border-slate-200 bg-gray-50 h-screen sticky top-0 flex-col transition-all duration-300 overflow-hidden ${
        isExpanded ? "w-72" : "w-20"
      }`}
      onMouseEnter={() => !isLocked && setIsExpanded(true)}
      onMouseLeave={() => !isLocked && setIsExpanded(false)}
      onClick={() => setIsLocked(!isLocked)} // toggle lock on click
    >
      {/* Logo Header */}
      <div className="px-5 py-5 border-b border-slate-200">
        <Link href="/dashboard" className="flex items-center gap-3">
          {/* Icon Container */}
          <div className="relative bg-linear-to-br from-[#399aef] to-[#2b8ad8] p-2 rounded-lg text-white shadow-lg group-hover:shadow-xl group-hover:shadow-blue-500/30 transition-all duration-300">
            <GraduationCap
              size={22}
              className="group-hover:rotate-6 transition-transform duration-300"
            />
          </div>
          <AnimatePresence>
            {isExpanded && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "100%" }}
                exit={{ opacity: 0, width: 0 }}
                className="flex items-center group text-2xl font-bold tracking-tight text-slate-900 whitespace-nowrap"
              >
                <span className="tracking-tight bg-linear-to-r from-[#111518] via-[#399aef] to-[#111518] bg-clip-text text-transparent bg-size-[200%_100%] group-hover:bg-size-[100%_100%] animate-gradient transition-all duration-500">
                  Class
                </span>
                <span className="tracking-tight text-[#399aef] group-hover:text-[#2b8ad8] transition-colors duration-300">
                  Flow
                </span>
              </motion.span>
            )}
          </AnimatePresence>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto overflow-x-hidden">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.id}
              href={item.href}
              className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? "bg-blue-50 text-primary font-medium"
                  : "text-slate-700 hover:bg-slate-100"
              }`}
              title={!isExpanded ? item.label : undefined}
            >
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
                    className="text-sm whitespace-nowrap"
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
      <div className="border-t border-slate-200">
        <div className="px-6 py-4 border-t border-slate-200">
          <div className="flex items-center gap-3">
            <div
              className="h-10 w-10 rounded-full bg-cover bg-center ring-2 ring-slate-100 shrink-0"
              style={{
                backgroundImage:
                  "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBfpo-xwmdOuSDI11UFt6Uo-zfOAy0Arx84Ltb0WBcuo7hd6utRBeV68VO53qJ2K_2wLk79hF5M0zFDzC_0OVL8mkdBPcvkIWi4f5DA-obHsl5ApQ9Y9n2aDJmfy-TJOvmTvNmQCSqayLMtIrc0LYIiilkEyWdjn_HnZPOSXzqB1c7x69bka7oB3xaF-RmiadEcUbY4C9MPWnu6UgasrRPBIkkbv0G9ejPS6E399yybBWRW2TtyMPZd7_-yOmvsBZ2KuGhtRJl1R7nO')",
              }}
            />
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-semibold truncate text-slate-900">
                Alex Johnson
              </p>
              <p className="text-xs text-slate-500 truncate">
                alex.johnson@classflow.edu
              </p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
