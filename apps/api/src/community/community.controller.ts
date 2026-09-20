import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  notificationReadSchema,
  ratingInputSchema,
  ratingListQuerySchema,
  recommendationInputSchema,
  reportInputSchema,
  replyInputSchema,
  type NotificationReadInput,
  type RatingInput,
  type RatingListQueryInput,
  type RecommendationInput,
  type ReportInput,
  type ReplyInput,
} from '@youpu/schema';
import { ZodValidationPipe } from '../common/zod-validation.pipe';
import { AuthGuard, OptionalAuthGuard } from '../auth/auth.guard';
import { CurrentAccount } from '../auth/current-account.decorator';
import type { AccountView, AuthRequest } from '../auth/auth.types';
import { CommunityService } from './community.service';

@Controller()
export class CommunityController {
  constructor(private readonly community: CommunityService) {}

  @Get('products/:productRef/ratings')
  @UseGuards(OptionalAuthGuard)
  ratings(
    @Param('productRef') productRef: string,
    @Query(new ZodValidationPipe(ratingListQuerySchema)) query: RatingListQueryInput,
    @Req() request: AuthRequest,
  ) {
    return this.community.listRatings(productRef, query, request.account?.id);
  }

  @Post('products/:productRef/ratings')
  @UseGuards(AuthGuard)
  createRating(
    @Param('productRef') productRef: string,
    @CurrentAccount() account: AccountView,
    @Body(new ZodValidationPipe(ratingInputSchema)) body: RatingInput,
  ) {
    return this.community.upsertRating(productRef, account, body);
  }

  @Delete('ratings/:id')
  @UseGuards(AuthGuard)
  deleteRating(@Param('id', ParseUUIDPipe) id: string, @CurrentAccount() account: AccountView) {
    return this.community.deleteRating(id, account.id);
  }

  @Post('ratings/:id/helpful')
  @UseGuards(AuthGuard)
  helpful(@Param('id', ParseUUIDPipe) id: string, @CurrentAccount() account: AccountView) {
    return this.community.toggleHelpful(id, account);
  }

  @Post('ratings/:id/replies')
  @UseGuards(AuthGuard)
  reply(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentAccount() account: AccountView,
    @Body(new ZodValidationPipe(replyInputSchema)) body: ReplyInput,
  ) {
    return this.community.createReply(id, account, body);
  }

  @Delete('replies/:id')
  @UseGuards(AuthGuard)
  deleteReply(@Param('id', ParseUUIDPipe) id: string, @CurrentAccount() account: AccountView) {
    return this.community.deleteReply(id, account.id);
  }

  @Post('reports')
  @UseGuards(AuthGuard)
  report(@CurrentAccount() account: AccountView, @Body(new ZodValidationPipe(reportInputSchema)) body: ReportInput) {
    return this.community.createReport(account.id, body);
  }

  @Post('products/:productRef/favorite')
  @UseGuards(AuthGuard)
  addFavorite(@Param('productRef') productRef: string, @CurrentAccount() account: AccountView) {
    return this.community.addFavorite(productRef, account.id);
  }

  @Delete('products/:productRef/favorite')
  @UseGuards(AuthGuard)
  removeFavorite(@Param('productRef') productRef: string, @CurrentAccount() account: AccountView) {
    return this.community.removeFavorite(productRef, account.id);
  }

  @Get('me')
  @UseGuards(AuthGuard)
  me(@CurrentAccount() account: AccountView) {
    return this.community.getMe(account);
  }

  @Get('me/favorites')
  @UseGuards(AuthGuard)
  favorites(@CurrentAccount() account: AccountView) {
    return this.community.listFavorites(account.id);
  }

  @Get('me/notifications')
  @UseGuards(AuthGuard)
  notifications(@CurrentAccount() account: AccountView, @Query('limit') limit?: string) {
    const parsed = limit ? Number(limit) : 50;
    return this.community.listNotifications(account.id, Number.isFinite(parsed) ? parsed : 50);
  }

  @Patch('me/notifications/:id')
  @UseGuards(AuthGuard)
  markNotification(
    @Param('id') id: string,
    @CurrentAccount() account: AccountView,
    @Body(new ZodValidationPipe(notificationReadSchema)) body: NotificationReadInput,
  ) {
    return this.community.markNotification(account.id, id, body);
  }

  @Post('me/notifications/read-all')
  @UseGuards(AuthGuard)
  markAllNotifications(@CurrentAccount() account: AccountView) {
    return this.community.markAllNotifications(account.id);
  }

  @Post('recommendations')
  @UseGuards(OptionalAuthGuard)
  recommendations(
    @Body(new ZodValidationPipe(recommendationInputSchema)) body: RecommendationInput,
    @Req() request: AuthRequest,
  ) {
    return this.community.recommend(request.account?.id, body);
  }
}
