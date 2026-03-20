"use client";

import React, { useEffect } from "react";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

interface StepSuccessProps {
  onGoToLogin: () => void;
}

const StepSuccess: React.FC<StepSuccessProps> = ({ onGoToLogin }) => {
  useEffect(() => {
    // Auto redirect after 5 seconds
    const timer = setTimeout(() => {
      onGoToLogin();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onGoToLogin]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center py-4"
    >
      {/* Success Icon */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        className="mx-auto mb-6 w-20 h-20 bg-primary rounded-full flex items-center justify-center shadow-lg shadow-blue-200"
      >
        <CheckCircle2 size={40} className="text-white" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="text-[#0f172a] text-lg md:text-xl font-extrabold tracking-tight">
          Password Reset Successful!
        </h2>
        <p className="text-slate-700 text-xs md:text-sm font-medium mt-2 leading-relaxed max-w-sm mx-auto">
          Your password has been successfully reset. You can now sign in with your
          new password.
        </p>
      </motion.div>

      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        onClick={onGoToLogin}
        className="mt-8 w-full py-3 md:py-3 bg-[#399aef] text-white text-xs md:text-sm font-medium rounded-lg md:rounded-xl hover:bg-[#3289d6] shadow-lg shadow-blue-100 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
      >
        Go to Sign In <ArrowRight className="size-4 md:size-4.5" />
      </motion.button>

      <p className="mt-4 text-xs text-slate-500">
        Redirecting automatically in 5 seconds...
      </p>

      <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-xl">
        <p className="text-slate-600 text-[11px] md:text-xs font-medium">
          💡 <span className="font-bold">Security Tip:</span> Remember to use a
          strong, unique password and never share it with anyone.
        </p>
      </div>
    </motion.div>
  );
};

export default StepSuccess;