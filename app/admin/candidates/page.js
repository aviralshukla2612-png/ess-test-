"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Users,
  Search,
  Filter,
  Eye,
  Trash2,
  Mail,
  Phone,
  Landmark,
  GraduationCap,
  Award,
  ChevronRight,
  ShieldCheck
} from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import Button from "@/components/ui/Button";
import { candidateService } from "@/services/candidateService";

export default function CandidatesPage() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [deleteId, setDeleteId] = useState(null);

  const fetchCandidates = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter;

      const res = await candidateService.getAllCandidates(params);
      if (res.success) {
        setCandidates(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, [statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchCandidates();
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await candidateService.deleteCandidate(deleteId);
      setDeleteId(null);
      fetchCandidates();
    } catch (e) {
      alert("Failed to delete candidate: " + e.message);
    }
  };

  return (
    <AdminLayout
      title="Registered Candidates"
      subtitle="Complete roster of college internship candidates, academic profiles, and evaluation statuses"
    >
      {/* FILTER & SEARCH BAR */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6">
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 flex-1 max-w-lg">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search candidate name, email, college, or enrollment ID..."
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 outline-none focus:border-slate-900 shadow-xs"
            />
          </div>
          <Button type="submit" variant="secondary" size="sm" className="bg-white border-slate-200 text-xs">
            Search
          </Button>
        </form>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 outline-none cursor-pointer shadow-xs"
        >
          <option value="">All Statuses</option>
          <option value="COMPLETED">Completed Assessment</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="NOT_STARTED">Pending / Not Started</option>
        </select>
      </div>

      {/* CANDIDATES TABLE */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-slate-400 text-xs flex items-center justify-center gap-2">
            <div className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
            <span>Loading Candidate Profiles...</span>
          </div>
        ) : candidates.length === 0 ? (
          <div className="py-20 text-center text-slate-400 text-xs">
            No candidates found. Registered candidates will appear here automatically.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-mono uppercase text-[10px]">
                  <th className="py-3.5 px-4 font-bold">Candidate</th>
                  <th className="py-3.5 px-4 font-bold">ESS Enroll No.</th>
                  <th className="py-3.5 px-4 font-bold">Academic Profile</th>
                  <th className="py-3.5 px-4 font-bold">Contact</th>
                  <th className="py-3.5 px-4 font-bold">Score / Status</th>
                  <th className="py-3.5 px-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {candidates.map((cand) => (
                  <tr key={cand.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-4 px-4 font-bold text-slate-900">
                      <div className="font-bold text-slate-900 text-sm">{cand.fullName}</div>
                      <div className="text-[11px] text-slate-500 font-normal font-mono">{cand.email}</div>
                    </td>

                    <td className="py-4 px-4 font-mono font-bold text-slate-900">
                      <span className="px-2 py-1 bg-slate-100 rounded border border-slate-200">
                        {cand.enrollmentNumber || "000101"}
                      </span>
                    </td>

                    <td className="py-4 px-4 max-w-xs">
                      <div className="font-semibold text-slate-800 truncate">{cand.collegeName}</div>
                      <div className="text-[11px] text-slate-500">
                        {cand.degree} ({cand.branch || "CS"}) • {cand.semester || "Sem"} • Grad {cand.graduationYear}
                      </div>
                    </td>

                    <td className="py-4 px-4 font-mono text-slate-600">
                      {cand.phone}
                    </td>

                    <td className="py-4 px-4">
                      {cand.latestAttempt ? (
                        <div>
                          <div className="flex items-center gap-1.5 font-mono font-bold text-slate-900">
                            <span>{cand.latestAttempt.score} / 15</span>
                            <span className="text-[10px] text-slate-400">({cand.latestAttempt.percentage}%)</span>
                          </div>
                          <span
                            className={`inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              cand.latestAttempt.status === "COMPLETED"
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-amber-100 text-amber-800"
                            }`}
                          >
                            {cand.latestAttempt.status}
                          </span>
                        </div>
                      ) : (
                        <span className="text-slate-400 font-mono text-[11px]">Not Started</span>
                      )}
                    </td>

                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/candidates/${cand.id}`}
                          className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors inline-flex items-center gap-1 font-semibold"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View</span>
                        </Link>
                        <button
                          onClick={() => setDeleteId(cand.id)}
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

      {/* DELETE CANDIDATE CONFIRMATION */}
      {deleteId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-slate-200 text-center">
            <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">Delete Candidate Record?</h3>
            <p className="text-xs text-slate-500 mb-6 leading-relaxed">
              This will remove the candidate profile and any associated test attempts and score records permanently.
            </p>
            <div className="flex items-center justify-center gap-3">
              <Button variant="secondary" size="md" onClick={() => setDeleteId(null)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={handleDelete}
                className="bg-red-600 hover:bg-red-700 text-white font-bold"
              >
                Delete Candidate
              </Button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
