"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAssessment } from "@/context/AssessmentContext";
import AssessmentHeader from "@/components/assessment/AssessmentHeader";
import AssessmentSidebar from "@/components/assessment/AssessmentSidebar";
import QuestionCard from "@/components/assessment/QuestionCard";
import QuestionTimer from "@/components/assessment/QuestionTimer";
import SecurityAlertModal from "@/components/assessment/SecurityAlertModal";
import Card from "@/components/ui/Card";

export default function AssessmentPage() {
  const router = useRouter();
  const {
    questions,
    totalQuestions,
    currentIndex,
    currentQuestion,
    selectedAnswers,
    currentSelectedOption,
    timeRemaining,
    timerState,
    isTransitioning,
    isStarted,
    isCompleted,
    tabSwitchCount,
    securityAlert,
    dismissSecurityAlert,
    selectAnswer,
    startAssessment
  } = useAssessment();

  // If user lands directly on /assessment without starting, auto-start or redirect
  useEffect(() => {
    if (!isStarted && !isCompleted) {
      startAssessment();
    }
  }, [isStarted, isCompleted, startAssessment]);

  // Prevent right clicks during assessment
  const handleContextMenu = (e) => {
    e.preventDefault();
  };

  return (
    <div
      onContextMenu={handleContextMenu}
      className="min-h-screen bg-light-mesh text-slate-900 flex flex-col select-none overflow-x-hidden"
    >
      {/* Top Fixed Header */}
      <AssessmentHeader
        currentIndex={currentIndex}
        totalQuestions={totalQuestions}
        selectedAnswers={selectedAnswers}
      />

      {/* Main Assessment Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT COLUMN: Section Indicator Sidebar (Non-clickable) */}
          <div className="lg:col-span-3">
            <AssessmentSidebar currentIndex={currentIndex} />
          </div>

          {/* CENTER COLUMN: Main Question Area */}
          <div className="lg:col-span-6">
            <Card className="p-6 sm:p-8 md:p-10 min-h-[540px] flex flex-col justify-between border-slate-200/90 bg-white shadow-[0_15px_40px_rgba(0,0,0,0.06)]">
              <QuestionCard
                question={currentQuestion}
                currentIndex={currentIndex}
                totalQuestions={totalQuestions}
                selectedOption={currentSelectedOption}
                isTransitioning={isTransitioning}
                onSelectOption={selectAnswer}
              />
            </Card>
          </div>

          {/* RIGHT COLUMN: Circular Timer & Assessment Status */}
          <div className="lg:col-span-3 flex flex-col gap-4">
            <Card className="p-6 flex flex-col items-center justify-center border-slate-200/90 bg-white min-h-[260px] shadow-[0_10px_30px_rgba(0,0,0,0.05)]">
              <QuestionTimer
                timeRemaining={timeRemaining}
                timerState={timerState}
              />
            </Card>

            {/* Quick Status / Anti-Cheat Status Card */}
            <div className="p-4 rounded-3xl bg-white border border-slate-200 text-xs text-slate-600 flex flex-col gap-2 shadow-[0_4px_15px_rgba(0,0,0,0.03)]">
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="text-slate-500 uppercase tracking-wider font-bold">Assessment Status</span>
                <span className="text-slate-900 font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Live Session
                </span>
              </div>
              <div className="h-[1px] bg-slate-100 my-1" />
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-500 font-medium">Questions Answered:</span>
                <span className="font-mono text-slate-900 font-bold">
                  {Object.keys(selectedAnswers).length} / {totalQuestions}
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-500 font-medium">Security / Proctor:</span>
                <span className="font-mono text-slate-900 font-semibold">
                  {tabSwitchCount === 0 ? "100% Focused" : `${tabSwitchCount} Departures`}
                </span>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* Proctoring Security Alert Modal */}
      <SecurityAlertModal
        isOpen={securityAlert}
        onDismiss={dismissSecurityAlert}
        tabSwitchCount={tabSwitchCount}
      />
    </div>
  );
}
