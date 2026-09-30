const { Injectable } = require('@nestjs/common');
const { PrismaService } = require('../prisma/prisma.service');

@Injectable()
class AdminService {
  constructor(prisma) {
    this.prisma = prisma;
  }

  async getDashboardStats() {
    const [
      totalCandidates,
      totalAttempts,
      completedAttempts,
      inProgressAttempts,
      totalQuestions,
      activeQuestions,
      mathCount,
      reasoningCount,
      devCount,
      recentAttempts,
      recentCandidates
    ] = await Promise.all([
      this.prisma.candidate.count(),
      this.prisma.assessmentAttempt.count(),
      this.prisma.assessmentAttempt.count({ where: { status: 'COMPLETED' } }),
      this.prisma.assessmentAttempt.count({ where: { status: 'IN_PROGRESS' } }),
      this.prisma.question.count(),
      this.prisma.question.count({ where: { isActive: true } }),
      this.prisma.question.count({ where: { section: 'MATHEMATICS', isActive: true } }),
      this.prisma.question.count({ where: { section: 'LOGICAL_REASONING', isActive: true } }),
      this.prisma.question.count({ where: { section: 'DEVELOPER_TECHNICAL', isActive: true } }),
      this.prisma.assessmentAttempt.findMany({
        take: 6,
        orderBy: { createdAt: 'desc' },
        include: { candidate: true }
      }),
      this.prisma.candidate.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' }
      })
    ]);

    // Compute average score of completed attempts
    const completedList = await this.prisma.assessmentAttempt.findMany({
      where: { status: 'COMPLETED' },
      select: { score: true, percentage: true }
    });

    let avgScore = 0;
    let avgPercentage = 0;
    if (completedList.length > 0) {
      const sumScore = completedList.reduce((acc, curr) => acc + curr.score, 0);
      avgScore = Number((sumScore / completedList.length).toFixed(1));
      avgPercentage = Number(((avgScore / 15) * 100).toFixed(1));
    }

    // Score distribution
    const scoreDistribution = {
      '0-5 (Needs Review)': completedList.filter((a) => a.score <= 5).length,
      '6-9 (Proficient)': completedList.filter((a) => a.score >= 6 && a.score <= 9).length,
      '10-12 (Advanced)': completedList.filter((a) => a.score >= 10 && a.score <= 12).length,
      '13-15 (Platinum)': completedList.filter((a) => a.score >= 13).length
    };

    return {
      success: true,
      data: {
        summary: {
          totalCandidates,
          totalAttempts,
          completedAttempts,
          inProgressAttempts,
          pendingAssessments: totalCandidates - completedAttempts,
          averageScore: avgScore,
          averagePercentage: avgPercentage,
          totalQuestions,
          activeQuestions
        },
        sectionDistribution: {
          mathematics: mathCount,
          reasoning: reasoningCount,
          developer: devCount
        },
        scoreDistribution,
        recentAttempts: recentAttempts.map((a) => ({
          id: a.id,
          candidateName: a.candidate.fullName,
          enrollmentNumber: a.candidate.enrollmentNumber,
          email: a.candidate.email,
          college: a.candidate.collegeName,
          score: a.score,
          percentage: a.percentage,
          status: a.status,
          date: a.createdAt
        })),
        recentCandidates
      }
    };
  }

  async getAuditLogs(query = {}) {
    const page = Math.max(1, parseInt(query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(query.limit, 10) || 25));
    const skip = (page - 1) * limit;

    const [total, items] = await Promise.all([
      this.prisma.auditLog.count(),
      this.prisma.auditLog.findMany({
        skip,
        take: limit,
        include: {
          admin: {
            select: { id: true, fullName: true, email: true, role: true }
          }
        },
        orderBy: { createdAt: 'desc' }
      })
    ]);

    return {
      success: true,
      data: items,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }
}

AdminService.parameters = [PrismaService];

module.exports = { AdminService };
