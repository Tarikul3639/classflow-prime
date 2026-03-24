"use client";

import React, { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { verifyCodePasswordResetThunk } from "@/store/features/auth/thunks/password-reset.thunk";
import { resendCodePasswordResetThunk } from "@/store/features/auth/thunks/password-reset.thunk";
import { goToStep, clearPasswordResetStatus } from "@/store/features/auth/slices/password-reset.slice";
import ErrorMessage from "./Error";
import OTPInputForm from "./OTPInputForm";
import ResendOTPSection from "./ResendOTPSection";

const StepOTPVerification = () => {
  const dispatch = useAppDispatch();
  const { email, verifyStatus, resendStatus } = useAppSelector((s) => s.auth.passwordReset);
  
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(120);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(interval);
    } else setCanResend(true);
  }, [timer]);

  const handleVerifyOTP = (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length === 6) {
      dispatch(verifyCodePasswordResetThunk({ email, code }));
    }
  };

  const handleResendOTP = async () => {
    if (!canResend) return;
    const result = await dispatch(resendCodePasswordResetThunk({ email }));
    if (resendCodePasswordResetThunk.fulfilled.match(result)) {
      setTimer(120); setCanResend(false); setOtp(["", "", "", "", "", ""]);
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

      <ErrorMessage error={verifyStatus.error || resendStatus.error} />

      <OTPInputForm otp={otp} setOtp={setOtp} onSubmit={handleVerifyOTP} isLoading={verifyStatus.loading} />

      <ResendOTPSection timer={timer} canResend={canResend} onResend={handleResendOTP} isLoading={resendStatus.loading} />

      <div className="mt-4 pt-4 border-t border-slate-100 text-center">
        <button
          onClick={() => dispatch(goToStep("email"))}
          className="inline-flex items-center gap-2 text-slate-500 hover:text-[#399aef] text-xs md:text-sm font-bold transition-all group disabled:opacity-50"
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

export default StepOTPVerification;
