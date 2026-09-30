const {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  UseGuards,
  Request
} = require('@nestjs/common');
const { AssessmentsService } = require('./assessments.service');
const { JwtAuthGuard } = require('../auth/jwt-auth.guard');

@Controller('assessment')
class AssessmentsController {
  constructor(assessmentsService) {
    this.assessmentsService = assessmentsService;
  }

  // Active Assessment Configuration (Admin view)
  @Get('configuration')
  async getConfiguration() {
    return this.assessmentsService.getConfiguration();
  }

  // Update Active Assessment Configuration (Admin only)
  @UseGuards(JwtAuthGuard)
  @Patch('configuration')
  async updateConfiguration(@Body() body, @Request() req) {
    return this.assessmentsService.updateConfiguration(body, req.user?.id);
  }

  // Start Assessment Attempt (Candidate portal)
  @Post('start')
  async startAttempt(@Body() body) {
    return this.assessmentsService.startAttempt(body.candidateId);
  }

  // Get Current Attempt State (Candidate portal)
  @Get('attempt/:attemptId')
  async getAttempt(@Param('attemptId') attemptId) {
    return this.assessmentsService.getAttempt(attemptId);
  }

  // Submit Answer to Current Question
  @Post('attempt/:attemptId/answer')
  async submitAnswer(@Param('attemptId') attemptId, @Body() body) {
    const { questionId, answer, timeSpent } = body;
    return this.assessmentsService.submitAnswer(attemptId, questionId, answer, timeSpent);
  }

  // Timeout Current Question
  @Post('attempt/:attemptId/timeout')
  async handleTimeout(@Param('attemptId') attemptId, @Body() body) {
    return this.assessmentsService.handleTimeout(attemptId, body.questionId);
  }

  // Finalize Assessment & Save Typing Metrics
  @Post('attempt/:attemptId/complete')
  async completeAttempt(@Param('attemptId') attemptId, @Body() body) {
    return this.assessmentsService.completeAttempt(attemptId, body.typingResult);
  }
}

AssessmentsController.parameters = [AssessmentsService];

module.exports = { AssessmentsController };
