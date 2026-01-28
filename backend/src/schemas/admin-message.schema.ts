import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type AdminMessageDocument = AdminMessage & Document;

@Schema({ timestamps: true })
export class AdminMessage {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  subject: string;

  @Prop({ required: true })
  message: string;

  @Prop({ default: false })
  read: boolean;

  createdAt?: Date;
  updatedAt?: Date;
}

export const AdminMessageSchema = SchemaFactory.createForClass(AdminMessage);

// Database indexes for better query performance
AdminMessageSchema.index({ userId: 1 });
AdminMessageSchema.index({ read: 1 });
AdminMessageSchema.index({ createdAt: -1 });
AdminMessageSchema.index({ userId: 1, read: 1 });
