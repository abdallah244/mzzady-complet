import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ComparisonDocument = Comparison & Document;

@Schema({ timestamps: true })
export class Comparison {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: [Types.ObjectId], ref: 'Auction', required: true })
  auctionIds: Types.ObjectId[]; // المزادات المراد مقارنتها

  @Prop({ type: String, default: null })
  name?: string; // اسم المقارنة

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @Prop({ type: Date, default: null })
  expiresAt?: Date; // تاريخ انتهاء المقارنة
}

export const ComparisonSchema = SchemaFactory.createForClass(Comparison);
