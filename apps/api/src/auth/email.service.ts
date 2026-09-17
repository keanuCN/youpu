import { Injectable, Logger, ServiceUnavailableException } from '@nestjs/common';
import nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';
import { env } from '../config/env';

export type EmailCodePurpose = 'register' | 'reset-password';

export type EmailDeliveryResult =
  | { delivered: true }
  | { delivered: false; devCode: string };

/**
 * 邮箱验证码投递适配器。
 *
 * 使用标准 SMTP，腾讯企业邮、QQ 邮箱、163、Resend SMTP 等均可接入。
 * 本地未配置 SMTP 时只返回开发验证码；生产环境明确失败，不伪装成已发送。
 */
@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly transporter: Transporter | null;
  private readonly from: string | null;

  constructor() {
    const host = env.EMAIL_SMTP_HOST?.trim();
    const user = env.EMAIL_SMTP_USER?.trim();
    const password = env.EMAIL_SMTP_PASSWORD;

    if (!host || !user || !password) {
      this.transporter = null;
      this.from = null;
      return;
    }

    this.transporter = nodemailer.createTransport({
      host,
      port: env.EMAIL_SMTP_PORT,
      secure: env.EMAIL_SMTP_SECURE,
      auth: { user, pass: password },
    });
    this.from = env.EMAIL_FROM?.trim() || user;
  }

  isConfigured(): boolean {
    return this.transporter !== null && this.from !== null;
  }

  async sendVerificationCode(
    email: string,
    code: string,
    purpose: EmailCodePurpose,
  ): Promise<EmailDeliveryResult> {
    if (!this.transporter || !this.from) {
      if (env.NODE_ENV === 'production') {
        throw new ServiceUnavailableException('邮箱服务尚未配置');
      }
      this.logger.warn('本地邮箱验证码：' + email + '，验证码 ' + code + '，有效期 10 分钟');
      return { delivered: false, devCode: code };
    }

    const purposeLabel = purpose === 'register' ? '完成注册' : '重置密码';
    await this.transporter.sendMail({
      from: this.from,
      to: email,
      subject: '有谱验证码：' + purposeLabel,
      text:
        '你的有谱验证码是 ' +
        code +
        '，用于' +
        purposeLabel +
        '。验证码 10 分钟内有效。如非本人操作，请忽略此邮件。',
      html: [
        '<div style="font-family:Arial,\"Microsoft YaHei\",sans-serif;line-height:1.7;color:#1f2420">',
        '<p>你好，这里是有谱。</p>',
        '<p>你的验证码用于<strong>' +
          purposeLabel +
          '</strong>：</p>',
        '<p style="font-size:28px;letter-spacing:6px;font-weight:700">' +
          code +
          '</p>',
        '<p>验证码 10 分钟内有效。如非本人操作，请忽略此邮件。</p>',
        '</div>',
      ].join(''),
    });
    return { delivered: true };
  }
}
