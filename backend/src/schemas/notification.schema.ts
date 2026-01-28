import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type NotificationDocument = Notification & Document;

export enum NotificationType {
  BID_OUTBID = 'bid_outbid',
  AUCTION_WON = 'auction_won',
  AUCTION_ENDED = 'auction_ended',
  NEW_AUCTION = 'new_auction',
  BID_PLACED = 'bid_placed',
  SHIPPING_UPDATE = 'shipping_update',
  PAYMENT_RECEIVED = 'payment_received',
  REVIEW_REQUEST = 'review_request',
  POINTS_EARNED = 'points_earned',
  FLASH_AUCTION = 'flash_auction',
}

@Schema({ timestamps: true })
export class Notification {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: String, enum: NotificationType, required: true })
  type: NotificationType;

  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: String, required: true })
  message: string;

  @Prop({ type: Types.ObjectId, ref: 'Auction', default: null })
  auctionId?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Bid', default: null })
  bidId?: Types.ObjectId;

  @Prop({ type: Boolean, default: false })
  isRead: boolean;

  @Prop({ type: Date, default: Date.now })
  readAt?: Date;

  @Prop({ type: String, default: null })
  link?: string;

  @Prop({ type: Object, default: {} })
  metadata?: any;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);

// Database indexes for better query performance
NotificationSchema.index({ userId: 1, createdAt: -1 });
NotificationSchema.index({ userId: 1, isRead: 1 });
NotificationSchema.index({ type: 1 });
NotificationSchema.index({ auctionId: 1 });
