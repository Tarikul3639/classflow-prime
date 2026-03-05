"use client";
import React, { useState } from "react";
import { Mail, ArrowLeft, LockKeyhole, RefreshCcw } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (isSubmitted) return <ForgotPasswordSuccess email={email} />;

  return (
    <div className="bg-blue-50 min-h-screen flex flex-col font-display antialiased">
      <main className="flex-1 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-105 bg-white/70 backdrop-blur-md rounded-2xl shadow-xl shadow-[#399aef]/10 p-8 border border-white text-center"
        >
          {/* Icon Decoration */}
          <div className="mx-auto mb-6 w-16 h-16 rounded-full bg-[#399aef]/10 flex items-center justify-center text-[#399aef]">
            <LockKeyhole size={32} />
          </div>

          <div className="mb-8">
            <h1 className="text-[#111518] text-2xl font-bold pb-2">
              Reset Password
            </h1>
            <p className="text-[#617789] text-xsm font-medium leading-relaxed">
              Enter your email address below and we&apos;ll send you a link to reset
              your password.
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              setIsSubmitted(true);
            }}
            className="space-y-6 text-left"
          >
            <div className="space-y-2">
              <label className="text-[#111518] text-xsm font-bold ml-1">
                Email Address
              </label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#617789] size-5 group-focus-within:text-[#399aef] transition-colors" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  className="w-full h-12 pl-11 pr-4 rounded-xl border border-[#dbe1e6] bg-white text-[14px] text-black focus:ring-4 focus:ring-[#399aef]/10 focus:border-[#399aef] outline-none transition-all"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full h-12 bg-[#399aef] text-white text-sm font-bold rounded-xl hover:bg-[#3289d6] shadow-lg shadow-[#399aef]/20 active:scale-[0.98] transition-all"
            >
              Send Reset Link
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-neutral-border">
            <Link
              href="/auth/sign-in"
              className="inline-flex items-center gap-2 text-[#399aef] text-sm font-bold hover:underline group"
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

const ForgotPasswordSuccess: React.FC<{ email: string }> = ({ email }) => {
  return (
    <div className="bg-blue-50 min-h-screen flex flex-col font-display antialiased">
      <main className="flex-1 flex items-center justify-center p-6">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-full max-w-105 bg-white/70 backdrop-blur-md rounded-2xl shadow-xl shadow-[#399aef]/10 p-8 border border-white text-center"
        >
          {/* Success Icon */}
          <div className="mx-auto mb-6 w-16 h-16 rounded-full bg-green-100 flex items-center justify-center text-green-600">
            <Mail size={32} />
          </div>

          <div className="mb-8">
            <h1 className="text-[#111518] text-2xl font-bold pb-2">
              Check your Email
            </h1>
            <p className="text-[#617789] text-xsm font-medium leading-relaxed">
              We have sent a password recovery link to <br />
              <span className="text-[#111518] font-bold">
                {email || "your email"}
              </span>
              .
            </p>
          </div>

          <div className="space-y-3">
            <Link href="/auth/sign-in" className="block w-full">
              <button className="w-full h-12 bg-[#399aef] text-white text-sm font-bold rounded-xl hover:bg-[#3289d6] transition-all active:scale-[0.98]">
                Back to Login
              </button>
            </Link>

            <div className="mt-4 flex flex-col items-center gap-2">
              <p className="text-[#617789] text-xxsm font-medium">
                Didn&apos;t receive the email?
              </p>
              <button
                type="button"
                className="flex items-center gap-1.5 text-[#399aef] text-xxsm font-bold hover:text-[#3289d6] transition-colors group cursor-pointer"
              >
                <RefreshCcw
                  size={14}
                  className="group-active:rotate-180 transition-transform duration-500"
                />
                <span className="underline underline-offset-4">
                  Resend reset link
                </span>
              </button>
            </div>
          </div>

          <p className="mt-8 text-[11px] text-[#617789] leading-tight">
            Check your spam folder or contact support if the problem persists.
          </p>
        </motion.div>
      </main>
      <footer className="py-6 text-center text-[#617789] text-xs">
        © 2026 ClassFlow Academic Tracker. All rights reserved.
      </footer>
    </div>
  );
};

export default ForgotPasswordPage;
