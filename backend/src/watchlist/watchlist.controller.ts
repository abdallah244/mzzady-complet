import { Controller, Get, Post, Delete, Param, Body } from '@nestjs/common';
import { WatchlistService } from './watchlist.service';

@Controller('watchlist')
export class WatchlistController {
  constructor(private readonly watchlistService: WatchlistService) {}

  @Post()
  async addToWatchlist(@Body() body: { userId: string; auctionId: string; notifyOnBid?: boolean; notifyOnEnd?: boolean }) {
    return this.watchlistService.addToWatchlist(
      body.userId,
      body.auctionId,
      body.notifyOnBid ?? true,
      body.notifyOnEnd ?? true,
    );
  }

  @Delete(':userId/:auctionId')
  async removeFromWatchlist(@Param('userId') userId: string, @Param('auctionId') auctionId: string) {
    await this.watchlistService.removeFromWatchlist(userId, auctionId);
    return { message: 'Removed from watchlist' };
  }

  @Get('user/:userId')
  async getUserWatchlist(@Param('userId') userId: string) {
    return this.watchlistService.getUserWatchlist(userId);
  }

  @Get('user/:userId/auction/:auctionId')
  async isWatching(@Param('userId') userId: string, @Param('auctionId') auctionId: string) {
    const isWatching = await this.watchlistService.isWatching(userId, auctionId);
    return { isWatching };
  }
}
