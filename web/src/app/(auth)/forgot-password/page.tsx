"use client";

import React, { Suspense } from "react";
import ForgotPasswordContent from "./ForgotPasswordContent";

export default function ForgotPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
          <p className="text-sm text-slate-500">Loading...</p>
        </div>
      }
    >
      <ForgotPasswordContent />
    </Suspense>
  );
}