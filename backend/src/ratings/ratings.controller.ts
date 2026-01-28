import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Req,
  NotFoundException,
} from '@nestjs/common';
import { RatingsService } from './ratings.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('ratings')
export class RatingsController {
  constructor(private readonly ratingsService: RatingsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async createRating(
    @Body()
    body: {
      reviewerId: string;
      invoiceId: string;
      rating: number;
      comment?: string;
    },
  ) {
    return this.ratingsService.createRatingAfterPurchase(
      body.reviewerId,
      body.invoiceId,
      body.rating,
      body.comment,
    );
  }

  @Get('seller/:sellerId')
  async getSellerRatings(@Param('sellerId') sellerId: string) {
    return this.ratingsService.getSellerRatings(sellerId);
  }

  @Get('seller/:sellerId/average')
  async getAverageRating(@Param('sellerId') sellerId: string) {
    const average = await this.ratingsService.getAverageRating(sellerId);
    return { average };
  }

  @Get(':id')
  async getRatingById(@Param('id') id: string) {
    const rating = await this.ratingsService.getRatingById(id);
    if (!rating) {
      throw new NotFoundException('Rating not found');
    }
    return rating;
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async updateRating(
    @Param('id') id: string,
    @Body() body: { rating?: number; comment?: string },
    @Req() req: any,
  ) {
    const userId = req.user?.sub || req.user?.id;
    return this.ratingsService.updateRating(
      id,
      userId,
      body.rating,
      body.comment,
    );
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteRating(@Param('id') id: string, @Req() req: any) {
    const userId = req.user?.sub || req.user?.id;
    return this.ratingsService.deleteRating(id, userId);
  }

  @Get('user/:userId')
  async getUserRatings(@Param('userId') userId: string) {
    return this.ratingsService.getUserRatings(userId);
  }
}
