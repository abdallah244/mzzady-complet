import { Controller, Get, Post, Delete, Param, Body } from '@nestjs/common';
import { SellerLikesService } from './seller-likes.service';

@Controller('seller-likes')
export class SellerLikesController {
  constructor(private readonly sellerLikesService: SellerLikesService) {}

  @Post()
  async toggleLike(@Body() body: { sellerId: string; userId: string }) {
    // تحقق إذا كان الإعجاب موجود
    const isCurrentlyLiked = await this.sellerLikesService.isLiked(
      body.sellerId,
      body.userId,
    );

    if (isCurrentlyLiked) {
      // إزالة الإعجاب
      await this.sellerLikesService.unlikeSeller(body.sellerId, body.userId);
      const count = await this.sellerLikesService.getLikesCount(body.sellerId);
      return { liked: false, count };
    } else {
      // إضافة إعجاب
      await this.sellerLikesService.likeSeller(body.sellerId, body.userId);
      const count = await this.sellerLikesService.getLikesCount(body.sellerId);
      return { liked: true, count };
    }
  }

  @Delete(':sellerId/user/:userId')
  async unlikeSeller(
    @Param('sellerId') sellerId: string,
    @Param('userId') userId: string,
  ) {
    await this.sellerLikesService.unlikeSeller(sellerId, userId);
    return { success: true, message: 'Like removed successfully' };
  }

  @Get(':sellerId/user/:userId')
  async isLiked(
    @Param('sellerId') sellerId: string,
    @Param('userId') userId: string,
  ) {
    const isLiked = await this.sellerLikesService.isLiked(sellerId, userId);
    return { isLiked };
  }

  @Get(':sellerId/count')
  async getLikesCount(@Param('sellerId') sellerId: string) {
    const count = await this.sellerLikesService.getLikesCount(sellerId);
    return { count };
  }

  @Get('sellers/stats')
  async getAllSellersWithStats() {
    return this.sellerLikesService.getAllSellersWithStats();
  }
}
