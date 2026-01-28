import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type FlashAuctionDocument = FlashAuction & Document;

@Schema({ timestamps: true })
export class FlashAuction {
  @Prop({ type: Types.ObjectId, ref: 'Auction', required: true, unique: true })
  auctionId: Types.ObjectId; // المزاد الأصلي

  @Prop({ type: Date, required: true })
  startTime: Date;

  @Prop({ type: Date, required: true })
  endTime: Date;

  @Prop({ type: Number, required: true })
  durationInHours: number; // مدة المزاد السريع (بالساعات)

  @Prop({ type: Number, default: 0 })
  discountPercentage: number; // نسبة الخصم

  @Prop({ type: Boolean, default: false })
  isActive: boolean;

  @Prop({ type: Number, default: 0 })
  viewCount: number; // عدد المشاهدات

  @Prop({ type: Number, default: 0 })
  bidCount: number; // عدد المزايدات

  @Prop({ type: Object, default: {} })
  metadata?: any;
}

export const FlashAuctionSchema = SchemaFactory.createForClass(FlashAuction);
