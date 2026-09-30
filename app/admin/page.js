"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Users,
  CheckCircle2,
  Clock,
  Award,
  HelpCircle,
  Sliders,
  ArrowRight,
  TrendingUp,
  FileText,
  BarChart3,
  Download,
  Plus
} from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import Button from "@/components/ui/Button";
import { dashboardService } from "@/services/dashboardService";
import { assessmentService } from "@/services/assessmentService";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [dashRes, cfgRes] = await Promise.all([
          dashboardService.getDashboardStats(),
          assessmentService.getConfiguration()
        ]);
        if (dashRes.success) setStats(dashRes.data);
        if (cfgRes.success) setConfig(cfgRes.data);
      } catch (e) {
        console.error("Dashboard load error:", e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const summary = stats?.summary || {
    totalCandidates: 0,
    totalAttempts: 0,
    completedAttempts: 0,
    pendingAssessments: 0,
    averageScore: 0,
    averagePercentage: 0,
    totalQuestions: 15,
    activeQuestions: 15
  };

  const sectionDist = stats?.sectionDistribution || {
    mathematics: 5,
    reasoning: 5,
    developer: 5
  };

  const scoreDist = stats?.scoreDistribution || {
    "0-5 (Needs Review)": 0,
    "6-9 (Proficient)": 0,
    "10-12 (Advanced)": 0,
    "13-15 (Platinum)": 0
  };

  return (
    <AdminLayout
      title="Executive Overview"
      subtitle="Real-time candidate metrics, question distribution, and assessment status"
    >
      {/* TOP KPI CARDS (6 Grid) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Total Candidates */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            <span>Total Candidates</span>
            <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-900 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-black font-mono text-slate-900">
              {summary.totalCandidates}
            </span>
            <span className="text-xs text-slate-500 font-medium">Registered</span>
          </div>
        </div>

        {/* Completed Assessments */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            <span>Completed Tests</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-black font-mono text-emerald-700">
              {summary.completedAttempts}
            </span>
            <span className="text-xs text-slate-500 font-medium">Evaluations</span>
          </div>
        </div>

        {/* Average Score */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            <span>Average Score</span>
            <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-black font-mono text-slate-900">
              {summary.averageScore}
            </span>
            <span className="text-sm font-bold text-slate-400 font-mono">/ 15</span>
            <span className="text-xs text-blue-600 font-bold ml-1">({summary.averagePercentage}%)</span>
          </div>
        </div>

        {/* Question Bank */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            <span>Question Bank</span>
            <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center">
              <HelpCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-black font-mono text-slate-900">
              {summary.totalQuestions}
            </span>
            <span className="text-xs text-slate-500 font-medium">Questions Available</span>
          </div>
        </div>
      </div>

      {/* ACTIVE 15-QUESTION ASSESSMENT CONFIGURATION STATUS WIDGET */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-[#111827] to-black text-white mb-8 shadow-lg">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-slate-300 mb-1">
              <Sliders className="w-4 h-4 text-emerald-400" />
              <span>Active Assessment Configuration (Locked Snapshot)</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              {config?.name || "Emperor Pre-Employment Evaluation (Standard)"}
            </h2>
          </div>

          <Link href="/admin/assessment">
            <Button
              variant="secondary"
              size="sm"
              className="bg-white text-slate-900 hover:bg-slate-200 font-bold"
              iconRight={ArrowRight}
            >
              Configure 15 Questions
            </Button>
          </Link>
        </div>

        {/* 3 Section Breakdown Pills */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
            <div>
              <span className="text-[11px] uppercase font-bold text-slate-400 block font-mono">
                1. Mathematics
              </span>
              <span className="text-2xl font-black font-mono text-white">
                {config?.mathQuestions?.length || 5} / 5
              </span>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Locked
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
            <div>
              <span className="text-[11px] uppercase font-bold text-slate-400 block font-mono">
                2. Logical Reasoning
              </span>
              <span className="text-2xl font-black font-mono text-white">
                {config?.reasoningQuestions?.length || 5} / 5
              </span>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Locked
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
            <div>
              <span className="text-[11px] uppercase font-bold text-slate-400 block font-mono">
                3. Developer / Technical
              </span>
              <span className="text-2xl font-black font-mono text-white">
                {config?.developerQuestions?.length || 5} / 5
              </span>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Locked
            </span>
          </div>
        </div>
      </div>

      {/* 2-COLUMN SECTION: SCORE DISTRIBUTION & RECENT SUBMISSIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Score Distribution Chart / Bars */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-slate-700" />
                Score Tier Distribution
              </h3>
              <span className="text-xs text-slate-500 font-mono">Out of 15</span>
            </div>

            <div className="space-y-4">
              {Object.entries(scoreDist).map(([tier, count]) => {
                const total = summary.completedAttempts || 1;
                const percentage = Math.round((count / total) * 100);
                return (
                  <div key={tier}>
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1">
                      <span>{tier}</span>
                      <span className="font-mono text-slate-900 font-bold">{count} candidate(s)</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full bg-slate-900 rounded-full transition-all duration-500"
                        style={{ width: `${Math.max(5, percentage)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Pass Threshold: 10/15 (66.7%)</span>
            <Link href="/admin/results" className="text-slate-900 font-bold hover:underline">
              View All Results →
            </Link>
          </div>
        </div>

        {/* Recent Assessment Attempts Table */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-slate-700" />
              Recent Candidate Assessments
            </h3>
            <Link href="/admin/candidates" className="text-xs font-bold text-slate-600 hover:text-slate-900">
              Manage Candidates →
            </Link>
          </div>

          {stats?.recentAttempts && stats.recentAttempts.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-mono uppercase text-[10px]">
                    <th className="pb-3 font-bold">Candidate</th>
                    <th className="pb-3 font-bold">Enroll No.</th>
                    <th className="pb-3 font-bold">Score</th>
                    <th className="pb-3 font-bold">Status</th>
                    <th className="pb-3 font-bold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {stats.recentAttempts.map((attempt) => (
                    <tr key={attempt.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 font-bold text-slate-900">
                        {attempt.candidateName}
                        <div className="text-[10px] text-slate-500 font-normal">{attempt.email}</div>
                      </td>
                      <td className="py-3 font-mono text-slate-700 font-semibold">
                        {attempt.enrollmentNumber || "—"}
                      </td>
                      <td className="py-3 font-mono font-bold text-slate-900">
                        {attempt.score} / 15 <span className="text-[10px] text-slate-400">({attempt.percentage}%)</span>
                      </td>
                      <td className="py-3">
                        <span
                          className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                            attempt.status === "COMPLETED"
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {attempt.status}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <Link
                          href={`/admin/results/${attempt.id}`}
                          className="font-bold text-slate-900 hover:underline"
                        >
                          View →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-12 text-center text-slate-400 text-xs">
              No assessments recorded yet. Once candidates complete tests, their results will appear here in real-time.
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
