const { Module } = require('@nestjs/common');
const { AdminService } = require('./admin.service');
const { AdminController } = require('./admin.controller');

@Module({
  providers: [AdminService],
  controllers: [AdminController],
  exports: [AdminService]
})
class AdminModule {}

module.exports = { AdminModule };
