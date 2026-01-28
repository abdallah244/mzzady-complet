import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { FlashAuctionsService } from './flash-auctions.service';

@Controller('flash-auctions')
export class FlashAuctionsController {
  constructor(private readonly flashAuctionsService: FlashAuctionsService) {}

  @Post()
  async createFlashAuction(@Body() body: { auctionId: string; durationInHours: number; discountPercentage: number }) {
    return this.flashAuctionsService.createFlashAuction(
      body.auctionId,
      body.durationInHours,
      body.discountPercentage,
    );
  }
}
