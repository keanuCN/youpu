import { Body, Controller, HttpCode, Post, Req, UseGuards } from '@nestjs/common';
import { eventBatchSchema, type EventBatch } from '@youpu/schema';
import { OptionalAuthGuard } from '../auth/auth.guard';
import type { AuthRequest } from '../auth/auth.types';
import { ZodValidationPipe } from '../common/zod-validation.pipe';
import { EventsService } from './events.service';

@Controller('events')
export class EventsController {
  constructor(private readonly events: EventsService) {}

  @Post()
  @HttpCode(202)
  @UseGuards(OptionalAuthGuard)
  async ingest(@Body(new ZodValidationPipe(eventBatchSchema)) batch: EventBatch, @Req() request: AuthRequest) {
    const accepted = await this.events.ingest(batch, request.account?.id);
    return { accepted };
  }
}
