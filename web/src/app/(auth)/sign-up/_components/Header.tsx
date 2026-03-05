"use client";

import React, { useCallback } from "react";
import { RefreshCw } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface SignUpFormData {
  name: string;
  email: string;
  password: string;
  avatarUrl?: string;
}

interface RegistrationHeaderProps {
  formData: SignUpFormData;
  setFormData: React.Dispatch<React.SetStateAction<SignUpFormData>>;
}

const RegistrationHeader: React.FC<RegistrationHeaderProps> = ({
  formData,
  setFormData,
}) => {
  const regenerateAvatar = useCallback(() => {
    const newSeed = Math.random().toString(36).substring(7);
    setFormData((prev) => ({
      ...prev,
      avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${newSeed}`,
    }));
  }, [setFormData]);

  const getInitials = (name: string) => {
    return name
      ? name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
          .slice(0, 2)
      : "CF";
  };

  return (
    <div className="text-center mb-4">
      {/* Compact Avatar Section */}
      <div className="flex flex-col items-center md:mb-2">
        <div className="relative">
          <Avatar className="w-16 md:w-20 h-16 md:h-20 border-4 border-[#399aef]/10 shadow-sm ring-1 ring-blue-200">
            <AvatarImage src={formData.avatarUrl} alt="Avatar" />
            <AvatarFallback className="bg-[#399aef] text-white font-bold">
              {getInitials(formData.name)}
            </AvatarFallback>
          </Avatar>
          <button
            type="button"
            onClick={regenerateAvatar}
            className="absolute bottom-0 right-0 p-1.5 bg-white border border-slate-200 rounded-full text-[#399aef] hover:bg-slate-50 shadow-sm transition-all active:scale-90"
            title="Change Avatar"
          >
            <RefreshCw size={14} />
          </button>
        </div>
        <span className="text-[10px] md:text-xs text-slate-400 mt-2 font-medium uppercase tracking-wider">
          Profile Avatar
        </span>
      </div>
      <h1 className="text-[#0f172a] text-lg md:text-xl font-extrabold tracking-tight">
        Create Account
      </h1>
      <p className="text-slate-700 text-xs md:text-sm font-medium mt-1.5">
        Join ClassFlow to track your progress effortlessly.
      </p>
    </div>
  );
};

export default RegistrationHeader;
