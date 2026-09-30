const {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  UseGuards
} = require('@nestjs/common');
const { CandidatesService } = require('./candidates.service');
const { JwtAuthGuard } = require('../auth/jwt-auth.guard');

@Controller('candidates')
class CandidatesController {
  constructor(candidatesService) {
    this.candidatesService = candidatesService;
  }

  // Public candidate registration (Candidate portal)
  @Post()
  async register(@Body() body) {
    return this.candidatesService.register(body);
  }

  // Public generator endpoint for enrollment ID
  @Get('next-enrollment-number')
  async getNextEnrollmentNumber() {
    const number = await this.candidatesService.generateNextEnrollmentNumber();
    return {
      success: true,
      data: { enrollmentNumber: number }
    };
  }

  // Admin protected list
  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@Query() query) {
    return this.candidatesService.findAll(query);
  }

  // Admin protected single view
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id) {
    return this.candidatesService.findOne(id);
  }

  // Admin protected delete
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id') id) {
    return this.candidatesService.delete(id);
  }
}

CandidatesController.parameters = [CandidatesService];

module.exports = { CandidatesController };
