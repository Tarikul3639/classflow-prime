"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useRouter } from "next/navigation";
import { signUpThunk } from "@/redux/slices/auth/thunks/signUpThunk";
import { EmailInputStep } from "./_components/EmailStep";
import { InfoStep } from "./_components/InfoStep";
import { OTPVerificationStep } from "./_components/OtpStep";
import { StepSuccess } from "./_components/SuccessStep";
import SignUpSteps from "./_components/SignUpSteps";

type SignUpStepsType = "email" | "info" | "otp" | "success";

interface SignUpFormData {
  name: string;
  email: string;
  password: string;
  avatarUrl?: string;
}

const RegisterPage: React.FC = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [currentStep, setCurrentStep] = useState<SignUpStepsType>("otp");
  const { loading: isLoading, error } = useAppSelector(
    (state) => state.auth?.requestStatus?.signUp || {},
  );

  const [formData, setFormData] = useState<SignUpFormData>(() => ({
    name: "",
    email: "",
    password: "",
    avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${Math.random()
      .toString(36)
      .substring(7)}`,
  }));

  const handleNextStep = (step: SignUpStepsType) => {
    setCurrentStep(step);
  };

  const renderStep = () => {
    switch (currentStep) {
      case "email":
        return (
          <EmailInputStep
            email={formData.email}
            setEmail={(email) => setFormData({ ...formData, email })}
            onNext={() => handleNextStep("otp")}
          />
        );

      case "info":
        return (
          <InfoStep
            name={formData.name}
            setName={(name) => setFormData({ ...formData, name })}
            password={formData.password}
            setPassword={(password) => setFormData({ ...formData, password })}
            avatarUrl={formData.avatarUrl || ""}
            setAvatarUrl={(url) => setFormData({ ...formData, avatarUrl: url })}
            onNext={() => handleNextStep("otp")}
            onBack={() => handleNextStep("email")}
          />
        );

      case "otp":
        return (
          <OTPVerificationStep
            email={formData.email}
            onNext={() => handleNextStep("success")}
            onBack={() => handleNextStep("info")}
          />
        );

      case "success":
        return <StepSuccess onGoToLogin={() => router.push("/login")} />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-[#f8fafc] min-h-screen flex items-center justify-center font-display antialiased p-4">
      <div className="w-full max-w-md flex flex-col gap-4">
        {/* Steps */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl shadow-blue-100/50 p-4 border border-slate-200"
        >
          <SignUpSteps currentStep={currentStep} />
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl shadow-blue-100/50 p-6 sm:p-8 border border-slate-200"
        >
          <div>{renderStep()}</div>
        </motion.div>
      </div>
    </div>
  );
};

export default RegisterPage;
