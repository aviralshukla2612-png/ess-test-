const { Module } = require('@nestjs/common');
const { JwtModule } = require('@nestjs/jwt');
const { PassportModule } = require('@nestjs/passport');
const { AuthService } = require('./auth.service');
const { AuthController } = require('./auth.controller');
const { JwtStrategy } = require('./jwt.strategy');

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'emperor_smart_solutions_secret_jwt_key_2026_enterprise',
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    })
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService, PassportModule, JwtModule]
})
class AuthModule {}

module.exports = { AuthModule };
