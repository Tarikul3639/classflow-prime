"use client";

import React from "react";
import { User, Lock, Mail, ArrowRight, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/Input";

interface SignUpFormData {
  name: string;
  email: string;
  password: string;
  avatarUrl?: string;
}

interface RegistrationFormProps {
  formData: SignUpFormData;
  setFormData: React.Dispatch<React.SetStateAction<SignUpFormData>>;
  onSubmit: (e: React.FormEvent) => void;
  isLoading?: boolean;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({
  formData,
  setFormData,
  onSubmit,
  isLoading,
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-4">
        <Input
          required
          label="Full Name"
          type="text"
          placeholder="Alex Johnson"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          icon={User}
        />
        <Input
          required
          label="Email Address"
          type="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          icon={Mail}
        />
        <Input
          required
          label="Password"
          type="password"
          placeholder="Min. 6 characters"
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
          <>Create Account {<ArrowRight className="size-4 md:size-4.5" />}</>
        )}
      </button>
    </form>
  );
};

export default RegistrationForm;
