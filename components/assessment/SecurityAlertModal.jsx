"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldAlert } from "lucide-react";
import Button from "@/components/ui/Button";

export default function SecurityAlertModal({
  isOpen,
  onDismiss,
  tabSwitchCount
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-md bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.2)] text-center overflow-hidden"
          >
            <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 mb-4 shadow-sm">
              <ShieldAlert className="w-7 h-7" />
            </div>

            <h3 className="text-lg font-bold text-slate-900 mb-2">
              Proctoring Notice: Tab Switch Detected
            </h3>

            <p className="text-sm text-slate-600 mb-5 leading-relaxed">
              Please keep the assessment window in focus. All window minimizations and tab departures are recorded on your evaluation record.
            </p>

            <div className="bg-slate-50 rounded-2xl p-3.5 mb-6 border border-slate-200 flex items-center justify-between text-xs">
              <span className="text-slate-600 font-semibold">Logged Departures:</span>
              <span className="font-mono font-bold text-slate-900 px-2.5 py-1 rounded-lg bg-white border border-slate-200 shadow-xs">
                {tabSwitchCount} {tabSwitchCount === 1 ? "Event" : "Events"}
              </span>
            </div>

            <Button
              variant="primary"
              size="md"
              className="w-full"
              onClick={onDismiss}
            >
              I Understand & Resume Assessment
            </Button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
