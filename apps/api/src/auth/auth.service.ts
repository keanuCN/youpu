import {
  ConflictException,
  Inject,
  Injectable,
  HttpException,
  HttpStatus,
  NotFoundException,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';
import {
  accountPatchSchema,
  authEmailCodeSchema,
  authLoginSchema,
  authRefreshSchema,
  authRegisterSchema,
  authResetPasswordSchema,
  type AccountPatchInput,
  type AuthEmailCodeInput,
  type AuthLoginInput,
  type AuthRefreshInput,
  type AuthRegisterInput,
  type AuthResetPasswordInput,
} from '@youpu/schema';
import {
  createHash,
  createHmac,
  randomBytes,
  randomInt,
  scrypt as nodeScrypt,
  timingSafeEqual,
  type ScryptOptions,
} from 'node:crypto';
import type Redis from 'ioredis';
import { env } from '../config/env';
import { Prisma } from '../common/db';
import { PrismaService } from '../common/prisma.service';
import { REDIS } from '../common/redis.module';
import { uuidv7 } from '../common/uuid';
import type { AccountView, AuthRequest, SessionResponse } from './auth.types';
import { EmailService, type EmailCodePurpose } from './email.service';

const ACCESS_TOKEN_TTL_SECONDS = 15 * 60;
const REFRESH_TOKEN_TTL_MS = 30 * 24 * 60 * 60 * 1000;
const EMAIL_CODE_TTL_SECONDS = 10 * 60;
const EMAIL_CODE_COOLDOWN_SECONDS = 60;
const EMAIL_CODE_MAX_ATTEMPTS = 5;
const EMAIL_CODE_DAILY_IP_LIMIT = 20;
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const SCRYPT_OPTIONS: ScryptOptions = { N: 16_384, r: 8, p: 1, maxmem: 32 * 1024 * 1024 };

type AccountRow = {
  id: string;
  email: string | null;
  nickname: string;
  avatarUrl: string | null;
  riderProfile: unknown;
  role: string;
  status: string;
  createdAt: Date;
  passwordHash?: string | null;
};

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(REDIS) private readonly redis: Redis,
    private readonly email: EmailService,
  ) {}

  async register(input: AuthRegisterInput, request?: AuthRequest): Promise<SessionResponse> {
    const body = authRegisterSchema.parse(input);
    const email = normalizeEmail(body.email);
    await this.consumeEmailCode(email, 'register', body.code);
    const nickname = body.nickname?.trim() || defaultNickname(email);
    const passwordHash = await hashPassword(body.password);
    let account: AccountRow;
    try {
      account = (await this.prisma.account.create({
        data: {
          id: uuidv7(),
          email,
          nickname,
          passwordHash,
          emailVerifiedAt: new Date(),
          status: 'active',
          role: 'user',
        },
      })) as AccountRow;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException('该邮箱已注册，请直接登录');
      }
      throw error;
    }
    return this.issueSession(account, request);
  }

  async login(input: AuthLoginInput, request?: AuthRequest): Promise<SessionResponse> {
    const body = authLoginSchema.parse(input);
    const account = (await this.prisma.account.findUnique({ where: { email: normalizeEmail(body.email) } })) as AccountRow | null;
    if (!account || !account.passwordHash || !(await verifyPassword(body.password, account.passwordHash))) {
      throw new UnauthorizedException('邮箱或密码不正确');
    }
    if (account.status !== 'active') throw new UnauthorizedException('账号当前不可用');
    return this.issueSession(account, request);
  }

  async requestEmailCode(
    input: AuthEmailCodeInput,
    request?: AuthRequest,
  ): Promise<{ ok: true; expiresIn: number; devCode?: string }> {
    const body = authEmailCodeSchema.parse(input);
    const email = normalizeEmail(body.email);
    const purpose: EmailCodePurpose = body.purpose;

    if (env.NODE_ENV === 'production' && !this.email.isConfigured()) {
      throw new ServiceUnavailableException('邮箱服务尚未配置');
    }

    const existing = await this.prisma.account.findUnique({ where: { email }, select: { id: true } });
    if (purpose === 'register' && existing) throw new ConflictException('该邮箱已注册，请直接登录');
    if (purpose === 'reset-password' && !existing) throw new NotFoundException('该邮箱尚未注册');

    const emailHash = emailDigest(email);
    const cooldownKey = 'auth:email-code:' + purpose + ':cooldown:' + emailHash;
    const accepted = await this.redis.set(cooldownKey, '1', 'EX', EMAIL_CODE_COOLDOWN_SECONDS, 'NX');
    if (accepted !== 'OK') {
      const ttl = await this.redis.ttl(cooldownKey);
      throw new ConflictException('验证码已发送，请 ' + Math.max(ttl, 1) + ' 秒后再试');
    }

    const requestIp = request?.ip || request?.headers?.['x-forwarded-for']?.split(',')[0]?.trim() || 'unknown';
    const ipLimitKey =
      'auth:email-code:ip:' + digestText(requestIp) + ':' + new Date().toISOString().slice(0, 10);
    const ipCount = await this.redis.incr(ipLimitKey);
    if (ipCount === 1) await this.redis.expire(ipLimitKey, 24 * 60 * 60);
    if (ipCount > EMAIL_CODE_DAILY_IP_LIMIT) {
      await this.redis.del(cooldownKey);
      throw new HttpException('验证码请求过于频繁，请明天再试', HttpStatus.TOO_MANY_REQUESTS);
    }

    const code = String(randomInt(100000, 1000000));
    const codeKey = emailCodeKey(email, purpose);
    await this.redis.del(codeKey, codeKey + ':attempts');
    await this.redis.set(codeKey, emailCodeDigest(email, purpose, code), 'EX', EMAIL_CODE_TTL_SECONDS);
    try {
      const delivery = await this.email.sendVerificationCode(email, code, purpose);
      return {
        ok: true,
        expiresIn: EMAIL_CODE_TTL_SECONDS,
        ...(delivery.delivered ? {} : { devCode: delivery.devCode }),
      };
    } catch {
      await this.redis.del(cooldownKey, codeKey);
      throw new ServiceUnavailableException('验证邮件发送失败，请稍后再试');
    }
  }

  async refresh(input: AuthRefreshInput, request?: AuthRequest): Promise<SessionResponse> {
    const body = authRefreshSchema.parse(input);
    const tokenHash = hashToken(body.refreshToken);
    const stored = await this.prisma.refreshToken.findUnique({
      where: { tokenHash },
      include: { account: true },
    });
    if (!stored || stored.revokedAt || stored.expiresAt <= new Date() || stored.account.status !== 'active') {
      throw new UnauthorizedException('刷新令牌无效或已过期');
    }

    await this.prisma.refreshToken.update({ where: { id: stored.id }, data: { revokedAt: new Date() } });
    return this.issueSession(stored.account as AccountRow, request);
  }

  async logout(refreshToken: string | undefined): Promise<{ ok: true }> {
    if (refreshToken) {
      await this.prisma.refreshToken.updateMany({
        where: { tokenHash: hashToken(refreshToken), revokedAt: null },
        data: { revokedAt: new Date() },
      });
    }
    return { ok: true };
  }

  async resetPassword(input: AuthResetPasswordInput): Promise<{ ok: true }> {
    const body = authResetPasswordSchema.parse(input);
    const email = normalizeEmail(body.email);
    await this.consumeEmailCode(email, 'reset-password', body.code);
    const account = await this.prisma.account.findUnique({ where: { email }, select: { id: true } });
    if (!account) throw new NotFoundException('该邮箱尚未注册');
    const passwordHash = await hashPassword(body.password);
    await this.prisma.$transaction([
      this.prisma.account.update({ where: { id: account.id }, data: { passwordHash } }),
      this.prisma.refreshToken.updateMany({ where: { accountId: account.id, revokedAt: null }, data: { revokedAt: new Date() } }),
    ]);
    return { ok: true };
  }

  async getAccount(accountId: string): Promise<AccountView> {
    const account = (await this.prisma.account.findUnique({ where: { id: accountId } })) as AccountRow | null;
    if (!account || account.status !== 'active') throw new UnauthorizedException('账号不存在或已停用');
    return this.toView(account);
  }

  async updateAccount(accountId: string, input: AccountPatchInput): Promise<AccountView> {
    const body = accountPatchSchema.parse(input);
    const account = (await this.prisma.account.update({
      where: { id: accountId },
      data: {
        ...(body.nickname === undefined ? {} : { nickname: body.nickname }),
        ...(body.avatarUrl === undefined ? {} : { avatarUrl: body.avatarUrl }),
        ...(body.riderProfile === undefined ? {} : { riderProfile: body.riderProfile }),
      },
    })) as AccountRow;
    return this.toView(account);
  }

  async resolveAccessToken(authorization: string | undefined): Promise<AccountView | null> {
    const token = authorization?.startsWith('Bearer ') ? authorization.slice('Bearer '.length).trim() : '';
    if (!token) return null;
    const payload = verifyAccessToken(token);
    if (!payload || !UUID_RE.test(payload.accountId) || payload.exp <= Math.floor(Date.now() / 1000)) return null;
    try {
      return await this.getAccount(payload.accountId);
    } catch {
      return null;
    }
  }

  private async consumeEmailCode(email: string, purpose: EmailCodePurpose, code: string): Promise<void> {
    const codeKey = emailCodeKey(email, purpose);
    const expectedDigest = await this.redis.get(codeKey);
    if (!expectedDigest) throw new UnauthorizedException('验证码已过期，请重新获取');

    const attemptsKey = codeKey + ':attempts';
    const attempts = await this.redis.incr(attemptsKey);
    if (attempts === 1) await this.redis.expire(attemptsKey, EMAIL_CODE_TTL_SECONDS);
    if (attempts > EMAIL_CODE_MAX_ATTEMPTS) {
      await this.redis.del(codeKey, attemptsKey);
      throw new UnauthorizedException('验证码错误次数过多，请重新获取');
    }
    if (!safeEqualText(expectedDigest, emailCodeDigest(email, purpose, code))) {
      throw new UnauthorizedException('验证码不正确');
    }
    await this.redis.del(codeKey, attemptsKey);
  }

  private async issueSession(account: AccountRow, request?: AuthRequest): Promise<SessionResponse> {
    const refreshToken = randomBytes(48).toString('base64url');
    await this.prisma.refreshToken.create({
      data: {
        id: uuidv7(),
        accountId: account.id,
        tokenHash: hashToken(refreshToken),
        userAgent: request?.headers?.['user-agent']?.slice(0, 512),
        expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL_MS),
      },
    });
    return {
      accessToken: createAccessToken(account.id),
      refreshToken,
      expiresIn: ACCESS_TOKEN_TTL_SECONDS,
      account: this.toView(account),
    };
  }

  private toView(account: AccountRow): AccountView {
    const riderProfile = account.riderProfile;
    return {
      id: account.id,
      email: account.email,
      nickname: account.nickname,
      avatarUrl: account.avatarUrl,
      riderProfile:
        riderProfile && typeof riderProfile === 'object' && !Array.isArray(riderProfile)
          ? (riderProfile as Record<string, unknown>)
          : {},
      role: account.role,
      status: account.status,
      createdAt: account.createdAt.toISOString(),
    };
  }
}

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function defaultNickname(email: string): string {
  const prefix = email.split('@')[0]?.replace(/[^a-zA-Z0-9_]/g, '').slice(0, 16);
  return prefix || 'rider';
}

