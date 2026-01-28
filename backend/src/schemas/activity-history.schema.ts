import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ActivityHistoryDocument = ActivityHistory & Document;

export enum ActivityType {
  BID_PLACED = 'bid_placed',
  BID_WON = 'bid_won',
  BID_LOST = 'bid_lost',
  PURCHASE = 'purchase',
  SALE = 'sale',
  WALLET_DEPOSIT = 'wallet_deposit',
  WALLET_WITHDRAW = 'wallet_withdraw',
  AUCTION_CREATED = 'auction_created',
  AUCTION_ENDED = 'auction_ended',
  PRODUCT_ADDED = 'product_added',
  REVIEW_POSTED = 'review_posted',
}

@Schema({ timestamps: true })
export class ActivityHistory {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: String, enum: ActivityType, required: true })
  activityType: ActivityType;

  @Prop({ type: String, required: true })
  description: string;

  @Prop({ type: Types.ObjectId, ref: 'Auction', default: null })
  auctionId?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Bid', default: null })
  bidId?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Invoice', default: null })
  invoiceId?: Types.ObjectId;

  @Prop({ type: Number, default: 0 })
  amount?: number;

  @Prop({ type: Object, default: {} })
  metadata?: any; // بيانات إضافية
}

export const ActivityHistorySchema =
  SchemaFactory.createForClass(ActivityHistory);

// Database indexes for better query performance
ActivityHistorySchema.index({ userId: 1, createdAt: -1 });
ActivityHistorySchema.index({ activityType: 1 });
ActivityHistorySchema.index({ auctionId: 1 });
