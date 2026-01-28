import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { LoyaltyPointsService } from './loyalty-points.service';
import { PointsSource } from '../schemas/loyalty-points.schema';

@Controller('loyalty-points')
export class LoyaltyPointsController {
  constructor(private readonly loyaltyPointsService: LoyaltyPointsService) {}

  @Post('add')
  async addPoints(@Body() body: { userId: string; source: PointsSource; points: number; description?: string; invoiceId?: string; auctionId?: string }) {
    return this.loyaltyPointsService.addPoints(
      body.userId,
      body.source,
      body.points,
      body.description,
      body.invoiceId,
      body.auctionId,
    );
  }

  @Post('redeem')
  async redeemPoints(@Body() body: { userId: string; points: number; description?: string }) {
    return this.loyaltyPointsService.redeemPoints(
      body.userId,
      body.points,
      body.description,
    );
  }

  @Get('user/:userId')
  async getUserPoints(@Param('userId') userId: string) {
    return this.loyaltyPointsService.getUserPoints(userId);
  }

  @Get('user/:userId/history')
  async getPointsHistory(@Param('userId') userId: string) {
    return this.loyaltyPointsService.getPointsHistory(userId);
  }
}
