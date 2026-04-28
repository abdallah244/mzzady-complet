import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ImageStore, ImageStoreDocument } from '../schemas/image-store.schema';
import * as fs from 'fs';

@Injectable()
export class ImageStoreService {
  private readonly logger = new Logger(ImageStoreService.name);

  constructor(
    @InjectModel(ImageStore.name)
    private imageModel: Model<ImageStoreDocument>,
  ) {}

  /**
   * Save a file (from disk path) to MongoDB and return
   * the URL path to access it: /images/<id>
   */
  async saveFromFile(
    filePath: string,
    contentType: string,
    originalName?: string,
  ): Promise<string> {
    const data = fs.readFileSync(filePath);
    const image = new this.imageModel({
      contentType,
      data,
      originalName: originalName || filePath,
    });
    const saved = await image.save();
    this.logger.log(
      `Stored image in MongoDB: ${originalName || filePath} (${(data.length / 1024).toFixed(0)}KB) → /images/${saved._id}`,
    );
    return `/images/${saved._id}`;
  }

  /**
   * Save a Buffer directly to MongoDB.
   */
  async saveFromBuffer(
    buffer: Buffer,
    contentType: string,
    originalName?: string,
  ): Promise<string> {
    const image = new this.imageModel({
      contentType,
      data: buffer,
      originalName,
    });
    const saved = await image.save();
    this.logger.log(
      `Stored image in MongoDB: ${originalName} (${(buffer.length / 1024).toFixed(0)}KB) → /images/${saved._id}`,
    );
    return `/images/${saved._id}`;
  }

  /**
   * Retrieve an image by ID.
   */
  async getImage(
    id: string,
  ): Promise<{ contentType: string; data: Buffer } | null> {
    const image = await this.imageModel.findById(id).exec();
    if (!image) {
      throw new NotFoundException('Image not found');
    }
    return { contentType: image.contentType, data: image.data };
  }
}
