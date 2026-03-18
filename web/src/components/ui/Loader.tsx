"use client";
import React from "react";
import { motion } from "framer-motion";

export const Loader = () => {
  return (
    <div className="fixed inset-0 z-999 bg-white flex flex-col items-center justify-center">
      {/* Center Logo & Animation Container */}
      <div className="relative flex flex-col items-center">
        {/* Animated Rings */}
        <div className="relative w-18 h-18 flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
            className="absolute inset-0 border-4 border-slate-100 rounded-4xl"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
            className="absolute inset-0 border-t-4 border-[#399aef] rounded-4xl"
          />

          {/* Central Icon / Symbol */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0.5 }}
            animate={{ scale: [0.8, 1.1, 0.8], opacity: 1 }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="bg-[#399aef] w-8 h-8 rounded-xl shadow-lg shadow-blue-200 flex items-center justify-center"
          >
            <div className="w-4 h-4 border border-white rounded-sm rotate-45" />
          </motion.div>
        </div>

        {/* Text Animation */}
        <div className="mt-4 flex flex-col items-center gap-2">
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm font-black tracking-[0.3em] text-[#0f172a] ml-[0.3em]"
          >
            CLASSFLOW
          </motion.h2>

          {/* Progress Bar Style Loader */}
          <div className="w-24 h-0.5 bg-slate-100 rounded-full overflow-hidden mt-0.5">
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{
                repeat: Infinity,
                duration: 1.5,
                ease: "easeInOut",
              }}
              className="w-full h-full bg-linear-to-r from-transparent via-[#399aef] to-transparent"
            />
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-0"
          >
            Syncing Academic Data...
          </motion.p>
        </div>
      </div>

      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-50/50 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-slate-50 rounded-full blur-[120px]" />
      </div>
    </div>
  );
};
