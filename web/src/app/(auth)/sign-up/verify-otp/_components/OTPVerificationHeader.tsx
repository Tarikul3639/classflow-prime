"use client";

import React from "react";
import { ShieldCheck } from "lucide-react";

interface OTPVerificationHeaderProps {
  email: string;
}

const OTPVerificationHeader: React.FC<OTPVerificationHeaderProps> = ({
  email,
}) => {
  return (
    <div className="text-center mb-6">
      {/* Icon Section */}
      <div className="flex flex-col items-center md:mb-3">
        <div className="w-16 md:w-20 h-16 md:h-20 bg-linear-to-br from-[#399aef] to-[#3289d6] rounded-full flex items-center justify-center shadow-lg shadow-blue-200/50 ring-4 ring-blue-100">
          <ShieldCheck className="text-white" size={32} />
        </div>
        <span className="text-[10px] md:text-xs text-slate-400 mt-3 font-medium uppercase tracking-wider">
          Verification Required
        </span>
      </div>
      
      <h1 className="text-[#0f172a] text-lg md:text-xl font-extrabold tracking-tight mt-2">
        Verify Your Email
      </h1>
      <p className="text-slate-700 text-xs md:text-sm font-medium mt-2 leading-relaxed">
        We've sent a 6-digit verification code to
        <br />
        <span className="text-[#399aef] font-bold">{email}</span>
      </p>
    </div>
  );
};

export default OTPVerificationHeader;