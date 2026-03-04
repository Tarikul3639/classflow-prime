"use client";

import React from "react";
import { MessageCircle, Radio, Send, Plus, ExternalLink } from "lucide-react";
import Link from "next/link";
import { GroupCard } from "./_components/GroupCard";

interface Group {
  _id: string;
  name: string;
  platform: string;
  platformColor: string;
  platformBg: string;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  description: string;
}

export default function GroupsPage({
  params,
}: {
  params: { classId: string };
}) {
  const groups: Group[] = [
    {
      _id: "1",
      name: "Class Chat - Section A",
      platform: "WhatsApp",
      platformColor: "text-emerald-600",
      platformBg: "bg-emerald-50",
      icon: MessageCircle,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
      description:
        "The primary group for instant announcements, peer discussions, and quick help with assignments.",
    },
    {
      _id: "2",
      name: "Study Circle & Voice",
      platform: "Discord",
      platformColor: "text-indigo-600",
      platformBg: "bg-indigo-50",
      icon: Radio,
      iconBg: "bg-indigo-50",
      iconColor: "text-indigo-600",
      description:
        "Voice channels for group study sessions and organized threads for different topics.",
    },
    {
      _id: "3",
      name: "Resource Library",
      platform: "Telegram",
      platformColor: "text-sky-600",
      platformBg: "bg-sky-50",
      icon: Send,
      iconBg: "bg-sky-50",
      iconColor: "text-sky-600",
      description:
        "Unofficial repository for lecture notes, past papers, and shared academic materials.",
    },
  ];

  return (
    <main className="p-4 space-y-4 pb-8 mx-auto">
      {/* Add New Group - Dashed Border */}
      <div className="border-2 border-dashed border-slate-300 rounded-2xl bg-transparent p-6 flex flex-col items-center text-center gap-3">
        <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
          <Plus className="text-primary" size={24} />
        </div>
        <div>
          <h4 className="font-bold text-slate-900 text-base">
            Add New Group Link
          </h4>
          <p className="text-sm text-slate-600 mt-1">
            Help your classmates by sharing relevant group links
          </p>
        </div>
        <Link
          href={`/classes/${params.classId}/groups/1`}
          className="mt-2 px-4 py-2.5 rounded-lg border border-primary/30 bg-white/50 text-primary font-bold text-[11px] md:text-[12px] lg:text-[13px] hover:bg-blue-50 transition-colors flex items-center gap-2 cursor-pointer"
        >
          <span>Suggest Link</span>
        </Link>
      </div>

      {/* Section Title */}
      <div className="mt-6 mb-2">
        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 px-1">
          Active Communication Channels
        </h3>
      </div>

      {/* Groups Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {groups.map((group) => {
          return <GroupCard key={group._id} group={group} />;
        })}
      </div>
    </main>
  );
}
