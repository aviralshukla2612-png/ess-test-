"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import AnswerOption from "./AnswerOption";

export default function QuestionCard({
  question,
  currentIndex,
  totalQuestions,
  selectedOption,
  isTransitioning,
  onSelectOption
}) {
  if (!question) return null;

  return (
    <div className="flex-1 w-full flex flex-col justify-between">
      <AnimatePresence mode="wait">
        <motion.div
          key={question.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="flex flex-col gap-6"
        >
          {/* Section & Topic Meta Header */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-slate-100 text-slate-800 border border-slate-200 shadow-xs">
                {question.section}
              </span>
              {question.topic && (
                <span className="hidden sm:inline-block px-2.5 py-1 rounded-lg text-[11px] font-semibold text-slate-600 bg-slate-50 border border-slate-200">
                  {question.topic}
                </span>
              )}
            </div>

            <div className="text-xs font-mono font-semibold text-slate-500">
              Question {currentIndex + 1} of {totalQuestions}
            </div>
          </div>

          {/* Question Prompt Title */}
          <div className="min-h-[70px] flex items-center">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900 leading-relaxed tracking-tight whitespace-pre-line">
              {question.question}
            </h2>
          </div>

          {/* 4 Large Selectable Answer Option Cards */}
          <div className="grid grid-cols-1 gap-3.5 pt-2">
            {question.options.map((opt) => (
              <AnswerOption
                key={opt.id}
                option={opt}
                isSelected={selectedOption === opt.id}
                isDisabled={isTransitioning}
                onSelect={onSelectOption}
              />
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Helper footer */}
      <div className="mt-8 pt-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-slate-800" />
          <span>Click any card to lock your response and automatically advance.</span>
        </div>
        <div className="hidden sm:block font-mono text-[11px] text-slate-500 font-semibold">
          Auto-advance active
        </div>
      </div>
    </div>
  );
}
