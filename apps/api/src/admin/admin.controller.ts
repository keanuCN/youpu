import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  adminAccountPatchSchema,
  adminBrandInputSchema,
  adminBrandPatchSchema,
  adminCategoryInputSchema,
  adminCategoryPatchSchema,
  adminProductInputSchema,
  adminProductPatchSchema,
  adminModerationPatchSchema,
  adminRatingModerationPatchSchema,
  type AdminBrandInput,
  type AdminBrandPatch,
  type AdminAccountPatch,
  type AdminCategoryInput,
  type AdminCategoryPatch,
  type AdminProductInput,
  type AdminProductPatch,
  type AdminModerationPatch,
  type AdminRatingModerationPatch,
} from '@youpu/schema';
import { z } from 'zod';
import { parse as parseYaml } from 'yaml';
import { ZodValidationPipe } from '../common/zod-validation.pipe';
import { AdminGuard } from './admin.guard';
import type { AdminRequest } from './admin.guard';
import { AdminRoles } from './admin-roles.decorator';
import { ADMIN_PRODUCT_MISSING_FIELDS, AdminService, type AdminProductMissingField } from './admin.service';
import { env } from '../config/env';
import { AdminImportService } from './admin-import.service';
import { AdminImageUploadService } from './admin-image-upload.service';

const importReviewSchema = z.object({
  decision: z.enum(['approve', 'reject']),
  note: z.string().max(1000).optional(),
}).strict();

@Controller('admin')
@UseGuards(AdminGuard)
export class AdminController {
  constructor(
    private readonly admin: AdminService,
    private readonly imports: AdminImportService,
    private readonly imageUploads: AdminImageUploadService,
  ) {}

  @Get('auth/me')
  me(@Req() request: AdminRequest) {
    return {
      authenticated: true,
      role: request.admin?.role ?? env.ADMIN_ROLE,
      source: request.admin?.source ?? 'legacy-token',
      accountId: request.admin?.accountId ?? null,
    };
  }

  @Get('dashboard')
  dashboard() {
    return this.admin.dashboard();
  }

  @Get('accounts')
  @AdminRoles('admin')
  accounts() {
    return this.admin.listAccounts();
  }

  @Patch('accounts/:id')
  @AdminRoles('admin')
  updateAccount(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(new ZodValidationPipe(adminAccountPatchSchema)) body: AdminAccountPatch,
    @Req() request: AdminRequest,
  ) {
    return this.admin.updateAccountAccess(id, body, request.admin?.accountId ?? undefined);
  }

  @Get('audit-logs')
  @AdminRoles('admin')
  auditLogs(
    @Query('entity') entity?: string,
    @Query('action') action?: string,
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
  ) {
    return this.admin.listAuditLogs({
      entity: entity?.trim() || undefined,
      action: action?.trim() || undefined,
      page: parsePositiveInteger(page, 'page'),
      pageSize: parsePositiveInteger(pageSize, 'pageSize'),
    });
  }

  @Get('analytics')
  analytics(@Query('days') days?: string) {
    const rangeDays = parsePositiveInteger(days, 'days');
    if (rangeDays !== undefined && rangeDays > 90) {
      throw new BadRequestException('days 不能超过 90');
    }
    return this.admin.analytics(rangeDays ?? 14);
  }

  @Get('moderation/reports')
  @AdminRoles('admin')
  reports(@Query('status') status?: string) {
    return this.admin.listReports(status);
  }

  @Patch('moderation/reports/:id')
  @AdminRoles('admin')
  updateReport(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(new ZodValidationPipe(adminModerationPatchSchema)) body: AdminModerationPatch,
    @Req() request: AdminRequest,
  ) {
    return this.admin.updateReport(id, body, request.admin?.accountId ?? undefined);
  }

  @Get('moderation/ratings')
  @AdminRoles('admin')
  moderationRatings(@Query('status') status?: string) {
    return this.admin.listRatings(status);
  }

