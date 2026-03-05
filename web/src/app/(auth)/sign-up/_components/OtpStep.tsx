"use client";

import React, { useState, useEffect, useRef, KeyboardEvent, ClipboardEvent, forwardRef, InputHTMLAttributes } from "react";
import { ArrowLeft, RefreshCw, Clock, ArrowRight, Loader2 } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { verifyPasswordResetOTPThunk } from "@/redux/slices/auth/thunks/verifyPasswordResetOTPThunk";
import { resendPasswordResetOTPThunk } from "@/redux/slices/auth/thunks/resendPasswordResetOTPThunk";
import ErrorMessage from "./Error";

interface StepOTPVerificationProps {
  email: string;
  onNext: () => void;
  onBack: () => void;
}

// OTPInput Component
interface OTPInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "onKeyDown" | "onPaste"> {
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
  }
);

OTPInput.displayName = "OTPInput";

// Main Component
export const OTPVerificationStep: React.FC<StepOTPVerificationProps> = ({
  email,
  onNext,
  onBack,
}) => {
  const dispatch = useAppDispatch();
  const { loading: isLoading, error } = useAppSelector(
    (state) => state.auth?.requestStatus?.verifyPasswordResetOTP || {}
  );

  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setCanResend(true);
    }
  }, [timer]);

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

  const handleVerifyOTP = (e: React.FormEvent) => {
    e.preventDefault();
    const otpCode = otp.join("");

    if (otpCode.length !== 6) return;

    dispatch(verifyPasswordResetOTPThunk({ email, otp: otpCode }))
      .unwrap()
      .then(() => {
        onNext();
      })
      .catch(() => {});
  };

  const handleResendOTP = () => {
    if (!canResend) return;

    dispatch(resendPasswordResetOTPThunk({ email }))
      .unwrap()
      .then(() => {
        setTimer(60);
        setCanResend(false);
        setOtp(["", "", "", "", "", ""]);
      })
      .catch(() => {});
  };

  return (
    <div>
      <div className="text-center mb-6">
        <h2 className="text-[#0f172a] text-lg md:text-xl font-extrabold tracking-tight">
          Verify Your Email
        </h2>
        <p className="text-slate-700 text-xs md:text-sm font-medium mt-2 leading-relaxed">
          We've sent a 6-digit code to
          <br />
          <span className="text-[#399aef] font-bold">{email}</span>
        </p>
      </div>

      <ErrorMessage error={error} />

      {/* OTP Input Form */}
      <form onSubmit={handleVerifyOTP} className="space-y-6">
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

      {/* Resend OTP Section */}
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
              onClick={handleResendOTP}
              className="inline-flex items-center gap-2 text-[#399aef] hover:text-[#3289d6] text-xs md:text-sm font-bold transition-colors"
            >
              <RefreshCw size={16} />
              Resend Verification Code
            </button>
          )}
        </div>

        <p className="text-[#64748b] text-[11px] md:text-xs font-medium mt-4 text-center">
          Didn't receive the code? Check your spam folder.
        </p>
      </div>

      {/* Back Button */}
      <div className="mt-4 pt-4 border-t border-slate-100 text-center">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-slate-500 hover:text-[#399aef] text-xs md:text-sm font-bold transition-all group"
        >
          <ArrowLeft
            size={16}
            className="group-hover:-translate-x-1 transition-transform"
          />
          Change Email
        </button>
      </div>
    </div>
  );
};