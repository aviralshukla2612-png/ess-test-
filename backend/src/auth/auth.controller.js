const { Controller, Post, Get, Body, UseGuards, Request, BadRequestException } = require('@nestjs/common');
const { AuthService } = require('./auth.service');
const { JwtAuthGuard } = require('./jwt-auth.guard');

@Controller('auth')
class AuthController {
  constructor(authService) {
    this.authService = authService;
  }

  @Post('login')
  async login(@Body() body) {
    const { email, password } = body;
    if (!email || !password) {
      throw new BadRequestException('Email and password are required');
    }
    return this.authService.login(email, password);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getProfile(@Request() req) {
    return this.authService.getProfile(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout() {
    return {
      success: true,
      message: 'Logged out successfully'
    };
  }
}

AuthController.parameters = [AuthService];

module.exports = { AuthController };
