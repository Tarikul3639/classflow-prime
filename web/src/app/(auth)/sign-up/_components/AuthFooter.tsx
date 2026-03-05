"use client";

import React from "react";
import Link from "next/link";

interface AuthFooterProps {
  message: string;
  linkText: string;
  linkHref: string;
}

const AuthFooter: React.FC<AuthFooterProps> = ({
  message,
  linkText,
  linkHref,
}) => {
  return (
    <div className="py-3 pt-6 border-t border-slate-100 text-center">
      <p className="text-[#64748b] text-[12px] md:text-xs font-medium">
        {message}
        <Link
          href={linkHref}
          className="text-[#399aef] font-bold hover:underline ml-1.5"
        >
          {linkText}
        </Link>
      </p>
    </div>
  );
};

export default AuthFooter;