"use client";

import React, {
  ClipboardEvent,
  forwardRef,
  InputHTMLAttributes,
  KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { ArrowLeft, ArrowRight, Clock, Loader2, RefreshCw } from "lucide-react";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import ErrorMessage from "./Error";

// Updated thunks (server flow match)
import {
  resendSignupVerificationThunk,
  verifySignupEmailThunk,
} from "@/store/features/auth/thunks/signup.thunk";

import type {
  IResendVerificationRequest,
  IEmailVerifyRequest,
} from "@/store/features/auth/thunks/signup.thunk";

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

const OTP_LEN = 6;
const RESEND_COOLDOWN_SECONDS = 60;

export const OTPVerificationStep: React.FC<StepOTPVerificationProps> = ({
  email,
  onNext,
  onBack,
}) => {
  const dispatch = useAppDispatch();

  const isVerifying = useAppSelector(
    (s) => s.auth.signup.verifySignupEmail.loading,
  );
  const isResending = useAppSelector(
    (s) => s.auth.signup.resendSignupVerification.loading,
  );
  const error = useAppSelector(
    (s) =>
      s.auth.signup.verifySignupEmail.error ||
      s.auth.signup.resendSignupVerification.error,
  );

  const [otp, setOtp] = useState<string[]>(
    Array.from({ length: OTP_LEN }, () => ""),
  );
  const [timer, setTimer] = useState<number>(RESEND_COOLDOWN_SECONDS);
  const [canResend, setCanResend] = useState<boolean>(false);

  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    if (timer <= 0) {
      setCanResend(true);
      return;
    }

    const id = setInterval(() => setTimer((p) => p - 1), 1000);
    return () => clearInterval(id);
  }, [timer]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const next = [...otp];
    next[index] = value.slice(-1); // only last digit
    setOtp(next);

    if (value && index < OTP_LEN - 1) {
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

    const pasted = e.clipboardData
      .getData("text")
      .replace(/\s/g, "")
      .slice(0, OTP_LEN);
    if (!/^\d+$/.test(pasted)) return;

    const next = pasted
      .split("")
      .concat(Array(OTP_LEN).fill(""))
      .slice(0, OTP_LEN);
    setOtp(next);

    inputRefs.current[Math.min(pasted.length - 1, OTP_LEN - 1)]?.focus();
  };

  const handleVerifyOTP: React.FormEventHandler<HTMLFormElement> = async (
    e,
  ) => {
    e.preventDefault();

    const code = otp.join("");
    if (code.length !== OTP_LEN) return;

    const payload: IEmailVerifyRequest = { email, code };
    const resultAction = await dispatch(verifySignupEmailThunk(payload));

    if (verifySignupEmailThunk.fulfilled.match(resultAction)) {
      onNext();
    }
  };

  const handleResendOTP = async () => {
    if (!canResend || isResending) return;

    const payload: IResendVerificationRequest = { email };
    const resultAction = await dispatch(resendSignupVerificationThunk(payload));

    if (resendSignupVerificationThunk.fulfilled.match(resultAction)) {
      setTimer(RESEND_COOLDOWN_SECONDS);
      setCanResend(false);
      setOtp(Array.from({ length: OTP_LEN }, () => ""));
      inputRefs.current[0]?.focus();
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

      <ErrorMessage error={error} />

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
              disabled={isVerifying || isResending}
            />
          ))}
        </div>

        <button
          type="submit"
          disabled={
            isVerifying || isResending || otp.join("").length !== OTP_LEN
          }
          className="w-full py-3 bg-[#399aef] text-white text-xs md:text-sm font-medium rounded-lg hover:bg-[#3289d6] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isVerifying ? (
            <>
              <Loader2 className="animate-spin size-5" />
              Verifying...
            </>
          ) : (
            <>
              Verify &amp; Continue{" "}
              <ArrowRight className="size-4 md:size-4.5" />
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
              disabled={isResending}
              className="inline-flex items-center gap-2 text-[#399aef] hover:text-[#3289d6] text-xs md:text-sm font-bold transition-colors disabled:opacity-50"
            >
              <RefreshCw size={16} />
              {isResending ? "Resending..." : "Resend Verification Code"}
            </button>
          )}
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-slate-100 text-center">
        <button
          type="button"
          onClick={onBack}
          disabled={isVerifying || isResending}
          className="inline-flex items-center justify-center gap-2 text-slate-500 hover:text-[#399aef] text-xs md:text-sm font-semibold transition-all group disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
        >
          <ArrowLeft
            size={16}
            className="group-hover:-translate-x-0.5 translate-y-0.5 transition-transform"
          />
          Change Info
        </button>
      </div>
    </div>
  );
};
