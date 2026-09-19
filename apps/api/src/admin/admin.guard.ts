import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { env } from '../config/env';
import type { AccountView } from '../auth/auth.types';
import { AuthService } from '../auth/auth.service';
import { ADMIN_ROLES_METADATA } from './admin-roles.decorator';
import { canAccessAdminRole, type AdminIdentity, type AdminRole } from './admin-permissions';

interface AdminAuthResolver {
  resolveAccessToken(authorization?: string): Promise<AccountView | null>;
}

export interface AdminRequest {
  headers?: { authorization?: string };
  admin?: AdminIdentity;
}

/**
 * 后台鉴权：优先接受已有账号体系的 access token，同时保留单令牌迁移入口。
 */
@Injectable()
export class AdminGuard implements CanActivate {
  constructor(
    @Inject(AuthService) private readonly auth: AdminAuthResolver,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AdminRequest>();
    const authorization = request.headers?.authorization ?? '';
    const token = authorization.startsWith('Bearer ') ? authorization.slice('Bearer '.length).trim() : '';
    const requiredRoles = this.reflector.getAllAndOverride<AdminRole[]>(ADMIN_ROLES_METADATA, [
      context.getHandler(),
      context.getClass(),
    ]) ?? [];

    let identity: AdminIdentity;
    if (token && env.ADMIN_TOKEN && token === env.ADMIN_TOKEN) {
      identity = { accountId: null, role: env.ADMIN_ROLE, source: 'legacy-token' };
    } else {
      const account = await this.auth.resolveAccessToken(authorization);
      if (!account) throw new UnauthorizedException('后台登录已失效，请重新登录');
      if (account.status !== 'active') throw new UnauthorizedException('后台账号已停用');
      if (account.role !== 'editor' && account.role !== 'admin') {
        throw new ForbiddenException('当前账号没有后台访问权限');
      }
      identity = { accountId: account.id, role: account.role, source: 'account' };
    }

    if (requiredRoles.some((required) => !canAccessAdminRole(identity.role, required))) {
      throw new ForbiddenException('当前账号没有执行此操作的权限');
    }
    request.admin = identity;
    return true;
  }
}
