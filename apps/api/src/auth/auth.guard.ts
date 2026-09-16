import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import type { AuthRequest } from './auth.types';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly auth: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthRequest>();
    const account = await this.auth.resolveAccessToken(request.headers?.authorization);
    if (!account) throw new UnauthorizedException('请先登录');
    request.account = account;
    request.accountId = account.id;
    return true;
  }
}

@Injectable()
export class OptionalAuthGuard implements CanActivate {
  constructor(private readonly auth: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthRequest>();
    const account = await this.auth.resolveAccessToken(request.headers?.authorization);
    if (account) {
      request.account = account;
      request.accountId = account.id;
    }
    return true;
  }
}
