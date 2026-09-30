"use client";

import React from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

export default function AnswerOption({
  option,
  isSelected,
  isDisabled,
  onSelect
}) {
  const handleKeyDown = (e) => {
    if ((e.key === "Enter" || e.key === " ") && !isDisabled) {
      e.preventDefault();
      onSelect(option.id);
    }
  };

  return (
    <motion.div
      whileHover={!isDisabled ? { scale: 1.006, x: 2 } : {}}
      whileTap={!isDisabled ? { scale: 0.99 } : {}}
      onClick={() => {
        if (!isDisabled) {
          onSelect(option.id);
        }
      }}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={isDisabled ? -1 : 0}
      aria-pressed={isSelected}
      aria-label={`Option ${option.id}: ${option.text}`}
      className={`
        group relative flex items-center justify-between w-full p-4 md:p-5 rounded-2xl text-left
        transition-all duration-200 select-none outline-none border
        ${
          isSelected
            ? "bg-slate-900 text-white border-slate-900 shadow-lg ring-2 ring-slate-900"
            : "bg-white hover:bg-slate-50 border-slate-200 hover:border-slate-400 text-slate-800 shadow-xs"
        }
        ${isDisabled ? "cursor-default opacity-90" : "cursor-pointer"}
      `}
    >
      <div className="flex items-center gap-4 w-full pr-4">
        {/* Letter Badge (A, B, C, D) */}
        <div
          className={`
            w-9 h-9 rounded-xl flex items-center justify-center font-mono font-bold text-sm shrink-0
            transition-all duration-200 border
            ${
              isSelected
                ? "bg-white text-slate-900 border-white shadow-xs"
                : "bg-slate-100 text-slate-800 border-slate-200 group-hover:border-slate-300 group-hover:bg-slate-200"
            }
          `}
        >
          {isSelected ? <Check className="w-4 h-4 stroke-[3]" /> : option.id}
        </div>

        {/* Option Text */}
        <span
          className={`
            text-sm md:text-base font-normal tracking-wide leading-relaxed
            ${isSelected ? "text-white font-medium" : "text-slate-800 group-hover:text-slate-900"}
          `}
        >
          {option.text}
        </span>
      </div>

      {/* Selected Indicator dot / icon */}
      <div className="shrink-0 flex items-center justify-center">
        <div
          className={`
            w-5 h-5 rounded-full border transition-all duration-200 flex items-center justify-center
            ${
              isSelected
                ? "border-white bg-white shadow-xs"
                : "border-slate-300 bg-white group-hover:border-slate-400"
            }
          `}
        >
          {isSelected && <div className="w-2 h-2 rounded-full bg-slate-900" />}
        </div>
      </div>
    </motion.div>
  );
}
