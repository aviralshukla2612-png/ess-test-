import { apiRequest } from './apiClient';

function getStoredCandidates() {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem('emperor_all_candidates');
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function saveStoredCandidates(candidates) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('emperor_all_candidates', JSON.stringify(candidates));
  } catch (e) {
    console.error(e);
  }
}

export const candidateService = {
  async register(candidateData) {
    const localId = candidateData.id || `cand_${Date.now()}`;
    const newCandidate = {
      id: localId,
      candidateId: candidateData.candidateId || `ESS-${Math.floor(100000 + Math.random() * 900000)}`,
      createdAt: new Date().toISOString(),
      ...candidateData
    };

    // Always update local registry
    const current = getStoredCandidates();
    const existingIdx = current.findIndex((c) => c.email === candidateData.email || c.id === candidateData.id);
    if (existingIdx >= 0) {
      current[existingIdx] = { ...current[existingIdx], ...newCandidate };
    } else {
      current.unshift(newCandidate);
    }
    saveStoredCandidates(current);

    try {
      const res = await apiRequest('/candidates', {
        method: 'POST',
        body: JSON.stringify(candidateData)
      });
      return res;
    } catch (err) {
      return {
        success: true,
        data: newCandidate
      };
    }
  },

  async getNextEnrollmentNumber() {
    try {
      return await apiRequest('/candidates/next-enrollment-number');
    } catch (err) {
      const stored = typeof window !== 'undefined' ? localStorage.getItem('ess_enroll_sequence') : null;
      const nextSeq = stored ? parseInt(stored, 10) : 101;
      return {
        success: true,
        data: { enrollmentNumber: String(nextSeq).padStart(6, '0') }
      };
    }
  },

  async getAllCandidates(params = {}) {
    const query = new URLSearchParams(params).toString();
    try {
      const res = await apiRequest(`/candidates${query ? `?${query}` : ''}`);
      if (res.success && res.data && res.data.length > 0) {
        return res;
      }
    } catch (err) {
      // Use stored candidates fallback
    }

    let candidates = getStoredCandidates();

    // Also enrich with any submission results
    if (typeof window !== 'undefined') {
      try {
        const subRaw = localStorage.getItem('emperor_all_submissions');
        const submissions = subRaw ? JSON.parse(subRaw) : [];
        candidates = candidates.map((cand) => {
          const sub = submissions.find(
            (s) => s.candidateInfo?.email === cand.email || s.candidateInfo?.enrollmentNumber === cand.enrollmentNumber
          );
          if (sub) {
            return {
              ...cand,
              latestAttempt: {
                id: sub.id || sub.submissionId,
                status: 'COMPLETED',
                score: sub.score,
                percentage: sub.scorePercentage,
                typingMetrics: sub.typingResult
              }
            };
          }
          return cand;
        });
      } catch (e) {}
    }

    if (params.search) {
      const q = params.search.toLowerCase();
      candidates = candidates.filter(
        (c) =>
          c.fullName?.toLowerCase().includes(q) ||
          c.email?.toLowerCase().includes(q) ||
          c.enrollmentNumber?.toLowerCase().includes(q) ||
          c.collegeName?.toLowerCase().includes(q)
      );
    }

    return {
      success: true,
      data: candidates,
      meta: { page: 1, limit: 20, total: candidates.length, totalPages: Math.ceil(candidates.length / 20) || 1 }
    };
  },

  async getCandidateById(id) {
    try {
      return await apiRequest(`/candidates/${id}`);
    } catch (err) {
      const candidates = getStoredCandidates();
      const found = candidates.find((c) => c.id === id);
      if (found) {
        return { success: true, data: found };
      }
      throw new Error('Candidate not found');
    }
  },

  async deleteCandidate(id) {
    const current = getStoredCandidates();
    saveStoredCandidates(current.filter((c) => c.id !== id));
    try {
      return await apiRequest(`/candidates/${id}`, { method: 'DELETE' });
    } catch (err) {
      return { success: true, message: 'Candidate deleted' };
    }
  }
};