  @Patch('moderation/ratings/:id')
  @AdminRoles('admin')
  updateRatingStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(new ZodValidationPipe(adminRatingModerationPatchSchema)) body: AdminRatingModerationPatch,
    @Req() request: AdminRequest,
  ) {
    return this.admin.updateRatingStatus(id, body, request.admin?.accountId ?? undefined);
  }

  @Get('products')
  products(
    @Query('search') search?: string,
    @Query('status') status?: string,
    @Query('categorySlug') categorySlug?: string,
    @Query('brandSlug') brandSlug?: string,
    @Query('missing') missing?: string,
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
  ) {
    return this.admin.listProducts({
      search: search?.trim() || undefined,
      status: status === 'draft' || status === 'published' ? status : undefined,
      categorySlug: categorySlug?.trim() || undefined,
      brandSlug: brandSlug?.trim() || undefined,
      missing: parseMissingField(missing),
      page: parsePositiveInteger(page, 'page'),
      pageSize: parsePositiveInteger(pageSize, 'pageSize'),
    });
  }

  @Get('imports')
  importsList(@Query('status') status?: string) {
    const allowedStatus = status === 'approved' || status === 'rejected' ? status : 'pending';
    return this.imports.list(allowedStatus);
  }

  @Get('imports/:id')
  importDetail(@Param('id', ParseUUIDPipe) id: string) {
    return this.imports.get(id);
  }

  @Post('imports')
  stageImport(@Body() body: { filename?: string; content?: string }, @Req() request: AdminRequest) {
    if (!body || typeof body.filename !== 'string' || typeof body.content !== 'string') {
      throw new BadRequestException('请选择 YAML 采集草稿文件');
    }
    if (!/\.ya?ml$/i.test(body.filename)) throw new BadRequestException('仅支持 .yaml 或 .yml 文件');
    if (Buffer.byteLength(body.content, 'utf8') > 80 * 1024) throw new BadRequestException('单个采集文件不能超过 80 KB');
    let payload: unknown;
    try {
      payload = parseYaml(body.content);
    } catch (error) {
      throw new BadRequestException(`YAML 解析失败：${error instanceof Error ? error.message : String(error)}`);
    }
    return this.imports.stage(payload, request.admin?.accountId ?? undefined);
  }

  @Patch('imports/:id/review')
  reviewImport(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(new ZodValidationPipe(importReviewSchema)) body: z.infer<typeof importReviewSchema>,
    @Req() request: AdminRequest,
  ) {
    const actorId = request.admin?.accountId;
    if (!actorId) throw new BadRequestException('采集审核需要账号登录');
    return this.imports.review(id, body, actorId);
  }

  @Get('products/:id')
  product(@Param('id', ParseUUIDPipe) id: string) {
    return this.admin.getProduct(id);
  }

  @Post('products')
  createProduct(
    @Body(new ZodValidationPipe(adminProductInputSchema)) body: AdminProductInput,
    @Req() request: AdminRequest,
  ) {
    return this.admin.createProduct(body, request.admin?.accountId ?? undefined);
  }

  @Patch('products/:id')
  updateProduct(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(new ZodValidationPipe(adminProductPatchSchema)) body: AdminProductPatch,
    @Req() request: AdminRequest,
  ) {
    return this.admin.updateProduct(id, body, request.admin?.accountId ?? undefined);
  }

  @Post('product-images')
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: 10 * 1024 * 1024 } }))
  uploadProductImage(@UploadedFile() file?: { buffer: Buffer; mimetype: string }) {
    if (!file) throw new BadRequestException('请选择要上传的图片');
    return this.imageUploads.upload({ buffer: file.buffer, mimetype: file.mimetype });
  }

  @Get('brands')
  brands() {
    return this.admin.listBrands();
  }

  @Post('brands')
  createBrand(
    @Body(new ZodValidationPipe(adminBrandInputSchema)) body: AdminBrandInput,
    @Req() request: AdminRequest,
  ) {
    return this.admin.createBrand(body, request.admin?.accountId ?? undefined);
  }

  @Patch('brands/:id')
  updateBrand(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(new ZodValidationPipe(adminBrandPatchSchema)) body: AdminBrandPatch,
    @Req() request: AdminRequest,
  ) {
    return this.admin.updateBrand(id, body, request.admin?.accountId ?? undefined);
  }

  @Get('categories')
  categories() {
    return this.admin.listCategories();
  }

  @Post('categories')
  createCategory(
    @Body(new ZodValidationPipe(adminCategoryInputSchema)) body: AdminCategoryInput,
    @Req() request: AdminRequest,
  ) {
    return this.admin.createCategory(body, request.admin?.accountId ?? undefined);
  }

  @Patch('categories/:id')
  updateCategory(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(new ZodValidationPipe(adminCategoryPatchSchema)) body: AdminCategoryPatch,
    @Req() request: AdminRequest,
  ) {
    return this.admin.updateCategory(id, body, request.admin?.accountId ?? undefined);
  }
}

function parsePositiveInteger(value: string | undefined, label: string): number | undefined {
  if (value === undefined || value === '') return undefined;
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 1) {
    throw new BadRequestException(`${label} 必须是大于 0 的整数`);
  }
  return parsed;
}

function parseMissingField(value: string | undefined): AdminProductMissingField | undefined {
  if (value === undefined || value === '') return undefined;
  if ((ADMIN_PRODUCT_MISSING_FIELDS as readonly string[]).includes(value)) return value as AdminProductMissingField;
  throw new BadRequestException(`missing 仅支持 ${ADMIN_PRODUCT_MISSING_FIELDS.join('|')}`);
}
