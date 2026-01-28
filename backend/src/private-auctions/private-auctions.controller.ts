import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { PrivateAuctionsService } from './private-auctions.service';

@Controller('private-auctions')
export class PrivateAuctionsController {
  constructor(private readonly privateAuctionsService: PrivateAuctionsService) {}

  @Post()
  async createPrivateAuction(@Body() body: { auctionId: string; invitedUsers: string[]; isExclusive?: boolean; minMembershipLevel?: number }) {
    return this.privateAuctionsService.createPrivateAuction(
      body.auctionId,
      body.invitedUsers,
      body.isExclusive ?? false,
      body.minMembershipLevel,
    );
  }

  @Get('check/:auctionId/:userId')
  async checkAccess(@Param('auctionId') auctionId: string, @Param('userId') userId: string) {
    const hasAccess = await this.privateAuctionsService.checkAccess(auctionId, userId);
    return { hasAccess };
  }
}
