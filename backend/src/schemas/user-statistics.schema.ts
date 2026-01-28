import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserStatisticsDocument = UserStatistics & Document;

@Schema({ timestamps: true })
export class UserStatistics {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, unique: true })
  userId: Types.ObjectId;

  // إحصائيات المزايدات
  @Prop({ type: Number, default: 0 })
  totalBids: number;

  @Prop({ type: Number, default: 0 })
  wonAuctions: number;

  @Prop({ type: Number, default: 0 })
  lostAuctions: number;

  @Prop({ type: Number, default: 0 })
  totalBidAmount: number; // إجمالي المبالغ المزايدة بها

  // إحصائيات المشتريات
  @Prop({ type: Number, default: 0 })
  totalPurchases: number;

  @Prop({ type: Number, default: 0 })
  totalPurchaseAmount: number;

  // إحصائيات المبيعات
  @Prop({ type: Number, default: 0 })
  totalSales: number;

  @Prop({ type: Number, default: 0 })
  totalSaleAmount: number;

  // إحصائيات التقييمات
  @Prop({ type: Number, default: 0 })
  averageRating: number; // متوسط التقييم

  @Prop({ type: Number, default: 0 })
  totalRatings: number; // عدد التقييمات

  // إحصائيات النقاط
  @Prop({ type: Number, default: 0 })
  totalPoints: number;

  @Prop({ type: Number, default: 0 })
  usedPoints: number;

  @Prop({ type: Number, default: 0 })
  availablePoints: number;

  // آخر تحديث
  @Prop({ type: Date, default: Date.now })
  lastUpdated: Date;
}

export const UserStatisticsSchema = SchemaFactory.createForClass(UserStatistics);
