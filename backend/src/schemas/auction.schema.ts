import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type AuctionDocument = Auction & Document;

@Schema({ timestamps: true })
export class Auction {
  @Prop({ type: String, required: true })
  productName: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  sellerId: Types.ObjectId;

  @Prop({ type: Number, required: true })
  startingPrice: number;

  @Prop({ type: Number, required: true, default: 1 })
  minBidIncrement: number;

  @Prop({ type: String, required: true })
  mainImageUrl: string;

  @Prop({ type: String, required: true })
  mainImageFilename: string;

  @Prop({ type: [String], default: [] })
  additionalImagesUrl: string[];

  @Prop({ type: [String], default: [] })
  additionalImagesFilename: string[];

  @Prop({
    type: String,
    enum: ['pending', 'active', 'ended'],
    default: 'pending',
  })
  status: string;

  @Prop({ type: Date, required: true })
  startDate: Date;

  @Prop({ type: Date, required: true })
  endDate: Date;

  @Prop({ type: Number, required: true }) // Duration in seconds (1 to 7 days)
  durationInSeconds: number;

  @Prop({ type: Number, default: null })
  highestBid: number | null;

  @Prop({ type: Types.ObjectId, ref: 'User', default: null })
  highestBidderId: Types.ObjectId | null;

  @Prop({ type: Boolean, default: false })
  isFeatured: boolean;

  @Prop({
    type: String,
    enum: [
      'electronics',
      'fashion',
      'home',
      'vehicles',
      'art',
      'jewelry',
      'books',
      'sports',
      'other',
    ],
    default: 'other',
  })
  category: string;
}

export const AuctionSchema = SchemaFactory.createForClass(Auction);

// Database indexes for better query performance
AuctionSchema.index({ sellerId: 1 });
AuctionSchema.index({ status: 1 });
AuctionSchema.index({ endDate: 1 });
AuctionSchema.index({ category: 1 });
AuctionSchema.index({ status: 1, endDate: 1 }); // Compound index for active auctions
AuctionSchema.index({ createdAt: -1 });
AuctionSchema.index({ isFeatured: 1, status: 1 });
