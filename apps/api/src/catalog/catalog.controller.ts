import { BadRequestException, Controller, Get, Param, Query } from '@nestjs/common';
import { CatalogService, PRODUCT_SORTS, type ProductSort } from './catalog.service';

@Controller()
export class CatalogController {
  constructor(private readonly catalog: CatalogService) {}

  @Get('categories/tree')
  tree() {
    return this.catalog.getCategoryTree();
  }

  @Get('categories/:slug/spec-schema')
  async specSchema(@Param('slug') slug: string) {
    const category = await this.catalog.getCategoryBySlug(slug);
    return { slug: category.slug, name: category.name, specSchema: category.specSchema };
  }

  @Get('products')
  list(
    @Query('category') category?: string,
    @Query('brand') brand?: string,
    @Query('sort') sort?: string,
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
    @Query('ids') ids?: string,
  ) {
    if (ids?.trim()) {
      const refs = [...new Set(ids.split(',').map((item) => item.trim()).filter(Boolean))];
      if (refs.length > 4) throw new BadRequestException('一次最多对比 4 件产品');
      return this.catalog.getProductsByRefs(refs);
    }

    const parsedSort = (sort ?? 'hot') as ProductSort;
    if (!PRODUCT_SORTS.includes(parsedSort)) {
      throw new BadRequestException(`sort 仅支持 ${PRODUCT_SORTS.join('|')}`);
    }
    return this.catalog.listProducts({
      category,
      brand,
      sort: parsedSort,
      page: page ? Number(page) : undefined,
      pageSize: pageSize ? Number(pageSize) : undefined,
    });
  }

  @Get('products/:slug')
  detail(@Param('slug') slug: string) {
    return this.catalog.getProductBySlug(slug);
  }
}
