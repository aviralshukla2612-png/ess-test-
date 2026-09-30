"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  FileText,
  Clock,
  Lock,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Award
} from "lucide-react";
import Logo from "@/components/ui/Logo";
import Button from "@/components/ui/Button";

export default function WelcomePage() {
  return (
    <main className="min-h-screen bg-light-mesh flex items-center justify-center p-4 sm:p-6 lg:p-10 relative overflow-hidden">
      {/* Background architectural grid elements */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Main Container Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative w-full max-w-6xl rounded-3xl bg-white border border-slate-200/90 shadow-[0_20px_70px_rgba(0,0,0,0.07)] overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[600px]"
      >
        {/* Top subtle sheen */}
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 pointer-events-none" />

        {/* LEFT COLUMN: Content & Start Action */}
        <div className="lg:col-span-7 p-8 sm:p-10 lg:p-12 flex flex-col justify-between relative z-10">
          <div>
            {/* Main Welcome Copy */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.5 }}
            >
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 mb-4 leading-tight">
                Welcome to <br />
                <span className="text-silver-gradient">
                  the Assessment
                </span>
              </h1>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-lg mb-8">
                This assessment evaluates problem-solving, analytical reasoning, and software development skills in a real-time proctored session.
              </p>
            </motion.div>

            {/* Three Info Cards */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-10"
            >
              {/* Card 1: 15 Questions */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-slate-300 hover:bg-white hover:shadow-md transition-all duration-200 group">
                <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform shadow-sm">
                  <FileText className="w-4 h-4" />
                </div>
                <div className="text-lg font-bold text-slate-900 tracking-tight">15</div>
                <div className="text-xs text-slate-500 font-medium">Questions</div>
              </div>

              {/* Card 2: 1 Minute per question */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-slate-300 hover:bg-white hover:shadow-md transition-all duration-200 group">
                <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform shadow-sm">
                  <Clock className="w-4 h-4" />
                </div>
                <div className="text-lg font-bold text-slate-900 tracking-tight">1 Minute</div>
                <div className="text-xs text-slate-500 font-medium">Per Question</div>
              </div>

              {/* Card 3: No Skipping */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-slate-300 hover:bg-white hover:shadow-md transition-all duration-200 group">
                <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform shadow-sm">
                  <Lock className="w-4 h-4" />
                </div>
                <div className="text-lg font-bold text-slate-900 tracking-tight">No Skip</div>
                <div className="text-xs text-slate-500 font-medium">Mandatory Flow</div>
              </div>
            </motion.div>
          </div>

          {/* Primary CTA */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.5 }}
            className="pt-2"
          >
            <Link href="/register" className="inline-block w-full sm:w-auto">
              <Button
                variant="primary"
                size="lg"
                className="w-full sm:w-auto min-w-[220px] group bg-slate-900 hover:bg-black text-white"
                iconRight={ArrowRight}
              >
                Start Test
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* RIGHT COLUMN: Official Emperor Smart Solutions Brand Showcase */}
        <div className="lg:col-span-5 relative hidden lg:flex flex-col justify-between p-8 sm:p-10 border-l border-slate-200 bg-gradient-to-br from-slate-900 via-[#0F1420] to-black text-white">
          {/* Subtle Ambient Glow */}
          <div className="absolute top-1/4 right-1/4 w-48 h-48 bg-white/5 rounded-full blur-3xl pointer-events-none" />

          {/* Top Badge */}
          <div className="relative z-10 flex items-center justify-between">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs font-mono text-slate-200">
              <ShieldCheck className="w-3.5 h-3.5 text-white" />
              <span>Verified Candidate Portal</span>
            </div>
            <span className="text-[10px] font-mono text-slate-400">ESS-PORTAL-v2</span>
          </div>

          {/* Center Official Brand Display */}
          <div className="relative z-10 my-auto py-8 text-center flex flex-col items-center justify-center">
            <div className="relative p-6 rounded-3xl bg-[#0B0F17]/90 border border-white/20 shadow-[0_15px_40px_rgba(0,0,0,0.6)] mb-6">
              <Image
                src="/images/ess-logo.png"
                alt="Emperor Smart Solutions"
                width={220}
                height={70}
                className="object-contain filter drop-shadow-[0_4px_16px_rgba(255,255,255,0.2)]"
                priority
              />
            </div>
            
            <h3 className="text-xl font-bold tracking-tight text-white mb-2">
              Emperor Smart Solutions
            </h3>
            <p className="text-xs text-slate-300 max-w-xs leading-relaxed">
              Global technology consulting and software engineering proficiency evaluations.
            </p>
          </div>

          {/* Bottom Info Bar */}
          <div className="relative z-10 p-4 rounded-2xl bg-white/[0.07] backdrop-blur-md border border-white/10 text-xs text-slate-300 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Assessment System Online</span>
            </div>
            <span className="font-mono text-[11px] text-slate-400">15 Questions</span>
          </div>
        </div>
      </motion.div>
    </main>
  );
}
