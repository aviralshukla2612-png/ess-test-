const { Injectable, UnauthorizedException } = require('@nestjs/common');
const { JwtService } = require('@nestjs/jwt');
const bcrypt = require('bcryptjs');
const { PrismaService } = require('../prisma/prisma.service');

@Injectable()
class AuthService {
  constructor(prisma, jwtService) {
    this.prisma = prisma;
    this.jwtService = jwtService;
  }

  async validateUser(email, password) {
    const admin = await this.prisma.adminUser.findUnique({
      where: { email: email.toLowerCase().trim() }
    });

    if (!admin || !admin.isActive) {
      throw new UnauthorizedException('Invalid credentials or inactive account');
    }

    const isMatch = await bcrypt.compare(password, admin.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const { passwordHash, ...result } = admin;
    return result;
  }

  async login(email, password) {
    const user = await this.validateUser(email, password);

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      fullName: user.fullName
    };

    const token = this.jwtService.sign(payload);

    // Record login in audit log
    await this.prisma.auditLog.create({
      data: {
        adminId: user.id,
        action: 'ADMIN_LOGIN',
        entityType: 'AdminUser',
        entityId: user.id,
        metadata: JSON.stringify({ email: user.email, timestamp: new Date().toISOString() })
      }
    });

    return {
      success: true,
      data: {
        accessToken: token,
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          role: user.role
        }
      },
      message: 'Login successful'
    };
  }

  async getProfile(userId) {
    const user = await this.prisma.adminUser.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        isActive: true,
        createdAt: true
      }
    });

    if (!user) {
      throw new UnauthorizedException('User session not found');
    }

    return {
      success: true,
      data: user
    };
  }
}

AuthService.parameters = [PrismaService, JwtService];

module.exports = { AuthService };
