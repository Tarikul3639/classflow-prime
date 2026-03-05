"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import OTPVerificationHeader from "./_components/OTPVerificationHeader";
import ErrorMessage from "./_components/Error";
import OTPInputForm from "./_components/OTPInputForm";
import ResendOTPSection from "./_components/ResendOTPSection";
import { verifyOTPThunk } from "@/redux/slices/auth/thunks/verifyOTPThunk";
import { resendOTPThunk } from "@/redux/slices/auth/thunks/resendOTPThunk";

const VerifyOTPPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  
  const email = searchParams.get("email") || "";
  const { loading: isLoading, error } = useAppSelector(
    (state) => state.auth?.requestStatus?.verifyOTP || {},
  );

  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  // Countdown timer
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
    
    if (otpCode.length !== 6) {
      return;
    }

    dispatch(verifyOTPThunk({ email, otp: otpCode }))
      .unwrap()
      .then(() => {
        // Set client-side auth marker cookie for middleware
        document.cookie = "cf_auth=1; path=/; max-age=604800; SameSite=Lax";
        console.log("✅ OTP verified successfully");
        router.push("/classroom");
      })
      .catch(() => {});
  };

  const handleResendOTP = () => {
    if (!canResend) return;
    
    dispatch(resendOTPThunk({ email }))
      .unwrap()
      .then(() => {
        setTimer(60);
        setCanResend(false);
        setOtp(["", "", "", "", "", ""]);
      })
      .catch(() => {});
  };

  return (
    <div className="bg-[#f8fafc] min-h-screen flex flex-col font-display antialiased">
      <main className="flex-1 flex items-center justify-center p-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-white rounded-2xl shadow-xl shadow-blue-100/50 p-6 sm:p-8 border border-slate-200"
        >
          <OTPVerificationHeader email={email} />

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
        </motion.div>
      </main>
    </div>
  );
};

export default VerifyOTPPage;