import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type WatchlistDocument = Watchlist & Document;

@Schema({ timestamps: true })
export class Watchlist {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Auction', required: true })
  auctionId: Types.ObjectId;

  @Prop({ type: Boolean, default: true })
  notifyOnBid: boolean; // إشعار عند مزايدة جديدة

  @Prop({ type: Boolean, default: true })
  notifyOnEnd: boolean; // إشعار عند انتهاء المزاد

  @Prop({ type: Date, default: Date.now })
  addedAt: Date;
}

export const WatchlistSchema = SchemaFactory.createForClass(Watchlist);

// Database indexes for better query performance
WatchlistSchema.index({ userId: 1 });
WatchlistSchema.index({ auctionId: 1 });
WatchlistSchema.index({ userId: 1, auctionId: 1 }, { unique: true });
