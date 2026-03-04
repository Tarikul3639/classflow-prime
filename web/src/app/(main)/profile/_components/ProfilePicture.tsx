"use client";

import React from "react";
import { Edit, Verified } from "lucide-react";

interface ProfilePictureProps {
  imageUrl: string;
  name: string;
  role: string;
  email: string;
  onEdit: () => void;
}

export default function ProfilePicture({
  imageUrl,
  name,
  role,
  email,
  onEdit,
}: ProfilePictureProps) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="relative group">
        <div
          className="h-28 w-28 rounded-full bg-cover bg-center border-4 border-slate-50 shadow-lg"
          style={{
            backgroundImage: `url('${imageUrl}')`,
          }}
        />
        <button
          onClick={onEdit}
          className="absolute bottom-0 right-0 bg-primary text-white p-1.5 rounded-full shadow-lg border-4 border-white hover:scale-110 transition-transform"
        >
          <Edit size={14} />
        </button>
      </div>
      <h2 className="mt-5 text-xl font-bold text-slate-900">{name}</h2>
      <p className="text-slate-500 font-medium text-sm">{role}</p>
      <div className="mt-3 flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-primary font-medium text-xs">
        <Verified size={14} />
        {email}
      </div>
    </div>
  );
}