import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Watchlist, WatchlistDocument } from '../schemas/watchlist.schema';

@Injectable()
export class WatchlistService {
  constructor(
    @InjectModel(Watchlist.name)
    private watchlistModel: Model<WatchlistDocument>,
  ) {}

  // إضافة مزاد للمتابعة تلقائياً
  async addToWatchlist(
    userId: string,
    auctionId: string,
    notifyOnBid: boolean = true,
    notifyOnEnd: boolean = true,
  ): Promise<WatchlistDocument> {
    // التحقق من عدم التكرار
    const existing = await this.watchlistModel.findOne({
      userId: new Types.ObjectId(userId),
      auctionId: new Types.ObjectId(auctionId),
    });

    if (existing) {
      return existing;
    }

    const watchlist = new this.watchlistModel({
      userId: new Types.ObjectId(userId),
      auctionId: new Types.ObjectId(auctionId),
      notifyOnBid,
      notifyOnEnd,
    });

    return watchlist.save();
  }

  // إزالة من المتابعة
  async removeFromWatchlist(userId: string, auctionId: string): Promise<void> {
    await this.watchlistModel.deleteOne({
      userId: new Types.ObjectId(userId),
      auctionId: new Types.ObjectId(auctionId),
    });
  }

  // الحصول على قائمة المتابعة
  async getUserWatchlist(userId: string): Promise<WatchlistDocument[]> {
    return this.watchlistModel
      .find({ userId: new Types.ObjectId(userId) })
      .populate('auctionId', 'productName mainImageUrl status endDate highestBid')
      .sort({ addedAt: -1 })
      .exec();
  }

  // التحقق من المتابعة
  async isWatching(userId: string, auctionId: string): Promise<boolean> {
    const watchlist = await this.watchlistModel.findOne({
      userId: new Types.ObjectId(userId),
      auctionId: new Types.ObjectId(auctionId),
    });
    return !!watchlist;
  }

  // الحصول على جميع المتابعين لمزاد
  async getAuctionWatchers(auctionId: string): Promise<WatchlistDocument[]> {
    return this.watchlistModel
      .find({ auctionId: new Types.ObjectId(auctionId) })
      .populate('userId', 'firstName lastName email')
      .exec();
  }
}
