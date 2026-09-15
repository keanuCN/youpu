import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import type { SearchResponse } from '@youpu/schema';
import { SearchService } from './search.service';
import { parseSearchQuery, type RawSearchQuery } from './search-query';

@Controller()
export class SearchController {
  constructor(private readonly search: SearchService) {}

  @Get('search')
  async searchProducts(@Query() query: RawSearchQuery): Promise<SearchResponse> {
    try {
      return await this.search.search(parseSearchQuery(query));
    } catch (error) {
      if (error instanceof Error && /^(q|sort|page|pageSize|year|price)/.test(error.message)) {
        throw new BadRequestException(error.message);
      }
      throw error;
    }
  }
}
