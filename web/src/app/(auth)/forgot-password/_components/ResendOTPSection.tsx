"use client";

import React from "react";
import { RefreshCw, Clock, Loader2 } from "lucide-react";

interface ResendOTPSectionProps {
  timer: number;
  canResend: boolean;
  onResend: () => void;
  isLoading?: boolean; // ✅ Add optional isLoading prop
}

const ResendOTPSection: React.FC<ResendOTPSectionProps> = ({
  timer,
  canResend,
  onResend,
  isLoading = false, // ✅ Default to false
}) => {
  return (
    <div className="mt-6 pt-6 border-t border-slate-100">
      <div className="text-center">
        {!canResend ? (
          <div className="flex items-center justify-center gap-2 text-slate-500 text-xs md:text-sm font-medium">
            <Clock size={16} className="text-[#399aef]" />
            <span>
              Resend code in{" "}
              <span className="font-bold text-[#399aef]">{timer}s</span>
            </span>
          </div>
        ) : (
          <button
            onClick={onResend}
            disabled={isLoading} // ✅ Disable when loading
            className="inline-flex items-center gap-2 text-[#399aef] hover:text-[#3289d6] text-xs md:text-sm font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <RefreshCw size={16} />
                Resend Verification Code
              </>
            )}
          </button>
        )}
      </div>

      <p className="text-[#64748b] text-[11px] md:text-xs font-medium mt-4 text-center">
        Didn't receive the code? Check your spam folder.
      </p>
    </div>
  );
};

export default ResendOTPSection;