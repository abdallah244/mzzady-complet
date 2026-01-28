import { Controller, Get, Param, Query } from '@nestjs/common';
import { RecommendationsService } from './recommendations.service';

@Controller('recommendations')
export class RecommendationsController {
  constructor(private readonly recommendationsService: RecommendationsService) {}

  @Get('user/:userId')
  async getRecommendations(@Param('userId') userId: string, @Query('limit') limit?: string) {
    const limitNum = limit ? parseInt(limit, 10) : 10;
    return this.recommendationsService.getRecommendations(userId, limitNum);
  }

  @Get('similar/:auctionId')
  async getSimilarAuctions(@Param('auctionId') auctionId: string, @Query('limit') limit?: string) {
    const limitNum = limit ? parseInt(limit, 10) : 5;
    return this.recommendationsService.getSimilarAuctions(auctionId, limitNum);
  }
}
