"use client";
import { motion } from "framer-motion";
import { GraduationCap, ArrowLeft, Home } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NotFoundPage() {
  const router = useRouter();

  return (
    <div className="relative min-h-screen bg-[#fcfdfe] flex items-center justify-center px-4">
      {/* Soft background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(57,154,239,0.12),transparent_65%)]" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md text-center"
      >
        {/* Icon */}
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-blue-50/70 backdrop-blur-sm shadow-lg shadow-blue-200 border border-blue-100"
        >
          <GraduationCap className="text-[#399aef]" size={36} />
        </motion.div>

        {/* 404 */}
        <h1 className="text-7xl font-black text-slate-200 leading-none select-none mb-2">
          404
        </h1>

        {/* Title */}
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mb-3">
          Page not found
        </h2>

        {/* Description */}
        <p className="text-sm sm:text-base text-slate-500 leading-relaxed mb-8">
          The page you’re looking for doesn’t exist or you may not have access
          to it. Let’s get you back on track.
        </p>

        {/* Actions */}
        <div className="flex flex-col xs:flex-row gap-3 justify-center">
          <button
            onClick={() => router.back()}
            className="group inline-flex items-center justify-center gap-2 rounded-xl border bg-white px-6 py-3.5 text-xs font-bold uppercase tracking-widest text-slate-600 hover:bg-slate-100 transition border-slate-200 shadow-sm shadow-slate-100"
          >
            <ArrowLeft
              size={16}
              className="group-hover:-translate-x-1 transition-transform duration-300"
            />
            Go back
          </button>

          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#399aef] px-5 py-3 text-xs font-bold uppercase tracking-widest text-white shadow-md shadow-blue-200 hover:bg-[#2d84d1] transition"
          >
            <Home size={14} />
            Dashboard
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
