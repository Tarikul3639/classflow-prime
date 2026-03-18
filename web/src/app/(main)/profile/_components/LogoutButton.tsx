"use client";

import React from "react";
import { LogOut } from "lucide-react";
import { Loader2 } from "lucide-react";

interface LogoutButtonProps {
  onLogout: () => void;
  isLoading?: boolean;
}

export default function LogoutButton({
  onLogout,
  isLoading,
}: LogoutButtonProps) {
  return (
    <div className="mt-8">
      <button
        onClick={onLogout}
        disabled={isLoading}
        className="w-full border-2 border-red-500/20 text-red-500 rounded-lg py-2.5 px-4 font-bold text-sm hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-2 group cursor-pointer"
      >
        {isLoading ? (
          <>
            <Loader2 className="animate-spin" />
            <span>Logging Out...</span>
          </>
        ) : (
          <>
            <LogOut
              size={16}
              className="group-hover:rotate-12 transition-transform duration-300 group-hover:text-white"
            />
            <span>Log Out</span>
          </>
        )}
      </button>
    </div>
  );
}
