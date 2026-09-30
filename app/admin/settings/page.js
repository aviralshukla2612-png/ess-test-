"use client";

import React, { useState, useEffect } from "react";
import {
  Settings,
  Shield,
  History,
  KeyRound,
  Database,
  CheckCircle2,
  Server,
  Lock
} from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import Button from "@/components/ui/Button";
import { dashboardService } from "@/services/dashboardService";
import { authService } from "@/services/authService";

export default function SettingsPage() {
  const [currentUser, setCurrentUser] = useState(null);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const user = authService.getCurrentUser();
        setCurrentUser(user);

        const logsRes = await dashboardService.getAuditLogs();
        if (logsRes.success) setAuditLogs(logsRes.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <AdminLayout
      title="System Settings & Audit Logs"
      subtitle="Security controls, active server configuration, and administrative audit trails"
    >
      {/* 2-COLUMN GRID: ADMIN PROFILE & SYSTEM SPECS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Admin Account Card */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center gap-3 pb-4 mb-4 border-b border-slate-100">
            <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-bold text-sm">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Administrator Credentials</h3>
              <p className="text-xs text-slate-500">Active role and session details</p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <span className="text-slate-400 block font-semibold uppercase text-[10px]">Full Name</span>
              <span className="font-bold text-slate-900">{currentUser?.fullName || "System Administrator"}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-semibold uppercase text-[10px]">Email Address</span>
              <span className="font-mono text-slate-900">{currentUser?.email || "admin@emperorsmartsolutions.com"}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-semibold uppercase text-[10px]">Authorization Role</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800">
                {currentUser?.role || "SUPER_ADMIN"}
              </span>
            </div>
          </div>
        </div>

        {/* Platform Architecture & Engine */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center gap-3 pb-4 mb-4 border-b border-slate-100">
            <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-bold text-sm">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Engine Configuration</h3>
              <p className="text-xs text-slate-500">Full-Stack architecture specifications</p>
            </div>
          </div>

          <div className="space-y-2.5 text-xs text-slate-700 font-medium">
            <div className="flex items-center justify-between">
              <span>Frontend:</span>
              <span className="font-mono font-bold text-slate-900">Next.js 14+ (App Router)</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Backend REST API:</span>
              <span className="font-mono font-bold text-slate-900">NestJS (Modular Architecture)</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Database & ORM:</span>
              <span className="font-mono font-bold text-slate-900">PostgreSQL / Prisma ORM</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Security & Timer:</span>
              <span className="font-mono font-bold text-emerald-700">Server-Side Wall-Clock Validation</span>
            </div>
          </div>
        </div>
      </div>

      {/* AUDIT LOG TABLE */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <History className="w-4 h-4 text-slate-700" />
            Administrative Audit Trail
          </h3>
          <span className="text-xs text-slate-400 font-mono">Immutable Action Log</span>
        </div>

        {auditLogs.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-mono uppercase text-[10px]">
                  <th className="py-3 px-3 font-bold">Action</th>
                  <th className="py-3 px-3 font-bold">Entity</th>
                  <th className="py-3 px-3 font-bold">Details</th>
                  <th className="py-3 px-3 font-bold">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/60">
                    <td className="py-3 px-3 font-mono font-bold text-slate-900">
                      <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-[10px]">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-700 font-semibold">{log.entityType || "System"}</td>
                    <td className="py-3 px-3 font-mono text-[11px] text-slate-500 max-w-xs truncate">
                      {log.metadata || "—"}
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-400 text-[11px]">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-8 text-center text-slate-400 text-xs">
            No administrative audit actions recorded in current session.
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
