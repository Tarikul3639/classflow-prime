"use client";

import React from "react";
import { Mail, ShieldCheck, Lock, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

type ForgotPasswordStep = "email" | "otp" | "password" | "success";

interface Step {
  id: ForgotPasswordStep;
  label: string;
  icon: React.ElementType;
}

const steps: Step[] = [
  { id: "email", label: "Email", icon: Mail },
  { id: "otp", label: "Verify", icon: ShieldCheck },
  { id: "password", label: "Reset", icon: Lock },
  { id: "success", label: "Done", icon: CheckCircle2 },
];

interface ForgotPasswordStepsProps {
  currentStep: ForgotPasswordStep;
}

const ForgotPasswordSteps: React.FC<ForgotPasswordStepsProps> = ({
  currentStep,
}) => {
  const currentIndex = steps.findIndex((step) => step.id === currentStep);

  return (
    <div className="relative">
      {/* Progress Bar Background */}
      <div className="absolute top-5 left-0 w-full h-0.5 bg-slate-200">
        <motion.div
          initial={{ width: "0%" }}
          animate={{
            width: `${(currentIndex / (steps.length - 1)) * 100}%`,
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="h-full bg-[#399aef]"
        />
      </div>

      {/* Steps */}
      <div className="relative flex justify-between">
        {steps.map((step, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;
          const Icon = step.icon;

          return (
            <div key={step.id} className="flex flex-col items-center">
              {/* Step Circle */}
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{
                  scale: isCurrent ? 1.1 : 1,
                  backgroundColor:
                    isCompleted || isCurrent ? "#399aef" : "#e2e8f0",
                }}
                transition={{ duration: 0.3 }}
                className={`w-10 h-10 rounded-full flex items-center justify-center z-10 ${
                  isCompleted || isCurrent
                    ? "ring-4 ring-blue-100 shadow-lg shadow-blue-200/50"
                    : "ring-2 ring-slate-100"
                }`}
              >
                <Icon
                  size={18}
                  className={
                    isCompleted || isCurrent ? "text-white" : "text-slate-400"
                  }
                />
              </motion.div>

              {/* Step Label */}
              <motion.span
                initial={{ opacity: 0.5 }}
                animate={{
                  opacity: isCurrent ? 1 : 0.6,
                  fontWeight: isCurrent ? 700 : 500,
                }}
                className={`mt-2 text-[10px] md:text-xs ${
                  isCurrent ? "text-[#399aef]" : "text-slate-500"
                }`}
              >
                {step.label}
              </motion.span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ForgotPasswordSteps;
