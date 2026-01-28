import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type CartItemDocument = CartItem & Document;

@Schema({ timestamps: true })
export class CartItem {
  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'User' })
  userId: MongooseSchema.Types.ObjectId;

  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'Product' })
  productId: MongooseSchema.Types.ObjectId;

  @Prop({ default: 'ground' })
  shippingMethod: 'ground' | 'air';

  @Prop({ default: false })
  insurance: boolean;

  @Prop({ default: 'pending' })
  status: 'pending' | 'paid' | 'completed' | 'cancelled';

  @Prop({ default: Date.now })
  addedAt: Date;

  @Prop()
  paidAt?: Date;

  createdAt?: Date;
  updatedAt?: Date;
}

export const CartItemSchema = SchemaFactory.createForClass(CartItem);

// Database indexes for better query performance
CartItemSchema.index({ userId: 1, status: 1 });
CartItemSchema.index({ productId: 1 });
CartItemSchema.index({ createdAt: -1 });
