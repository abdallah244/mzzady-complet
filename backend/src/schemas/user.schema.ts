import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: false, default: '' }) // Optional for OAuth users
  password: string;

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: false, default: '' }) // Optional
  middleName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true, unique: true })
  nickname: string;

  @Prop({ required: false, unique: true, sparse: true }) // Optional for OAuth users, sparse allows multiple nulls
  phone: string;

  @Prop({ required: false, unique: true, sparse: true }) // Optional for OAuth users
  nationalId: string;

  @Prop()
  nationalIdFrontUrl?: string;

  @Prop()
  nationalIdFrontFilename?: string;

  @Prop()
  nationalIdBackUrl?: string;

  @Prop()
  nationalIdBackFilename?: string;

  @Prop({ default: Date.now })
  lastActivity: Date;

  @Prop({ default: 0 })
  visitsThisMonth: number;

  @Prop({ default: false })
  isOnline: boolean;

  @Prop({ default: 0 })
  walletBalance: number;

  @Prop()
  profileImageUrl?: string;

  @Prop()
  profileImageFilename?: string;

  // OAuth provider info
  @Prop({ enum: ['local', 'google', 'facebook'], default: 'local' })
  authProvider: string;

  @Prop()
  oauthId?: string;

  // Profile completion status for OAuth users
  @Prop({ default: false })
  isProfileComplete: boolean;

  // Track if nickname was changed (one-time edit for OAuth users)
  @Prop({ default: false })
  nicknameChanged: boolean;

  // Track if email was verified (for OAuth users to verify once)
  @Prop({ default: false })
  emailVerified: boolean;

  createdAt?: Date;
  updatedAt?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

// Automatically exclude password from JSON responses
UserSchema.set('toJSON', {
  transform: (doc, ret) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...rest } = ret;
    return rest;
  },
});

UserSchema.set('toObject', {
  transform: (doc, ret) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...rest } = ret;
    return rest;
  },
});

// Database indexes for better query performance
UserSchema.index({ createdAt: -1 });
UserSchema.index({ authProvider: 1 });
