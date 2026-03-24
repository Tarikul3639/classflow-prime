"use client";

import { Mail, ArrowRight, Loader2, ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/Input";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { requestPasswordResetThunk } from "@/store/features/auth/thunks/password-reset.thunk";
import { setResetEmail } from "@/store/features/auth/slices/password-reset.slice";
import ErrorMessage from "./Error";

const StepEmailInput = () => {
  const dispatch = useAppDispatch();
  const email = useAppSelector((state) => state.auth.passwordReset.email);
  const { loading: isLoading, error } = useAppSelector(
    (state) => state.auth.passwordReset.requestStatus,
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(requestPasswordResetThunk({ email }));
    // .then() বা .unwrap() করার দরকার নেই, স্লাইস নিজেই fulfilled হলে ধাপ পরিবর্তন করবে
  };

  return (
    <div>
      <div className="text-center mb-6">
        <h2 className="text-[#0f172a] text-lg md:text-xl font-extrabold tracking-tight">
          Reset Password
        </h2>
        <p className="text-slate-700 text-xs md:text-sm font-medium mt-2 leading-relaxed">
          Enter your email address and we'll send you a verification code
        </p>
      </div>

      <ErrorMessage error={error} />

      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          required
          label="Email Address"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => dispatch(setResetEmail(e.target.value))}
          icon={Mail}
        />

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 md:py-3 bg-[#399aef] text-white text-xs md:text-sm font-medium rounded-lg md:rounded-xl hover:bg-[#3289d6] shadow-lg shadow-blue-100 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin size-5" />
              Sending...
            </>
          ) : (
            <>
              Send Verification Code{" "}
              <ArrowRight className="size-4 md:size-4.5" />
            </>
          )}
        </button>
      </form>

      <div className="mt-6 pt-4 border-t border-slate-100 text-center">
        <Link
          href="/sign-in"
          className="inline-flex items-center gap-2 text-[#399aef] text-xs md:text-sm font-bold hover:underline transition-all group"
        >
          <ArrowLeft
            size={16}
            className="group-hover:-translate-x-1 transition-transform"
          />
          Back to Login
        </Link>
      </div>
    </div>
  );
};

export default StepEmailInput;
