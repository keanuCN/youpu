import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import type { AccountView, AuthRequest } from './auth.types';

export const CurrentAccount = createParamDecorator((_data: unknown, context: ExecutionContext): AccountView => {
  const request = context.switchToHttp().getRequest<AuthRequest>();
  if (!request.account) throw new UnauthorizedException('请先登录');
  return request.account;
});
