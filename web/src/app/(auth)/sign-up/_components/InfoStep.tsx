"use client";

import { useState, useCallback } from "react";
import { Lock, User, ArrowRight, Loader2, ArrowLeft, RefreshCw } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { signUpThunk } from "@/redux/slices/auth/thunks/signUpThunk";
import ErrorMessage from "./Error";

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
  const { loading: isLoading, error } = useAppSelector(
    (state) => state.auth?.requestStatus?.signUp || {},
  );

  const regenerateAvatar = useCallback(() => {
    const newSeed = Math.random().toString(36).substring(7);
    setAvatarUrl(`https://api.dicebear.com/7.x/avataaars/svg?seed=${newSeed}`);
  }, [setAvatarUrl]);

  const getInitials = (n: string) =>
    n
      ? n.split(" ").map((x) => x[0]).join("").toUpperCase().slice(0, 2)
      : "CF";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // basic validation
    if (!email) return;
    if (password.length < 6) return;

    const result = await dispatch(
      signUpThunk({
        name,
        email,
        password,
        avatarUrl,
      } as any),
    );

    if (signUpThunk.fulfilled.match(result)) {
      // backend signup -> sends verification code
      onNext(); // go to OTP
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <div className="flex flex-col items-center md:mb-2">
        <div className="relative">
          <Avatar className="w-16 md:w-20 h-16 md:h-20 border-4 border-[#399aef]/10 shadow-sm ring-1 ring-blue-200">
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
            Create & Send Code <ArrowRight className="size-4 md:size-4.5" />
          </>
        )}
      </button>

      <div className="mt-4 pt-2 border-t border-slate-100 text-center">
        <button
          type="button"
          onClick={onBack}
          disabled={isLoading}
          className="inline-flex items-center gap-2 text-slate-500 hover:text-[#399aef] text-xs md:text-sm font-bold transition-all group disabled:opacity-50"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Change Email
        </button>
      </div>
    </form>
  );
};