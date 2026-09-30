"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  FileCheck2,
  Search,
  Filter,
  Eye,
  Award,
  Clock,
  Keyboard,
  CheckCircle2,
  AlertCircle,
  ExternalLink
} from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import Button from "@/components/ui/Button";
import { resultService } from "@/services/resultService";

export default function ResultsPage() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function fetchResults() {
      setLoading(true);
      try {
        const res = await resultService.getAllResults(search ? { search } : {});
        if (res.success) setResults(res.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchResults();
  }, [search]);

  return (
    <AdminLayout
      title="Candidate Results & Scores"
      subtitle="Comprehensive candidate evaluations, MCQ scoring, and typing test speed metrics"
    >
      {/* Search Filter */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search candidate name, email, or enrollment ID..."
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 outline-none focus:border-slate-900 shadow-xs"
          />
        </div>
      </div>

      {/* Results Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-slate-400 text-xs flex items-center justify-center gap-2">
            <div className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
            <span>Loading Assessment Results...</span>
          </div>
        ) : results.length === 0 ? (
          <div className="py-20 text-center text-slate-400 text-xs">
            No completed assessments recorded yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-mono uppercase text-[10px]">
                  <th className="py-3.5 px-4 font-bold">Candidate</th>
                  <th className="py-3.5 px-4 font-bold">Enroll No.</th>
                  <th className="py-3.5 px-4 font-bold">MCQ Score</th>
                  <th className="py-3.5 px-4 font-bold">Typing Speed</th>
                  <th className="py-3.5 px-4 font-bold">Status</th>
                  <th className="py-3.5 px-4 font-bold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {results.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-4 px-4 font-bold text-slate-900">
                      <div>{item.candidate?.fullName}</div>
                      <div className="text-[11px] text-slate-500 font-normal">{item.candidate?.collegeName}</div>
                    </td>

                    <td className="py-4 px-4 font-mono font-bold text-slate-900">
                      {item.candidate?.enrollmentNumber || "—"}
                    </td>

                    <td className="py-4 px-4 font-mono font-bold text-slate-900">
                      <span className="text-base">{item.score}</span> / 15
                      <span className="text-[10px] text-slate-400 font-normal ml-1">({item.percentage}%)</span>
                    </td>

                    <td className="py-4 px-4 font-mono">
                      {item.typingResult ? (
                        <div className="text-slate-900">
                          <span className="font-bold">{item.typingResult.wpm} WPM</span>
                          <span className="text-[10px] text-slate-500 ml-1">({item.typingResult.accuracy}% acc)</span>
                        </div>
                      ) : (
                        <span className="text-slate-400 text-[11px]">N/A</span>
                      )}
                    </td>

                    <td className="py-4 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          item.status === "COMPLETED"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>

                    <td className="py-4 px-4 text-right">
                      <Link
                        href={`/admin/results/${item.id}`}
                        className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-700 hover:text-slate-900 font-bold transition-colors inline-flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Breakdown</span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
