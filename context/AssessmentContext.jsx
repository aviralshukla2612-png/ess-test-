"use client";

import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ASSESSMENT_QUESTIONS, SECTIONS, SECTION_METADATA } from "@/data/questions";

const AssessmentContext = createContext(null);

const QUESTION_DURATION = 60; // 60 seconds per question

export function AssessmentProvider({ children }) {
  const router = useRouter();

  const [candidateInfo, setCandidateInfo] = useState({
    fullName: "",
    email: "",
    phone: "",
    enrollmentNumber: "",
    college: "",
    university: "",
    degree: "",
    branch: "",
    semester: "",
    graduationYear: "",
    cgpa: "",
    candidateId: ""
  });

  const [questions] = useState(ASSESSMENT_QUESTIONS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({}); // { [questionId]: { optionId, isTimeout, durationSpent } }
  const [currentSelectedOption, setCurrentSelectedOption] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(QUESTION_DURATION);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const [securityAlert, setSecurityAlert] = useState(false);

  const timerRef = useRef(null);
  const currentIndexRef = useRef(currentIndex);
  currentIndexRef.current = currentIndex;

  const isTransitioningRef = useRef(isTransitioning);
  isTransitioningRef.current = isTransitioning;

  const isCompletedRef = useRef(isCompleted);
  isCompletedRef.current = isCompleted;

  const isStartedRef = useRef(isStarted);
  isStartedRef.current = isStarted;

  const candidateInfoRef = useRef(candidateInfo);
  candidateInfoRef.current = candidateInfo;

  const currentQuestion = questions[currentIndex] || questions[0];

  // Helper to determine timer state
  const timerState =
    timeRemaining > 20 ? "normal" : timeRemaining > 5 ? "warning" : "critical";

  // Calculate current active section
  const currentSection = currentQuestion ? currentQuestion.section : SECTIONS.MATHEMATICS;

  // Stop timer helper
  const clearCurrentTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // Advance to next question or complete assessment
  const advanceQuestion = useCallback((nextIdx, newAnswers) => {
    if (nextIdx < questions.length) {
      setCurrentIndex(nextIdx);
      setCurrentSelectedOption(null);
      setTimeRemaining(QUESTION_DURATION);
      setIsTransitioning(false);
    } else {
      // Assessment Completed
      setIsCompleted(true);
      setIsTransitioning(false);
      clearCurrentTimer();
      const finishTime = new Date().toISOString();
      setEndTime(finishTime);

      // Detailed Score Calculations
      let totalCorrect = 0;
      let totalIncorrect = 0;
      let totalUnanswered = 0;
      let totalSecondsSpent = 0;

      const sectionBreakdown = {
        [SECTIONS.MATHEMATICS]: { correct: 0, total: 5, topicScores: {} },
        [SECTIONS.LOGICAL_REASONING]: { correct: 0, total: 5, topicScores: {} },
        [SECTIONS.DEVELOPER_TECHNICAL]: { correct: 0, total: 5, topicScores: {} }
      };

      questions.forEach((q) => {
        const userResp = newAnswers[q.id];
        const isAnswered = userResp && userResp.selectedOption !== null && !userResp.isTimeout;
        const isCorrect = isAnswered && userResp.selectedOption === q.correctAnswer;
        const timeSpent = userResp ? userResp.durationSpent : 60;

        totalSecondsSpent += timeSpent;

        if (isCorrect) {
          totalCorrect += 1;
          if (sectionBreakdown[q.section]) {
            sectionBreakdown[q.section].correct += 1;
          }
        } else if (isAnswered) {
          totalIncorrect += 1;
        } else {
          totalUnanswered += 1;
        }
      });

      const scorePercentage = ((totalCorrect / questions.length) * 100).toFixed(1);
      
      let performanceTier = "Needs Review";
      let statusColor = "amber";
      if (Number(scorePercentage) >= 85) {
        performanceTier = "Exceptional / Platinum Tier";
        statusColor = "emerald";
      } else if (Number(scorePercentage) >= 70) {
        performanceTier = "Qualified / Advanced";
        statusColor = "blue";
      } else if (Number(scorePercentage) >= 50) {
        performanceTier = "Proficient / Standard";
        statusColor = "slate";
      }

      // Save MCQ summary in sessionStorage for the typing and completed screen
      if (typeof window !== "undefined") {
        const resultsPayload = {
          completed: false,
          mcqCompleted: true,
          candidateInfo: candidateInfoRef.current,
          totalQuestions: questions.length,
          score: totalCorrect,
          scorePercentage: Number(scorePercentage),
          totalCorrect,
          totalIncorrect,
          totalUnanswered,
          totalSecondsSpent,
          sectionBreakdown,
          performanceTier,
          statusColor,
          answers: newAnswers,
          startTime,
          mcqEndTime: finishTime,
          tabSwitchCount: tabSwitchCount
        };
        sessionStorage.setItem("emperor_assessment_results", JSON.stringify(resultsPayload));
      }

      router.push("/typing");
    }
  }, [questions, clearCurrentTimer, startTime, tabSwitchCount, router]);

  // Handle Timeout when question timer hits 00:00
  const handleTimeout = useCallback(() => {
    if (isTransitioningRef.current || isCompletedRef.current) return;

    setIsTransitioning(true);
    clearCurrentTimer();

    const currentQ = questions[currentIndexRef.current];
    const newAnswers = {
      ...selectedAnswers,
      [currentQ.id]: {
        questionId: currentQ.id,
        selectedOption: null,
        isTimeout: true,
        durationSpent: QUESTION_DURATION,
        timestamp: new Date().toISOString()
      }
    };

    setSelectedAnswers(newAnswers);

    // Brief delay before advancing
    setTimeout(() => {
      advanceQuestion(currentIndexRef.current + 1, newAnswers);
    }, 600);
  }, [clearCurrentTimer, questions, selectedAnswers, advanceQuestion]);

  // Start/Manage per-question timer
  useEffect(() => {
    if (!isStarted || isCompleted) {
      clearCurrentTimer();
      return;
    }

    clearCurrentTimer();

    timerRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          timerRef.current = null;
          handleTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearCurrentTimer();
    };
  }, [currentIndex, isStarted, isCompleted, clearCurrentTimer, handleTimeout]);

  // Select an Answer
  const selectAnswer = useCallback((optionId) => {
    if (isTransitioning || isCompleted || !isStarted) return;

    // Lock question immediately
    setIsTransitioning(true);
    setCurrentSelectedOption(optionId);
    clearCurrentTimer();

    const spent = QUESTION_DURATION - timeRemaining;
    const currentQ = questions[currentIndex];

    const newAnswers = {
      ...selectedAnswers,
      [currentQ.id]: {
        questionId: currentQ.id,
        selectedOption: optionId,
        isTimeout: false,
        durationSpent: spent,
        timestamp: new Date().toISOString()
      }
    };

    setSelectedAnswers(newAnswers);

    // Provide feedback delay (450ms) then advance to next question
    setTimeout(() => {
      advanceQuestion(currentIndex + 1, newAnswers);
    }, 500);
  }, [isTransitioning, isCompleted, isStarted, clearCurrentTimer, timeRemaining, questions, currentIndex, selectedAnswers, advanceQuestion]);

  // Start Assessment
  const startAssessment = useCallback(() => {
    const now = new Date().toISOString();
    setIsStarted(true);
    setIsCompleted(false);
    setCurrentIndex(0);
    setSelectedAnswers({});
    setCurrentSelectedOption(null);
    setTimeRemaining(QUESTION_DURATION);
    setIsTransitioning(false);
    setStartTime(now);
    setTabSwitchCount(0);

    if (typeof window !== "undefined") {
      sessionStorage.removeItem("emperor_assessment_results");
    }

    router.push("/assessment");
  }, [router]);

  // Reset / Finish
  const resetAssessment = useCallback(() => {
    clearCurrentTimer();
    setIsStarted(false);
    setIsCompleted(false);
    setCurrentIndex(0);
    setSelectedAnswers({});
    setCurrentSelectedOption(null);
    setTimeRemaining(QUESTION_DURATION);
    setIsTransitioning(false);
    setTabSwitchCount(0);
    setSecurityAlert(false);

    if (typeof window !== "undefined") {
      sessionStorage.removeItem("emperor_assessment_results");
    }

    router.push("/");
  }, [clearCurrentTimer, router]);

  // Security & Anti-Cheating Handlers: Tab Switch & Window Blur Detection
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && isStartedRef.current && !isCompletedRef.current) {
        setTabSwitchCount((prev) => prev + 1);
        setSecurityAlert(true);
      }
    };

    const handleBeforeUnload = (e) => {
      if (isStartedRef.current && !isCompletedRef.current) {
        e.preventDefault();
        e.returnValue = "Assessment in progress. Leaving this page may invalidate your submission.";
        return e.returnValue;
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  const dismissSecurityAlert = () => {
    setSecurityAlert(false);
  };

  const value = {
    candidateInfo,
    setCandidateInfo,
    questions,
    totalQuestions: questions.length,
    currentIndex,
    currentQuestion,
    selectedAnswers,
    currentSelectedOption,
    timeRemaining,
    timerState,
    isTransitioning,
    isStarted,
    isCompleted,
    currentSection,
    sectionMetadata: SECTION_METADATA,
    tabSwitchCount,
    securityAlert,
    dismissSecurityAlert,
    selectAnswer,
    handleTimeout,
    startAssessment,
    resetAssessment
  };

  return (
    <AssessmentContext.Provider value={value}>
      {children}
    </AssessmentContext.Provider>
  );
}

export function useAssessment() {
  const context = useContext(AssessmentContext);
  if (!context) {
    throw new Error("useAssessment must be used within an AssessmentProvider");
  }
  return context;
}
