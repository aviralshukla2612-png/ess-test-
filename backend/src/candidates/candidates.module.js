const { Module } = require('@nestjs/common');
const { CandidatesService } = require('./candidates.service');
const { CandidatesController } = require('./candidates.controller');

@Module({
  providers: [CandidatesService],
  controllers: [CandidatesController],
  exports: [CandidatesService]
})
class CandidatesModule {}

module.exports = { CandidatesModule };
