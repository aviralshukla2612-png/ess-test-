"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ChevronLeft,
  CheckCircle2,
  AlertCircle,
  FileCode,
  FileText,
  Save,
  Sparkles,
  HelpCircle
} from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import Button from "@/components/ui/Button";
import { questionService } from "@/services/questionService";

export default function NewQuestionPage() {
  const router = useRouter();
  const [activeMode, setActiveMode] = useState("form"); // "form" | "json"
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Mode A: Form State
  const [form, setForm] = useState({
    section: "MATHEMATICS",
    topic: "",
    question: "",
    optionA: "",
    optionB: "",
    optionC: "",
    optionD: "",
    correctAnswer: "A",
    difficulty: "MEDIUM",
    timeLimit: 60,
    isActive: true
  });

  // Mode B: JSON State
  const [jsonContent, setJsonContent] = useState(
    JSON.stringify(
      {
        section: "DEVELOPER_TECHNICAL",
        topic: "React Architecture",
        question: "What is useState used for in React?",
        options: [
          "Managing local component state",
          "Routing between pages",
          "Connecting to database",
          "Compiling CSS styles"
        ],
        correctAnswer: "Managing local component state",
        difficulty: "EASY",
        timeLimit: 60,
        isActive: true
      },
      null,
      2
    )
  );

  const handleFormChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const payload = {
        section: form.section,
        topic: form.topic,
        question: form.question,
        options: [
          { id: "A", text: form.optionA },
          { id: "B", text: form.optionB },
          { id: "C", text: form.optionC },
          { id: "D", text: form.optionD }
        ],
        correctAnswer: form.correctAnswer,
        difficulty: form.difficulty,
        timeLimit: Number(form.timeLimit) || 60,
        isActive: form.isActive
      };

      await questionService.createQuestion(payload);
      setSuccess("Question created and added to Question Bank!");
      setTimeout(() => router.push("/admin/questions"), 1000);
    } catch (err) {
      setError(err.message || "Failed to create question");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitJson = async () => {
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      let parsed;
      try {
        parsed = JSON.parse(jsonContent);
      } catch (e) {
        throw new Error("Invalid JSON formatting. Please check syntax.");
      }

      await questionService.createQuestion(parsed);
      setSuccess("Question successfully parsed, validated, and saved!");
      setTimeout(() => router.push("/admin/questions"), 1000);
    } catch (err) {
      setError(err.message || "JSON validation failed");
    } finally {
      setLoading(false);
    }
  };

  const formatJson = () => {
    try {
      const parsed = JSON.parse(jsonContent);
      setJsonContent(JSON.stringify(parsed, null, 2));
      setError("");
    } catch (e) {
      setError("Cannot format invalid JSON");
    }
  };

  return (
    <AdminLayout
      title="Create Assessment Question"
      subtitle="Add questions to the centralized Question Bank via Interactive Form or JSON"
    >
      <div className="mb-6 flex items-center justify-between">
        <Link
          href="/admin/questions"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span>Back to Question Bank</span>
        </Link>

        {/* Mode Switcher Tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-200/80 rounded-2xl">
          <button
            onClick={() => setActiveMode("form")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeMode === "form"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Interactive Form</span>
          </button>
          <button
            onClick={() => setActiveMode("json")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeMode === "json"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>JSON Editor</span>
          </button>
        </div>
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

      {/* MODE A: INTERACTIVE FORM */}
      {activeMode === "form" && (
        <form onSubmit={handleSubmitForm} className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Section */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Section <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={form.section}
                onChange={(e) => handleFormChange("section", e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 outline-none cursor-pointer"
              >
                <option value="MATHEMATICS">Mathematics</option>
                <option value="LOGICAL_REASONING">Logical Reasoning</option>
                <option value="DEVELOPER_TECHNICAL">Developer / Technical</option>
              </select>
            </div>

            {/* Topic */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Topic / Category
              </label>
              <input
                type="text"
                value={form.topic}
                onChange={(e) => handleFormChange("topic", e.target.value)}
                placeholder="e.g. Asynchronous JS or Percentages"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 outline-none"
              />
            </div>

            {/* Difficulty */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Difficulty
              </label>
              <select
                value={form.difficulty}
                onChange={(e) => handleFormChange("difficulty", e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 outline-none cursor-pointer"
              >
                <option value="EASY">Easy</option>
                <option value="MEDIUM">Medium</option>
                <option value="HARD">Hard</option>
              </select>
            </div>
          </div>

          {/* Question Text */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Question Statement <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              rows={3}
              value={form.question}
              onChange={(e) => handleFormChange("question", e.target.value)}
              placeholder="Enter the complete question problem or code snippet..."
              className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-900 outline-none font-medium leading-relaxed"
            />
          </div>

          {/* 4 Options Grid */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
              Options (Exactly 4 Required) <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase font-mono block mb-1">Option A</span>
                <input
                  type="text"
                  required
                  value={form.optionA}
                  onChange={(e) => handleFormChange("optionA", e.target.value)}
                  placeholder="Option A text..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 outline-none"
                />
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase font-mono block mb-1">Option B</span>
                <input
                  type="text"
                  required
                  value={form.optionB}
                  onChange={(e) => handleFormChange("optionB", e.target.value)}
                  placeholder="Option B text..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 outline-none"
                />
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase font-mono block mb-1">Option C</span>
                <input
                  type="text"
                  required
                  value={form.optionC}
                  onChange={(e) => handleFormChange("optionC", e.target.value)}
                  placeholder="Option C text..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 outline-none"
                />
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase font-mono block mb-1">Option D</span>
                <input
                  type="text"
                  required
                  value={form.optionD}
                  onChange={(e) => handleFormChange("optionD", e.target.value)}
                  placeholder="Option D text..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Correct Answer & Time Limit */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Correct Answer Option <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={form.correctAnswer}
                onChange={(e) => handleFormChange("correctAnswer", e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold font-mono text-emerald-800 outline-none cursor-pointer"
              >
                <option value="A">Option A ({form.optionA || "A"})</option>
                <option value="B">Option B ({form.optionB || "B"})</option>
                <option value="C">Option C ({form.optionC || "C"})</option>
                <option value="D">Option D ({form.optionD || "D"})</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Time Limit (Seconds)
              </label>
              <input
                type="number"
                min="10"
                max="300"
                value={form.timeLimit}
                onChange={(e) => handleFormChange("timeLimit", e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900 outline-none"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <Link href="/admin/questions">
              <Button variant="secondary" size="md">
                Cancel
              </Button>
            </Link>
            <Button
              type="submit"
              variant="primary"
              size="md"
              disabled={loading}
              className="bg-slate-900 hover:bg-black text-white font-bold"
              icon={Save}
            >
              {loading ? "Saving..." : "Save to Question Bank"}
            </Button>
          </div>
        </form>
      )}

      {/* MODE B: LIVE JSON EDITOR */}
      {activeMode === "json" && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
            <span className="text-xs text-slate-500 font-mono">
              Schema: section (MATHEMATICS | LOGICAL_REASONING | DEVELOPER_TECHNICAL), question, options (array of 4), correctAnswer, difficulty, timeLimit
            </span>
            <button
              type="button"
              onClick={formatJson}
              className="px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-mono font-bold text-slate-700 transition-colors"
            >
              Format JSON
            </button>
          </div>

          <textarea
            rows={15}
            value={jsonContent}
            onChange={(e) => setJsonContent(e.target.value)}
            className="w-full p-4 font-mono text-xs bg-slate-900 text-emerald-400 rounded-2xl outline-none mb-4 shadow-inner"
          />

          <div className="flex items-center justify-end gap-3">
            <Link href="/admin/questions">
              <Button variant="secondary" size="md">
                Cancel
              </Button>
            </Link>
            <Button
              variant="primary"
              size="md"
              disabled={loading}
              onClick={handleSubmitJson}
              className="bg-slate-900 hover:bg-black text-white font-bold"
              icon={Save}
            >
              {loading ? "Validating & Saving..." : "Validate & Save JSON Question"}
            </Button>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
