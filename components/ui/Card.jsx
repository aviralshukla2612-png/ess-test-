"use client";

import React from "react";

export default function Card({
  children,
  className = "",
  glow = false,
  interactive = false,
  onClick,
  ...props
}) {
  return (
    <div
      onClick={onClick}
      className={`
        relative rounded-3xl bg-white
        border border-slate-200/90 shadow-[0_10px_35px_rgba(0,0,0,0.05)]
        transition-all duration-200
        ${glow ? "shadow-[0_0_30px_rgba(15,23,42,0.08)] border-slate-400/50" : ""}
        ${interactive ? "cursor-pointer hover:border-slate-300 hover:shadow-md" : ""}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}
