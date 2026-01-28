import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ActivityHistory, ActivityHistoryDocument, ActivityType } from '../schemas/activity-history.schema';

@Injectable()
export class ActivityHistoryService {
  constructor(
    @InjectModel(ActivityHistory.name)
    private activityHistoryModel: Model<ActivityHistoryDocument>,
  ) {}

  // إنشاء سجل نشاط تلقائي
  async createActivity(
    userId: string,
    activityType: ActivityType,
    description: string,
    auctionId?: string,
    bidId?: string,
    invoiceId?: string,
    amount?: number,
    metadata?: any,
  ): Promise<ActivityHistoryDocument> {
    const activity = new this.activityHistoryModel({
      userId: new Types.ObjectId(userId),
      activityType,
      description,
      auctionId: auctionId ? new Types.ObjectId(auctionId) : null,
      bidId: bidId ? new Types.ObjectId(bidId) : null,
      invoiceId: invoiceId ? new Types.ObjectId(invoiceId) : null,
      amount,
      metadata,
    });

    return activity.save();
  }

  // الحصول على سجل النشاط للمستخدم
  async getUserActivity(userId: string, limit: number = 50): Promise<ActivityHistoryDocument[]> {
    return this.activityHistoryModel
      .find({ userId: new Types.ObjectId(userId) })
      .populate('auctionId', 'productName mainImageUrl')
      .sort({ createdAt: -1 })
      .limit(limit)
      .exec();
  }

  // الحصول على سجل نشاط حسب النوع
  async getActivityByType(userId: string, activityType: ActivityType): Promise<ActivityHistoryDocument[]> {
    return this.activityHistoryModel
      .find({
        userId: new Types.ObjectId(userId),
        activityType,
      })
      .populate('auctionId', 'productName mainImageUrl')
      .sort({ createdAt: -1 })
      .exec();
  }
}