function digestText(value: string): string {
  return createHash('sha256').update(value).digest('hex');
}

function emailDigest(email: string): string {
  return digestText('email:' + email);
}

function emailCodeKey(email: string, purpose: EmailCodePurpose): string {
  return 'auth:email-code:' + purpose + ':' + emailDigest(email);
}

function emailCodeDigest(email: string, purpose: EmailCodePurpose, code: string): string {
  return createHmac('sha256', env.AUTH_SECRET).update(purpose + ':' + email + ':' + code).digest('hex');
}

function hashToken(value: string): string {
  return createHash('sha256').update(value).digest('hex');
}

function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString('base64url');
  return scryptAsync(password, salt).then((derived) => `scrypt$${salt}$${derived.toString('base64url')}`);
}

async function verifyPassword(password: string, encoded: string): Promise<boolean> {
  const [, salt, expectedEncoded] = encoded.split('$');
  if (!salt || !expectedEncoded) return false;
  const actual = await scryptAsync(password, salt);
  const expected = Buffer.from(expectedEncoded, 'base64url');
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}

function safeEqualText(left: string, right: string): boolean {
  const leftBytes = Buffer.from(left);
  const rightBytes = Buffer.from(right);
  return leftBytes.length === rightBytes.length && timingSafeEqual(leftBytes, rightBytes);
}

