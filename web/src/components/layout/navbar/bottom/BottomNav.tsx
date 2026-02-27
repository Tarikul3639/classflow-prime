"use client";
import React from "react";
import {
  LayoutDashboard,
  GraduationCap,
  Plus,
  Bell,
  User,
} from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";

export const BottomNavbar: React.FC = () => {
    const pathname = usePathname();
  return (
    <nav className="fixed lg:hidden bottom-0 w-full bg-white border-t border-gray-200 pt-1 px-4 z-50">
      <div className="flex justify-between items-center max-w-md mx-auto">
        <Link
          className={`flex flex-1 flex-col items-center justify-center gap-1 transition-colors py-2 ${
            pathname === "/dashboard"
              ? "text-blue-500"
              : "text-gray-400 hover:text-blue-500"
          }`}
          href="/dashboard"
        >
          <LayoutDashboard size={24} />
          <span className="text-[10px] font-medium">Dashboard</span>
        </Link>
        <Link
          className={`flex flex-1 flex-col items-center justify-center gap-1 transition-colors py-2 ${
            pathname === "/classes"
              ? "text-blue-500"
              : "text-gray-400 hover:text-blue-500"
          }`}
          href="/classes"
        >
          <GraduationCap size={24} />
          <span className="text-[10px] font-medium">Classes</span>
        </Link>
        <Link
          className="flex flex-1 flex-col items-center justify-center"
          href="/add-class"
        >
          <div className="-translate-y-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white shadow-lg shadow-primary/40 transition-transform hover:scale-105 active:scale-95">
            <Plus size={24} />
          </div>
        </Link>
        <Link
          className={`flex flex-1 flex-col items-center justify-center gap-1 transition-colors py-2 ${
            pathname === "/notifications"
              ? "text-blue-500"
              : "text-gray-400 hover:text-blue-500"
          }`}
          href="/notifications"
        >
          <Bell size={24} />
          <span className="text-[10px] font-medium">Notifications</span>
        </Link>
        <Link 
          className={`flex flex-1 flex-col items-center justify-center gap-1 py-2 ${
            pathname === "/profile"
              ? "text-blue-500"
              : "text-gray-400 hover:text-blue-500"
          }`}
          href="/profile"
        >
          <User
            size={24}
            fill={pathname === "/profile" ? "currentColor" : "none"}
          />
          <span className="text-[10px] font-medium">Profile</span>
        </Link>
      </div>
      {/* Safe Area Spacer for iOS Home Indicator */}
      {/* <div className="h-4 w-full" /> */}
    </nav>
  );
};
