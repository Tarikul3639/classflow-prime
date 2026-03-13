"use client";

import React from "react";
import { Mail, ArrowRight, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import ErrorMessage from "./Error";
import AuthFooter from "./AuthFooter";
import { sendSignupVerificationThunk } from "@/redux/slices/auth/thunks/sendSignupVerificationThunk";

interface StepEmailInputProps {
  email: string;
  setEmail: (email: string) => void;
  onNext: () => void;
}

export const EmailInputStep: React.FC<StepEmailInputProps> = ({
  email,
  setEmail,
  onNext,
}) => {
  const dispatch = useAppDispatch();
  const { loading: isLoading, error } = useAppSelector(
    (state) => state.auth?.requestStatus?.sendSignupVerification || {},
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await dispatch(sendSignupVerificationThunk({ email }));
    if (sendSignupVerificationThunk.fulfilled.match(result)) {
      onNext();
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="mb-6 text-center">
        <h1 className="text-[#0f172a] text-lg md:text-xl font-extrabold tracking-tight">
          Create Account
        </h1>
        <p className="text-slate-700 text-xs md:text-sm font-medium mt-1.5">
          Join ClassFlow to track your progress effortlessly.
        </p>
      </div>

      <ErrorMessage error={error} />

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          required
          label="Email Address"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          icon={Mail}
          disabled={isLoading}
        />

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 bg-[#399aef] text-white text-xs md:text-sm font-medium rounded-lg hover:bg-[#3289d6] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin size-5" />
              Sending...
            </>
          ) : (
            <>
              Continue <ArrowRight className="size-4 md:size-4.5" />
            </>
          )}
        </button>
      </form>

      <AuthFooter
        message="Already have an account?"
        linkText="Back to Login"
        linkHref="/auth/sign-in"
      />
    </div>
  );
};
