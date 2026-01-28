import { Controller, Get, Post, Delete, Param, Body } from '@nestjs/common';
import { ComparisonsService } from './comparisons.service';

@Controller('comparisons')
export class ComparisonsController {
  constructor(private readonly comparisonsService: ComparisonsService) {}

  @Post()
  async createComparison(@Body() body: { userId: string; auctionIds: string[]; name?: string }) {
    return this.comparisonsService.createComparison(
      body.userId,
      body.auctionIds,
      body.name,
    );
  }

  @Get('user/:userId')
  async getUserComparisons(@Param('userId') userId: string) {
    return this.comparisonsService.getUserComparisons(userId);
  }

  @Delete(':id/user/:userId')
  async deleteComparison(@Param('id') id: string, @Param('userId') userId: string) {
    await this.comparisonsService.deleteComparison(id, userId);
    return { message: 'Comparison deleted' };
  }
}
