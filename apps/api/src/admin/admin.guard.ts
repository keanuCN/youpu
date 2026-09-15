import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';
import { env } from '../config/env';

export interface AdminIdentity {
  role: 'editor' | 'admin';
}

interface AdminRequest {
  headers?: { authorization?: string };
  admin?: AdminIdentity;
}

/**
 * M2 单人内测鉴权：使用环境变量配置的 Bearer 令牌。
 * 账号/JWT、多用户角色和验证码属于 M3，不在首版里伪造完成。
 */
@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    if (!env.ADMIN_TOKEN || env.ADMIN_TOKEN === 'replace-with-a-long-random-token') {
      throw new ServiceUnavailableException('后台尚未配置 ADMIN_TOKEN，请先配置 apps/api/.env');
    }

    const request = context.switchToHttp().getRequest<AdminRequest>();
    const authorization = request.headers?.authorization ?? '';
    const token = authorization.startsWith('Bearer ') ? authorization.slice('Bearer '.length).trim() : '';
    if (!token || token !== env.ADMIN_TOKEN) throw new UnauthorizedException('后台令牌无效或已缺失');

    request.admin = { role: env.ADMIN_ROLE };
    return true;
  }
}
