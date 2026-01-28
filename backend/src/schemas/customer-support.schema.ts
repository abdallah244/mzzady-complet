import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CustomerSupportDocument = CustomerSupport & Document;

export enum SupportCategory {
  DELETE_ACCOUNT = 'delete_account',
  DEPOSIT_ISSUE = 'deposit_issue',
  PRODUCT_ISSUE = 'product_issue',
  TECHNICAL_ISSUE = 'technical_issue',
  GENERAL_INQUIRY = 'general_inquiry',
  COMPLAINT = 'complaint',
}

export enum SupportStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  RESOLVED = 'resolved',
  CLOSED = 'closed',
}

@Schema({ timestamps: true })
export class CustomerSupport {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: String, enum: SupportCategory, required: true })
  category: SupportCategory;

  @Prop({ type: String, required: true })
  subject: string;

  @Prop({ type: String, required: true })
  message: string;

  @Prop({ type: String, enum: SupportStatus, default: SupportStatus.PENDING })
  status: SupportStatus;

  @Prop({ type: Types.ObjectId, ref: 'User', default: null })
  reviewedBy?: Types.ObjectId;

  @Prop({ type: String, default: null })
  adminResponse?: string;

  @Prop({ type: Date, default: null })
  respondedAt?: Date;
}

export const CustomerSupportSchema =
  SchemaFactory.createForClass(CustomerSupport);

// Database indexes for better query performance
CustomerSupportSchema.index({ userId: 1 });
CustomerSupportSchema.index({ status: 1 });
CustomerSupportSchema.index({ category: 1 });
CustomerSupportSchema.index({ createdAt: -1 });
