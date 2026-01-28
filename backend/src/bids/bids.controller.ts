import { Controller, Get, Post, Body, Param, BadRequestException } from '@nestjs/common';
import { BidsService } from './bids.service';

@Controller('bids')
export class BidsController {
  constructor(private readonly bidsService: BidsService) {}

  @Post()
  async placeBid(@Body() body: { auctionId: string; userId: string; amount: number }) {
    if (!body.userId) {
      throw new BadRequestException('User ID is required');
    }
    return this.bidsService.placeBid(body.auctionId, body.userId, body.amount);
  }

  @Get('auction/:auctionId')
  async getBidsByAuction(@Param('auctionId') auctionId: string) {
    return this.bidsService.getBidsByAuction(auctionId);
  }

  @Get('user/:userId')
  async getUserBids(@Param('userId') userId: string) {
    return this.bidsService.getUserBids(userId);
  }
}

