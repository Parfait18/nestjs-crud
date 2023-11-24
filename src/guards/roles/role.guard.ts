import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { User } from '@prisma/client';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    //get required roles
    const roles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!roles) {
      return true;
    }

    //get user from request
    const user: User = context.switchToHttp().getRequest().user;

    if (!user) {
      return false;
    }
    // console.log('userRole in guard =>', user.role);
    return validateRequest(user, roles);
  }
}
function validateRequest(
  user: User,
  roles: string[],
): boolean | Promise<boolean> | Observable<boolean> {
  // return roles.some((element) => userRoles.includes(element)); //in case of many roles
  return roles.includes(user.role);
}
