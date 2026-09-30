const { Injectable, BadRequestException, NotFoundException, ForbiddenException } = require('@nestjs/common');
const { PrismaService } = require('../prisma/prisma.service');

const QUESTION_DURATION = 60; // 60 seconds per question
const SERVER_GRACE_PERIOD = 4; // 4 seconds network latency grace period

@Injectable()
class AssessmentsService {
  constructor(prisma) {
    this.prisma = prisma;
  }

  // Get active assessment configuration
  async getConfiguration() {
    let config = await this.prisma.assessmentConfiguration.findFirst({
      where: { isActive: true },
      orderBy: { version: 'desc' }
    });

    if (!config) {
      // Fallback: create default configuration from first 15 questions
      const math = await this.prisma.question.findMany({
        where: { section: 'MATHEMATICS', isActive: true },
        take: 5
      });
      const reasoning = await this.prisma.question.findMany({
        where: { section: 'LOGICAL_REASONING', isActive: true },
        take: 5
      });
      const dev = await this.prisma.question.findMany({
        where: { section: 'DEVELOPER_TECHNICAL', isActive: true },
        take: 5
      });

      config = await this.prisma.assessmentConfiguration.create({
        data: {
          version: 1,
          name: 'Emperor Pre-Employment Evaluation',
          isActive: true,
          mathQuestionIds: JSON.stringify(math.map((q) => q.id)),
          reasoningQuestionIds: JSON.stringify(reasoning.map((q) => q.id)),
          developerQuestionIds: JSON.stringify(dev.map((q) => q.id)),
          totalQuestions: 15
        }
      });
    }

    // Populate question details for admin UI
    const mathIds = JSON.parse(config.mathQuestionIds || '[]');
    const reasoningIds = JSON.parse(config.reasoningQuestionIds || '[]');
    const devIds = JSON.parse(config.developerQuestionIds || '[]');

    const allIds = [...mathIds, ...reasoningIds, ...devIds];
    const questions = await this.prisma.question.findMany({
      where: { id: { in: allIds } }
    });

    const questionMap = new Map(questions.map((q) => [q.id, q]));

    const formatQuestion = (id) => {
      const q = questionMap.get(id);
      if (!q) return null;
      let options = [];
      try {
        options = JSON.parse(q.optionsJson);
      } catch (e) {
        options = [];
      }
      return { ...q, options };
    };

    return {
      success: true,
      data: {
        id: config.id,
        version: config.version,
        name: config.name,
        isActive: config.isActive,
        totalQuestions: config.totalQuestions,
        mathQuestions: mathIds.map(formatQuestion).filter(Boolean),
        reasoningQuestions: reasoningIds.map(formatQuestion).filter(Boolean),
        developerQuestions: devIds.map(formatQuestion).filter(Boolean)
      }
    };
  }

  // Update assessment configuration (Enforces strictly 5 Math, 5 Reasoning, 5 Tech)
  async updateConfiguration(dto, adminId = null) {
    const { name, mathQuestionIds, reasoningQuestionIds, developerQuestionIds } = dto;

    if (!Array.isArray(mathQuestionIds) || mathQuestionIds.length !== 5) {
      throw new BadRequestException('Mathematics section must have exactly 5 questions');
    }
    if (!Array.isArray(reasoningQuestionIds) || reasoningQuestionIds.length !== 5) {
      throw new BadRequestException('Logical Reasoning section must have exactly 5 questions');
    }
    if (!Array.isArray(developerQuestionIds) || developerQuestionIds.length !== 5) {
      throw new BadRequestException('Developer / Technical section must have exactly 5 questions');
    }

    // Verify all IDs exist in database and match their sections
    const allIds = [...mathQuestionIds, ...reasoningQuestionIds, ...developerQuestionIds];
    const questions = await this.prisma.question.findMany({
      where: { id: { in: allIds } }
    });

    if (questions.length !== 15) {
      throw new BadRequestException('One or more selected question IDs do not exist in the Question Bank');
    }

    // Create a new version
    const latest = await this.prisma.assessmentConfiguration.findFirst({
      orderBy: { version: 'desc' }
    });
    const nextVersion = latest ? latest.version + 1 : 1;

    // Deactivate prior versions
    await this.prisma.assessmentConfiguration.updateMany({
      data: { isActive: false }
    });

    const newConfig = await this.prisma.assessmentConfiguration.create({
      data: {
        version: nextVersion,
        name: name || `Assessment Version ${nextVersion}`,
        isActive: true,
        mathQuestionIds: JSON.stringify(mathQuestionIds),
        reasoningQuestionIds: JSON.stringify(reasoningQuestionIds),
        developerQuestionIds: JSON.stringify(developerQuestionIds),
        totalQuestions: 15
      }
    });

    if (adminId) {
      await this.prisma.auditLog.create({
        data: {
          adminId,
          action: 'ASSESSMENT_CONFIGURED',
          entityType: 'AssessmentConfiguration',
          entityId: newConfig.id,
          metadata: JSON.stringify({ version: nextVersion, totalQuestions: 15 })
        }
      });
    }

    return {
      success: true,
      data: newConfig,
      message: `Active Assessment updated to Version ${nextVersion} (15 Questions Locked)`
    };
  }

