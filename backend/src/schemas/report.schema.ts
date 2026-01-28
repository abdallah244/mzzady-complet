import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ReportDocument = Report & Document;

export enum ReportType {
  AUCTION = 'auction',
  USER = 'user',
  PRODUCT = 'product',
  REVIEW = 'review',
  OTHER = 'other',
}

export enum ReportStatus {
  PENDING = 'pending',
  REVIEWING = 'reviewing',
  RESOLVED = 'resolved',
  REJECTED = 'rejected',
}

@Schema({ timestamps: true })
export class Report {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  reporterId: Types.ObjectId; // من قام بالإبلاغ

  @Prop({ type: String, enum: ReportType, required: true })
  reportType: ReportType;

  @Prop({ type: Types.ObjectId, ref: 'Auction', default: null })
  auctionId?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', default: null })
  reportedUserId?: Types.ObjectId; // المستخدم المبلغ عنه

  @Prop({ type: Types.ObjectId, ref: 'Product', default: null })
  productId?: Types.ObjectId;

  @Prop({ type: String, required: true })
  reason: string; // سبب الإبلاغ

  @Prop({ type: String, default: null })
  description?: string; // وصف إضافي

  @Prop({ type: String, enum: ReportStatus, default: ReportStatus.PENDING })
  status: ReportStatus;

  @Prop({ type: Types.ObjectId, ref: 'User', default: null })
  reviewedBy?: Types.ObjectId; // من راجع البلاغ

  @Prop({ type: String, default: null })
  adminResponse?: string; // رد الأدمن

  @Prop({ type: Date, default: null })
  reviewedAt?: Date;

  @Prop({ type: Object, default: {} })
  metadata?: any;
}

export const ReportSchema = SchemaFactory.createForClass(Report);

// Database indexes for better query performance
ReportSchema.index({ reporterId: 1 });
ReportSchema.index({ reportedUserId: 1 });
ReportSchema.index({ status: 1 });
ReportSchema.index({ reportType: 1 });
ReportSchema.index({ createdAt: -1 });
