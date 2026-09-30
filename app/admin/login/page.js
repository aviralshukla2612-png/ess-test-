"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Lock,
  Mail,
  ArrowRight,
  AlertCircle,
  KeyRound,
  Sparkles
} from "lucide-react";
import Logo from "@/components/ui/Logo";
import Button from "@/components/ui/Button";
import { authService } from "@/services/authService";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@emperorsmartsolutions.com");
  const [password, setPassword] = useState("Admin@123");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await authService.login(email, password);
      router.push("/admin");
    } catch (err) {
      setError(err.message || "Invalid credentials. Please check your email and password.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0B0F19] via-[#0F172A] to-black flex items-center justify-center p-4 sm:p-6 relative text-white">
      {/* Background Architectural Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md rounded-3xl bg-white/[0.04] border border-white/10 backdrop-blur-xl p-8 sm:p-10 shadow-[0_20px_70px_rgba(0,0,0,0.5)] overflow-hidden"
      >
        {/* Top subtle sheen */}
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-slate-400 via-white to-slate-400 pointer-events-none" />

        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="bg-white px-4 py-2 rounded-xl mb-4 shadow-sm">
            <Logo size="small" />
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-slate-300 text-[10px] font-mono font-bold uppercase tracking-wider mb-2 border border-white/10">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Admin Authorization Portal</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
            Administrator Sign In
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Access Question Bank, Assessment Config, and Candidate Results
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3.5 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Admin Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@emperorsmartsolutions.com"
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 outline-none focus:border-white focus:bg-white/10 transition-all font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Master Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 outline-none focus:border-white focus:bg-white/10 transition-all font-mono"
              />
            </div>
          </div>

          {/* Quick Demo Credentials Reminder */}
          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 text-[11px] text-slate-400 flex items-start gap-2">
            <KeyRound className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span>Default Credentials:</span>
              <div className="font-mono text-white text-[10px] mt-0.5">
                admin@emperorsmartsolutions.com / Admin@123
              </div>
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={isLoading}
            className="w-full bg-white text-slate-950 hover:bg-slate-200 mt-4 font-bold"
            iconRight={ArrowRight}
          >
            {isLoading ? "Authenticating..." : "Sign In to Admin Panel"}
          </Button>
        </form>
      </motion.div>
    </main>
  );
}
