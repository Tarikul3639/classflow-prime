"use client";

import React from "react";
import { Link as LinkIcon } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";

interface GroupLinkInputProps {
  formData: {
    link?: string;
  };
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  selectedPlatform: string;
  onPlatformChange: (platformId: string) => void;
}

export default function GroupLinkInput({
  formData,
  onInputChange,
  selectedPlatform,
  onPlatformChange,
}: GroupLinkInputProps) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-4">
      <h3 className="text-sm font-bold text-slate-900 mb-4">Group Link</h3>

      <Select
        label="Platform"
        description="Choose the platform where this group is hosted"
        value={selectedPlatform}
        onChange={(e) => onPlatformChange(e.target.value)}
        options={[
          { value: "slack", label: "Slack" },
          { value: "discord", label: "Discord" },
          { value: "telegram", label: "Telegram" },
          { value: "whatsapp", label: "WhatsApp" },
          { value: "messenger", label: "Facebook Messenger" },
        ]}
      />

      <Input
        label="Invitation Link"
        name="link"
        type="url"
        value={formData.link}
        onChange={onInputChange}
        placeholder="e.g., https://chat.whatsapp.com/..."
        description="Paste the invite link that students can use to join the group."
        required
        icon={LinkIcon}
      />

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
        <p className="text-xs text-slate-600 leading-relaxed">
          <span className="font-semibold text-amber-900">Privacy Note:</span>{" "}
          Make sure the link you're sharing is a public invite link that doesn't
          expire. Avoid sharing links that contain sensitive information.
        </p>
      </div>
    </div>
  );
}
