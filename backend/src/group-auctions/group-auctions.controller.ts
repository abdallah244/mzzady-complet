import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { GroupAuctionsService } from './group-auctions.service';

@Controller('group-auctions')
export class GroupAuctionsController {
  constructor(private readonly groupAuctionsService: GroupAuctionsService) {}

  @Post()
  async createGroupAuction(@Body() body: { auctionId: string; targetParticipants: number; pricePerParticipant: number }) {
    return this.groupAuctionsService.createGroupAuction(
      body.auctionId,
      body.targetParticipants,
      body.pricePerParticipant,
    );
  }

  @Post(':id/join')
  async joinGroupAuction(@Param('id') id: string, @Body() body: { userId: string }) {
    await this.groupAuctionsService.joinGroupAuction(id, body.userId);
    return { message: 'Joined group auction' };
  }
}
