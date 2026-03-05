"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle } from "lucide-react";

interface ErrorMessageProps {
  error?: string | null;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ error }) => {
  return (
    <AnimatePresence mode="wait">
      {error && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="overflow-hidden mb-6"
        >
          <div className="flex items-center gap-2.5 py-3 px-4 rounded-xl bg-red-50 border border-red-100">
            <AlertCircle className="text-red-500 shrink-0" size={16} />
            <p className="text-red-700 text-xs font-bold leading-tight">
              {typeof error === "string"
                ? error
                : "Registration failed. Try again."}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ErrorMessage;
