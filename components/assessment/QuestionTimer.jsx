"use client";

import React from "react";
import { motion } from "framer-motion";

export default function QuestionTimer({ timeRemaining, timerState }) {
  const totalDuration = 60;
  const radius = 54;
  const strokeWidth = 6;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (timeRemaining / totalDuration) * circumference;

  // Format MM:SS
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  const formattedTime = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  // State color mapping for light theme
  const colorMap = {
    normal: {
      stroke: "#0F172A", // Deep Charcoal / Slate-900
      glow: "rgba(15, 23, 42, 0.15)",
      bgTrack: "#E2E8F0",
      textColor: "text-slate-900",
      pulse: false
    },
    warning: {
      stroke: "#D97706", // Amber
      glow: "rgba(217, 119, 6, 0.2)",
      bgTrack: "#FEF3C7",
      textColor: "text-amber-700",
      pulse: false
    },
    critical: {
      stroke: "#DC2626", // Red
      glow: "rgba(220, 38, 38, 0.25)",
      bgTrack: "#FEE2E2",
      textColor: "text-red-600",
      pulse: true
    }
  };

  const currentTheme = colorMap[timerState] || colorMap.normal;

  return (
    <div className="flex flex-col items-center justify-center select-none">
      <div className="relative w-36 h-36 flex items-center justify-center">
        {/* Ambient Glow */}
        <motion.div
          animate={
            currentTheme.pulse
              ? { scale: [1, 1.08, 1], opacity: [0.3, 0.6, 0.3] }
              : { scale: 1, opacity: 0.1 }
          }
          transition={{ duration: 1, repeat: Infinity }}
          className="absolute inset-2 rounded-full blur-lg pointer-events-none"
          style={{ backgroundColor: currentTheme.glow }}
        />

        <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 130 130">
          {/* Background Track */}
          <circle
            cx="65"
            cy="65"
            r={radius}
            fill="transparent"
            stroke={currentTheme.bgTrack}
            strokeWidth={strokeWidth}
          />

          {/* Animated Countdown Ring */}
          <circle
            cx="65"
            cy="65"
            r={radius}
            fill="transparent"
            stroke={currentTheme.stroke}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-linear"
          />
        </svg>

        {/* Center Countdown Display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <motion.span
            key={formattedTime}
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            className={`font-mono text-2xl font-black tracking-tight ${currentTheme.textColor}`}
          >
            {formattedTime}
          </motion.span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mt-0.5">
            Time Remaining
          </span>
        </div>
      </div>
    </div>
  );
}
