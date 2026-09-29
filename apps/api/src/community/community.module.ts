import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../common/prisma.module';
import { RedisModule } from '../common/redis.module';
import { CommunityController } from './community.controller';
import { CommunityRateLimit } from './community-rate-limit';
import { CommunityService } from './community.service';
import { AdminImageUploadService } from '../admin/admin-image-upload.service';

@Module({
  imports: [PrismaModule, AuthModule, RedisModule],
  controllers: [CommunityController],
  providers: [CommunityService, CommunityRateLimit, AdminImageUploadService],
})
export class CommunityModule {}
