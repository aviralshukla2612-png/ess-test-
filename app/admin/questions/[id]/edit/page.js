"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import {
  ChevronLeft,
  CheckCircle2,
  AlertCircle,
  Save
} from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import Button from "@/components/ui/Button";
import { questionService } from "@/services/questionService";

export default function EditQuestionPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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

  useEffect(() => {
    async function loadQuestion() {
      if (!id) return;
      try {
        const res = await questionService.getQuestionById(id);
        if (res.success && res.data) {
          const q = res.data;
          const options = Array.isArray(q.options) ? q.options : [];
          setForm({
            section: q.section || "MATHEMATICS",
            topic: q.topic || "",
            question: q.question || "",
            optionA: options[0]?.text || options[0] || "",
            optionB: options[1]?.text || options[1] || "",
            optionC: options[2]?.text || options[2] || "",
            optionD: options[3]?.text || options[3] || "",
            correctAnswer: q.correctAnswer || "A",
            difficulty: q.difficulty || "MEDIUM",
            timeLimit: q.timeLimit || 60,
            isActive: q.isActive !== undefined ? q.isActive : true
          });
        }
      } catch (err) {
        setError("Failed to load question details");
      } finally {
        setLoading(false);
      }
    }
    loadQuestion();
  }, [id]);

  const handleFormChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);

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

      await questionService.updateQuestion(id, payload);
      setSuccess("Question updated successfully!");
      setTimeout(() => router.push("/admin/questions"), 1000);
    } catch (err) {
      setError(err.message || "Failed to update question");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Edit Question">
        <div className="py-20 text-center text-slate-400 text-xs flex items-center justify-center gap-2">
          <div className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
          <span>Loading Question Data...</span>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      title="Edit Assessment Question"
      subtitle="Modify question text, options, difficulty, or time limit"
    >
      <div className="mb-6">
        <Link
          href="/admin/questions"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span>Back to Question Bank</span>
        </Link>
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

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Question Statement <span className="text-red-500">*</span>
          </label>
          <textarea
            required
            rows={3}
            value={form.question}
            onChange={(e) => handleFormChange("question", e.target.value)}
            className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-900 outline-none font-medium leading-relaxed"
          />
        </div>

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
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 outline-none"
              />
            </div>
          </div>
        </div>

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
              <option value="A">Option A</option>
              <option value="B">Option B</option>
              <option value="C">Option C</option>
              <option value="D">Option D</option>
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
            disabled={saving}
            className="bg-slate-900 hover:bg-black text-white font-bold"
            icon={Save}
          >
            {saving ? "Updating..." : "Update Question"}
          </Button>
        </div>
      </form>
    </AdminLayout>
  );
}
