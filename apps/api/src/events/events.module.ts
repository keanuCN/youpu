import { Module } from '@nestjs/common';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { EventsIngestWorker } from './events.worker';

@Module({
  controllers: [EventsController],
  providers: [EventsService, EventsIngestWorker],
})
export class EventsModule {}
