"use client";

import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";

import ForgotPasswordSteps from "./_components/ForgotPasswordSteps";
import StepEmailInput from "./_components/StepEmailInput";
import StepOTPVerification from "./_components/StepOTPVerification";
import StepNewPassword from "./_components/StepNewPassword";
import StepSuccess from "./_components/StepSuccess";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  setResetEmail,
  goToStep,
} from "@/store/features/auth/slices/password-reset.slice";

const ForgotPasswordPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();

  const currentStep = useAppSelector(
    (state) => state.auth.passwordReset.currentStep,
  );

  useEffect(() => {
    const email = searchParams.get("email");

    if (email) {
      dispatch(setResetEmail(email));
      dispatch(goToStep("otp"));
    }
  }, [searchParams, dispatch]);

  const renderStep = () => {
    switch (currentStep) {
      case "email":
        return <StepEmailInput />;
      case "otp":
        return <StepOTPVerification />;
      case "password":
        return <StepNewPassword />;
      case "success":
        return <StepSuccess onGoToLogin={() => router.push("/sign-in")} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#f8fafc] font-display antialiased">
      <main className="flex flex-1 items-center justify-center p-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-blue-100/50 sm:p-8"
        >
          <ForgotPasswordSteps currentStep={currentStep} />

          <div className="mt-8">{renderStep()}</div>
        </motion.div>
      </main>

      <footer className="py-6 text-center text-xs text-[#64748b]">
        © {new Date().getFullYear()} ClassFlow Academic Tracker. All rights
        reserved.
      </footer>
    </div>
  );
};

export default ForgotPasswordPage;
