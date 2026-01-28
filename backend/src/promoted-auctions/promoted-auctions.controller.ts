import { Controller, Get, Post, Delete, Param, Query } from '@nestjs/common';
import { PromotedAuctionsService } from './promoted-auctions.service';

@Controller('promoted-auctions')
export class PromotedAuctionsController {
  constructor(private readonly promotedAuctionsService: PromotedAuctionsService) {}

  @Post(':id/promote')
  async promoteAuction(@Param('id') id: string) {
    return this.promotedAuctionsService.promoteAuction(id);
  }

  @Get()
  async getPromotedAuctions(@Query('limit') limit?: string) {
    const limitNum = limit ? parseInt(limit, 10) : 10;
    return this.promotedAuctionsService.getPromotedAuctions(limitNum);
  }

  @Delete(':id/promote')
  async unpromoteAuction(@Param('id') id: string) {
    return this.promotedAuctionsService.unpromoteAuction(id);
  }
}
