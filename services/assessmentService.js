import { apiRequest } from './apiClient';

export const assessmentService = {
  async getConfiguration() {
    try {
      return await apiRequest('/assessment/configuration');
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  async updateConfiguration(configData) {
    return await apiRequest('/assessment/configuration', {
      method: 'PATCH',
      body: JSON.stringify(configData)
    });
  },

  async startAttempt(candidateId) {
    try {
      return await apiRequest('/assessment/start', {
        method: 'POST',
        body: JSON.stringify({ candidateId })
      });
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  async getAttempt(attemptId) {
    return await apiRequest(`/assessment/attempt/${attemptId}`);
  },

  async submitAnswer(attemptId, questionId, answer, timeSpent) {
    return await apiRequest(`/assessment/attempt/${attemptId}/answer`, {
      method: 'POST',
      body: JSON.stringify({ questionId, answer, timeSpent })
    });
  },

  async timeoutQuestion(attemptId, questionId) {
    return await apiRequest(`/assessment/attempt/${attemptId}/timeout`, {
      method: 'POST',
      body: JSON.stringify({ questionId })
    });
  },

  async completeAttempt(attemptId, typingResult) {
    return await apiRequest(`/assessment/attempt/${attemptId}/complete`, {
      method: 'POST',
      body: JSON.stringify({ typingResult })
    });
  }
};
