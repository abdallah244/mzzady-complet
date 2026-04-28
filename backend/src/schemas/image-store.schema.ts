import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ImageStoreDocument = ImageStore & Document;

@Schema({ timestamps: true })
export class ImageStore {
  @Prop({ type: String, required: true })
  contentType: string;

  @Prop({ type: Buffer, required: true })
  data: Buffer;

  @Prop({ type: String })
  originalName: string;
}

export const ImageStoreSchema = SchemaFactory.createForClass(ImageStore);
