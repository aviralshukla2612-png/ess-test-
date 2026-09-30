import { apiRequest } from './apiClient';
import { ASSESSMENT_QUESTIONS } from '@/data/questions';

function getStoredSubmissions() {
  if (typeof window === 'undefined') return [];
  const submissions = [];

  // Check persistent localStorage
  try {
    const raw = localStorage.getItem('emperor_all_submissions');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) submissions.push(...parsed);
    }
  } catch (e) {}

  // Check current session result
  try {
    const sessionRaw = sessionStorage.getItem('emperor_assessment_results');
    if (sessionRaw) {
      const sessionParsed = JSON.parse(sessionRaw);
      const exists = submissions.some(
        (s) => s.id === sessionParsed.id || (s.candidateInfo?.email === sessionParsed.candidateInfo?.email && s.startTime === sessionParsed.startTime)
      );
      if (!exists && sessionParsed.candidateInfo?.fullName) {
        submissions.unshift(sessionParsed);
      }
    }
  } catch (e) {}

  return submissions;
}

export const resultService = {
  async getAllResults(params = {}) {
    const query = new URLSearchParams(params).toString();
    try {
      const res = await apiRequest(`/results${query ? `?${query}` : ''}`);
      if (res.success && res.data && res.data.length > 0) {
        return res;
      }
    } catch (err) {
      // Fallback to locally stored submissions
    }

    const storedList = getStoredSubmissions();
    const formatted = storedList.map((sub, idx) => {
      const candidate = sub.candidateInfo || {};
      return {
        id: sub.id || sub.submissionId || `att_${idx + 1}`,
        candidate: {
          id: candidate.id || `cand_${idx + 1}`,
          fullName: candidate.fullName || "Candidate",
          email: candidate.email || "candidate@test.com",
          phone: candidate.phone || "—",
          enrollmentNumber: candidate.enrollmentNumber || "000101",
          collegeName: candidate.college || candidate.collegeName || "Engineering Institute",
          degree: candidate.degree || "B.Tech",
          branch: candidate.branch || "CSE",
          semester: candidate.semester || "Semester 6",
          graduationYear: candidate.graduationYear || "2025"
        },
        score: sub.score ?? 0,
        totalQuestions: sub.totalQuestions || 15,
        percentage: sub.scorePercentage ?? 0,
        status: sub.completed !== false ? "COMPLETED" : "IN_PROGRESS",
        startedAt: sub.startTime || new Date().toISOString(),
        completedAt: sub.endTime || new Date().toISOString(),
        totalSecondsSpent: sub.totalSecondsSpent || 450,
        typingResult: sub.typingResult || { wpm: 0, accuracy: 100, grade: "Standard" }
      };
    });

    return {
      success: true,
      data: formatted,
      meta: { page: 1, limit: 20, total: formatted.length, totalPages: Math.ceil(formatted.length / 20) || 1 }
    };
  },

  async getResultByAttemptId(attemptId) {
    try {
      return await apiRequest(`/results/${attemptId}`);
    } catch (err) {
      const storedList = getStoredSubmissions();
      const sub = storedList.find((s) => s.id === attemptId || s.submissionId === attemptId) || storedList[0];

      if (!sub) {
        throw new Error('Result not found');
      }

      const candidate = sub.candidateInfo || {};
      const answersMap = sub.answers || {};

      const questionResults = ASSESSMENT_QUESTIONS.map((q, idx) => {
        const userResp = answersMap[q.id];
        const isAnswered = Boolean(userResp && userResp.selectedOption !== null && !userResp.isTimeout);
        const isCorrect = isAnswered && userResp.selectedOption === q.correctAnswer;
        const isTimeout = Boolean(userResp?.isTimeout);

        return {
          questionIndex: idx + 1,
          questionId: q.id,
          section: q.section,
          topic: q.topic,
          question: q.question,
          options: q.options,
          candidateAnswer: userResp ? userResp.selectedOption : (isTimeout ? null : "Unanswered"),
          correctAnswer: q.correctAnswer,
          isCorrect,
          isTimeout,
          timeSpent: userResp ? userResp.durationSpent : 60
        };
      });

      return {
        success: true,
        data: {
          attemptId: attemptId,
          candidate,
          status: "COMPLETED",
          score: sub.score ?? 0,
          totalQuestions: 15,
          percentage: sub.scorePercentage ?? 0,
          startedAt: sub.startTime,
          completedAt: sub.endTime,
          totalSecondsSpent: sub.totalSecondsSpent || 450,
          sectionBreakdown: sub.sectionBreakdown || {
            MATHEMATICS: { correct: 0, total: 5 },
            LOGICAL_REASONING: { correct: 0, total: 5 },
            DEVELOPER_TECHNICAL: { correct: 0, total: 5 }
          },
          questionResults,
          typingResult: sub.typingResult || { wpm: 0, accuracy: 100, grade: "Standard" }
        }
      };
    }
  },

  async getResultsByCandidateId(candidateId) {
    return await apiRequest(`/results/candidate/${candidateId}`);
  }
};
