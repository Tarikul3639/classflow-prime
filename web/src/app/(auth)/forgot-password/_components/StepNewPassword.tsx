"use client";

import React, { useState } from "react";
import { Lock, ArrowRight, Loader2, ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { resetPasswordThunk } from "@/redux/slices/auth/thunks/resetPasswordThunk";
import ErrorMessage from "./Error";

interface StepNewPasswordProps {
  email: string;
  onNext: () => void;
  onBack: () => void;
}

const StepNewPassword: React.FC<StepNewPasswordProps> = ({
  email,
  onNext,
  onBack,
}) => {
  const dispatch = useAppDispatch();
  const { loading: isLoading, error } = useAppSelector(
    (state) => state.auth?.requestStatus?.resetPassword || {}
  );

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [validationError, setValidationError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError("");

    if (password.length < 6) {
      setValidationError("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      setValidationError("Passwords do not match");
      return;
    }

    dispatch(resetPasswordThunk({ email, newPassword: password }))
      .unwrap()
      .then(() => {
        onNext();
      })
      .catch(() => {});
  };

  return (
    <div>
      <div className="text-center mb-6">
        <h2 className="text-[#0f172a] text-lg md:text-xl font-extrabold tracking-tight">
          Create New Password
        </h2>
        <p className="text-slate-700 text-xs md:text-sm font-medium mt-2 leading-relaxed">
          Your new password must be different from previous passwords
        </p>
      </div>

      <ErrorMessage error={error || validationError} />

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          required
          label="New Password"
          type="password"
          placeholder="Min. 6 characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          icon={Lock}
        />

        <Input
          required
          label="Confirm Password"
          type="password"
          placeholder="Re-enter your password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          icon={Lock}
        />

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 md:py-3 bg-[#399aef] text-white text-xs md:text-sm font-medium rounded-lg md:rounded-xl hover:bg-[#3289d6] shadow-lg shadow-blue-100 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin size-5" />
              Resetting...
            </>
          ) : (
            <>
              Reset Password <ArrowRight className="size-4 md:size-4.5" />
            </>
          )}
        </button>
      </form>

      <div className="mt-4 pt-4 border-t border-slate-100 text-center">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-slate-500 hover:text-[#399aef] text-xs md:text-sm font-bold transition-all group"
        >
          <ArrowLeft
            size={16}
            className="group-hover:-translate-x-1 transition-transform"
          />
          Back to Verification
        </button>
      </div>
    </div>
  );
};

export default StepNewPassword;