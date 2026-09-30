const { Injectable, SetMetadata } = require('@nestjs/common');
const { AuthGuard } = require('@nestjs/passport');
const { Reflector } = require('@nestjs/core');

@Injectable()
class JwtAuthGuard extends AuthGuard('jwt') {}

const ROLES_KEY = 'roles';
const Roles = (...roles) => SetMetadata(ROLES_KEY, roles);

@Injectable()
class RolesGuard {
  constructor(reflector) {
    this.reflector = reflector;
  }

  canActivate(context) {
    const requiredRoles = this.reflector.getAllAndOverride(ROLES_KEY, [
      context.getHandler(),
      context.getClass()
    ]);
    if (!requiredRoles) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();
    return user && requiredRoles.includes(user.role);
  }
}

RolesGuard.parameters = [Reflector];

module.exports = { JwtAuthGuard, Roles, RolesGuard, ROLES_KEY };
