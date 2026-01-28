import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type InvoiceDocument = Invoice & Document;

@Schema({ timestamps: true })
export class Invoice {
  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'User' })
  userId: MongooseSchema.Types.ObjectId;

  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'Product' })
  productId: MongooseSchema.Types.ObjectId;

  @Prop({
    required: true,
    type: MongooseSchema.Types.ObjectId,
    ref: 'CartItem',
  })
  cartItemId: MongooseSchema.Types.ObjectId;

  @Prop({ required: true })
  productName: string;

  @Prop({ required: true })
  productPrice: number;

  @Prop({ required: true })
  shippingMethod: 'ground' | 'air';

  @Prop({ required: true })
  shippingCost: number;

  @Prop({ required: true })
  insurance: boolean;

  @Prop({ required: true })
  insuranceCost: number;

  @Prop({ required: true })
  totalAmount: number;

  @Prop({ required: true })
  shippingAddress: string;

  @Prop({ required: true })
  country: string;

  @Prop({ required: true })
  governorate: string;

  @Prop({ required: true })
  contactPhone: string;

  @Prop({ required: true })
  deliveryLocation: string;

  @Prop({ default: Date.now })
  issuedAt: Date;

  createdAt?: Date;
  updatedAt?: Date;
}

export const InvoiceSchema = SchemaFactory.createForClass(Invoice);

// Database indexes for better query performance
InvoiceSchema.index({ userId: 1 });
InvoiceSchema.index({ productId: 1 });
InvoiceSchema.index({ createdAt: -1 });
InvoiceSchema.index({ userId: 1, createdAt: -1 });
