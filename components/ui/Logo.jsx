"use client";

import React from "react";

export default function Logo({ size = "default", className = "" }) {
  const isLarge = size === "large";
  const isSmall = size === "small";

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      <div className="flex flex-col">
        <span
          className={`font-black uppercase tracking-[0.22em] text-slate-900 leading-none ${
            isLarge ? "text-xl" : isSmall ? "text-xs tracking-[0.18em]" : "text-sm"
          }`}
        >
          EMPEROR
        </span>
        <span
          className={`font-bold uppercase tracking-[0.28em] text-slate-500 leading-tight mt-0.5 ${
            isLarge ? "text-[10px]" : isSmall ? "text-[8px] tracking-[0.2em]" : "text-[9px]"
          }`}
        >
          SMART SOLUTIONS
        </span>
      </div>
    </div>
  );
}
