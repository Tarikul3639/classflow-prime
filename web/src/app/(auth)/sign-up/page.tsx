"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useRouter } from "next/navigation";
import { signUpThunk } from "@/redux/slices/auth/thunks/signUpThunk";
import RegistrationHeader from "./_components/Header";
import ErrorMessage from "./_components/Error";
import RegistrationForm from "./_components/Form";
import AuthFooter from "./_components/AuthFooter";

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

  const [formData, setFormData] = useState<SignUpFormData>(() => ({
    name: "",
    email: "",
    password: "",
    avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${Math.random()
      .toString(36)
      .substring(7)}`,
  }));

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

  return (
    <div className="bg-[#f8fafc] min-h-screen flex flex-col font-display antialiased">
      <main className="flex-1 flex items-center justify-center p-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-white rounded-2xl shadow-xl shadow-blue-100/50 p-6 sm:p-8 border border-slate-200"
        >
          <RegistrationHeader formData={formData} setFormData={setFormData} />

          <ErrorMessage error={error} />

          <RegistrationForm
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleSubmit}
            isLoading={isLoading}
          />

          <AuthFooter
            message="Already have an account?"
            linkText="Back to Login"
            linkHref="/auth/sign-in"
          />
        </motion.div>
      </main>
    </div>
  );
};

export default RegisterPage;
