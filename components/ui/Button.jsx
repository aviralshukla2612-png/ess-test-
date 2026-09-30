"use client";

import React from "react";

export default function Button({
  children,
  onClick,
  disabled = false,
  variant = "primary", // primary, secondary, metallic, danger, ghost
  size = "md", // sm, md, lg
  className = "",
  type = "button",
  icon: Icon,
  iconRight: IconRight,
  ...props
}) {
  const baseStyles =
    "relative inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 outline-none select-none cursor-pointer disabled:cursor-not-allowed disabled:opacity-40 overflow-hidden";

  const sizeStyles = {
    sm: "text-xs px-4 py-2 gap-1.5",
    md: "text-sm px-6 py-3 gap-2",
    lg: "text-base px-8 py-3.5 gap-2.5"
  };

  const variantStyles = {
    primary:
      "bg-slate-900 hover:bg-black text-white shadow-[0_4px_14px_rgba(15,23,42,0.2)] active:scale-[0.98] border border-slate-800",
    secondary:
      "bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 hover:border-slate-400 active:scale-[0.98] shadow-sm",
    metallic:
      "bg-gradient-to-b from-slate-100 to-slate-200 text-slate-900 border border-slate-300 shadow-sm hover:from-white hover:to-slate-100",
    danger:
      "bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 active:scale-[0.98]",
    ghost:
      "bg-transparent hover:bg-slate-100 text-slate-600 hover:text-slate-900"
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {Icon && <Icon className="w-4 h-4 shrink-0" />}
      <span>{children}</span>
      {IconRight && <IconRight className="w-4 h-4 shrink-0 transition-transform group-hover:translate-x-0.5" />}
    </button>
  );
}
