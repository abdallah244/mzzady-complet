import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ShippingTrackingDocument = ShippingTracking & Document;

export enum ShippingStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  IN_TRANSIT = 'in_transit',
  OUT_FOR_DELIVERY = 'out_for_delivery',
  DELIVERED = 'delivered',
  RETURNED = 'returned',
  CANCELLED = 'cancelled',
}

@Schema({ timestamps: true })
export class ShippingTracking {
  @Prop({ type: Types.ObjectId, ref: 'Invoice', required: true, unique: true })
  invoiceId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: String, enum: ShippingStatus, default: ShippingStatus.PENDING })
  status: ShippingStatus;

  @Prop({ type: String, default: null })
  trackingNumber?: string;

  @Prop({ type: String, default: null })
  carrier?: string; // شركة الشحن

  @Prop({ type: String, required: true })
  shippingAddress: string;

  @Prop({ type: String, default: null })
  estimatedDeliveryDate?: string;

  @Prop({ type: Date, default: null })
  shippedAt?: Date;

  @Prop({ type: Date, default: null })
  deliveredAt?: Date;

  @Prop({ type: [Object], default: [] })
  trackingHistory: Array<{
    status: ShippingStatus;
    location?: string;
    timestamp: Date;
    description?: string;
  }>;

  @Prop({ type: Object, default: {} })
  metadata?: any;
}

export const ShippingTrackingSchema =
  SchemaFactory.createForClass(ShippingTracking);

// Database indexes for better query performance
ShippingTrackingSchema.index({ userId: 1 });
ShippingTrackingSchema.index({ status: 1 });
ShippingTrackingSchema.index({ trackingNumber: 1 });
