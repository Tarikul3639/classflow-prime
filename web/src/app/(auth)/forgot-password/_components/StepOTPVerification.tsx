"use client";

import React, { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { verifyPasswordResetOTPThunk } from "@/redux/slices/auth/thunks/verifyPasswordResetOTPThunk";
import { resendPasswordResetOTPThunk } from "@/redux/slices/auth/thunks/resendPasswordResetOTPThunk";
import { clearError } from "@/redux/slices/auth/authSlice";
import ErrorMessage from "./Error";
import OTPInputForm from "./OTPInputForm";
import ResendOTPSection from "./ResendOTPSection";

interface StepOTPVerificationProps {
  email: string;
  onNext: (code: string) => void; // ✅ Return verified code
  onBack: () => void;
}

const StepOTPVerification: React.FC<StepOTPVerificationProps> = ({
  email,
  onNext,
  onBack,
}) => {
  const dispatch = useAppDispatch();
  const verifyStatus = useAppSelector(
    (state) => state.auth?.requestStatus?.verifyPasswordResetOTP
  );
  const resendStatus = useAppSelector(
    (state) => state.auth?.requestStatus?.sendPasswordResetOTP
  );

  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(120); // 2 minutes
  const [canResend, setCanResend] = useState(false);

  // Clear error on unmount
  useEffect(() => {
    return () => {
      dispatch(clearError("verifyPasswordResetOTP"));
    };
  }, [dispatch]);

  // Timer countdown
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

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpCode = otp.join("");

    if (otpCode.length !== 6) return;

    const result = await dispatch(
      verifyPasswordResetOTPThunk({ email, otp: otpCode })
    );

    if (verifyPasswordResetOTPThunk.fulfilled.match(result)) {
      console.log("✅ OTP verified, moving to password reset");
      onNext(otpCode); // ✅ Pass verified code to parent
    }
  };

  const handleResendOTP = async () => {
    if (!canResend) return;

    const result = await dispatch(resendPasswordResetOTPThunk({ email }));

    if (resendPasswordResetOTPThunk.fulfilled.match(result)) {
      setTimer(120);
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

      <OTPInputForm
        otp={otp}
        setOtp={setOtp}
        onSubmit={handleVerifyOTP}
        isLoading={verifyStatus.loading}
      />

      <ResendOTPSection
        timer={timer}
        canResend={canResend}
        onResend={handleResendOTP}
        isLoading={resendStatus.loading}
      />

      <div className="mt-4 pt-4 border-t border-slate-100 text-center">
        <button
          onClick={onBack}
          disabled={verifyStatus.loading}
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