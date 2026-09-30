const { Module } = require('@nestjs/common');
const { AssessmentsService } = require('./assessments.service');
const { AssessmentsController } = require('./assessments.controller');

@Module({
  providers: [AssessmentsService],
  controllers: [AssessmentsController],
  exports: [AssessmentsService]
})
class AssessmentsModule {}

module.exports = { AssessmentsModule };
