const { Injectable, BadRequestException, NotFoundException } = require('@nestjs/common');
const { PrismaService } = require('../prisma/prisma.service');

const VALID_SECTIONS = ['MATHEMATICS', 'LOGICAL_REASONING', 'DEVELOPER_TECHNICAL'];
const VALID_DIFFICULTIES = ['EASY', 'MEDIUM', 'HARD'];

@Injectable()
class QuestionsService {
  constructor(prisma) {
    this.prisma = prisma;
  }

  // Validate Question DTO / JSON structure
  validateQuestionPayload(data) {
    const errors = [];
    if (!data.section || !VALID_SECTIONS.includes(data.section.toUpperCase())) {
      errors.push(`Invalid section '${data.section}'. Must be one of: ${VALID_SECTIONS.join(', ')}`);
    }

    if (!data.question || typeof data.question !== 'string' || data.question.trim().length === 0) {
      errors.push('Question text is required and cannot be empty');
    }

    let options = data.options;
    if (typeof options === 'string') {
      try {
        options = JSON.parse(options);
      } catch (e) {
        errors.push('Options must be a valid JSON array');
      }
    }

    if (!Array.isArray(options) || options.length !== 4) {
      errors.push('Exactly 4 options are required');
    } else {
      // Normalize options
      const optionTexts = options.map((opt) => (typeof opt === 'object' && opt !== null ? opt.text : String(opt)).trim());
      if (optionTexts.some((t) => !t || t.length === 0)) {
        errors.push('All 4 options must be non-empty strings');
      }
      const uniqueTexts = new Set(optionTexts.map((t) => t.toLowerCase()));
      if (uniqueTexts.size !== 4) {
        errors.push('All 4 options must be distinct and unique');
      }

      if (!data.correctAnswer) {
        errors.push('Correct answer is required');
      } else {
        const normalizedCorrect = String(data.correctAnswer).trim();
        const validMatch =
          optionTexts.includes(normalizedCorrect) ||
          ['A', 'B', 'C', 'D'].includes(normalizedCorrect.toUpperCase()) ||
          options.some((o) => typeof o === 'object' && o && o.id === normalizedCorrect.toUpperCase());

        if (!validMatch) {
          errors.push(`Correct answer '${normalizedCorrect}' must match one of the 4 options or an option ID (A, B, C, D)`);
        }
      }
    }

    if (data.difficulty && !VALID_DIFFICULTIES.includes(data.difficulty.toUpperCase())) {
      errors.push(`Difficulty must be one of: ${VALID_DIFFICULTIES.join(', ')}`);
    }

    if (data.timeLimit && (isNaN(data.timeLimit) || Number(data.timeLimit) <= 0)) {
      errors.push('Time limit must be a positive integer in seconds');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Format options consistently into [{id: "A", text: "..."}, ...]
  formatOptions(optionsInput) {
    let raw = optionsInput;
    if (typeof raw === 'string') {
      try {
        raw = JSON.parse(raw);
      } catch (e) {
        raw = [];
      }
    }
    if (!Array.isArray(raw)) return JSON.stringify([]);

    const letters = ['A', 'B', 'C', 'D'];
    const formatted = raw.map((opt, idx) => {
      if (typeof opt === 'object' && opt !== null && opt.text !== undefined) {
        return {
          id: opt.id || letters[idx] || `OPT_${idx + 1}`,
          text: String(opt.text).trim()
        };
      }
      return {
        id: letters[idx] || `OPT_${idx + 1}`,
        text: String(opt).trim()
      };
    });

    return JSON.stringify(formatted);
  }

  // Find all questions with pagination and filters
  async findAll(query = {}) {
    const page = Math.max(1, parseInt(query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(query.limit, 10) || 20));
    const skip = (page - 1) * limit;

    const where = {};
    if (query.section) {
      where.section = query.section.toUpperCase();
    }
    if (query.difficulty) {
      where.difficulty = query.difficulty.toUpperCase();
    }
    if (query.isActive !== undefined && query.isActive !== '') {
      where.isActive = query.isActive === 'true' || query.isActive === true;
    }
    if (query.search) {
      where.OR = [
        { question: { contains: query.search } },
        { topic: { contains: query.search } }
      ];
    }

    const [total, items] = await Promise.all([
      this.prisma.question.count({ where }),
      this.prisma.question.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      })
    ]);

    const formattedItems = items.map((q) => {
      let parsedOptions = [];
      try {
        parsedOptions = JSON.parse(q.optionsJson);
      } catch (e) {
        parsedOptions = [];
      }
      return {
        ...q,
        options: parsedOptions
      };
    });

    return {
      success: true,
      data: formattedItems,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  // Find single question
  async findOne(id) {
    const question = await this.prisma.question.findUnique({
      where: { id }
    });
    if (!question) {
      throw new NotFoundException(`Question with ID ${id} not found`);
    }

    let parsedOptions = [];
    try {
      parsedOptions = JSON.parse(question.optionsJson);
    } catch (e) {
      parsedOptions = [];
    }

    return {
      success: true,
      data: {
        ...question,
        options: parsedOptions
      }
    };
  }

  // Create single question
  async create(data, adminId = null) {
    const validation = this.validateQuestionPayload(data);
    if (!validation.isValid) {
      throw new BadRequestException({
        message: 'Question validation failed',
        errors: validation.errors
      });
    }

    const optionsJson = this.formatOptions(data.options);
    const created = await this.prisma.question.create({
      data: {
        section: data.section.toUpperCase(),
        topic: data.topic ? data.topic.trim() : null,
        question: data.question.trim(),
        optionsJson,
        correctAnswer: String(data.correctAnswer).trim(),
        difficulty: data.difficulty ? data.difficulty.toUpperCase() : 'MEDIUM',
        timeLimit: parseInt(data.timeLimit, 10) || 60,
        isActive: data.isActive !== undefined ? Boolean(data.isActive) : true
      }
    });

    // Record Audit Log
    if (adminId) {
      await this.prisma.auditLog.create({
        data: {
          adminId,
          action: 'QUESTION_CREATED',
          entityType: 'Question',
          entityId: created.id,
          metadata: JSON.stringify({ section: created.section, difficulty: created.difficulty })
        }
      });
    }

    return {
      success: true,
      data: created,
      message: 'Question created successfully'
    };
  }

  // Update question
  async update(id, data, adminId = null) {
    const existing = await this.prisma.question.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`Question with ID ${id} not found`);
    }

    const merged = { ...existing, ...data };
    const validation = this.validateQuestionPayload(merged);
    if (!validation.isValid) {
      throw new BadRequestException({
        message: 'Question update validation failed',
        errors: validation.errors
      });
    }

    const updateData = {};
    if (data.section) updateData.section = data.section.toUpperCase();
    if (data.topic !== undefined) updateData.topic = data.topic ? data.topic.trim() : null;
    if (data.question) updateData.question = data.question.trim();
    if (data.options) updateData.optionsJson = this.formatOptions(data.options);
    if (data.correctAnswer) updateData.correctAnswer = String(data.correctAnswer).trim();
    if (data.difficulty) updateData.difficulty = data.difficulty.toUpperCase();
    if (data.timeLimit !== undefined) updateData.timeLimit = parseInt(data.timeLimit, 10);
    if (data.isActive !== undefined) updateData.isActive = Boolean(data.isActive);

    const updated = await this.prisma.question.update({
      where: { id },
      data: updateData
    });

    if (adminId) {
      await this.prisma.auditLog.create({
        data: {
          adminId,
          action: 'QUESTION_UPDATED',
          entityType: 'Question',
          entityId: updated.id,
          metadata: JSON.stringify(updateData)
        }
      });
    }

    return {
      success: true,
      data: updated,
      message: 'Question updated successfully'
    };
  }

