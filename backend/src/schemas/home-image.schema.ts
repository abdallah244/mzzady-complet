import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type HomeImageDocument = HomeImage & Document;

@Schema({ timestamps: true })
export class HomeImage {
  @Prop({ required: true })
  url: string;

  @Prop({ required: true, enum: ['hero', 'howItWorks'] })
  section: string;

  @Prop({ required: true })
  filename: string;

  @Prop({ required: true })
  originalName: string;

  @Prop({ required: true })
  mimetype: string;

  @Prop({ required: true })
  size: number;

  @Prop({ default: 0 })
  order: number;
}

export const HomeImageSchema = SchemaFactory.createForClass(HomeImage);

