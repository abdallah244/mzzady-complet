import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type MoneyRequestDocument = MoneyRequest & Document;

@Schema({ timestamps: true })
export class MoneyRequest {
  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'User' })
  userId: MongooseSchema.Types.ObjectId;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true, default: '01142402039' })
  phoneNumber: string;

  @Prop({ required: true })
  depositImageUrl: string;

  @Prop({ required: true })
  depositImageFilename: string;

  @Prop({
    required: true,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  })
  status: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  reviewedBy?: MongooseSchema.Types.ObjectId;

  @Prop()
  reviewNote?: string;

  createdAt: Date;
  updatedAt: Date;
}

export const MoneyRequestSchema = SchemaFactory.createForClass(MoneyRequest);

// Database indexes for better query performance
MoneyRequestSchema.index({ userId: 1 });
MoneyRequestSchema.index({ status: 1 });
MoneyRequestSchema.index({ createdAt: -1 });
MoneyRequestSchema.index({ userId: 1, status: 1 });
