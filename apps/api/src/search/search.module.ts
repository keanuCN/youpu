import { Global, Module } from '@nestjs/common';
import { ElasticService } from './elastic.service';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';

@Global()
@Module({
  controllers: [SearchController],
  providers: [ElasticService, SearchService],
  exports: [ElasticService],
})
export class SearchModule {}
