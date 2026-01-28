import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type IdentityVerificationDocument = IdentityVerification & Document;

export enum VerificationStatus {
  PENDING = 'pending',
  VERIFIED = 'verified',
  REJECTED = 'rejected',
}

export enum VerificationType {
  SELLER = 'seller',
  BUYER = 'buyer',
  BOTH = 'both',
}

@Schema({ timestamps: true })
export class IdentityVerification {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, unique: true })
  userId: Types.ObjectId;

  @Prop({ type: String, enum: VerificationType, required: true })
  verificationType: VerificationType;

  @Prop({ type: String, enum: VerificationStatus, default: VerificationStatus.PENDING })
  status: VerificationStatus;

  @Prop({ type: String, default: null })
  idDocumentUrl?: string; // رابط وثيقة الهوية

  @Prop({ type: String, default: null })
  idDocumentFilename?: string;

  @Prop({ type: String, default: null })
  addressDocumentUrl?: string; // رابط وثيقة العنوان

  @Prop({ type: String, default: null })
  addressDocumentFilename?: string;

  @Prop({ type: Types.ObjectId, ref: 'User', default: null })
  verifiedBy?: Types.ObjectId; // من قام بالتحقق

  @Prop({ type: String, default: null })
  rejectionReason?: string; // سبب الرفض

  @Prop({ type: Date, default: null })
  verifiedAt?: Date;

  @Prop({ type: Date, default: null })
  expiresAt?: Date; // تاريخ انتهاء التحقق

  @Prop({ type: Object, default: {} })
  metadata?: any;
}

export const IdentityVerificationSchema = SchemaFactory.createForClass(IdentityVerification);
