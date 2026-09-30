"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import {
  Check,
  ShieldCheck,
  FileCheck2,
  Layers,
  Home,
  User,
  Mail,
  Briefcase,
  Clock,
  Award,
  BarChart3,
  Keyboard,
  Zap,
  Target,
  CheckCircle2
} from "lucide-react";
import Logo from "@/components/ui/Logo";
import Button from "@/components/ui/Button";
import { useAssessment } from "@/context/AssessmentContext";
import { SECTIONS } from "@/data/questions";

export default function CompletedPage() {
  const { resetAssessment, candidateInfo } = useAssessment();
  const [submissionData, setSubmissionData] = useState(null);
  const [submissionId, setSubmissionId] = useState("");

  useEffect(() => {
    // Generate unique corporate submission receipt
    const randomHex = Math.random().toString(36).substring(2, 8).toUpperCase();
    setSubmissionId(`ESS-DEV-${randomHex}-PRO`);

    // Trigger celebratory confetti in sleek chrome and slate colors
    try {
      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.6 },
        colors: ["#0F172A", "#334155", "#64748B", "#CBD5E1", "#10B981"]
      });
    } catch (err) {
      console.log(err);
    }

    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem("emperor_assessment_results");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setSubmissionData(parsed);

          // Ensure it's in localStorage for Admin Panel
          try {
            const allRaw = localStorage.getItem("emperor_all_submissions");
            const allSubmissions = allRaw ? JSON.parse(allRaw) : [];
            const exists = allSubmissions.some((s) => s.id === parsed.id || (s.candidateInfo?.email === parsed.candidateInfo?.email && s.startTime === parsed.startTime));
            if (!exists) {
              allSubmissions.unshift(parsed);
              localStorage.setItem("emperor_all_submissions", JSON.stringify(allSubmissions));
            }
          } catch (e) {}
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, []);

  const candidate = submissionData?.candidateInfo || candidateInfo;
  const score = submissionData?.score ?? 0;
  const totalQuestions = submissionData?.totalQuestions || 15;
  const scorePercentage = submissionData?.scorePercentage ?? ((score / totalQuestions) * 100).toFixed(1);
  const typingResult = submissionData?.typingResult || {
    wpm: 0,
    accuracy: 100,
    correctWords: 0,
    totalWordsTyped: 0,
    grade: "Completed"
  };

  const sectionBreakdown = submissionData?.sectionBreakdown || {
    [SECTIONS.MATHEMATICS]: { correct: 0, total: 5 },
    [SECTIONS.LOGICAL_REASONING]: { correct: 0, total: 5 },
    [SECTIONS.DEVELOPER_TECHNICAL]: { correct: 0, total: 5 }
  };

  const performanceTier = submissionData?.performanceTier || (score >= 12 ? "Platinum Tier / Exceptional" : score >= 9 ? "Advanced / Qualified" : "Proficient");

  return (
    <main className="min-h-screen bg-light-mesh flex items-center justify-center p-4 sm:p-6 lg:p-10 relative">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-4xl rounded-3xl bg-white border border-slate-200/90 shadow-[0_20px_70px_rgba(0,0,0,0.08)] p-6 sm:p-10 text-center overflow-hidden"
      >
        {/* Top subtle sheen */}
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 pointer-events-none" />

        {/* Top Logo */}
        <div className="flex items-center justify-center mb-6">
          <Logo size="default" />
        </div>

        {/* Headings */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
            Assessment & Typing Test Complete
          </h1>
          <p className="text-slate-600 text-xs sm:text-sm mb-6">
            Your overall marks, section performance, and typing metrics have been compiled below.
          </p>
        </motion.div>

        {/* MAIN METRICS SCOREBOARD: 2-COLUMN GRID (MCQ Marks & Typing Speed) */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6"
        >
          {/* Card 1: 15-Question Assessment Marks */}
          <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-[#131B2A] to-black text-white p-6 text-left flex flex-col justify-between shadow-[0_15px_35px_rgba(0,0,0,0.12)]">
            <div>
              <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-slate-300 font-bold mb-2">
                <span>Assessment Questions Score</span>
                <span className="bg-white/10 px-2 py-0.5 rounded text-white">{scorePercentage}%</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl sm:text-5xl font-black font-mono tracking-tight text-white">
                  {score}
                </span>
                <span className="text-xl font-bold text-slate-400 font-mono">
                  / {totalQuestions}
                </span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-300">
              <span>MCQ Evaluation:</span>
              <span className="font-bold text-white flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-amber-400" />
                {performanceTier}
              </span>
            </div>
          </div>

          {/* Card 2: Typing Speed & Accuracy Marks */}
          <div className="rounded-3xl bg-slate-50 border border-slate-200 p-6 text-left flex flex-col justify-between shadow-xs">
            <div>
              <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-slate-600 font-bold mb-2">
                <span className="flex items-center gap-1.5 text-slate-900">
                  <Keyboard className="w-4 h-4" />
                  Word Typing Test Result
                </span>
                <span className="bg-slate-900 text-white px-2 py-0.5 rounded text-[10px] font-mono">{typingResult.grade || "Evaluated"}</span>
              </div>
              
              <div className="flex items-baseline gap-4 mt-1">
                <div>
                  <span className="text-4xl sm:text-5xl font-black font-mono tracking-tight text-slate-900">
                    {typingResult.wpm}
                  </span>
                  <span className="text-xs font-bold text-slate-500 uppercase font-mono ml-1.5">
                    WPM
                  </span>
                </div>

                <div className="h-8 w-[1px] bg-slate-200" />

                <div>
                  <span className="text-4xl sm:text-5xl font-black font-mono tracking-tight text-slate-900">
                    {typingResult.accuracy}%
                  </span>
                  <span className="text-xs font-bold text-slate-500 uppercase font-mono ml-1.5">
                    Accuracy
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
              <span>Words Processed:</span>
              <span className="font-bold text-slate-900">
                {typingResult.correctWords} Correct / {typingResult.totalWordsTyped} Typed
              </span>
            </div>
          </div>
        </motion.div>

        {/* 4 SECTION BREAKDOWN CARDS (Math, Reasoning, Technical, Typing) */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6 text-left"
        >
          {/* Section 1: Mathematics */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
            <div className="text-xs font-bold text-slate-900 mb-1">1. Mathematics</div>
            <div className="text-xl font-bold font-mono text-slate-900 mt-1">
              {sectionBreakdown[SECTIONS.MATHEMATICS]?.correct ?? 0} / 5
            </div>
            <div className="w-full h-1.5 bg-slate-200 rounded-full mt-2.5 overflow-hidden">
              <div
                className="h-full bg-slate-900 rounded-full"
                style={{ width: `${(((sectionBreakdown[SECTIONS.MATHEMATICS]?.correct ?? 0) / 5) * 100)}%` }}
              />
            </div>
          </div>

          {/* Section 2: Reasoning */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
            <div className="text-xs font-bold text-slate-900 mb-1">2. Logical Reasoning</div>
            <div className="text-xl font-bold font-mono text-slate-900 mt-1">
              {sectionBreakdown[SECTIONS.LOGICAL_REASONING]?.correct ?? 0} / 5
            </div>
            <div className="w-full h-1.5 bg-slate-200 rounded-full mt-2.5 overflow-hidden">
              <div
                className="h-full bg-slate-900 rounded-full"
                style={{ width: `${(((sectionBreakdown[SECTIONS.LOGICAL_REASONING]?.correct ?? 0) / 5) * 100)}%` }}
              />
            </div>
          </div>

          {/* Section 3: Technical */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
            <div className="text-xs font-bold text-slate-900 mb-1">3. Developer / Tech</div>
            <div className="text-xl font-bold font-mono text-slate-900 mt-1">
              {sectionBreakdown[SECTIONS.DEVELOPER_TECHNICAL]?.correct ?? 0} / 5
            </div>
            <div className="w-full h-1.5 bg-slate-200 rounded-full mt-2.5 overflow-hidden">
              <div
                className="h-full bg-slate-900 rounded-full"
                style={{ width: `${(((sectionBreakdown[SECTIONS.DEVELOPER_TECHNICAL]?.correct ?? 0) / 5) * 100)}%` }}
              />
            </div>
          </div>

          {/* Section 4: Word Typing */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
            <div className="text-xs font-bold text-slate-900 mb-1">4. Word Typing</div>
            <div className="text-xl font-bold font-mono text-slate-900 mt-1">
              {typingResult.wpm} <span className="text-xs font-normal text-slate-500">WPM</span>
            </div>
            <div className="w-full h-1.5 bg-slate-200 rounded-full mt-2.5 overflow-hidden">
              <div
                className="h-full bg-emerald-600 rounded-full"
                style={{ width: `${Math.min(100, (typingResult.wpm / 60) * 100)}%` }}
              />
            </div>
          </div>
        </motion.div>

        {/* Candidate Profile Details */}
        {candidate?.fullName && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left mb-6 text-xs flex flex-wrap items-center justify-between gap-3 shadow-xs"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-xs">
                <User className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-slate-900 text-sm">{candidate.fullName}</div>
                <div className="text-slate-500 flex items-center gap-2 mt-0.5 flex-wrap">
                  <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5 text-slate-400" />{candidate.email}</span>
                  {candidate.enrollmentNumber && <span className="font-mono font-bold text-slate-800">• Enroll No: {candidate.enrollmentNumber}</span>}
                  {candidate.phone && <span>• {candidate.phone}</span>}
                  {candidate.college && <span>• {candidate.college}</span>}
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="font-mono text-slate-900 text-xs font-bold">
                Enrollment: {candidate.enrollmentNumber || candidate.candidateId || submissionId}
              </div>
              <div className="text-slate-500 text-[11px] flex items-center justify-end gap-1 mt-0.5">
                <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                <span>{candidate.degree ? `${candidate.degree} (${candidate.branch || "CS"})` : candidate.role || "Developer"}</span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Official Receipt Bar */}
        <div className="p-3.5 rounded-2xl bg-slate-100 border border-slate-200 mb-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs font-mono">
          <span className="text-slate-600 font-semibold">Official Receipt ID:</span>
          <span className="text-slate-900 font-bold tracking-wider">{submissionId || "ESS-DEV-8F92D1-PRO"}</span>
        </div>

        {/* Primary CTA */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
        >
          <Button
            variant="primary"
            size="lg"
            onClick={resetAssessment}
            className="w-full sm:w-auto min-w-[220px] bg-slate-900 hover:bg-black text-white"
            icon={Home}
          >
            Back to Home
          </Button>
        </motion.div>
      </motion.div>
    </main>
  );
}
