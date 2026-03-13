"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import ForgotPasswordSteps from "./_components/ForgotPasswordSteps";
import StepEmailInput from "./_components/StepEmailInput";
import StepOTPVerification from "./_components/StepOTPVerification";
import StepNewPassword from "./_components/StepNewPassword";
import StepSuccess from "./_components/StepSuccess";

export type ForgotPasswordStep = "email" | "otp" | "password" | "success";

const ForgotPasswordPage: React.FC = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<ForgotPasswordStep>("email");
  const [email, setEmail] = useState("");
  const [verifiedCode, setVerifiedCode] = useState(""); // ✅ Store verified code

  const handleNextStep = (step: ForgotPasswordStep, code?: string) => {
    if (code) {
      setVerifiedCode(code); // ✅ Save code when moving from OTP to password step
    }
    setCurrentStep(step);
  };

  const renderStep = () => {
    switch (currentStep) {
      case "email":
        return (
          <StepEmailInput
            email={email}
            setEmail={setEmail}
            onNext={() => handleNextStep("otp")}
          />
        );
      case "otp":
        return (
          <StepOTPVerification
            email={email}
            onNext={(code) => handleNextStep("password", code)} // ✅ Pass code
            onBack={() => handleNextStep("email")}
          />
        );
      case "password":
        return (
          <StepNewPassword
            email={email}
            code={verifiedCode} // ✅ Pass verified code
            onNext={() => handleNextStep("success")}
            onBack={() => handleNextStep("otp")}
          />
        );
      case "success":
        return <StepSuccess onGoToLogin={() => router.push("/signin")} />;
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
          {/* Progress Steps */}
          <ForgotPasswordSteps currentStep={currentStep} />

          {/* Dynamic Step Content */}
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