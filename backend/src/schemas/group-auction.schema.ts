import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type GroupAuctionDocument = GroupAuction & Document;

@Schema({ timestamps: true })
export class GroupAuction {
  @Prop({ type: Types.ObjectId, ref: 'Auction', required: true, unique: true })
  auctionId: Types.ObjectId; // المزاد الأصلي

  @Prop({ type: Number, required: true })
  targetParticipants: number; // عدد المشاركين المطلوب

  @Prop({ type: [Types.ObjectId], ref: 'User', default: [] })
  participants: Types.ObjectId[]; // المشاركون

  @Prop({ type: Number, required: true })
  pricePerParticipant: number; // السعر لكل مشارك

  @Prop({ type: String, enum: ['open', 'closed', 'completed'], default: 'open' })
  status: string;

  @Prop({ type: Date, default: null })
  completedAt?: Date;

  @Prop({ type: Object, default: {} })
  metadata?: any;
}

export const GroupAuctionSchema = SchemaFactory.createForClass(GroupAuction);
