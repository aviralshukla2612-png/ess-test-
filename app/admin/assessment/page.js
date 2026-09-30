"use client";

import React, { useState, useEffect } from "react";
import {
  Sliders,
  CheckCircle2,
  AlertCircle,
  Save,
  RotateCcw,
  ArrowUpDown,
  Trash2,
  Plus,
  HelpCircle,
  Sparkles
} from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import Button from "@/components/ui/Button";
import { assessmentService } from "@/services/assessmentService";
import { questionService } from "@/services/questionService";

export default function ActiveAssessmentPage() {
  const [config, setConfig] = useState(null);
  const [allQuestions, setAllQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Selected question IDs
  const [mathIds, setMathIds] = useState([]);
  const [reasoningIds, setReasoningIds] = useState([]);
  const [devIds, setDevIds] = useState([]);
  const [assessmentName, setAssessmentName] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        const [cfgRes, qRes] = await Promise.all([
          assessmentService.getConfiguration(),
          questionService.getAllQuestions({ limit: 100 })
        ]);

        if (cfgRes.success && cfgRes.data) {
          const cfg = cfgRes.data;
          setConfig(cfg);
          setAssessmentName(cfg.name || "Emperor Pre-Employment Evaluation");
          setMathIds(cfg.mathQuestions?.map((q) => q.id) || []);
          setReasoningIds(cfg.reasoningQuestions?.map((q) => q.id) || []);
          setDevIds(cfg.developerQuestions?.map((q) => q.id) || []);
        }

        if (qRes.success && qRes.data) {
          setAllQuestions(qRes.data);
        }
      } catch (err) {
        setError("Failed to load assessment configuration");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const availableMath = allQuestions.filter((q) => q.section === "MATHEMATICS");
  const availableReasoning = allQuestions.filter((q) => q.section === "LOGICAL_REASONING");
  const availableDev = allQuestions.filter((q) => q.section === "DEVELOPER_TECHNICAL");

  const isMathValid = mathIds.length === 5;
  const isReasoningValid = reasoningIds.length === 5;
  const isDevValid = devIds.length === 5;
  const isTotalValid = isMathValid && isReasoningValid && isDevValid;

  const handleSelectQuestion = (section, index, newId) => {
    if (section === "MATHEMATICS") {
      const copy = [...mathIds];
      copy[index] = newId;
      setMathIds(copy);
    } else if (section === "LOGICAL_REASONING") {
      const copy = [...reasoningIds];
      copy[index] = newId;
      setReasoningIds(copy);
    } else if (section === "DEVELOPER_TECHNICAL") {
      const copy = [...devIds];
      copy[index] = newId;
      setDevIds(copy);
    }
  };

  const handlePublish = async () => {
    setError("");
    setSuccess("");

    if (!isTotalValid) {
      setError("Active assessment requires exactly 5 Mathematics, 5 Logical Reasoning, and 5 Technical questions (Total 15).");
      return;
    }

    setSaving(true);
    try {
      const res = await assessmentService.updateConfiguration({
        name: assessmentName,
        mathQuestionIds: mathIds,
        reasoningQuestionIds: reasoningIds,
        developerQuestionIds: devIds
      });

      setSuccess(res.message || "New active assessment version published successfully!");
      if (res.data) setConfig((prev) => ({ ...prev, version: res.data.version }));
    } catch (err) {
      setError(err.message || "Failed to publish assessment configuration");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout
      title="Active Assessment Configuration"
      subtitle="Configure and lock the exact 15 questions (5 Math + 5 Reasoning + 5 Tech) presented to candidates"
    >
      {/* Top Version & Summary Bar */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-slate-900 text-white text-[10px] font-mono font-bold uppercase tracking-wider">
              Published Version {config?.version || 1}
            </span>
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${isTotalValid ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"}`}>
              {isTotalValid ? "Valid (15/15 Locked)" : "Incomplete Selection"}
            </span>
          </div>
          <input
            type="text"
            value={assessmentName}
            onChange={(e) => setAssessmentName(e.target.value)}
            placeholder="Assessment Name"
            className="text-lg sm:text-xl font-bold text-slate-900 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-slate-900 outline-none transition-colors w-full"
          />
        </div>

        <Button
          variant="primary"
          size="md"
          disabled={saving || !isTotalValid}
          onClick={handlePublish}
          className="bg-slate-900 hover:bg-black text-white font-bold shrink-0"
          icon={Save}
        >
          {saving ? "Publishing..." : "Publish Assessment Version"}
        </Button>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2.5">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>{success}</span>
        </div>
      )}

      {/* 3 SECTION ACCORDIONS (MATHEMATICS, REASONING, TECHNICAL) */}
      <div className="space-y-6 mb-8">
        
        {/* SECTION 1: MATHEMATICS (Q1 - Q5) */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                1. Mathematics Section (Questions 1 to 5)
              </h3>
              <p className="text-xs text-slate-500">Must contain exactly 5 active questions</p>
            </div>
            <span className={`px-2.5 py-1 rounded-full text-xs font-mono font-bold ${isMathValid ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"}`}>
              {mathIds.length} / 5 Selected
            </span>
          </div>

          <div className="space-y-3">
            {[0, 1, 2, 3, 4].map((idx) => {
              const currentId = mathIds[idx] || "";
              const selectedQuestion = allQuestions.find((q) => q.id === currentId);

              return (
                <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 flex-1 min-w-0">
                    <span className="w-6 h-6 rounded-lg bg-slate-900 text-white flex items-center justify-center font-mono font-bold text-[11px] shrink-0">
                      Q{idx + 1}
                    </span>
                    <select
                      value={currentId}
                      onChange={(e) => handleSelectQuestion("MATHEMATICS", idx, e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 outline-none cursor-pointer"
                    >
                      <option value="">Select question from Mathematics bank...</option>
                      {availableMath.map((q) => (
                        <option key={q.id} value={q.id}>
                          {q.question} ({q.difficulty})
                        </option>
                      ))}
                    </select>
                  </div>
                  {selectedQuestion && (
                    <span className="font-mono text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded shrink-0">
                      Ans: {selectedQuestion.correctAnswer}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* SECTION 2: LOGICAL REASONING (Q6 - Q10) */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                2. Logical Reasoning Section (Questions 6 to 10)
              </h3>
              <p className="text-xs text-slate-500">Must contain exactly 5 active questions</p>
            </div>
            <span className={`px-2.5 py-1 rounded-full text-xs font-mono font-bold ${isReasoningValid ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"}`}>
              {reasoningIds.length} / 5 Selected
            </span>
          </div>

          <div className="space-y-3">
            {[0, 1, 2, 3, 4].map((idx) => {
              const currentId = reasoningIds[idx] || "";
              const selectedQuestion = allQuestions.find((q) => q.id === currentId);

              return (
                <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 flex-1 min-w-0">
                    <span className="w-6 h-6 rounded-lg bg-slate-900 text-white flex items-center justify-center font-mono font-bold text-[11px] shrink-0">
                      Q{idx + 6}
                    </span>
                    <select
                      value={currentId}
                      onChange={(e) => handleSelectQuestion("LOGICAL_REASONING", idx, e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 outline-none cursor-pointer"
                    >
                      <option value="">Select question from Reasoning bank...</option>
                      {availableReasoning.map((q) => (
                        <option key={q.id} value={q.id}>
                          {q.question} ({q.difficulty})
                        </option>
                      ))}
                    </select>
                  </div>
                  {selectedQuestion && (
                    <span className="font-mono text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded shrink-0">
                      Ans: {selectedQuestion.correctAnswer}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* SECTION 3: DEVELOPER / TECHNICAL (Q11 - Q15) */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                3. Developer / Technical Section (Questions 11 to 15)
              </h3>
              <p className="text-xs text-slate-500">Must contain exactly 5 active questions</p>
            </div>
            <span className={`px-2.5 py-1 rounded-full text-xs font-mono font-bold ${isDevValid ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"}`}>
              {devIds.length} / 5 Selected
            </span>
          </div>

          <div className="space-y-3">
            {[0, 1, 2, 3, 4].map((idx) => {
              const currentId = devIds[idx] || "";
              const selectedQuestion = allQuestions.find((q) => q.id === currentId);

              return (
                <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 flex-1 min-w-0">
                    <span className="w-6 h-6 rounded-lg bg-slate-900 text-white flex items-center justify-center font-mono font-bold text-[11px] shrink-0">
                      Q{idx + 11}
                    </span>
                    <select
                      value={currentId}
                      onChange={(e) => handleSelectQuestion("DEVELOPER_TECHNICAL", idx, e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 outline-none cursor-pointer"
                    >
                      <option value="">Select question from Developer bank...</option>
                      {availableDev.map((q) => (
                        <option key={q.id} value={q.id}>
                          {q.question} ({q.difficulty})
                        </option>
                      ))}
                    </select>
                  </div>
                  {selectedQuestion && (
                    <span className="font-mono text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded shrink-0">
                      Ans: {selectedQuestion.correctAnswer}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
