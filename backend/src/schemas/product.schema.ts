import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type ProductDocument = Product & Document;

@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true })
  productName: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  imageUrl: string;

  @Prop()
  imageFilename?: string;

  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'User' })
  userId: MongooseSchema.Types.ObjectId;

  @Prop({ default: 'pending' })
  status: 'pending' | 'available' | 'sold';

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Auction', default: null })
  auctionId?: MongooseSchema.Types.ObjectId;

  @Prop({ default: Date.now })
  addedAt: Date;

  createdAt?: Date;
  updatedAt?: Date;
}

export const ProductSchema = SchemaFactory.createForClass(Product);

// Database indexes for better query performance
ProductSchema.index({ userId: 1 });
ProductSchema.index({ status: 1 });
ProductSchema.index({ auctionId: 1 });
ProductSchema.index({ createdAt: -1 });
ProductSchema.index({ userId: 1, status: 1 });
