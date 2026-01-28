import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { ReverseAuctionsService } from './reverse-auctions.service';

@Controller('reverse-auctions')
export class ReverseAuctionsController {
  constructor(private readonly reverseAuctionsService: ReverseAuctionsService) {}

  @Post()
  async createReverseAuction(@Body() body: any) {
    return this.reverseAuctionsService.createReverseAuction(
      body.buyerId,
      body.productName,
      body.description,
      body.maxPrice,
      body.minPrice,
      new Date(body.endDate),
      body.category,
    );
  }

  @Post(':id/bid')
  async submitSellerBid(@Param('id') id: string, @Body() body: { sellerId: string; price: number }) {
    await this.reverseAuctionsService.submitSellerBid(id, body.sellerId, body.price);
    return { message: 'Bid submitted' };
  }
}
