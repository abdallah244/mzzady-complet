import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type PrivateAuctionDocument = PrivateAuction & Document;

@Schema({ timestamps: true })
export class PrivateAuction {
  @Prop({ type: Types.ObjectId, ref: 'Auction', required: true, unique: true })
  auctionId: Types.ObjectId; // المزاد الأصلي

  @Prop({ type: [Types.ObjectId], ref: 'User', default: [] })
  invitedUsers: Types.ObjectId[]; // المستخدمون المدعوون

  @Prop({ type: Boolean, default: false })
  isExclusive: boolean; // حصري للمستخدمين المميزين

  @Prop({ type: String, default: null })
  inviteCode?: string; // كود الدعوة

  @Prop({ type: Number, default: null })
  minMembershipLevel?: number; // الحد الأدنى لمستوى العضوية

  @Prop({ type: Object, default: {} })
  metadata?: any;
}

export const PrivateAuctionSchema = SchemaFactory.createForClass(PrivateAuction);
