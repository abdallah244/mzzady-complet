import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type SellerLikeDocument = SellerLike & Document;

@Schema({ timestamps: true })
export class SellerLike {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  sellerId: Types.ObjectId; // البائع الذي تم الإعجاب به

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId; // المستخدم الذي أعجب بالبائع

  @Prop({ type: Date, default: Date.now })
  likedAt: Date;
}

export const SellerLikeSchema = SchemaFactory.createForClass(SellerLike);

// Compound index to ensure one like per user per seller
SellerLikeSchema.index({ sellerId: 1, userId: 1 }, { unique: true });
