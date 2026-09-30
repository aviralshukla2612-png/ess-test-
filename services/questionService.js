import { apiRequest } from './apiClient';
import { ASSESSMENT_QUESTIONS } from '@/data/questions';

export const questionService = {
  async getAllQuestions(params = {}) {
    const query = new URLSearchParams(params).toString();
    try {
      return await apiRequest(`/questions${query ? `?${query}` : ''}`);
    } catch (err) {
      // Fallback with static question bank
      return {
        success: true,
        data: ASSESSMENT_QUESTIONS,
        meta: { page: 1, limit: 20, total: ASSESSMENT_QUESTIONS.length, totalPages: 1 }
      };
    }
  },

  async getQuestionById(id) {
    try {
      return await apiRequest(`/questions/${id}`);
    } catch (err) {
      const found = ASSESSMENT_QUESTIONS.find((q) => q.id === id || q.id === Number(id));
      if (found) return { success: true, data: found };
      throw err;
    }
  },

  async createQuestion(questionData) {
    return await apiRequest('/questions', {
      method: 'POST',
      body: JSON.stringify(questionData)
    });
  },

  async updateQuestion(id, questionData) {
    return await apiRequest(`/questions/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(questionData)
    });
  },

  async duplicateQuestion(id) {
    return await apiRequest(`/questions/${id}/duplicate`, {
      method: 'POST'
    });
  },

  async deleteQuestion(id) {
    return await apiRequest(`/questions/${id}`, {
      method: 'DELETE'
    });
  },

  async bulkImport(questions) {
    return await apiRequest('/questions/import', {
      method: 'POST',
      body: JSON.stringify({ questions })
    });
  },

  async exportQuestions(params = {}) {
    const query = new URLSearchParams(params).toString();
    try {
      return await apiRequest(`/questions/export${query ? `?${query}` : ''}`);
    } catch (err) {
      return {
        success: true,
        data: ASSESSMENT_QUESTIONS,
        count: ASSESSMENT_QUESTIONS.length
      };
    }
  }
};
