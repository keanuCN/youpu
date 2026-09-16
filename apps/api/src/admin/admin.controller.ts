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
  UseGuards,
} from '@nestjs/common';
import {
  adminBrandInputSchema,
  adminBrandPatchSchema,
  adminCategoryInputSchema,
  adminCategoryPatchSchema,
  adminProductInputSchema,
  adminProductPatchSchema,
  type AdminBrandInput,
  type AdminBrandPatch,
  type AdminCategoryInput,
  type AdminCategoryPatch,
  type AdminProductInput,
  type AdminProductPatch,
} from '@youpu/schema';
import { ZodValidationPipe } from '../common/zod-validation.pipe';
import { AdminGuard } from './admin.guard';
import { AdminService } from './admin.service';
import { env } from '../config/env';

@Controller('admin')
@UseGuards(AdminGuard)
export class AdminController {
  constructor(private readonly admin: AdminService) {}

  @Get('auth/me')
  me() {
    return { authenticated: true, role: env.ADMIN_ROLE };
  }

  @Get('dashboard')
  dashboard() {
    return this.admin.dashboard();
  }

  @Get('analytics')
  analytics(@Query('days') days?: string) {
    const rangeDays = parsePositiveInteger(days, 'days');
    if (rangeDays !== undefined && rangeDays > 90) {
      throw new BadRequestException('days 不能超过 90');
    }
    return this.admin.analytics(rangeDays ?? 14);
  }

  @Get('products')
  products(
    @Query('search') search?: string,
    @Query('status') status?: string,
    @Query('categorySlug') categorySlug?: string,
    @Query('brandSlug') brandSlug?: string,
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
  ) {
    return this.admin.listProducts({
      search: search?.trim() || undefined,
      status: status === 'draft' || status === 'published' ? status : undefined,
      categorySlug: categorySlug?.trim() || undefined,
      brandSlug: brandSlug?.trim() || undefined,
      page: parsePositiveInteger(page, 'page'),
      pageSize: parsePositiveInteger(pageSize, 'pageSize'),
    });
  }

  @Get('products/:id')
  product(@Param('id', ParseUUIDPipe) id: string) {
    return this.admin.getProduct(id);
  }

  @Post('products')
  createProduct(@Body(new ZodValidationPipe(adminProductInputSchema)) body: AdminProductInput) {
    return this.admin.createProduct(body);
  }

  @Patch('products/:id')
  updateProduct(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(new ZodValidationPipe(adminProductPatchSchema)) body: AdminProductPatch,
  ) {
    return this.admin.updateProduct(id, body);
  }

  @Get('brands')
  brands() {
    return this.admin.listBrands();
  }

  @Post('brands')
  createBrand(@Body(new ZodValidationPipe(adminBrandInputSchema)) body: AdminBrandInput) {
    return this.admin.createBrand(body);
  }

  @Patch('brands/:id')
  updateBrand(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(new ZodValidationPipe(adminBrandPatchSchema)) body: AdminBrandPatch,
  ) {
    return this.admin.updateBrand(id, body);
  }

  @Get('categories')
  categories() {
    return this.admin.listCategories();
  }

  @Post('categories')
  createCategory(@Body(new ZodValidationPipe(adminCategoryInputSchema)) body: AdminCategoryInput) {
    return this.admin.createCategory(body);
  }

  @Patch('categories/:id')
  updateCategory(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(new ZodValidationPipe(adminCategoryPatchSchema)) body: AdminCategoryPatch,
  ) {
    return this.admin.updateCategory(id, body);
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
