"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ChevronLeft,
  Award,
  CheckCircle2,
  XCircle,
  Clock,
  Keyboard,
  User,
  Mail,
  ShieldCheck,
  FileCheck2,
  Layers
} from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import Button from "@/components/ui/Button";
import { resultService } from "@/services/resultService";

export default function ResultBreakdownPage() {
  const params = useParams();
  const id = params?.id;

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!id) return;
      try {
        const res = await resultService.getResultByAttemptId(id);
        if (res.success) setResult(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  if (loading) {
    return (
      <AdminLayout title="Evaluation Breakdown">
        <div className="py-20 text-center text-slate-400 text-xs flex items-center justify-center gap-2">
          <div className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
          <span>Loading Candidate Scorecard...</span>
        </div>
      </AdminLayout>
    );
  }

  if (!result) {
    return (
      <AdminLayout title="Evaluation Breakdown">
        <div className="py-20 text-center text-slate-500 text-sm">
          Assessment record not found.
        </div>
      </AdminLayout>
    );
  }

  const candidate = result.candidate || {};
  const sectionBreakdown = result.sectionBreakdown || {};
  const questionResults = result.questionResults || [];
  const typingResult = result.typingResult || {};

  return (
    <AdminLayout
      title={`Candidate Scorecard: ${candidate.fullName}`}
      subtitle={`ESS Enrollment No: ${candidate.enrollmentNumber || "000101"}`}
    >
      <div className="mb-6">
        <Link
          href="/admin/results"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span>Back to All Results</span>
        </Link>
      </div>

      {/* TOP COMPOSITE METRICS (MCQ & Typing) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {/* Card 1: 15-Question Assessment Score */}
        <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-[#111827] to-black text-white shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-mono uppercase tracking-wider text-slate-300 font-bold mb-2">
              <span>MCQ Assessment Score</span>
              <span className="bg-white/10 px-2.5 py-0.5 rounded text-white">{result.percentage}%</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl sm:text-5xl font-black font-mono tracking-tight text-white">
                {result.score}
              </span>
              <span className="text-xl font-bold text-slate-400 font-mono">
                / {result.totalQuestions || 15}
              </span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-300">
            <span>Assessment Status:</span>
            <span className="font-bold text-emerald-400 uppercase tracking-wider">{result.status}</span>
          </div>
        </div>

        {/* Card 2: 1-Minute Word Typing Result */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-mono uppercase tracking-wider text-slate-500 font-bold mb-2">
              <span className="flex items-center gap-1.5 text-slate-900">
                <Keyboard className="w-4 h-4" />
                1-Min Word Typing Test
              </span>
              <span className="bg-slate-900 text-white px-2 py-0.5 rounded text-[10px]">{typingResult.grade || "Evaluated"}</span>
            </div>

            <div className="flex items-baseline gap-4 mt-2">
              <div>
                <span className="text-4xl font-black font-mono text-slate-900">
                  {typingResult.wpm || 0}
                </span>
                <span className="text-xs font-bold text-slate-500 font-mono ml-1.5 uppercase">WPM</span>
              </div>
              <div className="h-8 w-[1px] bg-slate-200" />
              <div>
                <span className="text-4xl font-black font-mono text-slate-900">
                  {typingResult.accuracy || 100}%
                </span>
                <span className="text-xs font-bold text-slate-500 font-mono ml-1.5 uppercase">Accuracy</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
            <span>Words Typed:</span>
            <span className="font-bold text-slate-900">{typingResult.correctWords || 0} Correct / {typingResult.totalWordsTyped || 0} Total</span>
          </div>
        </div>
      </div>

      {/* 3 SECTION SCORE BREAKDOWN BARS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="text-xs font-bold text-slate-900 mb-1">1. Mathematics</div>
          <div className="text-xl font-bold font-mono text-slate-900">
            {sectionBreakdown.MATHEMATICS?.correct || 0} / 5
          </div>
          <div className="w-full h-1.5 bg-slate-100 rounded-full mt-2.5 overflow-hidden">
            <div
              className="h-full bg-slate-900 rounded-full"
              style={{ width: `${((sectionBreakdown.MATHEMATICS?.correct || 0) / 5) * 100}%` }}
            />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="text-xs font-bold text-slate-900 mb-1">2. Logical Reasoning</div>
          <div className="text-xl font-bold font-mono text-slate-900">
            {sectionBreakdown.LOGICAL_REASONING?.correct || 0} / 5
          </div>
          <div className="w-full h-1.5 bg-slate-100 rounded-full mt-2.5 overflow-hidden">
            <div
              className="h-full bg-slate-900 rounded-full"
              style={{ width: `${((sectionBreakdown.LOGICAL_REASONING?.correct || 0) / 5) * 100}%` }}
            />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="text-xs font-bold text-slate-900 mb-1">3. Developer / Technical</div>
          <div className="text-xl font-bold font-mono text-slate-900">
            {sectionBreakdown.DEVELOPER_TECHNICAL?.correct || 0} / 5
          </div>
          <div className="w-full h-1.5 bg-slate-100 rounded-full mt-2.5 overflow-hidden">
            <div
              className="h-full bg-slate-900 rounded-full"
              style={{ width: `${((sectionBreakdown.DEVELOPER_TECHNICAL?.correct || 0) / 5) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* QUESTION-BY-QUESTION EVALUATION TABLE */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
          <FileCheck2 className="w-4 h-4 text-slate-700" />
          Question-by-Question Response Audit
        </h3>

        <div className="space-y-4">
          {questionResults.map((q, idx) => {
            return (
              <div
                key={idx}
                className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                  q.isCorrect
                    ? "bg-emerald-50/30 border-emerald-200"
                    : q.isTimeout
                    ? "bg-amber-50/30 border-amber-200"
                    : "bg-red-50/30 border-red-200"
                }`}
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-200/60">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs bg-slate-900 text-white px-2 py-0.5 rounded">
                      Q{q.questionIndex}
                    </span>
                    <span className="text-xs font-mono font-bold uppercase text-slate-600">
                      {q.section?.replace("_", " ")}
                    </span>
                    {q.topic && <span className="text-xs text-slate-400 font-medium">• {q.topic}</span>}
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-slate-500">
                      <Clock className="w-3.5 h-3.5 inline mr-1" />
                      {q.timeSpent}s
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        q.isCorrect
                          ? "bg-emerald-100 text-emerald-800"
                          : q.isTimeout
                          ? "bg-amber-100 text-amber-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {q.isCorrect ? "Correct (+1)" : q.isTimeout ? "Timed Out (0)" : "Incorrect (0)"}
                    </span>
                  </div>
                </div>

                <div className="text-xs font-bold text-slate-900 mb-3 leading-relaxed">
                  {q.question}
                </div>

                {/* Candidate Answer vs Correct Answer Comparison */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                    <span className="text-[10px] font-mono font-bold text-slate-400 block uppercase">
                      Candidate Selected:
                    </span>
                    <span className={`font-mono font-bold text-sm ${q.isCorrect ? "text-emerald-700" : "text-red-600"}`}>
                      {q.candidateAnswer || (q.isTimeout ? "No answer (Timeout)" : "Unanswered")}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                    <span className="text-[10px] font-mono font-bold text-slate-400 block uppercase">
                      Official Correct Answer:
                    </span>
                    <span className="font-mono font-bold text-sm text-emerald-700">
                      {q.correctAnswer}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AdminLayout>
  );
}
