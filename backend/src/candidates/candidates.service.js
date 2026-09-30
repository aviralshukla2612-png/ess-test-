const { Injectable, BadRequestException, NotFoundException } = require('@nestjs/common');
const { PrismaService } = require('../prisma/prisma.service');

@Injectable()
class CandidatesService {
  constructor(prisma) {
    this.prisma = prisma;
  }

  // Generate strictly sequential ESS Enrollment Number starting with 000101
  async generateNextEnrollmentNumber() {
    const totalCandidates = await this.prisma.candidate.count();
    const nextSeq = 101 + totalCandidates;
    const formatted = String(nextSeq).padStart(6, '0');

    // Double check uniqueness
    const existing = await this.prisma.candidate.findUnique({
      where: { enrollmentNumber: formatted }
    });

    if (existing) {
      const randomSuffix = Math.floor(100 + Math.random() * 900);
      return `0001${randomSuffix}`;
    }

    return formatted;
  }

  // Register Candidate
  async register(data) {
    const {
      fullName,
      email,
      phone,
      collegeName,
      university,
      degree,
      branch,
      semester,
      graduationYear,
      cgpa
    } = data;

    // Validations
    if (!fullName || fullName.trim().length < 2) {
      throw new BadRequestException('Full name is required (at least 2 characters)');
    }

    if (!email || !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email.trim())) {
      throw new BadRequestException('A valid email address is required');
    }

    const cleanPhone = String(phone || '').replace(/\D/g, '');
    if (cleanPhone.length !== 10) {
      throw new BadRequestException('Phone number must be exactly 10 digits');
    }

    if (!collegeName || !university || !degree || !branch || !semester || !graduationYear) {
      throw new BadRequestException('All academic fields are required');
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check if candidate already exists
    let candidate = await this.prisma.candidate.findUnique({
      where: { email: normalizedEmail },
      include: {
        attempts: {
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      }
    });

    if (candidate) {
      // Update details if needed
      candidate = await this.prisma.candidate.update({
        where: { id: candidate.id },
        data: {
          fullName: fullName.trim(),
          phone: cleanPhone,
          collegeName: collegeName.trim(),
          university: university.trim(),
          degree,
          branch,
          semester,
          graduationYear,
          cgpa: cgpa ? String(cgpa).trim() : null
        },
        include: {
          attempts: {
            orderBy: { createdAt: 'desc' },
            take: 1
          }
        }
      });

      return {
        success: true,
        data: candidate,
        message: 'Candidate profile retrieved & updated'
      };
    }

    // Generate unique sequential Enrollment Number starting with 000101
    const enrollmentNumber = data.enrollmentNumber || (await this.generateNextEnrollmentNumber());
    const candidateId = `ESS-${Math.floor(100000 + Math.random() * 900000)}`;

    candidate = await this.prisma.candidate.create({
      data: {
        enrollmentNumber,
        candidateId,
        fullName: fullName.trim(),
        email: normalizedEmail,
        phone: cleanPhone,
        collegeName: collegeName.trim(),
        university: university.trim(),
        degree,
        branch,
        semester,
        graduationYear,
        cgpa: cgpa ? String(cgpa).trim() : null
      }
    });

    return {
      success: true,
      data: candidate,
      message: 'Candidate registered successfully'
    };
  }

  // Find all candidates with pagination, search, and filters
  async findAll(query = {}) {
    const page = Math.max(1, parseInt(query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(query.limit, 10) || 20));
    const skip = (page - 1) * limit;

    const where = {};
    if (query.search) {
      where.OR = [
        { fullName: { contains: query.search } },
        { email: { contains: query.search } },
        { enrollmentNumber: { contains: query.search } },
        { collegeName: { contains: query.search } }
      ];
    }

    if (query.status) {
      where.attempts = {
        some: {
          status: query.status.toUpperCase()
        }
      };
    }

    const [total, items] = await Promise.all([
      this.prisma.candidate.count({ where }),
      this.prisma.candidate.findMany({
        where,
        skip,
        take: limit,
        include: {
          attempts: {
            orderBy: { createdAt: 'desc' },
            take: 1
          }
        },
        orderBy: { createdAt: 'desc' }
      })
    ]);

    const formatted = items.map((c) => {
      const latestAttempt = c.attempts && c.attempts[0] ? c.attempts[0] : null;
      let typingMetrics = null;
      if (latestAttempt && latestAttempt.typingResultJson) {
        try {
          typingMetrics = JSON.parse(latestAttempt.typingResultJson);
        } catch (e) {
          typingMetrics = null;
        }
      }

      return {
        id: c.id,
        enrollmentNumber: c.enrollmentNumber,
        candidateId: c.candidateId,
        fullName: c.fullName,
        email: c.email,
        phone: c.phone,
        collegeName: c.collegeName,
        university: c.university,
        degree: c.degree,
        branch: c.branch,
        semester: c.semester,
        graduationYear: c.graduationYear,
        cgpa: c.cgpa,
        createdAt: c.createdAt,
        latestAttempt: latestAttempt
          ? {
              id: latestAttempt.id,
              status: latestAttempt.status,
              score: latestAttempt.score,
              percentage: latestAttempt.percentage,
              startedAt: latestAttempt.startedAt,
              completedAt: latestAttempt.completedAt,
              typingMetrics
            }
          : null
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

  // Find candidate by ID
  async findOne(id) {
    const candidate = await this.prisma.candidate.findUnique({
      where: { id },
      include: {
        attempts: {
          include: {
            answers: {
              include: {
                question: true
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!candidate) {
      throw new NotFoundException(`Candidate with ID ${id} not found`);
    }

    return {
      success: true,
      data: candidate
    };
  }

  // Delete candidate
  async delete(id) {
    const existing = await this.prisma.candidate.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`Candidate with ID ${id} not found`);
    }

    await this.prisma.candidate.delete({ where: { id } });

    return {
      success: true,
      message: 'Candidate and associated attempts deleted successfully'
    };
  }
}

CandidatesService.parameters = [PrismaService];

module.exports = { CandidatesService };
