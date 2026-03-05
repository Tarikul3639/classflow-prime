"use client";
import React, { useState } from "react";
import {
  Mail,
  ArrowLeft,
  LockKeyhole,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/Input";
import Link from "next/link";
import { useRouter } from "next/navigation";

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
      router.push("/forgot-password/verify-otp");
    }, 2000);
  };

  return (
    <div className="bg-blue-50 min-h-screen flex flex-col font-display antialiased">
      <main className="flex-1 flex items-center justify-center p-3 md:p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-105 bg-white/70 backdrop-blur-md rounded-2xl shadow-xl shadow-[#399aef]/10 p-8 pb-6 border border-white text-center"
        >
          {/* Icon Decoration */}
          <div className="mx-auto mb-6 w-16 h-16 rounded-full bg-[#399aef]/10 flex items-center justify-center text-[#399aef]">
            <LockKeyhole size={32} />
          </div>

          <div className="mb-6">
            <h1 className="text-slate-900 text-xl md:text-2xl font-bold pb-2">
              Reset Password
            </h1>
            <p className="text-slate-600 text-xs font-medium leading-relaxed">
              Enter your email address below and we&apos;ll send you a link to
              reset your password.
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              setIsSubmitted(true);
            }}
            className="space-y-4 text-left"
          >
            <Input
              required
              label="Email Address"
              type="email"
              placeholder="Enter your email"
              description="We'll send a password reset link to this email."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={Mail}
            />

            <button
              type="submit"
              disabled={isLoading}
              onClick={handleSubmit}
              className="w-full py-3 md:py-3 bg-[#399aef] text-white text-xs md:text-sm font-medium rounded-lg md:rounded-xl hover:bg-[#3289d6] shadow-lg shadow-blue-100 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin size-5" />
                  Sending...
                </>
              ) : (
                <>
                  Send Reset Link{" "}
                  {<ArrowRight className="size-4 md:size-4.5" />}
                </>
              )}
            </button>
          </form>

          <div className="mt-4 pt-2 border-t border-neutral-border">
            <Link
              href="/sign-in"
              className="inline-flex items-center gap-2 text-[#399aef] text-[11px] md:text-xs font-bold hover:underline group"
            >
              <ArrowLeft
                size={16}
                className="group-hover:-translate-x-1 transition-transform"
              />
              Back to Login
            </Link>
          </div>
        </motion.div>
      </main>
      <footer className="py-6 text-center text-[#617789] text-xs">
        © 2026 ClassFlow Academic Tracker. All rights reserved.
      </footer>
    </div>
  );
};

export default ForgotPasswordPage;
