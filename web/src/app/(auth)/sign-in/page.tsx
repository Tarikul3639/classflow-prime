"use client";

import React, { useState } from "react";
import {
  Lock,
  ArrowRight,
  Loader2,
  GraduationCap,
  Eye,
  EyeOff,
  AlertCircle,
  Mail,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { signInThunk } from "@/redux/slices/auth/thunks/signInThunk";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useRouter } from "next/navigation";
interface SignInPayload {
  email: string;
  password: string;
}

const SignInPage: React.FC = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const isLoading = useAppSelector(
    (state) => state.auth?.requestStatus.signIn?.loading,
  );
  const error = useAppSelector(
    (state) => state.auth?.requestStatus?.signIn?.error || state.auth?.error,
  );

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<SignInPayload>({
    email: "",
    password: "",
  });

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const data = await dispatch(signInThunk(formData)).unwrap();

      console.log("🎯 Sign-in response:", data);

      // Set client-side auth marker cookie for middleware
      document.cookie = "cf_auth=1; path=/; max-age=604800; SameSite=Lax";

      console.log("✅ Auth data stored in localStorage");

      if (data.user) {
        if (data.user.classrooms.length > 0) {
          router.push(`/classroom/${data.user.classrooms[0]}`);
        } else {
          router.push("/classroom");
        }
      }
    } catch (err) {
      console.error("Sign in failed:", err);
    }
  };

  return (
    <div className="bg-[#f8fafc] min-h-screen flex flex-col font-display antialiased">
      <main className="flex-1 flex items-center justify-center p-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-white rounded-2xl shadow-xl shadow-blue-100/50 p-6 sm:p-8 border border-slate-200"
        >
          {/* Header Section */}
          <div className="text-center mb-8">
            <div className="mx-auto mb-5 w-16 h-16 rounded-2xl bg-[#399aef]/10 flex items-center justify-center text-[#399aef]">
              <GraduationCap size={32} />
            </div>
            <h1 className="text-[#0f172a] text-2xl font-extrabold tracking-tight">
              Welcome Back
            </h1>
            <p className="text-[#475569] text-sm font-medium mt-1.5">
              Log in to continue your academic journey.
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
                      : "Authentication failed."}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSignIn} className="space-y-5">
            <div className="space-y-4">
              {/* Email Field */}
              <div className="space-y-1.5">
                <label className="text-[#0f172a] text-xsm font-bold ml-1">
                  Email Address
                </label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 size-4 group-focus-within:text-[#399aef] transition-colors" />
                  <input
                    required
                    type="email"
                    placeholder="name@university.edu"
                    className="w-full h-11 pl-11 pr-4 rounded-lg border border-slate-200 bg-white text-sm text-[#0f172a] font-medium focus:ring-4 focus:ring-[#399aef]/10 focus:border-[#399aef] outline-none transition-all placeholder:text-slate-400 placeholder:font-normal"
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center px-1">
                  <label className="text-[#0f172a] text-xsm font-bold">
                    Password
                  </label>
                  <Link
                    href="/auth/forgot-password"
                    className="text-[#399aef] text-xxsm font-bold hover:underline transition-colors"
                  >
                    Forgot Password?
                  </Link>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 size-4 group-focus-within:text-[#399aef] transition-colors" />
                  <input
                    required
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className="w-full h-11 pl-11 pr-12 rounded-lg border border-slate-200 bg-white text-sm text-[#0f172a] font-medium focus:ring-4 focus:ring-[#399aef]/10 focus:border-[#399aef] outline-none transition-all placeholder:text-slate-400 placeholder:font-normal"
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#399aef] transition-colors"
                  >
                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="group w-full h-11 bg-[#399aef] text-white text-[14px] font-medium rounded-xl hover:bg-[#3289d6] shadow-lg shadow-blue-100/50 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin size-5" />
                  Signing In...
                </>
              ) : (
                <>
                  Sign In{" "}
                  <ArrowRight
                    size={18}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </>
              )}
            </button>
          </form>

          {/* Footer Link */}
          <div className="py-3 pt-8 border-t border-slate-100 text-center">
            <p className="text-[#64748b] text-xs sm:text-xxsm font-medium">
              Don&apos;t have an account?
              <Link
                href="/auth/sign-up"
                className="text-[#399aef] font-bold hover:underline ml-1.5"
              >
                Create Account
              </Link>
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default SignInPage;
