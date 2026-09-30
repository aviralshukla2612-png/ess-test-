"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ChevronLeft,
  User,
  Mail,
  Phone,
  Landmark,
  Building,
  GraduationCap,
  Award,
  Clock,
  CheckCircle2,
  FileCheck2,
  Keyboard,
  ExternalLink
} from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import Button from "@/components/ui/Button";
import { candidateService } from "@/services/candidateService";

export default function CandidateDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id;

  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!id) return;
      try {
        const res = await candidateService.getCandidateById(id);
        if (res.success) setCandidate(res.data);
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
      <AdminLayout title="Candidate Profile">
        <div className="py-20 text-center text-slate-400 text-xs flex items-center justify-center gap-2">
          <div className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
          <span>Loading Candidate Data...</span>
        </div>
      </AdminLayout>
    );
  }

  if (!candidate) {
    return (
      <AdminLayout title="Candidate Profile">
        <div className="py-20 text-center text-slate-500 text-sm">
          Candidate record not found.
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      title={`Candidate: ${candidate.fullName}`}
      subtitle={`ESS Enrollment No: ${candidate.enrollmentNumber || "000101"}`}
    >
      <div className="mb-6">
        <Link
          href="/admin/candidates"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span>Back to Candidates</span>
        </Link>
      </div>

      {/* CANDIDATE ACADEMIC & PERSONAL PROFILE CARD */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-bold text-base shadow-xs">
              {candidate.fullName.charAt(0)}
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">{candidate.fullName}</h2>
              <div className="text-xs text-slate-500 font-mono mt-0.5">
                Enrollment ID: <span className="text-slate-900 font-bold">{candidate.enrollmentNumber}</span> • Candidate ID: {candidate.candidateId}
              </div>
            </div>
          </div>

          <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-800 border border-slate-200">
            Registered: {new Date(candidate.createdAt).toLocaleDateString()}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-6 text-xs">
          <div>
            <span className="text-slate-400 font-semibold block uppercase tracking-wider text-[10px] mb-1">Email Address</span>
            <span className="font-semibold text-slate-900 flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-slate-400" />{candidate.email}</span>
          </div>

          <div>
            <span className="text-slate-400 font-semibold block uppercase tracking-wider text-[10px] mb-1">Phone Number</span>
            <span className="font-semibold text-slate-900 flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-slate-400" />{candidate.phone}</span>
          </div>

          <div>
            <span className="text-slate-400 font-semibold block uppercase tracking-wider text-[10px] mb-1">College / Institute</span>
            <span className="font-semibold text-slate-900 flex items-center gap-1.5"><Landmark className="w-3.5 h-3.5 text-slate-400" />{candidate.collegeName}</span>
          </div>

          <div>
            <span className="text-slate-400 font-semibold block uppercase tracking-wider text-[10px] mb-1">University / Board</span>
            <span className="font-semibold text-slate-900 flex items-center gap-1.5"><Building className="w-3.5 h-3.5 text-slate-400" />{candidate.university}</span>
          </div>

          <div>
            <span className="text-slate-400 font-semibold block uppercase tracking-wider text-[10px] mb-1">Degree & Program</span>
            <span className="font-semibold text-slate-900">{candidate.degree}</span>
          </div>

          <div>
            <span className="text-slate-400 font-semibold block uppercase tracking-wider text-[10px] mb-1">Branch / Specialization</span>
            <span className="font-semibold text-slate-900">{candidate.branch}</span>
          </div>

          <div>
            <span className="text-slate-400 font-semibold block uppercase tracking-wider text-[10px] mb-1">Current Semester</span>
            <span className="font-semibold text-slate-900">{candidate.semester}</span>
          </div>

          <div>
            <span className="text-slate-400 font-semibold block uppercase tracking-wider text-[10px] mb-1">Graduation Year & CGPA</span>
            <span className="font-semibold text-slate-900">{candidate.graduationYear} {candidate.cgpa ? `(CGPA: ${candidate.cgpa})` : ""}</span>
          </div>
        </div>
      </div>

      {/* ASSESSMENT ATTEMPTS HISTORY */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
          <FileCheck2 className="w-4 h-4 text-slate-700" />
          Assessment Attempts & Evaluation Records
        </h3>

        {candidate.attempts && candidate.attempts.length > 0 ? (
          <div className="space-y-4">
            {candidate.attempts.map((attempt) => (
              <div
                key={attempt.id}
                className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        attempt.status === "COMPLETED"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {attempt.status}
                    </span>
                    <span className="text-xs font-mono text-slate-500">
                      Version {attempt.assessmentVersion || 1} • {new Date(attempt.startedAt).toLocaleString()}
                    </span>
                  </div>
                  <div className="text-sm font-bold text-slate-900">
                    Score: {attempt.score} / 15 ({attempt.percentage}%)
                  </div>
                </div>

                <Link href={`/admin/results/${attempt.id}`}>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="bg-white border-slate-200 text-xs font-bold"
                    iconRight={ExternalLink}
                  >
                    View Detailed Scorecard
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center text-slate-400 text-xs">
            Candidate has not started any assessment session yet.
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
