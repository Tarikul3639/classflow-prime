"use client";

import React, { useCallback } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Loader2,
  Lock,
  RefreshCw,
  User,
} from "lucide-react";

import { Input } from "@/components/ui/Input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";

import ErrorMessage from "./Error";

// Thunk + types
import { signupThunk } from "@/redux/slices/auth/thunks/signup.thunk";
import type { ISignUpRequest } from "@/redux/slices/auth/thunks/signup.thunk";

interface InfoStepProps {
  name: string;
  setName: (name: string) => void;

  password: string;
  setPassword: (password: string) => void;

  avatarUrl: string;
  setAvatarUrl: (url: string) => void;

  onNext: () => void;
  onBack: () => void;

  email: string;
}

type SplitNameResult = {
  firstName: string;
  lastName?: string;
};

export const InfoStep: React.FC<InfoStepProps> = ({
  name,
  setName,
  password,
  setPassword,
  avatarUrl,
  setAvatarUrl,
  onNext,
  onBack,
  email,
}) => {
  const dispatch = useAppDispatch();

  // If you use the new authSlice I provided earlier:
  const { loading: isLoading, error } = useAppSelector(
    (state) => state.auth.signup.signup,
  );

  const regenerateAvatar = useCallback(() => {
    const newSeed = Math.random().toString(36).substring(7);
    setAvatarUrl(`https://api.dicebear.com/7.x/avataaars/svg?seed=${newSeed}`);
  }, [setAvatarUrl]);

  const getInitials = (n: string): string => {
    if (!n?.trim()) return "CF";
    return n
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .map((x) => x[0]?.toUpperCase() ?? "")
      .join("")
      .slice(0, 2);
  };

  const splitName = (full: string): SplitNameResult => {
    const parts = full.trim().split(/\s+/).filter(Boolean);
    return {
      firstName: parts[0] ?? "",
      lastName: parts.slice(1).join(" ") || undefined,
    };
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    const { firstName, lastName } = splitName(name);

    const payload: ISignUpRequest = {
      email: email.trim().toLowerCase(),
      password,
      firstName,
      lastName,
      avatarUrl,
    };

    const resultAction = await dispatch(signupThunk(payload));

    if (signupThunk.fulfilled.match(resultAction)) {
      onNext(); // go to OTP
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <div className="flex flex-col items-center md:mb-2">
        <div className="relative">
          <Avatar className="w-16 h-16 md:w-20 md:h-20 border-4 border-[#399aef]/10 shadow-sm ring-1 ring-blue-200">
            <AvatarImage src={avatarUrl} alt="Avatar" />
            <AvatarFallback className="bg-[#399aef] text-white font-bold">
              {getInitials(name)}
            </AvatarFallback>
          </Avatar>

          <button
            type="button"
            onClick={regenerateAvatar}
            className="absolute bottom-0 right-0 p-1.5 bg-white border border-slate-200 rounded-full text-[#399aef] hover:bg-slate-50 shadow-sm transition-all active:scale-90"
            title="Change Avatar"
          >
            <RefreshCw size={14} />
          </button>
        </div>
      </div>

      <div className="mb-4 text-center">
        <h1 className="text-[#0f172a] text-lg md:text-xl font-extrabold tracking-tight">
          Create Account
        </h1>
        <p className="text-slate-700 text-xs md:text-sm font-medium mt-1.5">
          Join ClassFlow to track your progress effortlessly.
        </p>
      </div>

      <ErrorMessage error={error} />

      <Input
        required
        label="Full Name"
        type="text"
        placeholder="Alex Johnson"
        value={name}
        onChange={(e) => setName(e.target.value)}
        icon={User}
        disabled={isLoading}
      />

      <Input
        required
        label="Password"
        type="password"
        placeholder="Min. 6 characters"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        icon={Lock}
        disabled={isLoading}
      />

      <button
        type="submit"
        disabled={isLoading}
        className="w-full mt-5 py-3 bg-[#399aef] text-white text-xs md:text-sm font-medium rounded-lg hover:bg-[#3289d6] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
      >
        {isLoading ? (
          <>
            <Loader2 className="animate-spin size-5" />
            Creating...
          </>
        ) : (
          <>
            Create &amp; Send Code <ArrowRight className="size-4 md:size-4.5" />
          </>
        )}
      </button>

      <div className="mt-4 pt-2 border-t border-slate-100 text-center">
        <button
          type="button"
          onClick={onBack}
          disabled={isLoading}
          className="inline-flex items-center justify-center gap-2 text-slate-500 hover:text-[#399aef] text-xs md:text-sm font-semibold transition-all group disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
        >
          <ArrowLeft
            size={16}
            className="group-hover:-translate-x-0.5 translate-y-0.5 transition-transform"
          />
          Change Email
        </button>
      </div>
    </form>
  );
};
