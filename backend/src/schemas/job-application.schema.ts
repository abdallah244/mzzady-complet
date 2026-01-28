import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type JobApplicationDocument = JobApplication & Document;

export enum JobCategory {
  FRONTEND_DEVELOPER = 'frontend_developer',
  BACKEND_DEVELOPER = 'backend_developer',
  FULL_STACK_DEVELOPER = 'full_stack_developer',
  UI_UX_DESIGNER = 'ui_ux_designer',
  GRAPHIC_DESIGNER = 'graphic_designer',
  MARKETING_SPECIALIST = 'marketing_specialist',
  CONTENT_WRITER = 'content_writer',
  DATA_ANALYST = 'data_analyst',
  PROJECT_MANAGER = 'project_manager',
  OTHER = 'other',
}

@Schema({ timestamps: true })
export class JobApplication {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: String, enum: JobCategory, required: true })
  category: JobCategory;

  @Prop({ type: String, required: true })
  backupEmail: string;

  @Prop({ type: String, required: true })
  whatsappPhone: string;

  @Prop({ type: String, default: null })
  linkedinUrl?: string;

  @Prop({ type: String, default: null })
  githubUrl?: string;

  @Prop({ type: String, default: null })
  facebookUrl?: string;

  @Prop({ type: String, required: true })
  cvFileUrl: string;

  @Prop({ type: String, required: true })
  cvFilename: string;

  @Prop({ type: String, required: true })
  experience: string;

  @Prop({
    type: String,
    enum: ['pending', 'reviewed', 'accepted', 'rejected'],
    default: 'pending',
  })
  status: string;

  @Prop({ type: String, default: null })
  adminNote?: string;

  @Prop({ type: String, default: null })
  reviewedBy?: string;

  @Prop({ type: Date, default: null })
  reviewedAt?: Date;
}

export const JobApplicationSchema =
  SchemaFactory.createForClass(JobApplication);

// Database indexes for better query performance
JobApplicationSchema.index({ userId: 1 });
JobApplicationSchema.index({ status: 1 });
JobApplicationSchema.index({ category: 1 });
JobApplicationSchema.index({ createdAt: -1 });
