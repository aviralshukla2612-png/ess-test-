"use client";

import React from "react";
import { Calculator, Brain, Code2 } from "lucide-react";
import { SECTION_METADATA } from "@/data/questions";

const ICON_MAP = {
  Calculator: Calculator,
  Brain: Brain,
  Code2: Code2
};

export default function AssessmentSidebar({ currentIndex }) {
  return (
    <aside className="w-full lg:w-72 flex flex-col gap-3 select-none">
      <div className="p-4 bg-white rounded-3xl border border-slate-200/90 shadow-[0_10px_35px_rgba(0,0,0,0.04)]">
        <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500 px-2 py-1 mb-2">
          Assessment Sections
        </div>

        <div className="flex flex-col gap-2">
          {SECTION_METADATA.map((sec) => {
            const Icon = ICON_MAP[sec.icon] || Calculator;
            const isCurrent =
              currentIndex >= sec.startIndex && currentIndex <= sec.endIndex;
            const isPassed = currentIndex > sec.endIndex;

            return (
              <div
                key={sec.id}
                className={`
                  relative flex items-center justify-between p-3.5 rounded-2xl transition-all duration-300
                  ${
                    isCurrent
                      ? "bg-slate-900 text-white shadow-md"
                      : isPassed
                      ? "bg-slate-50 border border-slate-200 text-slate-800"
                      : "bg-transparent text-slate-400"
                  }
                `}
              >
                <div className="flex items-center gap-3 pl-1">
                  <div
                    className={`
                      w-8 h-8 rounded-xl flex items-center justify-center
                      ${
                        isCurrent
                          ? "bg-white/15 text-white"
                          : isPassed
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-slate-100 text-slate-400"
                      }
                    `}
                  >
                    <Icon className="w-4 h-4" />
                  </div>

                  <div className="flex flex-col">
                    <span
                      className={`text-xs font-bold tracking-wide ${
                        isCurrent ? "text-white" : isPassed ? "text-slate-900" : "text-slate-400"
                      }`}
                    >
                      {sec.shortName}
                    </span>
                    <span
                      className={`text-[10px] font-mono ${
                        isCurrent ? "text-slate-300" : "text-slate-500"
                      }`}
                    >
                      Questions {sec.range}
                    </span>
                  </div>
                </div>

                {/* Status indicator */}
                <div className="flex items-center gap-1.5 text-[11px] font-mono pr-1">
                  {isCurrent ? (
                    <span className="flex items-center gap-1 text-white font-bold text-[10px]">
                      <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      Active
                    </span>
                  ) : isPassed ? (
                    <span className="text-emerald-600 text-[10px] font-bold">
                      Done
                    </span>
                  ) : (
                    <span className="text-slate-400 text-[10px]">
                      Locked
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Info Notice Card */}
      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 hidden lg:block text-xs text-slate-600 leading-relaxed">
        <div className="flex items-center gap-2 text-slate-900 font-bold mb-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-slate-900" />
          <span>Sequential Flow</span>
        </div>
        <p className="text-[11px] text-slate-500">
          Once an option is selected or the 60s timer expires, your answer is saved and the test moves forward automatically.
        </p>
      </div>
    </aside>
  );
}
