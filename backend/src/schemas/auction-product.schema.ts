import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type AuctionProductDocument = AuctionProduct & Document;

@Schema({ timestamps: true })
export class AuctionProduct {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: String, required: true })
  productName: string;

  @Prop({ type: String, required: true })
  mainImageUrl: string;

  @Prop({ type: String, required: true })
  mainImageFilename: string;

  @Prop({ type: [String], default: [] })
  additionalImagesUrl: string[];

  @Prop({ type: [String], default: [] })
  additionalImagesFilename: string[];

  @Prop({ type: Number, required: true })
  startingPrice: number;

  @Prop({ type: Number, default: 1 })
  minBidIncrement?: number;

  @Prop({ type: Number, default: 86400 })
  durationInSeconds?: number;

  @Prop({ type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' })
  status: string;

  @Prop({ type: String, default: null })
  adminNote?: string;

  @Prop({ type: Types.ObjectId, ref: 'User', default: null })
  reviewedBy?: Types.ObjectId;

  @Prop({ type: Date, default: null })
  reviewedAt?: Date;
}

export const AuctionProductSchema = SchemaFactory.createForClass(AuctionProduct);

