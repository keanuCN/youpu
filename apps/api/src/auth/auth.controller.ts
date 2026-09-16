import { Body, Controller, Get, HttpCode, Patch, Post, Req, UseGuards } from '@nestjs/common';
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
import { ZodValidationPipe } from '../common/zod-validation.pipe';
import { AuthGuard } from './auth.guard';
import { CurrentAccount } from './current-account.decorator';
import { AuthService } from './auth.service';
import type { AccountView, AuthRequest } from './auth.types';

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('register')
  register(
    @Body(new ZodValidationPipe(authRegisterSchema)) body: AuthRegisterInput,
    @Req() request: AuthRequest,
  ) {
    return this.auth.register(body, request);
  }

  @Post('login')
  login(
    @Body(new ZodValidationPipe(authLoginSchema)) body: AuthLoginInput,
    @Req() request: AuthRequest,
  ) {
    return this.auth.login(body, request);
  }

  @Post('phone/code')
  requestPhoneCode(@Body(new ZodValidationPipe(authPhoneCodeSchema)) body: AuthPhoneCodeInput) {
    return this.auth.requestPhoneCode(body);
  }

  @Post('phone/login')
  phoneLogin(
    @Body(new ZodValidationPipe(authPhoneLoginSchema)) body: AuthPhoneLoginInput,
    @Req() request: AuthRequest,
  ) {
    return this.auth.phoneLogin(body, request);
  }

  @Post('refresh')
  refresh(
    @Body(new ZodValidationPipe(authRefreshSchema)) body: AuthRefreshInput,
    @Req() request: AuthRequest,
  ) {
    return this.auth.refresh(body, request);
  }

  @Post('logout')
  @HttpCode(200)
  logout(@Body() body: { refreshToken?: string }) {
    return this.auth.logout(body?.refreshToken);
  }

  @Post('reset-password')
  resetPassword(@Body(new ZodValidationPipe(authResetPasswordSchema)) body: AuthResetPasswordInput) {
    return this.auth.resetPassword(body);
  }

  @Get('me')
  @UseGuards(AuthGuard)
  me(@CurrentAccount() account: AccountView) {
    return account;
  }

  @Patch('me')
  @UseGuards(AuthGuard)
  updateMe(
    @CurrentAccount() account: AccountView,
    @Body(new ZodValidationPipe(accountPatchSchema)) body: AccountPatchInput,
  ) {
    return this.auth.updateAccount(account.id, body);
  }
}
