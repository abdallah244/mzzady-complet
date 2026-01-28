import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type EmailVerificationDocument = EmailVerification & Document;

@Schema({ timestamps: true })
export class EmailVerification {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  code: string;

  @Prop({ required: true })
  expiresAt: Date;

  @Prop({ default: false })
  verified: boolean;
}

export const EmailVerificationSchema = SchemaFactory.createForClass(EmailVerification);

// Auto-delete expired verifications after 10 minutes
EmailVerificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

