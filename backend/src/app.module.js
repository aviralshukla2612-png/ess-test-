const { Module } = require('@nestjs/common');
const { PrismaModule } = require('./prisma/prisma.module');
const { AuthModule } = require('./auth/auth.module');
const { QuestionsModule } = require('./questions/questions.module');
const { CandidatesModule } = require('./candidates/candidates.module');
const { AssessmentsModule } = require('./assessments/assessments.module');
const { ResultsModule } = require('./results/results.module');
const { AdminModule } = require('./admin/admin.module');

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    QuestionsModule,
    CandidatesModule,
    AssessmentsModule,
    ResultsModule,
    AdminModule
  ]
})
class AppModule {}

module.exports = { AppModule };
