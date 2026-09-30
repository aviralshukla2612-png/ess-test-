const { Module } = require('@nestjs/common');
const { ResultsService } = require('./results.service');
const { ResultsController } = require('./results.controller');

@Module({
  providers: [ResultsService],
  controllers: [ResultsController],
  exports: [ResultsService]
})
class ResultsModule {}

module.exports = { ResultsModule };
