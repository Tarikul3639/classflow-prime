"use client";

import React, {
  useEffect,
  useRef,
  useState,
  KeyboardEvent,
  ClipboardEvent,
  forwardRef,
  InputHTMLAttributes,
} from "react";
import { ArrowLeft, RefreshCw, Clock, ArrowRight, Loader2 } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { verifyEmailThunk } from "@/redux/slices/auth/thunks/verifyEmailThunk";
import { resendVerificationThunk } from "@/redux/slices/auth/thunks/resendVerificationThunk";
import ErrorMessage from "./Error";

interface StepOTPVerificationProps {
  email: string;
  onNext: () => void;
  onBack: () => void;
}

interface OTPInputProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "onKeyDown" | "onPaste"
> {
  onKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void;
  onPaste?: (e: ClipboardEvent<HTMLInputElement>) => void;
}

const OTPInput = forwardRef<HTMLInputElement, OTPInputProps>(
  ({ value, onChange, onKeyDown, onPaste, ...props }, ref) => (
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
  ),
);
OTPInput.displayName = "OTPInput";

export const OTPVerificationStep: React.FC<StepOTPVerificationProps> = ({
  email,
  onNext,
  onBack,
}) => {
  const dispatch = useAppDispatch();
  const verifyStatus = useAppSelector(
    (s) => s.auth?.requestStatus?.verifyEmail || {},
  );
  const resendStatus = useAppSelector(
    (s) => s.auth?.requestStatus?.resendVerification || {},
  );

  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (timer > 0) {
      const i = setInterval(() => setTimer((p) => p - 1), 1000);
      return () => clearInterval(i);
    }
    setCanResend(true);
  }, [timer]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const next = [...otp];
    next[index] = value.slice(-1);
    setOtp(next);
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0)
      inputRefs.current[index - 1]?.focus();
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").slice(0, 6);
    if (!/^\d+$/.test(pasted)) return;
    const next = pasted.split("").concat(Array(6).fill("")).slice(0, 6);
    setOtp(next);
    inputRefs.current[Math.min(pasted.length - 1, 5)]?.focus();
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length !== 6) return;

    const result = await dispatch(verifyEmailThunk({ email, code } as any));
    if (verifyEmailThunk.fulfilled.match(result)) onNext();
  };

  const handleResendOTP = async () => {
    if (!canResend) return;
    const result = await dispatch(resendVerificationThunk({ email } as any));
    if (resendVerificationThunk.fulfilled.match(result)) {
      setTimer(60);
      setCanResend(false);
      setOtp(["", "", "", "", "", ""]);
    }
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

      <ErrorMessage error={verifyStatus.error} />

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
              disabled={verifyStatus.loading}
            />
          ))}
        </div>

        <button
          type="submit"
          disabled={verifyStatus.loading || otp.join("").length !== 6}
          className="w-full py-3 bg-[#399aef] text-white text-xs md:text-sm font-medium rounded-lg hover:bg-[#3289d6] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {verifyStatus.loading ? (
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
              type="button"
              onClick={handleResendOTP}
              disabled={resendStatus.loading}
              className="inline-flex items-center gap-2 text-[#399aef] hover:text-[#3289d6] text-xs md:text-sm font-bold transition-colors disabled:opacity-50"
            >
              <RefreshCw size={16} />
              Resend Verification Code
            </button>
          )}
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-slate-100 text-center">
        <button
          type="button"
          onClick={onBack}
          disabled={verifyStatus.loading}
          className="inline-flex items-center gap-2 text-slate-500 hover:text-[#399aef] text-xs md:text-sm font-bold transition-all group disabled:opacity-50"
        >
          <ArrowLeft
            size={16}
            className="group-hover:-translate-x-1 transition-transform"
          />
          Back
        </button>
      </div>
    </div>
  );
};
