const { Controller, Get, Query, UseGuards } = require('@nestjs/common');
const { AdminService } = require('./admin.service');
const { JwtAuthGuard } = require('../auth/jwt-auth.guard');

@Controller('admin')
class AdminController {
  constructor(adminService) {
    this.adminService = adminService;
  }

  @UseGuards(JwtAuthGuard)
  @Get('dashboard')
  async getDashboardStats() {
    return this.adminService.getDashboardStats();
  }

  @UseGuards(JwtAuthGuard)
  @Get('audit-logs')
  async getAuditLogs(@Query() query) {
    return this.adminService.getAuditLogs(query);
  }
}

AdminController.parameters = [AdminService];

module.exports = { AdminController };
