import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { eventBatchSchema, type EventBatch } from '@youpu/schema';
import { ZodValidationPipe } from '../common/zod-validation.pipe';
import { EventsService } from './events.service';

@Controller('events')
export class EventsController {
  constructor(private readonly events: EventsService) {}

  @Post()
  @HttpCode(202)
  async ingest(@Body(new ZodValidationPipe(eventBatchSchema)) batch: EventBatch) {
    const accepted = await this.events.ingest(batch);
    return { accepted };
  }
}
