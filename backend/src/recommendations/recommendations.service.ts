import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Auction, AuctionDocument } from '../schemas/auction.schema';
import { Bid, BidDocument } from '../schemas/bid.schema';
import { Watchlist, WatchlistDocument } from '../schemas/watchlist.schema';

@Injectable()
export class RecommendationsService {
  constructor(
    @InjectModel(Auction.name)
    private auctionModel: Model<AuctionDocument>,
    @InjectModel(Bid.name)
    private bidModel: Model<BidDocument>,
    @InjectModel(Watchlist.name)
    private watchlistModel: Model<WatchlistDocument>,
  ) {}

  // التوصيات الذكية تلقائياً
  async getRecommendations(userId: string, limit: number = 10): Promise<AuctionDocument[]> {
    // الحصول على الفئات المفضلة للمستخدم (من المزايدات السابقة)
    const userBids = await this.bidModel.find({
      userId: new Types.ObjectId(userId),
    }).populate('auctionId');

    const favoriteCategories = new Map<string, number>();
    userBids.forEach((bid: any) => {
      if (bid.auctionId?.category) {
        favoriteCategories.set(
          bid.auctionId.category,
          (favoriteCategories.get(bid.auctionId.category) || 0) + 1,
        );
      }
    });

    // الحصول على المزادات في الفئات المفضلة
    const topCategories = Array.from(favoriteCategories.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([category]) => category);

    let recommendedAuctions: AuctionDocument[] = [];

    if (topCategories.length > 0) {
      recommendedAuctions = await this.auctionModel
        .find({
          status: 'active',
          category: { $in: topCategories },
          endDate: { $gt: new Date() },
        })
        .limit(limit)
        .exec();
    }

    // إذا لم تكن هناك توصيات كافية، أضف مزادات عشوائية
    if (recommendedAuctions.length < limit) {
      const additionalAuctions = await this.auctionModel
        .find({
          status: 'active',
          endDate: { $gt: new Date() },
          _id: { $nin: recommendedAuctions.map(a => a._id) },
        })
        .limit(limit - recommendedAuctions.length)
        .exec();
      
      recommendedAuctions = [...recommendedAuctions, ...additionalAuctions];
    }

    return recommendedAuctions;
  }

  // مزادات قد تهمك (بناءً على المتابعة)
  async getSimilarAuctions(auctionId: string, limit: number = 5): Promise<AuctionDocument[]> {
    const auction = await this.auctionModel.findById(auctionId);
    if (!auction) {
      return [];
    }

    return this.auctionModel
      .find({
        status: 'active',
        category: auction.category,
        _id: { $ne: new Types.ObjectId(auctionId) },
        endDate: { $gt: new Date() },
      })
      .limit(limit)
      .exec();
  }
}
