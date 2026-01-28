import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  UserStatistics,
  UserStatisticsDocument,
} from '../schemas/user-statistics.schema';
import { Bid, BidDocument } from '../schemas/bid.schema';
import { Invoice, InvoiceDocument } from '../schemas/invoice.schema';
import { Rating, RatingDocument } from '../schemas/rating.schema';
import {
  LoyaltyPoints,
  LoyaltyPointsDocument,
} from '../schemas/loyalty-points.schema';
import { Auction, AuctionDocument } from '../schemas/auction.schema';

@Injectable()
export class UserStatisticsService {
  constructor(
    @InjectModel(UserStatistics.name)
    private userStatisticsModel: Model<UserStatisticsDocument>,
    @InjectModel(Bid.name)
    private bidModel: Model<BidDocument>,
    @InjectModel(Invoice.name)
    private invoiceModel: Model<InvoiceDocument>,
    @InjectModel(Rating.name)
    private ratingModel: Model<RatingDocument>,
    @InjectModel(LoyaltyPoints.name)
    private loyaltyPointsModel: Model<LoyaltyPointsDocument>,
    @InjectModel(Auction.name)
    private auctionModel: Model<AuctionDocument>,
  ) {}

  // تحديث إحصائيات المستخدم تلقائياً باستخدام aggregation للأداء الأفضل
  async updateUserStatistics(userId: string): Promise<UserStatisticsDocument> {
    const userObjectId = new Types.ObjectId(userId);

    // استخدام Promise.all لتنفيذ جميع الـ aggregations بالتوازي
    const [
      bidStats,
      purchaseStats,
      salesStats,
      ratingStats,
      pointsEarnedStats,
      pointsRedeemedStats,
      existingStats,
    ] = await Promise.all([
      // إحصائيات المزايدات
      this.bidModel.aggregate([
        { $match: { userId: userObjectId } },
        {
          $group: {
            _id: null,
            totalBids: { $sum: 1 },
            totalBidAmount: { $sum: '$amount' },
          },
        },
      ]),
      // إحصائيات المشتريات
      this.invoiceModel.aggregate([
        { $match: { userId: userObjectId } },
        {
          $group: {
            _id: null,
            totalPurchases: { $sum: 1 },
            totalPurchaseAmount: { $sum: '$totalAmount' },
          },
        },
      ]),
      // إحصائيات المبيعات (من المزادات المنتهية)
      this.auctionModel.aggregate([
        {
          $match: {
            sellerId: userObjectId,
            status: 'ended',
            highestBid: { $ne: null },
          },
        },
        {
          $group: {
            _id: null,
            totalSales: { $sum: 1 },
            totalSaleAmount: { $sum: '$highestBid' },
          },
        },
      ]),
      // إحصائيات التقييمات
      this.ratingModel.aggregate([
        { $match: { sellerId: userObjectId, isVisible: true } },
        {
          $group: {
            _id: null,
            totalRatings: { $sum: 1 },
            averageRating: { $avg: '$rating' },
          },
        },
      ]),
      // إحصائيات النقاط المكتسبة
      this.loyaltyPointsModel.aggregate([
        { $match: { userId: userObjectId, transactionType: 'earned' } },
        {
          $group: {
            _id: null,
            totalPoints: { $sum: '$points' },
          },
        },
      ]),
      // إحصائيات النقاط المستخدمة
      this.loyaltyPointsModel.aggregate([
        { $match: { userId: userObjectId, transactionType: 'redeemed' } },
        {
          $group: {
            _id: null,
            usedPoints: { $sum: { $abs: '$points' } },
          },
        },
      ]),
      // الحصول على الإحصائيات الحالية
      this.userStatisticsModel.findOne({ userId: userObjectId }),
    ]);

    // إنشاء أو تحديث الإحصائيات
    const stats =
      existingStats || new this.userStatisticsModel({ userId: userObjectId });

    // تحديث القيم من نتائج الـ aggregation
    const bidData = bidStats[0] || { totalBids: 0, totalBidAmount: 0 };
    const purchaseData = purchaseStats[0] || {
      totalPurchases: 0,
      totalPurchaseAmount: 0,
    };
    const salesData = salesStats[0] || { totalSales: 0, totalSaleAmount: 0 };
    const ratingData = ratingStats[0] || { totalRatings: 0, averageRating: 0 };
    const pointsEarnedData = pointsEarnedStats[0] || { totalPoints: 0 };
    const pointsRedeemedData = pointsRedeemedStats[0] || { usedPoints: 0 };

    stats.totalBids = bidData.totalBids;
    stats.totalBidAmount = bidData.totalBidAmount;
    stats.totalPurchases = purchaseData.totalPurchases;
    stats.totalPurchaseAmount = purchaseData.totalPurchaseAmount;
    stats.totalSales = salesData.totalSales;
    stats.totalSaleAmount = salesData.totalSaleAmount;
    stats.totalRatings = ratingData.totalRatings;
    stats.averageRating = ratingData.averageRating || 0;
    stats.totalPoints = pointsEarnedData.totalPoints;
    stats.usedPoints = pointsRedeemedData.usedPoints;
    stats.availablePoints = stats.totalPoints - stats.usedPoints;
    stats.lastUpdated = new Date();

    return stats.save();
  }

  // الحصول على إحصائيات المستخدم
  async getUserStatistics(userId: string): Promise<UserStatisticsDocument> {
    let stats: UserStatisticsDocument | null =
      await this.userStatisticsModel.findOne({
        userId: new Types.ObjectId(userId),
      });

    if (!stats) {
      stats = await this.updateUserStatistics(userId);
    }

    if (!stats) {
      throw new Error('Failed to get user statistics');
    }

    return stats;
  }
}
