import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ReverseAuctionDocument = ReverseAuction & Document;

@Schema({ timestamps: true })
export class ReverseAuction {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  buyerId: Types.ObjectId; // المشتري

  @Prop({ type: String, required: true })
  productName: string;

  @Prop({ type: String, required: true })
  description: string;

  @Prop({ type: Number, required: true })
  maxPrice: number; // السعر الأقصى الذي يريده المشتري

  @Prop({ type: Number, required: true })
  minPrice: number; // السعر الأدنى

  @Prop({ type: String, enum: ['active', 'ended', 'cancelled'], default: 'active' })
  status: string;

  @Prop({ type: Date, required: true })
  endDate: Date;

  @Prop({ type: [Types.ObjectId], ref: 'User', default: [] })
  sellerBids: Types.ObjectId[]; // البائعون الذين تقدموا بعروض

  @Prop({ type: Types.ObjectId, ref: 'User', default: null })
  winnerSellerId?: Types.ObjectId; // البائع الفائز

  @Prop({ type: Number, default: null })
  finalPrice?: number; // السعر النهائي

  @Prop({ type: String, enum: ['electronics', 'fashion', 'home', 'vehicles', 'art', 'jewelry', 'books', 'sports', 'other'], default: 'other' })
  category: string;

  @Prop({ type: Object, default: {} })
  metadata?: any;
}

export const ReverseAuctionSchema = SchemaFactory.createForClass(ReverseAuction);
