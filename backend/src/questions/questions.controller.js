const {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request
} = require('@nestjs/common');
const { QuestionsService } = require('./questions.service');
const { JwtAuthGuard } = require('../auth/jwt-auth.guard');

@Controller('questions')
class QuestionsController {
  constructor(questionsService) {
    this.questionsService = questionsService;
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@Query() query) {
    return this.questionsService.findAll(query);
  }

  @UseGuards(JwtAuthGuard)
  @Get('export')
  async exportQuestions(@Query() query) {
    return this.questionsService.exportQuestions(query);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id) {
    return this.questionsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() body, @Request() req) {
    return this.questionsService.create(body, req.user?.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('import')
  async importBulk(@Body() body, @Request() req) {
    const questions = Array.isArray(body) ? body : body.questions;
    return this.questionsService.importBulk(questions, req.user?.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/duplicate')
  async duplicate(@Param('id') id, @Request() req) {
    return this.questionsService.duplicate(id, req.user?.id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(@Param('id') id, @Body() body, @Request() req) {
    return this.questionsService.update(id, body, req.user?.id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id') id, @Request() req) {
    return this.questionsService.delete(id, req.user?.id);
  }
}

QuestionsController.parameters = [QuestionsService];

module.exports = { QuestionsController };