  // Start Assessment Attempt for Candidate
  async startAttempt(candidateId) {
    const candidate = await this.prisma.candidate.findUnique({
      where: { id: candidateId }
    });
    if (!candidate) {
      throw new BadRequestException('Candidate record not found. Please register first.');
    }

    // Check if candidate already has an active or completed attempt
    const existingAttempt = await this.prisma.assessmentAttempt.findFirst({
      where: {
        candidateId,
        status: { in: ['IN_PROGRESS', 'COMPLETED'] }
      },
      orderBy: { createdAt: 'desc' }
    });

    if (existingAttempt && existingAttempt.status === 'COMPLETED') {
      return {
        success: true,
        alreadyCompleted: true,
        data: { attemptId: existingAttempt.id }
      };
    }

    // Get active configuration snapshot
    const configRes = await this.getConfiguration();
    const config = configRes.data;

    const orderedQuestions = [
      ...config.mathQuestions,
      ...config.reasoningQuestions,
      ...config.developerQuestions
    ];

    if (orderedQuestions.length !== 15) {
      throw new BadRequestException('Active assessment configuration is incomplete. Contact administrator.');
    }

    // Snapshot questions (include options and topics, omit correct answer)
    const sanitizedSnapshot = orderedQuestions.map((q, idx) => ({
      index: idx,
      id: q.id,
      section: q.section,
      topic: q.topic,
      question: q.question,
      options: q.options,
      timeLimit: q.timeLimit || 60
    }));

    const now = new Date();

    const attempt = await this.prisma.assessmentAttempt.create({
      data: {
        candidateId: candidate.id,
        assessmentVersion: config.version,
        snapshotQuestions: JSON.stringify(sanitizedSnapshot),
        currentQuestionIndex: 0,
        startedAt: now,
        questionStartedAt: now,
        status: 'IN_PROGRESS',
        score: 0,
        percentage: 0.0
      }
    });

    return {
      success: true,
      data: {
        attemptId: attempt.id,
        candidateInfo: candidate,
        totalQuestions: 15,
        currentQuestionIndex: 0,
        currentQuestion: sanitizedSnapshot[0],
        startedAt: attempt.startedAt
      },
      message: 'Assessment attempt initiated successfully'
    };
  }

  // Get current attempt state
  async getAttempt(attemptId) {
    const attempt = await this.prisma.assessmentAttempt.findUnique({
      where: { id: attemptId },
      include: {
        candidate: true,
        answers: true
      }
    });

    if (!attempt) {
      throw new NotFoundException('Assessment attempt not found');
    }

    let snapshot = [];
    try {
      snapshot = JSON.parse(attempt.snapshotQuestions);
    } catch (e) {
      snapshot = [];
    }

    const currentIdx = attempt.currentQuestionIndex;
    const currentQ = snapshot[currentIdx] || null;

    // Calculate server remaining time
    const now = Date.now();
    const qStarted = new Date(attempt.questionStartedAt).getTime();
    const elapsedSeconds = Math.floor((now - qStarted) / 1000);
    const serverRemainingTime = Math.max(0, QUESTION_DURATION - elapsedSeconds);

    return {
      success: true,
      data: {
        id: attempt.id,
        status: attempt.status,
        candidate: attempt.candidate,
        currentQuestionIndex: currentIdx,
        totalQuestions: snapshot.length,
        currentQuestion: currentQ,
        serverRemainingTime,
        score: attempt.score,
        tabSwitchCount: attempt.tabSwitchCount,
        isCompleted: attempt.status === 'COMPLETED'
      }
    };
  }

