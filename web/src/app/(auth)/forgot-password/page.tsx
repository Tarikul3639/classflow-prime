"use client";

import React from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import ForgotPasswordSteps from "./_components/ForgotPasswordSteps";
import StepEmailInput from "./_components/StepEmailInput";
import StepOTPVerification from "./_components/StepOTPVerification";
import StepNewPassword from "./_components/StepNewPassword";
import StepSuccess from "./_components/StepSuccess";
import { useAppSelector } from "@/redux/hooks";

const ForgotPasswordPage: React.FC = () => {
  const router = useRouter();
  // Get current step from Redux state
  const currentStep = useAppSelector((state) => state.auth.passwordReset.currentStep);

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
    <div className="bg-[#f8fafc] min-h-screen flex flex-col font-display antialiased">
      <main className="flex-1 flex items-center justify-center p-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-white rounded-2xl shadow-xl shadow-blue-100/50 p-6 sm:p-8 border border-slate-200"
        >
          <ForgotPasswordSteps currentStep={currentStep} />
          <div className="mt-8">{renderStep()}</div>
        </motion.div>
      </main>

      <footer className="py-6 text-center text-[#64748b] text-xs">
        © {new Date().getFullYear()} ClassFlow Academic Tracker. All rights reserved.
      </footer>
    </div>
  );
};

export default ForgotPasswordPage;