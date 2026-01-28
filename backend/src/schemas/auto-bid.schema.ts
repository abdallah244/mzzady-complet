import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type AutoBidDocument = AutoBid & Document;

@Schema({ timestamps: true })
export class AutoBid {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Auction', required: true })
  auctionId: Types.ObjectId;

  @Prop({ type: Number, required: true })
  maxBidAmount: number; // الحد الأقصى للمزايدة

  @Prop({ type: Number, required: true })
  incrementAmount: number; // مبلغ الزيادة التلقائية

  @Prop({ type: Number, default: 0 })
  currentBidAmount: number; // المزايدة الحالية

  @Prop({ type: Boolean, default: true })
  isActive: boolean; // نشط/غير نشط

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @Prop({ type: Date, default: null })
  lastBidAt?: Date; // آخر مزايدة تلقائية
}

export const AutoBidSchema = SchemaFactory.createForClass(AutoBid);

// Database indexes for better query performance
AutoBidSchema.index({ userId: 1 });
AutoBidSchema.index({ auctionId: 1 });
AutoBidSchema.index({ auctionId: 1, isActive: 1 });
AutoBidSchema.index({ userId: 1, auctionId: 1 }, { unique: true });