  // Submit Question Answer (Server-side Timer & Correctness Verification)
  async submitAnswer(attemptId, questionId, selectedAnswer, clientTimeSpent = 0) {
    const attempt = await this.prisma.assessmentAttempt.findUnique({
      where: { id: attemptId },
      include: { answers: true }
    });

    if (!attempt || attempt.status !== 'IN_PROGRESS') {
      throw new ForbiddenException('Assessment attempt is not in progress or has been finalized');
    }

    // Verify question belongs to attempt
    let snapshot = [];
    try {
      snapshot = JSON.parse(attempt.snapshotQuestions);
    } catch (e) {
      snapshot = [];
    }

    const currentQ = snapshot[attempt.currentQuestionIndex];
    if (!currentQ || currentQ.id !== questionId) {
      throw new BadRequestException('Submitting answer for an invalid or out-of-sequence question');
    }

    // Check if question was already answered
    const alreadyAnswered = attempt.answers.some((a) => a.questionId === questionId);
    if (alreadyAnswered) {
      throw new BadRequestException('This question has already been submitted');
    }

    // Server-side timing check
    const now = new Date();
    const qStarted = new Date(attempt.questionStartedAt).getTime();
    const elapsedSeconds = Math.floor((now.getTime() - qStarted) / 1000);
    const isTimeout = elapsedSeconds > (QUESTION_DURATION + SERVER_GRACE_PERIOD);

    // Retrieve real correct answer from database
    const realQuestion = await this.prisma.question.findUnique({
      where: { id: questionId }
    });
    if (!realQuestion) {
      throw new NotFoundException('Question not found');
    }

    // Determine correctness server-side
    let isCorrect = false;
    if (!isTimeout && selectedAnswer) {
      const normalizedSelected = String(selectedAnswer).trim().toLowerCase();
      const normalizedCorrect = String(realQuestion.correctAnswer).trim().toLowerCase();
      isCorrect = normalizedSelected === normalizedCorrect;
    }

    const timeSpent = isTimeout ? QUESTION_DURATION : Math.min(QUESTION_DURATION, Math.max(1, elapsedSeconds));

    // Record answer in database
    await this.prisma.assessmentAnswer.create({
      data: {
        attemptId: attempt.id,
        questionId: currentQ.id,
        selectedAnswer: isTimeout ? null : String(selectedAnswer || ''),
        correctAnswer: realQuestion.correctAnswer,
        isCorrect,
        timeSpent,
        isTimeout,
        answeredAt: now
      }
    });

    const nextIndex = attempt.currentQuestionIndex + 1;
    const isFinished = nextIndex >= snapshot.length;
    const newScore = isCorrect ? attempt.score + 1 : attempt.score;
    const totalSpent = attempt.totalSecondsSpent + timeSpent;

    const updated = await this.prisma.assessmentAttempt.update({
      where: { id: attempt.id },
      data: {
        currentQuestionIndex: nextIndex,
        questionStartedAt: now,
        score: newScore,
        totalSecondsSpent: totalSpent,
        status: isFinished ? 'COMPLETED' : 'IN_PROGRESS',
        completedAt: isFinished ? now : null,
        percentage: Number(((newScore / snapshot.length) * 100).toFixed(1))
      }
    });

    return {
      success: true,
      data: {
        isFinished,
        nextQuestionIndex: nextIndex,
        nextQuestion: isFinished ? null : snapshot[nextIndex]
      },
      message: isFinished ? 'All 15 assessment questions completed' : 'Answer recorded'
    };
  }

  // Handle Question Timeout at 00:00
  async handleTimeout(attemptId, questionId) {
    return this.submitAnswer(attemptId, questionId, null, QUESTION_DURATION);
  }

  // Complete Assessment with Typing Metrics
  async completeAttempt(attemptId, typingResult) {
    const attempt = await this.prisma.assessmentAttempt.findUnique({
      where: { id: attemptId }
    });
    if (!attempt) {
      throw new NotFoundException('Assessment attempt not found');
    }

    const updated = await this.prisma.assessmentAttempt.update({
      where: { id: attemptId },
      data: {
        status: 'COMPLETED',
        completedAt: new Date(),
        typingResultJson: typingResult ? JSON.stringify(typingResult) : null
      }
    });

    return {
      success: true,
      data: updated,
      message: 'Assessment finalized and composite score calculated'
    };
  }
}

AssessmentsService.parameters = [PrismaService];

module.exports = { AssessmentsService };
