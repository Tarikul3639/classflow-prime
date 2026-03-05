"use client";

import React, { useRef, KeyboardEvent, ClipboardEvent } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import OTPInput from "./OTPInput";

interface OTPInputFormProps {
  otp: string[];
  setOtp: React.Dispatch<React.SetStateAction<string[]>>;
  onSubmit: (e: React.FormEvent) => void;
  isLoading?: boolean;
}

const OTPInputForm: React.FC<OTPInputFormProps> = ({
  otp,
  setOtp,
  onSubmit,
  isLoading,
}) => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);

    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = pastedData.split("").concat(Array(6).fill("")).slice(0, 6);
    setOtp(newOtp);

    // Focus last filled input
    const lastIndex = Math.min(pastedData.length, 5);
    inputRefs.current[lastIndex]?.focus();
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="flex justify-center gap-2 md:gap-3">
        {otp.map((digit, index) => (
          <OTPInput
            key={index}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            autoFocus={index === 0}
          />
        ))}
      </div>

      <button
        type="submit"
        disabled={isLoading || otp.join("").length !== 6}
        className="w-full py-3 md:py-3 bg-[#399aef] text-white text-xs md:text-sm font-medium rounded-lg md:rounded-xl hover:bg-[#3289d6] shadow-lg shadow-blue-100 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <>
            <Loader2 className="animate-spin size-5" />
            Verifying...
          </>
        ) : (
          <>
            Verify & Continue <ArrowRight className="size-4 md:size-4.5" />
          </>
        )}
      </button>
    </form>
  );
};

export default OTPInputForm;
