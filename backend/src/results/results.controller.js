const { Controller, Get, Param, Query, UseGuards } = require('@nestjs/common');
const { ResultsService } = require('./results.service');
const { JwtAuthGuard } = require('../auth/jwt-auth.guard');

@Controller('results')
class ResultsController {
  constructor(resultsService) {
    this.resultsService = resultsService;
  }

  // Admin list all candidate assessment attempts
  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@Query() query) {
    return this.resultsService.findAll(query);
  }

  // Question-by-question candidate scorecard breakdown (Available to admin & candidate on completion)
  @Get(':attemptId')
  async findByAttemptId(@Param('attemptId') attemptId) {
    return this.resultsService.findByAttemptId(attemptId);
  }

  // Candidate history
  @UseGuards(JwtAuthGuard)
  @Get('candidate/:candidateId')
  async findByCandidateId(@Param('candidateId') candidateId) {
    return this.resultsService.findByCandidateId(candidateId);
  }
}

ResultsController.parameters = [ResultsService];

module.exports = { ResultsController };
