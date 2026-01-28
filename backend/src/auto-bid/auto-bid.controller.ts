import { Controller, Get, Post, Put, Param, Body } from '@nestjs/common';
import { AutoBidService } from './auto-bid.service';

@Controller('auto-bid')
export class AutoBidController {
  constructor(private readonly autoBidService: AutoBidService) {}

  @Post()
  async createAutoBid(@Body() body: { userId: string; auctionId: string; maxBidAmount: number; incrementAmount: number }) {
    return this.autoBidService.createAutoBid(
      body.userId,
      body.auctionId,
      body.maxBidAmount,
      body.incrementAmount,
    );
  }

  @Get('user/:userId')
  async getUserAutoBids(@Param('userId') userId: string) {
    return this.autoBidService.getUserAutoBids(userId);
  }

  @Put('cancel/:userId/:auctionId')
  async cancelAutoBid(@Param('userId') userId: string, @Param('auctionId') auctionId: string) {
    await this.autoBidService.cancelAutoBid(userId, auctionId);
    return { message: 'Auto bid cancelled' };
  }
}
