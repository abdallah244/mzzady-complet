import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type RatingDocument = Rating & Document;

@Schema({ timestamps: true })
export class Rating {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  reviewerId: Types.ObjectId; // من قام بالتقييم

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  sellerId: Types.ObjectId; // البائع

  @Prop({ type: Types.ObjectId, ref: 'Auction', default: null })
  auctionId?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Invoice', default: null })
  invoiceId?: Types.ObjectId;

  @Prop({ type: Number, required: true, min: 1, max: 5 })
  rating: number; // 1-5 stars

  @Prop({ type: String, default: null })
  comment?: string;

  @Prop({ type: Boolean, default: false })
  isVerified: boolean; // تم التحقق من الشراء

  @Prop({ type: Boolean, default: false })
  isVisible: boolean; // مرئي للآخرين

  @Prop({ type: Object, default: {} })
  metadata?: any; // بيانات إضافية
}

export const RatingSchema = SchemaFactory.createForClass(Rating);

// Database indexes for better query performance
RatingSchema.index({ sellerId: 1 });
RatingSchema.index({ reviewerId: 1 });
RatingSchema.index({ sellerId: 1, isVisible: 1 });
RatingSchema.index({ auctionId: 1 });
RatingSchema.index({ createdAt: -1 });
