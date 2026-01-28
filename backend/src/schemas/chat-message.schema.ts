import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ChatMessageDocument = ChatMessage & Document;

@Schema({ timestamps: true })
export class ChatMessage {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  senderId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  receiverId: Types.ObjectId;

  @Prop({ type: String, required: true })
  message: string;

  @Prop({ type: Types.ObjectId, ref: 'Auction', default: null })
  auctionId?: Types.ObjectId; // المزاد المرتبط بالدردشة

  @Prop({ type: Boolean, default: false })
  isRead: boolean;

  @Prop({ type: Date, default: null })
  readAt?: Date;

  @Prop({ type: String, default: null })
  messageType?: string; // text, image, file

  @Prop({ type: Object, default: {} })
  metadata?: any;
}

export const ChatMessageSchema = SchemaFactory.createForClass(ChatMessage);

// Database indexes for better query performance
ChatMessageSchema.index({ senderId: 1, receiverId: 1 });
ChatMessageSchema.index({ receiverId: 1, isRead: 1 });
ChatMessageSchema.index({ auctionId: 1 });
ChatMessageSchema.index({ createdAt: -1 });
