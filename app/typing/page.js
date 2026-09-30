"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Keyboard,
  Clock,
  Zap,
  Target,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  RotateCcw
} from "lucide-react";
import Logo from "@/components/ui/Logo";
import Button from "@/components/ui/Button";
import { useAssessment } from "@/context/AssessmentContext";
import { TYPING_WORDS } from "@/data/typingWords";

const TEST_DURATION = 60; // 60 seconds word typing test

export default function TypingPage() {
  const router = useRouter();
  const { candidateInfo, tabSwitchCount } = useAssessment();

  // Words list (shuffled subset of curated words)
  const [words, setWords] = useState([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const [wordResults, setWordResults] = useState([]); // [{ word, isCorrect, typed }]

  // Stats
  const [timeRemaining, setTimeRemaining] = useState(TEST_DURATION);
  const [hasStarted, setHasStarted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [totalKeystrokes, setTotalKeystrokes] = useState(0);
  const [correctKeystrokes, setCorrectKeystrokes] = useState(0);

  const inputRef = useRef(null);
  const timerRef = useRef(null);
  const isFinishedRef = useRef(false);
  const startTimeRef = useRef(null);
  const wordResultsRef = useRef([]);
  const totalKeystrokesRef = useRef(0);
  const correctKeystrokesRef = useRef(0);
  const timeRemainingRef = useRef(TEST_DURATION);

  // Keep refs in sync with state for zero-dependency callbacks
  wordResultsRef.current = wordResults;
  totalKeystrokesRef.current = totalKeystrokes;
  correctKeystrokesRef.current = correctKeystrokes;
  timeRemainingRef.current = timeRemaining;

  // Initialize shuffled word list
  useEffect(() => {
    const shuffled = [...TYPING_WORDS].sort(() => 0.5 - Math.random());
    setWords(shuffled);
  }, []);

  // Focus input automatically
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [hasStarted]);

  // Compute live WPM and Accuracy
  const timeElapsed = Math.max(1, TEST_DURATION - timeRemaining);
  const correctWordsCount = wordResults.filter((r) => r.isCorrect).length;
  const liveWpm =
    hasStarted && timeElapsed > 0 ? Math.round((correctWordsCount / (timeElapsed / 60))) : 0;
  const liveAccuracy =
    totalKeystrokes > 0
      ? Math.round((correctKeystrokes / totalKeystrokes) * 100)
      : 100;

  // Stable Complete typing test function (no recreations on keystrokes)
  const finishTypingTest = useCallback(() => {
    if (isFinishedRef.current) return;
    isFinishedRef.current = true;
    setIsFinished(true);

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    const currentResults = wordResultsRef.current;
    const currentTotalKeys = totalKeystrokesRef.current;
    const currentCorrectKeys = correctKeystrokesRef.current;
    const currentCorrectWords = currentResults.filter((r) => r.isCorrect).length;
    const duration = Math.min(TEST_DURATION, Math.max(1, TEST_DURATION - timeRemainingRef.current));

    const finalWpm = Math.round(currentCorrectWords / (duration / 60)) || 0;
    const finalAccuracy = currentTotalKeys > 0 ? Math.round((currentCorrectKeys / currentTotalKeys) * 100) : 100;

    // Typing evaluation marks
    let typingGrade = "Standard";
    if (finalWpm >= 55 && finalAccuracy >= 95) typingGrade = "Expert / Platinum";
    else if (finalWpm >= 40 && finalAccuracy >= 90) typingGrade = "Advanced / Gold";
    else if (finalWpm >= 28 && finalAccuracy >= 80) typingGrade = "Proficient / Silver";

    const typingMetrics = {
      wpm: finalWpm,
      accuracy: finalAccuracy,
      correctWords: currentCorrectWords,
      incorrectWords: currentResults.length - currentCorrectWords,
      totalWordsTyped: currentResults.length,
      timeTaken: duration,
      grade: typingGrade
    };

    // Save final combined results
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem("emperor_assessment_results");
      let currentPayload = {};
      if (stored) {
        try {
          currentPayload = JSON.parse(stored);
        } catch (e) {
          console.error(e);
        }
      }

      const combinedPayload = {
        ...currentPayload,
        id: currentPayload.id || `att_${Date.now()}`,
        completed: true,
        typingResult: typingMetrics,
        endTime: new Date().toISOString()
      };

      sessionStorage.setItem("emperor_assessment_results", JSON.stringify(combinedPayload));

      // Persist into all submissions list for Admin Panel
      try {
        const allRaw = localStorage.getItem("emperor_all_submissions");
        const allSubmissions = allRaw ? JSON.parse(allRaw) : [];
        allSubmissions.unshift(combinedPayload);
        localStorage.setItem("emperor_all_submissions", JSON.stringify(allSubmissions));
      } catch (err) {
        console.error(err);
      }
    }

    // Navigate to completed screen
    setTimeout(() => {
      router.push("/completed");
    }, 300);
  }, [router]);

  // Ultra-smooth wall-clock 60-second Countdown Timer (immune to keystroke re-renders)
  useEffect(() => {
    if (!hasStarted || isFinished) {
      return;
    }

    if (!startTimeRef.current) {
      startTimeRef.current = Date.now();
    }

    timerRef.current = setInterval(() => {
      if (isFinishedRef.current) {
        if (timerRef.current) clearInterval(timerRef.current);
        return;
      }

      const elapsedSeconds = Math.floor((Date.now() - startTimeRef.current) / 1000);
      const remaining = Math.max(0, TEST_DURATION - elapsedSeconds);

      setTimeRemaining(remaining);

      if (remaining <= 0) {
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
        finishTypingTest();
      }
    }, 250); // High precision sub-second polling without drift

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [hasStarted, isFinished, finishTypingTest]);

  // Handle Input Changes
  const handleInputChange = (e) => {
    if (isFinished) return;

    if (!hasStarted) {
      setHasStarted(true);
    }

    const val = e.target.value;

    // Detect word submission via Space or Enter
    if (val.endsWith(" ") || val.endsWith("\n")) {
      const trimmed = val.trim();
      if (trimmed.length === 0) {
        setInputValue("");
        return;
      }

      const currentTargetWord = words[currentWordIndex] || "";
      const isWordCorrect = trimmed === currentTargetWord;

      // Track keystrokes
      setTotalKeystrokes((prev) => prev + trimmed.length + 1);
      if (isWordCorrect) {
        setCorrectKeystrokes((prev) => prev + trimmed.length + 1);
      }

      setWordResults((prev) => [
        ...prev,
        {
          word: currentTargetWord,
          typed: trimmed,
          isCorrect: isWordCorrect
        }
      ]);

      // Move to next word
      setCurrentWordIndex((prev) => prev + 1);
      setInputValue("");

      // If finished all words in array, complete test
      if (currentWordIndex + 1 >= words.length) {
        finishTypingTest();
      }
      return;
    }

    setInputValue(val);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const timerPercentage = (timeRemaining / TEST_DURATION) * 100;
  const isTimeCritical = timeRemaining <= 10;
  const isTimeWarning = timeRemaining <= 20 && !isTimeCritical;

  return (
    <main className="min-h-screen bg-light-mesh flex items-center justify-center p-4 sm:p-6 lg:p-10 relative select-none">
      {/* Background Architectural Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-4xl rounded-3xl bg-white border border-slate-200/90 shadow-[0_20px_70px_rgba(0,0,0,0.07)] p-6 sm:p-10 overflow-hidden flex flex-col justify-between min-h-[580px]"
      >
        {/* Top subtle sheen */}
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 pointer-events-none" />

        {/* Top Header */}
        <div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
            <Logo size="small" />

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 text-slate-800 text-xs font-bold border border-slate-200">
                <Keyboard className="w-3.5 h-3.5" />
                <span>Section 4: 1-Minute Word Typing Assessment</span>
              </div>
            </div>
          </div>

          {/* Title & Prominent 1-Minute Countdown Timer */}
          <div className="mt-6 mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full bg-slate-900 text-white text-[10px] font-mono font-bold uppercase tracking-wider">
                  Duration: Exactly 1 Min (60s)
                </span>
                {hasStarted && !isFinished && (
                  <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    Timer Running
                  </span>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Word Typing Speed Test
              </h1>
              <p className="text-slate-600 text-xs sm:text-sm mt-1">
                Type each word accurately and press <span className="font-mono font-bold text-slate-900 bg-slate-100 px-1.5 py-0.5 rounded">Space</span> to proceed.
              </p>
            </div>

            {/* Live Metrics Bar with Big 1-Min Timer */}
            <div className="flex items-center gap-3 w-full md:w-auto justify-end">
              {/* 1-Minute Countdown Timer Widget */}
              <div
                className={`
                  px-4 py-2.5 rounded-2xl border text-center min-w-[110px] transition-all shadow-xs flex flex-col items-center justify-center
                  ${
                    isTimeCritical
                      ? "bg-red-50 border-red-300 text-red-700 animate-pulse ring-2 ring-red-400"
                      : isTimeWarning
                      ? "bg-amber-50 border-amber-300 text-amber-800"
                      : "bg-slate-900 text-white border-slate-800"
                  }
                `}
              >
                <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-wider opacity-80">
                  <Clock className="w-3 h-3" />
                  <span>1-Min Timer</span>
                </div>
                <span className="font-mono font-black text-2xl tracking-tight leading-none mt-1">
                  {formatTime(timeRemaining)}
                </span>
              </div>

              {/* Live WPM */}
              <div className="px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-center min-w-[80px] shadow-xs">
                <span className="text-[10px] font-bold font-mono uppercase text-slate-500 block">
                  Speed
                </span>
                <span className="font-mono font-black text-xl text-slate-900 leading-none mt-1 block">
                  {liveWpm} <span className="text-[10px] font-normal text-slate-500">WPM</span>
                </span>
              </div>

              {/* Live Accuracy */}
              <div className="px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-center min-w-[80px] shadow-xs">
                <span className="text-[10px] font-bold font-mono uppercase text-slate-500 block">
                  Accuracy
                </span>
                <span className="font-mono font-black text-xl text-slate-900 leading-none mt-1 block">
                  {liveAccuracy}%
                </span>
              </div>
            </div>
          </div>

          {/* 60-Second Timer Progress Bar */}
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mb-6 border border-slate-200/80">
            <motion.div
              className={`h-full transition-all duration-300 ${
                isTimeCritical ? "bg-red-600" : isTimeWarning ? "bg-amber-500" : "bg-slate-900"
              }`}
              style={{ width: `${timerPercentage}%` }}
            />
          </div>

          {/* WORDS STREAM DISPLAY AREA (Word-by-word) */}
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-50 border border-slate-200 min-h-[160px] flex flex-wrap items-center gap-3 mb-6 relative overflow-hidden">
            {words.slice(Math.max(0, currentWordIndex - 2), currentWordIndex + 10).map((w, idx) => {
              const actualIndex = Math.max(0, currentWordIndex - 2) + idx;
              const isCurrent = actualIndex === currentWordIndex;
              const isPast = actualIndex < currentWordIndex;
              const pastResult = isPast ? wordResults[actualIndex] : null;

              return (
                <span
                  key={actualIndex}
                  className={`
                    px-3.5 py-1.5 rounded-xl font-mono text-base sm:text-lg font-bold transition-all duration-150
                    ${
                      isCurrent
                        ? "bg-slate-900 text-white shadow-md scale-105 ring-2 ring-slate-400 z-10"
                        : isPast
                        ? pastResult?.isCorrect
                          ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                          : "bg-red-100 text-red-700 border border-red-300 line-through opacity-75"
                        : "text-slate-400 bg-white border border-slate-200"
                    }
                  `}
                >
                  {w}
                </span>
              );
            })}
          </div>

          {/* INPUT TYPING FIELD */}
          <div className="relative mb-6">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              disabled={isFinished}
              placeholder={hasStarted ? "Type word here and hit Space..." : "Click or start typing to begin the 60s test..."}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
              className="w-full px-6 py-4 rounded-2xl bg-white border-2 border-slate-300 focus:border-slate-900 text-xl font-mono font-bold text-slate-900 placeholder-slate-400 outline-none transition-all shadow-sm"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 font-mono text-xs text-slate-400 hidden sm:block">
              Press [SPACE] to submit word
            </div>
          </div>
        </div>

        {/* BOTTOM HELPER & ACTION */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Words Typed: <strong className="text-slate-900">{wordResults.length}</strong> (Correct: <strong className="text-emerald-700">{correctWordsCount}</strong>)</span>
          </div>

          <Button
            variant="primary"
            size="md"
            onClick={finishTypingTest}
            className="w-full sm:w-auto bg-slate-900 hover:bg-black text-white"
            iconRight={ArrowRight}
          >
            Submit & Calculate Total Score
          </Button>
        </div>
      </motion.div>
    </main>
  );
}
