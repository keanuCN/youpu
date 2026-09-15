import { Module } from '@nestjs/common';
import { CatalogModule } from './catalog/catalog.module';
import { AdminModule } from './admin/admin.module';
import { PrismaModule } from './common/prisma.module';
import { RedisModule } from './common/redis.module';
import { EventsModule } from './events/events.module';
import { HealthModule } from './health/health.module';
import { OutboxModule } from './outbox/outbox.module';
import { SearchModule } from './search/search.module';

@Module({
  imports: [
    PrismaModule,
    RedisModule,
    SearchModule,
    HealthModule,
    CatalogModule,
    AdminModule,
    EventsModule,
    OutboxModule,
    // M3 追加：AuthModule / RatingsModule / FavoritesModule / RecommendModule
  ],
})
export class AppModule {}
