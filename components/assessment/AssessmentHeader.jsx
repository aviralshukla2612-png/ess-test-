"use client";

import React from "react";
import Logo from "@/components/ui/Logo";

export default function AssessmentHeader({
  currentIndex,
  totalQuestions = 15,
  selectedAnswers = {}
}) {
  const currentNumber = currentIndex + 1;
  const formattedCurrent = String(currentNumber).padStart(2, "0");
  const formattedTotal = String(totalQuestions).padStart(2, "0");

  return (
    <header className="w-full bg-white/95 backdrop-blur-md border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left: Emperor Smart Solutions Logo */}
        <div className="flex items-center justify-between w-full md:w-auto">
          <Logo size="small" />

          {/* Mobile Right: Question Counter */}
          <div className="flex md:hidden items-center gap-2">
            <span className="font-mono text-xs font-semibold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">
              Q {formattedCurrent} / {formattedTotal}
            </span>
          </div>
        </div>

        {/* Center: Linear Question Progress Pills (1 .. 15) */}
        <div className="hidden lg:flex items-center gap-1.5 py-1.5 px-3 bg-slate-100 rounded-full border border-slate-200 shadow-inner">
          {Array.from({ length: totalQuestions }, (_, i) => {
            const qNum = i + 1;
            const isCurrent = i === currentIndex;
            const isCompleted = i < currentIndex;

            return (
              <div
                key={i}
                title={`Question ${qNum}`}
                className={`
                  relative flex items-center justify-center w-7 h-7 rounded-full text-xs font-mono font-bold
                  transition-all duration-300 select-none
                  ${
                    isCurrent
                      ? "bg-slate-900 text-white shadow-md ring-2 ring-slate-400 scale-110 z-10"
                      : isCompleted
                      ? "bg-white text-slate-800 border border-slate-300 shadow-xs"
                      : "bg-transparent text-slate-400"
                  }
                `}
              >
                {qNum}
              </div>
            );
          })}
        </div>

        {/* Right: Question Number & Proctor Badge */}
        <div className="hidden md:flex items-center gap-5">
          <div className="flex items-center gap-2 text-slate-600 text-xs font-medium">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
            </span>
            <span className="hidden xl:inline text-slate-600">Live Proctored</span>
          </div>

          <div className="h-4 w-[1px] bg-slate-200 hidden xl:block" />

          <div className="font-mono text-sm tracking-wider">
            <span className="text-slate-500">Question </span>
            <span className="text-slate-900 font-bold">{formattedCurrent}</span>
            <span className="text-slate-400"> / </span>
            <span className="text-slate-500">{formattedTotal}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
