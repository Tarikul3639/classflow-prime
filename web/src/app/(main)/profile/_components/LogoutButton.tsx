"use client";

import React from "react";
import { LogOut } from "lucide-react";

interface LogoutButtonProps {
  onLogout: () => void;
}

export default function LogoutButton({ onLogout }: LogoutButtonProps) {
  return (
    <div className="mt-8">
      <button
        onClick={onLogout}
        className="w-full border-2 border-red-500/20 text-red-500 rounded-lg py-2.5 px-4 font-bold text-sm hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-2 group cursor-pointer"
      >
        <LogOut
          size={16}
          className="group-hover:rotate-12 transition-transform duration-300 group-hover:text-white"
        />
        Log Out
      </button>
    </div>
  );
}