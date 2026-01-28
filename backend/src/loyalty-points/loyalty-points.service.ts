import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { LoyaltyPoints, LoyaltyPointsDocument, PointsTransactionType, PointsSource } from '../schemas/loyalty-points.schema';
import { UserStatisticsService } from '../user-statistics/user-statistics.service';

@Injectable()
export class LoyaltyPointsService {
  constructor(
    @InjectModel(LoyaltyPoints.name)
    private loyaltyPointsModel: Model<LoyaltyPointsDocument>,
    private userStatisticsService: UserStatisticsService,
  ) {}

  // إضافة نقاط تلقائياً
  async addPoints(
    userId: string,
    source: PointsSource,
    points: number,
    description?: string,
    invoiceId?: string,
    auctionId?: string,
  ): Promise<LoyaltyPointsDocument> {
    const pointsTransaction = new this.loyaltyPointsModel({
      userId: new Types.ObjectId(userId),
      transactionType: PointsTransactionType.EARNED,
      source,
      points,
      description,
      invoiceId: invoiceId ? new Types.ObjectId(invoiceId) : null,
      auctionId: auctionId ? new Types.ObjectId(auctionId) : null,
    });

    await pointsTransaction.save();

    // تحديث إحصائيات المستخدم تلقائياً
    await this.userStatisticsService.updateUserStatistics(userId);

    return pointsTransaction;
  }

  // استبدال النقاط
  async redeemPoints(
    userId: string,
    points: number,
    description?: string,
  ): Promise<LoyaltyPointsDocument> {
    // التحقق من النقاط المتاحة
    const stats = await this.userStatisticsService.getUserStatistics(userId);
    if (stats.availablePoints < points) {
      throw new Error('Insufficient points');
    }

    const pointsTransaction = new this.loyaltyPointsModel({
      userId: new Types.ObjectId(userId),
      transactionType: PointsTransactionType.REDEEMED,
      source: PointsSource.BONUS,
      points: -points, // سالب للاستخدام
      description,
    });

    await pointsTransaction.save();

    // تحديث إحصائيات المستخدم تلقائياً
    await this.userStatisticsService.updateUserStatistics(userId);

    return pointsTransaction;
  }

  // الحصول على نقاط المستخدم
  async getUserPoints(userId: string): Promise<{
    total: number;
    used: number;
    available: number;
  }> {
    const stats = await this.userStatisticsService.getUserStatistics(userId);
    return {
      total: stats.totalPoints,
      used: stats.usedPoints,
      available: stats.availablePoints,
    };
  }

  // الحصول على سجل النقاط
  async getPointsHistory(userId: string): Promise<LoyaltyPointsDocument[]> {
    return this.loyaltyPointsModel
      .find({ userId: new Types.ObjectId(userId) })
      .populate('invoiceId', 'totalAmount')
      .populate('auctionId', 'productName')
      .sort({ createdAt: -1 })
      .exec();
  }
}
