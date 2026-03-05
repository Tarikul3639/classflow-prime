"use client";

import React, { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { verifyPasswordResetOTPThunk } from "@/redux/slices/auth/thunks/verifyPasswordResetOTPThunk";
import { resendPasswordResetOTPThunk } from "@/redux/slices/auth/thunks/resendPasswordResetOTPThunk";
import ErrorMessage from "./Error";
import OTPInputForm from "./OTPInputForm";
import ResendOTPSection from "./ResendOTPSection";

interface StepOTPVerificationProps {
  email: string;
  onNext: () => void;
  onBack: () => void;
}

const StepOTPVerification: React.FC<StepOTPVerificationProps> = ({
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

      <OTPInputForm
        otp={otp}
        setOtp={setOtp}
        onSubmit={handleVerifyOTP}
        isLoading={isLoading}
      />

      <ResendOTPSection
        timer={timer}
        canResend={canResend}
        onResend={handleResendOTP}
      />

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

export default StepOTPVerification;