function scryptAsync(password: string, salt: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    nodeScrypt(password, salt, 64, SCRYPT_OPTIONS, (error, derived) => {
      if (error) reject(error);
      else resolve(derived as Buffer);
    });
  });
}

function createAccessToken(accountId: string): string {
  const payload = Buffer.from(
    JSON.stringify({ accountId, exp: Math.floor(Date.now() / 1000) + ACCESS_TOKEN_TTL_SECONDS }),
  ).toString('base64url');
  const signature = createHmac('sha256', env.AUTH_SECRET).update(payload).digest('base64url');
  return `${payload}.${signature}`;
}

function verifyAccessToken(token: string): { accountId: string; exp: number } | null {
  const [payload, signature] = token.split('.');
  if (!payload || !signature) return null;
  const expected = createHmac('sha256', env.AUTH_SECRET).update(payload).digest('base64url');
  const givenBytes = Buffer.from(signature);
  const expectedBytes = Buffer.from(expected);
  if (givenBytes.length !== expectedBytes.length || !timingSafeEqual(givenBytes, expectedBytes)) return null;
  try {
    const parsed = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as { accountId?: unknown; exp?: unknown };
    if (typeof parsed.accountId !== 'string' || typeof parsed.exp !== 'number') return null;
    return { accountId: parsed.accountId, exp: parsed.exp };
  } catch {
    return null;
  }
}
