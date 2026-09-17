import { Module } from '@nestjs/common';
import { PrismaModule } from '../common/prisma.module';
import { AuthController } from './auth.controller';
import { AuthGuard, OptionalAuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { EmailService } from './email.service';

@Module({
  imports: [PrismaModule],
  controllers: [AuthController],
  providers: [AuthService, AuthGuard, OptionalAuthGuard, EmailService],
  exports: [AuthService, AuthGuard, OptionalAuthGuard],
})
export class AuthModule {}
