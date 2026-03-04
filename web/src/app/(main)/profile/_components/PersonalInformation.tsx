"use client";

import React from "react";
import { User, Mail } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";

interface PersonalInformationProps {
  fullName: string;
  email: string;
  bio: string;
  onFullNameChange: (value: string) => void;
  onBioChange: (value: string) => void;
}

export default function PersonalInformation({
  fullName,
  email,
  bio,
  onFullNameChange,
  onBioChange,
}: PersonalInformationProps) {
  return (
    <div className="mt-8 pt-6 border-t border-slate-100">
      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
        Personal Information
      </h3>
      <div className="space-y-4">
        <Input
          icon={User}
          label="Full Name"
          description="This is the name that will be displayed on your profile and to your classmates."
          type="text"
          className="px-3 py-2 text-sm"
          value={fullName}
          onChange={(e) => onFullNameChange(e.target.value)}
        />
        <Input
          icon={Mail}
          label="Email Address"
          description="Your registered email address. Contact support to change it."
          type="email"
          className="px-3 py-2 text-sm"
          value={email}
          disabled
        />
        <Textarea
          label="Bio"
          placeholder="Tell us about yourself..."
          description="Maximum 500 characters"
          value={bio}
          rows={4}
          onChange={(e) => onBioChange(e.target.value)}
        />
      </div>
    </div>
  );
}