const { Injectable, UnauthorizedException } = require('@nestjs/common');
const { PassportStrategy } = require('@nestjs/passport');
const { Strategy, ExtractJwt } = require('passport-jwt');
const { PrismaService } = require('../prisma/prisma.service');

@Injectable()
class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(prisma) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'emperor_smart_solutions_secret_jwt_key_2026_enterprise'
    });
    this.prisma = prisma;
  }

  async validate(payload) {
    const user = await this.prisma.adminUser.findUnique({
      where: { id: payload.sub },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        isActive: true
      }
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedException('Session expired or unauthorized access');
    }

    return user;
  }
}

JwtStrategy.parameters = [PrismaService];

module.exports = { JwtStrategy };
