import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Auction, AuctionDocument } from '../schemas/auction.schema';

@Injectable()
export class PromotedAuctionsService {
  constructor(
    @InjectModel(Auction.name)
    private auctionModel: Model<AuctionDocument>,
  ) {}

  // إبراز المزاد تلقائياً (جعله مميز)
  async promoteAuction(auctionId: string): Promise<AuctionDocument> {
    const auction = await this.auctionModel.findById(auctionId);
    if (!auction) {
      throw new Error('Auction not found');
    }

    auction.isFeatured = true;
    return auction.save();
  }

  // الحصول على المزادات المميزة
  async getPromotedAuctions(limit: number = 10): Promise<AuctionDocument[]> {
    return this.auctionModel
      .find({
        status: 'active',
        isFeatured: true,
        endDate: { $gt: new Date() },
      })
      .sort({ createdAt: -1 })
      .limit(limit)
      .exec();
  }

  // إلغاء التميز
  async unpromoteAuction(auctionId: string): Promise<AuctionDocument> {
    const auction = await this.auctionModel.findById(auctionId);
    if (!auction) {
      throw new Error('Auction not found');
    }

    auction.isFeatured = false;
    return auction.save();
  }
}
