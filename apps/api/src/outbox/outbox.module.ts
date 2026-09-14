import { Module } from '@nestjs/common';
import { ConfigChangedConsumer } from './consumers/config-changed.consumer';
import { NotificationConsumer } from './consumers/notification.consumer';
import { ProductEsSyncConsumer } from './consumers/product-es-sync.consumer';
import { RatingRecountConsumer } from './consumers/rating-recount.consumer';
import { OutboxService } from './outbox.service';

@Module({
  providers: [
    OutboxService,
    ProductEsSyncConsumer,
    RatingRecountConsumer,
    NotificationConsumer,
    ConfigChangedConsumer,
  ],
})
export class OutboxModule {}
