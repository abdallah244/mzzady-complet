import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type LoyaltyPointsDocument = LoyaltyPoints & Document;

export enum PointsTransactionType {
  EARNED = 'earned',
  REDEEMED = 'redeemed',
  EXPIRED = 'expired',
  BONUS = 'bonus',
}

export enum PointsSource {
  PURCHASE = 'purchase',
  SALE = 'sale',
  BID = 'bid',
  REVIEW = 'review',
  REFERRAL = 'referral',
  BONUS = 'bonus',
}

@Schema({ timestamps: true })
export class LoyaltyPoints {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: String, enum: PointsTransactionType, required: true })
  transactionType: PointsTransactionType;

  @Prop({ type: String, enum: PointsSource, required: true })
  source: PointsSource;

  @Prop({ type: Number, required: true })
  points: number; // عدد النقاط (موجب للكسب، سالب للاستخدام)

  @Prop({ type: String, default: null })
  description?: string;

  @Prop({ type: Types.ObjectId, ref: 'Invoice', default: null })
  invoiceId?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Auction', default: null })
  auctionId?: Types.ObjectId;

  @Prop({ type: Date, default: null })
  expiresAt?: Date; // تاريخ انتهاء النقاط

  @Prop({ type: Object, default: {} })
  metadata?: any;
}

export const LoyaltyPointsSchema = SchemaFactory.createForClass(LoyaltyPoints);

// Database indexes for better query performance
LoyaltyPointsSchema.index({ userId: 1 });
LoyaltyPointsSchema.index({ userId: 1, transactionType: 1 });
LoyaltyPointsSchema.index({ createdAt: -1 });
LoyaltyPointsSchema.index({ expiresAt: 1 });
