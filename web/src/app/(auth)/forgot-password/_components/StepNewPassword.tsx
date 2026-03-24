"use client";

import React, { useState, useEffect } from "react";
import {
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  ArrowLeft,
} from "lucide-react";
import { Input } from "@/components/ui/Input";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { confirmNewPasswordPasswordResetThunk } from "@/store/features/auth/thunks/password-reset.thunk";
import {
  clearPasswordResetStatus,
  goToStep,
} from "@/store/features/auth/slices/password-reset.slice";
import ErrorMessage from "./Error";

const StepNewPassword = () => {
  const dispatch = useAppDispatch();
  const { email, resetToken, confirmStatus } = useAppSelector(
    (s) => s.auth.passwordReset,
  );
  const { loading } = confirmStatus;
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (resetToken) {
      dispatch(
        confirmNewPasswordPasswordResetThunk({
          email,
          resetToken,
          newPassword: password,
        }),
      );
    }
  };

  // Clear error on unmount
  useEffect(() => {
    return () => {
      dispatch(clearPasswordResetStatus());
    };
  }, [dispatch]);

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

      <ErrorMessage error={confirmStatus.error} />

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* New Password */}
        <div className="relative">
          <Input
            required
            label="New Password"
            type={showPassword ? "text" : "password"}
            placeholder="Min. 8 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            icon={Lock}
            disabled={loading}
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            disabled={loading}
            className="absolute right-3 top-8.5 md:top-9 text-gray-500 hover:text-gray-700 focus:outline-none disabled:opacity-50"
          >
            {showPassword ? (
              <EyeOff className="size-4 md:size-4.5" />
            ) : (
              <Eye className="size-4 md:size-4.5" />
            )}
          </button>
        </div>

        {/* Password Strength Indicator */}
        {password && (
          <div className="space-y-2">
            <div className="flex gap-1">
              <div
                className={`h-1 flex-1 rounded ${
                  password.length >= 8 ? "bg-green-500" : "bg-slate-200"
                }`}
              />
              <div
                className={`h-1 flex-1 rounded ${
                  /[A-Z]/.test(password) && /[a-z]/.test(password)
                    ? "bg-green-500"
                    : "bg-slate-200"
                }`}
              />
              <div
                className={`h-1 flex-1 rounded ${
                  /\d/.test(password) ? "bg-green-500" : "bg-slate-200"
                }`}
              />
            </div>
            <div className="text-xs text-slate-600 space-y-1">
              <p className={password.length >= 8 ? "text-green-600" : ""}>
                {password.length >= 8 ? "✓" : "○"} At least 8 characters
              </p>
              <p
                className={
                  /[A-Z]/.test(password) && /[a-z]/.test(password)
                    ? "text-green-600"
                    : ""
                }
              >
                {/[A-Z]/.test(password) && /[a-z]/.test(password) ? "✓" : "○"}{" "}
                Upper & lowercase letters
              </p>
              <p className={/\d/.test(password) ? "text-green-600" : ""}>
                {/\d/.test(password) ? "✓" : "○"} At least one number
              </p>
            </div>
          </div>
        )}

        {/* Confirm Password */}
        <div className="relative">
          <Input
            required
            label="Confirm Password"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Re-enter your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            icon={Lock}
            disabled={loading}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword((prev) => !prev)}
            disabled={loading}
            className="absolute right-3 top-8.5 md:top-9 text-gray-500 hover:text-gray-700 focus:outline-none disabled:opacity-50"
          >
            {showConfirmPassword ? (
              <EyeOff className="size-4 md:size-4.5" />
            ) : (
              <Eye className="size-4 md:size-4.5" />
            )}
          </button>
        </div>

        {/* Match Indicator */}
        {confirmPassword && (
          <div className="text-xs">
            {password === confirmPassword ? (
              <p className="text-green-600">✓ Passwords match</p>
            ) : (
              <p className="text-red-600">○ Passwords do not match</p>
            )}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 md:py-3 bg-[#399aef] text-white text-xs md:text-sm font-medium rounded-lg md:rounded-xl hover:bg-[#3289d6] shadow-lg shadow-blue-100 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
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
          onClick={() => dispatch(goToStep("otp"))}
          disabled={loading}
          className="inline-flex items-center gap-2 text-slate-500 hover:text-[#399aef] text-xs md:text-sm font-bold transition-all group disabled:opacity-50"
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
