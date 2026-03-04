"use client";

import React from "react";
import { User } from "lucide-react";

interface ProfileHeaderProps {
  onSave: () => void;
}

export default function ProfileHeader({ onSave }: ProfileHeaderProps) {
  return (
    <header className="sticky top-0 z-10 bg-slate-50 pb-4 pt-4 px-4 lg:px-8 border-b border-slate-200">
      <div className="flex items-center gap-3 mx-auto">
        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary">
          <User className="size-5.5" />
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-bold tracking-tight text-slate-900 truncate">
            Profile Settings
          </h1>
          <p className="text-slate-500 text-xs truncate">
            Manage your account settings and class preferences.
          </p>
        </div>
        <button
          onClick={onSave}
          className="flex bg-primary text-white px-4 lg:px-5 py-2 lg:py-2.5 rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors shadow-sm shadow-primary/20 cursor-pointer"
        >
          Save <span className="ml-1 hidden md:inline">Changes</span>
        </button>
      </div>
    </header>
  );
}