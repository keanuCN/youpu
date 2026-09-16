import {
  ConflictException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';
import {
  accountPatchSchema,
  authLoginSchema,
  authPhoneCodeSchema,
  authPhoneLoginSchema,
  authRefreshSchema,
  authRegisterSchema,
  authResetPasswordSchema,
  type AccountPatchInput,
  type AuthLoginInput,
  type AuthPhoneCodeInput,
  type AuthPhoneLoginInput,
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

const ACCESS_TOKEN_TTL_SECONDS = 15 * 60;
const REFRESH_TOKEN_TTL_MS = 30 * 24 * 60 * 60 * 1000;
const PHONE_CODE_TTL_SECONDS = 5 * 60;
const PHONE_CODE_COOLDOWN_SECONDS = 60;
const PHONE_CODE_MAX_ATTEMPTS = 5;
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const SCRYPT_OPTIONS: ScryptOptions = { N: 16_384, r: 8, p: 1, maxmem: 32 * 1024 * 1024 };

type AccountRow = {
  id: string;
  email: string | null;
  phone: string | null;
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
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly prisma: PrismaService,
    @Inject(REDIS) private readonly redis: Redis,
  ) {}

  async register(input: AuthRegisterInput, request?: AuthRequest): Promise<SessionResponse> {
    const body = authRegisterSchema.parse(input);
    const email = normalizeEmail(body.email);
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
          // 本地 M3 不接邮箱验证，注册后直接进入 active；上线前再接验证与风控。
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

  /**
   * 手机验证码登录的本地开发实现。
   *
   * 当前不接第三方短信服务：验证码只在非生产环境返回并写入日志，方便本地联调；
   * 生产环境在接入短信供应商前会明确返回不可用，不会伪装成已发送。
   */
  async requestPhoneCode(input: AuthPhoneCodeInput): Promise<{ ok: true; expiresIn: number; devCode?: string }> {
    const body = authPhoneCodeSchema.parse(input);
    const phone = normalizePhone(body.phone);
    if (env.NODE_ENV === 'production') {
      throw new ServiceUnavailableException('短信登录服务尚未配置');
    }

    const phoneKey = phoneDigest(phone);
    const cooldownKey = `auth:phone-code:cooldown:${phoneKey}`;
    const accepted = await this.redis.set(cooldownKey, '1', 'EX', PHONE_CODE_COOLDOWN_SECONDS, 'NX');
    if (accepted !== 'OK') {
      const ttl = await this.redis.ttl(cooldownKey);
      throw new ConflictException(`验证码已发送，请 ${Math.max(ttl, 1)} 秒后再试`);
    }

    const code = String(randomInt(100000, 1000000));
    await this.redis.set(phoneCodeKey(phone), otpDigest(phone, code), 'EX', PHONE_CODE_TTL_SECONDS);
    this.logger.log(`本地短信验证码：手机号尾号 ${phone.slice(-4)}，验证码 ${code}，有效期 ${PHONE_CODE_TTL_SECONDS} 秒`);

    return { ok: true, expiresIn: PHONE_CODE_TTL_SECONDS, devCode: code };
  }

  async phoneLogin(input: AuthPhoneLoginInput, request?: AuthRequest): Promise<SessionResponse> {
    const body = authPhoneLoginSchema.parse(input);
    const phone = normalizePhone(body.phone);
    const codeKey = phoneCodeKey(phone);
    const expectedDigest = await this.redis.get(codeKey);
    if (!expectedDigest) throw new UnauthorizedException('验证码已过期，请重新获取');

    const attemptsKey = `${codeKey}:attempts`;
    const attempts = await this.redis.incr(attemptsKey);
    if (attempts === 1) await this.redis.expire(attemptsKey, PHONE_CODE_TTL_SECONDS);
    if (attempts > PHONE_CODE_MAX_ATTEMPTS) {
      await this.redis.del(codeKey, attemptsKey);
      throw new UnauthorizedException('验证码错误次数过多，请重新获取');
    }
    if (!safeEqualText(expectedDigest, otpDigest(phone, body.code))) {
      throw new UnauthorizedException('验证码不正确');
    }
    await this.redis.del(codeKey, attemptsKey);

    let account = (await this.prisma.account.findUnique({ where: { phone } })) as AccountRow | null;
    if (!account) {
      try {
        account = (await this.prisma.account.create({
          data: {
            id: uuidv7(),
            phone,
            nickname: body.nickname?.trim() || defaultNicknameForPhone(phone),
            status: 'active',
            role: 'user',
          },
        })) as AccountRow;
      } catch (error) {
        // 并发首次登录时允许另一个请求先创建账号，再继续签发当前会话。
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
          account = (await this.prisma.account.findUnique({ where: { phone } })) as AccountRow | null;
        } else {
          throw error;
        }
      }
    }
    if (!account) throw new ConflictException('手机号账号创建失败，请重试');
    if (account.status !== 'active') throw new UnauthorizedException('账号当前不可用');
    return this.issueSession(account, request);
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
      phone: account.phone,
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

export function normalizePhone(phone: string): string {
  const compact = phone.trim().replace(/[\s-]/g, '');
  if (compact.startsWith('+86')) return compact.slice(3);
  if (compact.startsWith('86') && compact.length === 13) return compact.slice(2);
  return compact;
}

function defaultNickname(email: string): string {
  const prefix = email.split('@')[0]?.replace(/[^a-zA-Z0-9_]/g, '').slice(0, 16);
  return prefix || 'rider';
}

function defaultNicknameForPhone(phone: string): string {
  return `滑手${phone.slice(-4)}`;
}

function phoneDigest(phone: string): string {
  return createHash('sha256').update(`phone:${phone}`).digest('hex');
}

function phoneCodeKey(phone: string): string {
  return `auth:phone-code:${phoneDigest(phone)}`;
}

function otpDigest(phone: string, code: string): string {
  return createHmac('sha256', env.AUTH_SECRET).update(`phone-code:${phone}:${code}`).digest('hex');
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
