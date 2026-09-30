const { Injectable, NotFoundException } = require('@nestjs/common');
const { PrismaService } = require('../prisma/prisma.service');

@Injectable()
class ResultsService {
  constructor(prisma) {
    this.prisma = prisma;
  }

  // Find all results with pagination, filters, and search
  async findAll(query = {}) {
    const page = Math.max(1, parseInt(query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(query.limit, 10) || 20));
    const skip = (page - 1) * limit;

    const where = {};
    if (query.status) {
      where.status = query.status.toUpperCase();
    }
    if (query.search) {
      where.candidate = {
        OR: [
          { fullName: { contains: query.search } },
          { email: { contains: query.search } },
          { enrollmentNumber: { contains: query.search } },
          { collegeName: { contains: query.search } }
        ]
      };
    }

    const [total, items] = await Promise.all([
      this.prisma.assessmentAttempt.count({ where }),
      this.prisma.assessmentAttempt.findMany({
        where,
        skip,
        take: limit,
        include: {
          candidate: true
        },
        orderBy: { createdAt: 'desc' }
      })
    ]);

    const formatted = items.map((attempt) => {
      let typingResult = null;
      if (attempt.typingResultJson) {
        try {
          typingResult = JSON.parse(attempt.typingResultJson);
        } catch (e) {
          typingResult = null;
        }
      }

      return {
        id: attempt.id,
        candidate: {
          id: attempt.candidate.id,
          fullName: attempt.candidate.fullName,
          email: attempt.candidate.email,
          phone: attempt.candidate.phone,
          enrollmentNumber: attempt.candidate.enrollmentNumber,
          collegeName: attempt.candidate.collegeName,
          degree: attempt.candidate.degree,
          branch: attempt.candidate.branch,
          semester: attempt.candidate.semester,
          graduationYear: attempt.candidate.graduationYear
        },
        score: attempt.score,
        totalQuestions: 15,
        percentage: attempt.percentage,
        status: attempt.status,
        startedAt: attempt.startedAt,
        completedAt: attempt.completedAt,
        totalSecondsSpent: attempt.totalSecondsSpent,
        typingResult
      };
    });

    return {
      success: true,
      data: formatted,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  // Get detailed question-by-question result for an attempt
  async findByAttemptId(attemptId) {
    const attempt = await this.prisma.assessmentAttempt.findUnique({
      where: { id: attemptId },
      include: {
        candidate: true,
        answers: {
          include: {
            question: true
          },
          orderBy: { answeredAt: 'asc' }
        }
      }
    });

    if (!attempt) {
      throw new NotFoundException(`Result with Attempt ID ${attemptId} not found`);
    }

    let snapshot = [];
    try {
      snapshot = JSON.parse(attempt.snapshotQuestions || '[]');
    } catch (e) {
      snapshot = [];
    }

    let typingResult = null;
    if (attempt.typingResultJson) {
      try {
        typingResult = JSON.parse(attempt.typingResultJson);
      } catch (e) {
        typingResult = null;
      }
    }

    // Calculate section breakdown
    const sectionBreakdown = {
      MATHEMATICS: { correct: 0, total: 5, answered: 0 },
      LOGICAL_REASONING: { correct: 0, total: 5, answered: 0 },
      DEVELOPER_TECHNICAL: { correct: 0, total: 5, answered: 0 }
    };

    const questionResults = snapshot.map((sq, idx) => {
      const ans = attempt.answers.find((a) => a.questionId === sq.id);
      const isAnswered = Boolean(ans && !ans.isTimeout);
      const isCorrect = Boolean(ans && ans.isCorrect);

      if (sectionBreakdown[sq.section]) {
        if (isAnswered) sectionBreakdown[sq.section].answered += 1;
        if (isCorrect) sectionBreakdown[sq.section].correct += 1;
      }

      return {
        questionIndex: idx + 1,
        questionId: sq.id,
        section: sq.section,
        topic: sq.topic,
        question: sq.question,
        options: sq.options,
        candidateAnswer: ans ? ans.selectedAnswer : null,
        correctAnswer: ans ? ans.correctAnswer : null,
        isCorrect: isCorrect,
        isTimeout: ans ? ans.isTimeout : false,
        timeSpent: ans ? ans.timeSpent : 60
      };
    });

    return {
      success: true,
      data: {
        attemptId: attempt.id,
        candidate: attempt.candidate,
        status: attempt.status,
        score: attempt.score,
        totalQuestions: snapshot.length || 15,
        percentage: attempt.percentage,
        startedAt: attempt.startedAt,
        completedAt: attempt.completedAt,
        totalSecondsSpent: attempt.totalSecondsSpent,
        sectionBreakdown,
        questionResults,
        typingResult
      }
    };
  }

  // Get results by candidate ID
  async findByCandidateId(candidateId) {
    const attempts = await this.prisma.assessmentAttempt.findMany({
      where: { candidateId },
      include: { answers: true },
      orderBy: { createdAt: 'desc' }
    });

    return {
      success: true,
      data: attempts
    };
  }
}

ResultsService.parameters = [PrismaService];

module.exports = { ResultsService };
