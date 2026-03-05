"use client";
import React from "react";
import { LayoutDashboard, Plus, Bell, User, BookOpen } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";

export const BottomNavbar: React.FC = () => {
  const pathname = usePathname();
  return (
    <nav className="fixed lg:hidden bottom-0 w-full bg-white border-t border-gray-200 pt-1 px-4 z-50">
      <div className="flex justify-evenly items-center ">
        <Link
          className={`flex flex-col items-center justify-center gap-1 transition-colors py-2 ${
            pathname === "/"
              ? "text-primary"
              : "text-gray-400 hover:text-primary"
          }`}
          href="/"
        >
          <LayoutDashboard size={24} />
          <span className="text-[10px] font-medium">Dashboard</span>
        </Link>
        <Link
          className={`flex flex-col items-center justify-center gap-1 transition-colors py-2 ${
            pathname === "/classes"
              ? "text-primary"
              : "text-gray-400 hover:text-primary"
          }`}
          href="/classes"
        >
          <BookOpen size={24} />
          <span className="text-[10px] font-medium">Classes</span>
        </Link>
        <Link
          className="flex flex-col items-center justify-center"
          href="/classes/create"
        >
          <div className="-translate-y-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white shadow-lg shadow-primary/40 transition-transform hover:scale-105 active:scale-95">
            <Plus size={24} />
          </div>
        </Link>
        <Link
          className={`flex flex-col items-center justify-center gap-1 transition-colors py-2 ${
            pathname === "/notifications"
              ? "text-primary"
              : "text-gray-400 hover:text-primary"
          }`}
          href="/notifications"
        >
          <Bell size={24} />
          <span className="text-[10px] font-medium">Notifications</span>
        </Link>
        <Link
          className={`flex flex-col items-center justify-center gap-1 transition-colors py-2 ${
            pathname === "/profile"
              ? "text-primary"
              : "text-gray-400 hover:text-primary"
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
