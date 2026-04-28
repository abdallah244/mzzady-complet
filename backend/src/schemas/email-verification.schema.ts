import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type EmailVerificationDocument = EmailVerification & Document;

@Schema({ timestamps: true })
export class EmailVerification {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  code: string;

  // بيحدد امتى الكود يبقى Expired (للتحقق بس)
  @Prop({ required: true })
  expiresAt: Date;

  @Prop({ default: false })
  verified: boolean;

  // ✅ بيتحدد بعد التحقق علشان يتحذف بعد 10 دقايق
  @Prop({ default: null })
  deleteAt?: Date;
}

export const EmailVerificationSchema =
  SchemaFactory.createForClass(EmailVerification);

// ✅ Auto-delete when deleteAt time passes
EmailVerificationSchema.index({ deleteAt: 1 }, { expireAfterSeconds: 0 });
