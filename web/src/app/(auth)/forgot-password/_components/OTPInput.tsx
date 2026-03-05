"use client";

import React, {
  forwardRef,
  InputHTMLAttributes,
  KeyboardEvent,
  ClipboardEvent,
} from "react";

interface OTPInputProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "onKeyDown" | "onPaste"
> {
  onKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void;
  onPaste?: (e: ClipboardEvent<HTMLInputElement>) => void;
}

const OTPInput = forwardRef<HTMLInputElement, OTPInputProps>(
  ({ value, onChange, onKeyDown, onPaste, ...props }, ref) => {
    return (
      <input
        ref={ref}
        type="text"
        inputMode="numeric"
        maxLength={1}
        value={value}
        onChange={(e) => onChange?.(e)}
        onKeyDown={onKeyDown}
        onPaste={onPaste}
        className="w-10 h-12 md:w-12 md:h-14 text-center text-lg md:text-xl font-bold border-2 border-slate-200 rounded-lg md:rounded-xl focus:border-[#399aef] focus:ring-2 focus:ring-[#399aef]/20 outline-none transition-all bg-slate-50 focus:bg-white"
        {...props}
      />
    );
  },
);

OTPInput.displayName = "OTPInput";

export default OTPInput;