  // Duplicate question
  async duplicate(id, adminId = null) {
    const existing = await this.prisma.question.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`Question with ID ${id} not found`);
    }

    const duplicated = await this.prisma.question.create({
      data: {
        section: existing.section,
        topic: existing.topic,
        question: `${existing.question} (Copy)`,
        optionsJson: existing.optionsJson,
        correctAnswer: existing.correctAnswer,
        difficulty: existing.difficulty,
        timeLimit: existing.timeLimit,
        isActive: existing.isActive
      }
    });

    if (adminId) {
      await this.prisma.auditLog.create({
        data: {
          adminId,
          action: 'QUESTION_DUPLICATED',
          entityType: 'Question',
          entityId: duplicated.id,
          metadata: JSON.stringify({ sourceId: id })
        }
      });
    }

    return {
      success: true,
      data: duplicated,
      message: 'Question duplicated successfully'
    };
  }

  // Delete question with safety check against historical references
  async delete(id, adminId = null) {
    const existing = await this.prisma.question.findUnique({
      where: { id },
      include: { answers: true }
    });

    if (!existing) {
      throw new NotFoundException(`Question with ID ${id} not found`);
    }

    // Historical Safety: If question has answered attempts, soft delete (archive)
    if (existing.answers && existing.answers.length > 0) {
      await this.prisma.question.update({
        where: { id },
        data: { isActive: false }
      });

      if (adminId) {
        await this.prisma.auditLog.create({
          data: {
            adminId,
            action: 'QUESTION_ARCHIVED',
            entityType: 'Question',
            entityId: id,
            metadata: JSON.stringify({ reason: 'Preserved historical test answers; set isActive to false' })
          }
        });
      }

      return {
        success: true,
        archived: true,
        message: 'Question has historical assessment references and has been archived (deactivated) safely.'
      };
    }

    // Permanent delete if unreferenced
    await this.prisma.question.delete({ where: { id } });

    if (adminId) {
      await this.prisma.auditLog.create({
        data: {
          adminId,
          action: 'QUESTION_DELETED',
          entityType: 'Question',
          entityId: id,
          metadata: JSON.stringify({ section: existing.section })
        }
      });
    }

    return {
      success: true,
      message: 'Question deleted successfully'
    };
  }

  // Bulk JSON Import with schema validation
  async importBulk(questionsArray, adminId = null) {
    if (!Array.isArray(questionsArray) || questionsArray.length === 0) {
      throw new BadRequestException('Import payload must be a non-empty array of questions');
    }

    const validationReport = [];
    const validRecords = [];

    questionsArray.forEach((item, index) => {
      const check = this.validateQuestionPayload(item);
      if (!check.isValid) {
        validationReport.push({
          index,
          question: item.question || `Item #${index + 1}`,
          errors: check.errors
        });
      } else {
        validRecords.push({
          section: item.section.toUpperCase(),
          topic: item.topic ? String(item.topic).trim() : null,
          question: String(item.question).trim(),
          optionsJson: this.formatOptions(item.options),
          correctAnswer: String(item.correctAnswer).trim(),
          difficulty: item.difficulty ? item.difficulty.toUpperCase() : 'MEDIUM',
          timeLimit: parseInt(item.timeLimit, 10) || 60,
          isActive: item.isActive !== undefined ? Boolean(item.isActive) : true
        });
      }
    });

    if (validRecords.length === 0) {
      throw new BadRequestException({
        message: 'All questions in the import batch failed validation',
        validationReport
      });
    }

    // Insert valid records in a transaction
    const createdItems = await this.prisma.$transaction(
      validRecords.map((data) => this.prisma.question.create({ data }))
    );

    if (adminId) {
      await this.prisma.auditLog.create({
        data: {
          adminId,
          action: 'BULK_QUESTION_IMPORT',
          entityType: 'Question',
          metadata: JSON.stringify({
            totalAttempted: questionsArray.length,
            importedCount: createdItems.length,
            failedCount: validationReport.length
          })
        }
      });
    }

    return {
      success: true,
      data: {
        importedCount: createdItems.length,
        failedCount: validationReport.length,
        validationReport
      },
      message: `Successfully imported ${createdItems.length} questions.`
    };
  }

  // Export questions to JSON
  async exportQuestions(filter = {}) {
    const where = {};
    if (filter.section) where.section = filter.section.toUpperCase();
    if (filter.isActive !== undefined) where.isActive = filter.isActive === 'true' || filter.isActive === true;

    const questions = await this.prisma.question.findMany({
      where,
      orderBy: [{ section: 'asc' }, { createdAt: 'desc' }]
    });

    const exportList = questions.map((q) => {
      let options = [];
      try {
        options = JSON.parse(q.optionsJson);
      } catch (e) {
        options = [];
      }
      return {
        id: q.id,
        section: q.section,
        topic: q.topic,
        question: q.question,
        options,
        correctAnswer: q.correctAnswer,
        difficulty: q.difficulty,
        timeLimit: q.timeLimit,
        isActive: q.isActive
      };
    });

    return {
      success: true,
      data: exportList,
      count: exportList.length
    };
  }
}

QuestionsService.parameters = [PrismaService];

module.exports = { QuestionsService };
