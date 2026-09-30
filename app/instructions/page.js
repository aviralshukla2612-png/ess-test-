"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  FileText,
  Clock,
  Lock,
  Layers,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  User,
  ChevronLeft
} from "lucide-react";
import Logo from "@/components/ui/Logo";
import Button from "@/components/ui/Button";
import { useAssessment } from "@/context/AssessmentContext";
import Link from "next/link";

export default function InstructionsPage() {
  const [agreed, setAgreed] = useState(false);
  const { startAssessment, candidateInfo } = useAssessment();

  const handleStart = () => {
    if (agreed) {
      startAssessment();
    }
  };

  const instructionCards = [
    {
      icon: FileText,
      title: "Total Questions",
      description: "There are 15 questions in total.",
      badge: "15 Questions"
    },
    {
      icon: Clock,
      title: "Time per Question",
      description: "You will get 1 minute (60 seconds) for each question.",
      badge: "1 Minute / Q"
    },
    {
      icon: Lock,
      title: "No Skipping & No Back",
      description: "You must answer each question. You cannot skip or return to previous questions.",
      badge: "Strict Order"
    },
    {
      icon: Layers,
      title: "Assessment + Typing Test",
      description: "15 MCQs (Math, Reasoning, Tech) followed by a 60s Word Typing Test.",
      badge: "4 Evaluation Sections"
    }
  ];

  const rules = [
    "Each question is timed individually at exactly 60 seconds.",
    "Selecting an answer automatically locks your choice and moves to the next question.",
    "If the timer reaches 00:00, your response is automatically submitted.",
    "After Question 15, you will proceed to the 60-Second Word Typing Speed Test.",
    "Do not switch tabs, minimize the window, or refresh the browser during the test.",
    "Both MCQ marks and Typing Speed (WPM & Accuracy) contribute to the final score."
  ];

  return (
    <main className="min-h-screen bg-light-mesh flex items-center justify-center p-4 sm:p-6 lg:p-10 relative">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-4xl rounded-3xl bg-white border border-slate-200/90 shadow-[0_20px_70px_rgba(0,0,0,0.07)] p-6 sm:p-10 lg:p-12 overflow-hidden"
      >
        {/* Top subtle sheen */}
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 pointer-events-none" />

        {/* Top Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <Logo size="default" />
          <Link
            href="/register"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Edit Candidate Details</span>
          </Link>
        </div>

        {/* Candidate Badge if registered */}
        {candidateInfo?.fullName && (
          <div className="mt-6 p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-xs">
                <User className="w-4 h-4" />
              </div>
              <div>
                <span className="text-slate-500">Candidate: </span>
                <span className="font-bold text-slate-900">{candidateInfo.fullName}</span>
                {candidateInfo.enrollmentNumber && (
                  <>
                    <span className="text-slate-300 mx-2">|</span>
                    <span className="text-slate-500">Enroll No: </span>
                    <span className="font-mono font-bold text-slate-900">{candidateInfo.enrollmentNumber}</span>
                  </>
                )}
                {candidateInfo.degree && (
                  <>
                    <span className="text-slate-300 mx-2">|</span>
                    <span className="text-slate-500">Program: </span>
                    <span className="text-slate-800 font-semibold">{candidateInfo.degree} ({candidateInfo.branch || "Engineering"})</span>
                  </>
                )}
              </div>
            </div>
            <div className="font-mono text-[11px] text-slate-900 font-bold bg-white px-3 py-1 rounded-lg border border-slate-200 shadow-xs">
              ID: {candidateInfo.enrollmentNumber || candidateInfo.candidateId || "ESS-000101"}
            </div>
          </div>
        )}

        {/* Main Title */}
        <div className="mt-6 mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
            Assessment Instructions
          </h1>
          <p className="text-slate-600 text-sm sm:text-base mt-2">
            Please read the assessment instructions carefully before beginning the evaluation.
          </p>
        </div>

        {/* 4 Instruction Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {instructionCards.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-slate-300 hover:bg-white hover:shadow-sm transition-all duration-200 flex flex-col justify-between"
              >
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-xs">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[11px] font-bold font-mono px-2.5 py-1 rounded-full bg-white text-slate-800 border border-slate-200 shadow-xs">
                    {item.badge}
                  </span>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 mb-1">{item.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{item.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Essential Assessment Rules Checklist */}
        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 mb-8">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-800 mb-3.5">
            <AlertCircle className="w-4 h-4 text-slate-900" />
            <span>Assessment Integrity & Rules</span>
          </div>

          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2.5 text-xs text-slate-600">
            {rules.map((rule, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-900 mt-1.5 shrink-0" />
                <span className="leading-normal">{rule}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Mandatory Agreement Checkbox & CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-6 border-t border-slate-200">
          <label className="flex items-center gap-3 cursor-pointer select-none group">
            <input
              type="checkbox"
              id="instruction-agreement"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="sr-only"
            />
            <div
              className={`
                w-5 h-5 rounded-md border flex items-center justify-center transition-all duration-200
                ${
                  agreed
                    ? "bg-slate-900 border-slate-900 text-white shadow-xs"
                    : "border-slate-300 bg-white group-hover:border-slate-400"
                }
              `}
            >
              {agreed && <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />}
            </div>
            <span className="text-xs sm:text-sm font-semibold text-slate-700 group-hover:text-slate-900 transition-colors">
              I have read and understood the instructions.
            </span>
          </label>

          <Button
            variant="primary"
            size="lg"
            disabled={!agreed}
            onClick={handleStart}
            className="w-full sm:w-auto min-w-[240px] group bg-slate-900 hover:bg-black text-white"
            iconRight={ArrowRight}
          >
            I Understand, Start Test
          </Button>
        </div>
      </motion.div>
    </main>
  );
}
