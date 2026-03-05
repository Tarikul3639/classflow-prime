"use client";

import React, { useState, useCallback } from "react";
import {
  User,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { signUpThunk } from "@/redux/slices/auth/thunks/signUpThunk";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/Input";

interface SignUpFormData {
  name: string;
  email: string;
  password: string;
  avatarUrl?: string;
}

const RegisterPage: React.FC = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { loading: isLoading, error } = useAppSelector(
    (state) => state.auth?.requestStatus?.signUp || {},
  );

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<SignUpFormData>(() => ({
    name: "",
    email: "",
    password: "",
    avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${Math.random()
      .toString(36)
      .substring(7)}`,
  }));

  const regenerateAvatar = useCallback(() => {
    const newSeed = Math.random().toString(36).substring(7);
    setFormData((prev) => ({
      ...prev,
      avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${newSeed}`,
    }));
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(signUpThunk(formData))
      .unwrap()
      .then(() => {
        // Set client-side auth marker cookie for middleware
        document.cookie = "cf_auth=1; path=/; max-age=604800; SameSite=Lax";
        console.log("✅ Auth data stored in localStorage");
        router.push("/classroom");
      })
      .catch(() => {});
  };

  const getInitials = (name: string) => {
    return name
      ? name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
          .slice(0, 2)
      : "CF";
  };

  return (
    <div className="bg-[#f8fafc] min-h-screen flex flex-col font-display antialiased">
      <main className="flex-1 flex items-center justify-center p-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-white rounded-2xl shadow-xl shadow-blue-100/50 p-6 sm:p-8 border border-slate-200"
        >
          {/* Header */}
          <div className="text-center mb-4">
            {/* Compact Avatar Section */}
            <div className="flex flex-col items-center md:mb-2">
              <div className="relative">
                <Avatar className="w-16 md:w-20 h-16 md:h-20 border-4 border-[#399aef]/10 shadow-sm ring-1 ring-blue-200">
                  <AvatarImage src={formData.avatarUrl} alt="Avatar" />
                  <AvatarFallback className="bg-[#399aef] text-white font-bold">
                    {getInitials(formData.name)}
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
              <span className="text-[10px] md:text-xs text-slate-400 mt-2 font-medium uppercase tracking-wider">
                Profile Avatar
              </span>
            </div>
            <h1 className="text-[#0f172a] text-lg md:text-xl font-extrabold tracking-tight">
              Create Account
            </h1>
            <p className="text-slate-700 text-xs md:text-sm font-medium mt-1.5">
              Join ClassFlow to track your progress effortlessly.
            </p>
          </div>

          {/* Error Message */}
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

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Input Groups */}
            <div className="space-y-4">
              <Input
                required
                label="Full Name"
                type="text"
                placeholder="Alex Johnson"
                description="Enter your primary email"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                icon={User}
              />
              <Input
                required
                label="Email Address"
                type="email"
                placeholder="Enter your email"
                description="We'll never share your email with anyone else."
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                icon={Mail}
              />
              <Input
                required
                label="Password"
                type="password"
                placeholder="Min. 6 characters"
                description="Choose a strong password."
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                icon={Lock}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 md:py-3 bg-[#399aef] text-white text-xs md:text-sm font-medium rounded-lg md:rounded-xl hover:bg-[#3289d6] shadow-lg shadow-blue-100 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-7 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin size-5" />
                  Creating...
                </>
              ) : (
                <>
                  Create Account <ArrowRight className="size-4 md:size-4.5" />
                </>
              )}
            </button>
          </form>

          <div className="py-3 pt-6 border-t border-slate-100 text-center">
            <p className="text-[#64748b] text-[12px] md:text-xs font-medium">
              Already have an account?
              <Link
                href="/auth/sign-in"
                className="text-[#399aef] font-bold hover:underline ml-1.5"
              >
                Back to Login
              </Link>
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default RegisterPage;
