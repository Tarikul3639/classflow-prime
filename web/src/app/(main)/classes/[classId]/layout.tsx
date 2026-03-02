"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Share2 } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";

interface ClassLayoutProps {
  children: React.ReactNode;
  params: { classId: string };
}

export default function ClassLayout({ children, params }: ClassLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();

  const tabs = [
    {
      id: "overview",
      label: "Overview",
      href: `/classes/${params.classId}/overview`,
    },
    {
      id: "updates",
      label: "Updates",
      href: `/classes/${params.classId}/updates`,
    },
    {
      id: "faculty",
      label: "Faculty",
      href: `/classes/${params.classId}/faculty`,
    },
    {
      id: "members",
      label: "Members",
      href: `/classes/${params.classId}/members`,
    },
    {
      id: "groups",
      label: "Groups",
      href: `/classes/${params.classId}/groups`,
    },
  ];

  const isActiveTab = (href: string) => pathname === href;

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* Sticky Header */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-lg border-b border-slate-100 px-4 md:px-8 py-3">
        <div className="flex items-center justify-between mx-auto">
          <div className="flex items-center gap-3">
            <button
              onClick={router.back}
              className="group flex items-center justify-center p-2 rounded-lg hover:bg-white transition-colors border border-slate-200 bg-white cursor-pointer hover:border-primary/30"
            >
              <ArrowLeft
                className="text-slate-900 group-hover:text-primary group-hover:-translate-x-0.5 transition-all duration-200"
                size={18}
              />
            </button>
            <h1 className="text-lg font-bold text-slate-900">Class Details</h1>
          </div>
          <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-50 cursor-pointer transition-colors">
            <Share2 className="text-slate-600" size={20} />
          </button>
        </div>
      </header>

      {/* Class Info Card - Hero Style */}
      <div className="p-4 mx-auto w-full">
        <div className="relative h-64 w-full rounded-2xl overflow-hidden shadow-lg">
          <img
            alt="Class Background"
            className="absolute inset-0 w-full h-full object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBiqTWbkwjYy_mo_vKEgSaE_mcDquuBA4sRWKC6PF19Y12A3wiv4JvSQNg7s8MGJhzBBFYMZOtE4ETlFLyPPR6LyWXFKlBfmguClalI9wnpFaAjzg7h3XwJ1a_rD7f8H2PStW0kYFL9FizfF6E8FqPYxfbRdQJSld9DorCv1ue79zweVL6AxSpJz2gLxavBKmqlOo-l1dSn8dpdqbr9Vb7yiVdtlLZvl33bUAdQ0gFr53C-4sABTbyiFLBCPAxP_DHdCFJKFOGahopf"
          />
          <div className="absolute inset-0 bg-linear-to-t from-blue-900/90 via-primary/40 to-transparent"></div>
          <div className="absolute inset-0 p-6 flex flex-col justify-between text-white">
            {/* Top Row */}
            <div className="flex justify-between items-start">
              <span className="px-3 py-1 bg-emerald-500/90 backdrop-blur-sm text-[11px] font-bold rounded-full uppercase tracking-wider">
                Active
              </span>
              <div className="flex items-center gap-1 bg-white/20 backdrop-blur-md px-2 py-1 rounded-lg">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                <span className="text-xs font-semibold">32 Members</span>
              </div>
            </div>

            {/* Bottom Info */}
            <div>
              <p className="text-blue-100 text-xs font-bold uppercase tracking-widest mb-1">
                CS-101 • Fall 2024
              </p>
              <h2 className="text-2xl font-extrabold mb-4 leading-tight">
                Advanced Mathematics & Theory
              </h2>
              <div className="flex items-center gap-3 pt-4 border-t border-white/20">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-primary font-bold text-sm shadow-sm">
                  AG
                </div>
                <div>
                  <p className="text-xs text-blue-100 font-medium">
                    Instructor
                  </p>
                  <p className="text-sm font-bold">Dr. Alan Grant</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Tabs */}
      <div className="sticky top-16 z-20 bg-slate-50/95 backdrop-blur-md border-b border-slate-200  mx-auto w-full">
        <div className="flex overflow-x-auto no-scrollbar px-4 relative">
          {tabs.map((tab) => {
            const active = isActiveTab(tab.href);

            return (
              <Link
                key={tab.id}
                href={tab.href}
                className={`relative flex-none px-4 py-4 text-sm font-semibold transition-colors overflow-hidden ${
                  active
                    ? "text-primary font-bold"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                {tab.label}

                {active && (
                  <>
                    {/* Glow Light */}
                    <motion.span
                      layoutId="activeGlow"
                      className="absolute -bottom-1 left-2 right-2 h-3 bg-primary/40 blur-md rounded-full"
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 30,
                      }}
                    />

                    {/* Main Underline */}
                    <motion.span
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-1 rounded-t-full bg-primary"
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 30,
                      }}
                    />
                  </>
                )}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Page Content */}
      <div className="flex-1">{children}</div>
    </div>
  );
}
