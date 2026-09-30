"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Plus,
  Upload,
  Download,
  Search,
  Filter,
  Copy,
  Edit,
  Trash2,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  FileJson,
  X,
  Clock,
  Layers
} from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import Button from "@/components/ui/Button";
import { questionService } from "@/services/questionService";

export default function QuestionBankPage() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("");

  // Modal States
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [jsonInput, setJsonInput] = useState("");
  const [importError, setImportError] = useState("");
  const [importSuccess, setImportSuccess] = useState("");
  const [isImporting, setIsImporting] = useState(false);

  // Delete Confirmation
  const [deleteId, setDeleteId] = useState(null);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (selectedSection) params.section = selectedSection;
      if (selectedDifficulty) params.difficulty = selectedDifficulty;

      const res = await questionService.getAllQuestions(params);
      if (res.success) {
        setQuestions(res.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [selectedSection, selectedDifficulty]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchQuestions();
  };

  const handleDuplicate = async (id) => {
    try {
      await questionService.duplicateQuestion(id);
      fetchQuestions();
    } catch (e) {
      alert(e.message || "Failed to duplicate question");
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    try {
      const res = await questionService.deleteQuestion(deleteId);
      setDeleteId(null);
      fetchQuestions();
    } catch (e) {
      alert(e.message || "Failed to delete question");
    }
  };

  const handleExport = async (section = "") => {
    try {
      const res = await questionService.exportQuestions(section ? { section } : {});
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(res.data, null, 2));
      const downloadAnchor = document.createElement("a");
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `emperor_questions_${section || "all"}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    } catch (e) {
      alert("Failed to export JSON: " + e.message);
    }
  };

  const handleBulkImport = async () => {
    setImportError("");
    setImportSuccess("");
    setIsImporting(true);

    try {
      let parsed;
      try {
        parsed = JSON.parse(jsonInput);
      } catch (e) {
        throw new Error("Invalid JSON format. Please format JSON correctly.");
      }

      if (!Array.isArray(parsed)) {
        parsed = [parsed];
      }

      const res = await questionService.bulkImport(parsed);
      setImportSuccess(res.message || "Successfully imported questions.");
      setJsonInput("");
      fetchQuestions();
      setTimeout(() => setImportModalOpen(false), 1200);
    } catch (err) {
      setImportError(err.message || "Validation failed on import");
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <AdminLayout
      title="Question Bank"
      subtitle="Centralized management of assessment items, JSON bulk import/export, and question variations"
    >
      {/* ACTION BAR: SEARCH, FILTERS, AND BUTTONS */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 mb-6">
        {/* Search & Filters */}
        <form onSubmit={handleSearchSubmit} className="flex flex-wrap items-center gap-2.5 flex-1">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search question text or topic..."
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 outline-none focus:border-slate-900 shadow-xs"
            />
          </div>

          <select
            value={selectedSection}
            onChange={(e) => setSelectedSection(e.target.value)}
            className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 outline-none cursor-pointer shadow-xs"
          >
            <option value="">All Sections</option>
            <option value="MATHEMATICS">Mathematics</option>
            <option value="LOGICAL_REASONING">Logical Reasoning</option>
            <option value="DEVELOPER_TECHNICAL">Developer / Technical</option>
          </select>

          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 outline-none cursor-pointer shadow-xs"
          >
            <option value="">All Difficulties</option>
            <option value="EASY">Easy</option>
            <option value="MEDIUM">Medium</option>
            <option value="HARD">Hard</option>
          </select>
        </form>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setImportModalOpen(true)}
            className="bg-white border-slate-200 hover:bg-slate-100 text-slate-800 text-xs font-bold"
            icon={Upload}
          >
            Bulk Import JSON
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => handleExport(selectedSection)}
            className="bg-white border-slate-200 hover:bg-slate-100 text-slate-800 text-xs font-bold"
            icon={Download}
          >
            Export JSON
          </Button>

          <Link href="/admin/questions/new">
            <Button
              variant="primary"
              size="sm"
              className="bg-slate-900 hover:bg-black text-white text-xs font-bold"
              icon={Plus}
            >
              Add Question
            </Button>
          </Link>
        </div>
      </div>

      {/* QUESTIONS TABLE */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-slate-400 text-xs flex items-center justify-center gap-2">
            <div className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
            <span>Loading Question Bank...</span>
          </div>
        ) : questions.length === 0 ? (
          <div className="py-20 text-center text-slate-400 text-xs">
            No questions found matching your filter criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-mono uppercase text-[10px]">
                  <th className="py-3.5 px-4 font-bold">#</th>
                  <th className="py-3.5 px-4 font-bold">Section</th>
                  <th className="py-3.5 px-4 font-bold">Question & Options</th>
                  <th className="py-3.5 px-4 font-bold">Correct Ans</th>
                  <th className="py-3.5 px-4 font-bold">Difficulty</th>
                  <th className="py-3.5 px-4 font-bold">Time</th>
                  <th className="py-3.5 px-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {questions.map((q, idx) => (
                  <tr key={q.id || idx} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-4 px-4 font-mono text-slate-400 text-[11px]">
                      {idx + 1}
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider ${
                          q.section === "MATHEMATICS"
                            ? "bg-purple-100 text-purple-800"
                            : q.section === "LOGICAL_REASONING"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {q.section?.replace("_", " ")}
                      </span>
                      {q.topic && (
                        <div className="text-[10px] text-slate-500 mt-1 font-medium">{q.topic}</div>
                      )}
                    </td>
                    <td className="py-4 px-4 max-w-md">
                      <div className="font-bold text-slate-900 leading-snug mb-1.5">
                        {q.question}
                      </div>
                      <div className="grid grid-cols-2 gap-1 text-[11px] text-slate-600">
                        {Array.isArray(q.options) &&
                          q.options.map((opt, oIdx) => (
                            <div key={oIdx} className="truncate">
                              <span className="font-bold text-slate-800">{opt.id || String.fromCharCode(65 + oIdx)}: </span>
                              <span>{opt.text || opt}</span>
                            </div>
                          ))}
                      </div>
                    </td>
                    <td className="py-4 px-4 font-mono font-bold text-emerald-700 bg-emerald-50/40 px-2 rounded">
                      {q.correctAnswer}
                    </td>
                    <td className="py-4 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                        {q.difficulty || "MEDIUM"}
                      </span>
                    </td>
                    <td className="py-4 px-4 font-mono text-slate-500 text-[11px]">
                      {q.timeLimit || 60}s
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleDuplicate(q.id)}
                          title="Duplicate Question"
                          className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition-colors"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <Link
                          href={`/admin/questions/${q.id}/edit`}
                          title="Edit Question"
                          className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition-colors"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          onClick={() => setDeleteId(q.id)}
                          title="Delete / Archive Question"
                          className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* BULK IMPORT JSON MODAL */}
      {importModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <FileJson className="w-5 h-5 text-slate-900" />
                <h3 className="text-base font-bold text-slate-900">Bulk Import Questions (JSON)</h3>
              </div>
              <button
                onClick={() => setImportModalOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-500 mb-3">
              Paste an array of questions in JSON format. The system will validate all 4 options, section tags, and correct answer mapping.
            </p>

            {importError && (
              <div className="mb-3 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{importError}</span>
              </div>
            )}

            {importSuccess && (
              <div className="mb-3 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{importSuccess}</span>
              </div>
            )}

            <textarea
              rows={10}
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              placeholder={`[\n  {\n    "section": "MATHEMATICS",\n    "question": "What is 25% of 200?",\n    "options": ["25", "40", "50", "75"],\n    "correctAnswer": "50",\n    "difficulty": "EASY",\n    "timeLimit": 60\n  }\n]`}
              className="w-full p-4 font-mono text-xs bg-slate-900 text-emerald-400 rounded-2xl outline-none mb-4 shadow-inner"
            />

            <div className="flex items-center justify-end gap-3">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setImportModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                disabled={isImporting || !jsonInput.trim()}
                onClick={handleBulkImport}
                className="bg-slate-900 hover:bg-black text-white"
              >
                {isImporting ? "Validating & Importing..." : "Validate & Import Questions"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE / ARCHIVE CONFIRMATION MODAL */}
      {deleteId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-slate-200 text-center">
            <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">Delete this question?</h3>
            <p className="text-xs text-slate-500 mb-6 leading-relaxed">
              If this question has already been used in completed candidate assessments, it will be safely archived (deactivated) to preserve historical integrity.
            </p>
            <div className="flex items-center justify-center gap-3">
              <Button variant="secondary" size="md" onClick={() => setDeleteId(null)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={handleDeleteConfirm}
                className="bg-red-600 hover:bg-red-700 text-white font-bold"
              >
                Delete / Archive
              </Button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
