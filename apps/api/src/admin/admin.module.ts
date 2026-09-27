import { Module } from '@nestjs/common';
import { PrismaModule } from '../common/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { AdminController } from './admin.controller';
import { AdminGuard } from './admin.guard';
import { AdminService } from './admin.service';
import { AdminImportService } from './admin-import.service';
import { AdminImageUploadService } from './admin-image-upload.service';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [AdminController],
  providers: [AdminService, AdminImportService, AdminImageUploadService, AdminGuard],
})
export class AdminModule {}
