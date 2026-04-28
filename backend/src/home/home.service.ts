import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { HomeImage, HomeImageDocument } from '../schemas/home-image.schema';

@Injectable()
export class HomeService {
  constructor(
    @InjectModel(HomeImage.name)
    private homeImageModel: Model<HomeImageDocument>,
  ) {}

  async saveImage(
    url: string,
    section: 'hero' | 'howItWorks' | 'about',
    filename: string,
    originalName: string,
    mimetype: string,
    size: number,
  ): Promise<HomeImageDocument> {
    // Get current max order for this section
    const maxOrder = await this.homeImageModel
      .findOne({ section })
      .sort({ order: -1 })
      .exec();

    const newOrder = maxOrder ? maxOrder.order + 1 : 0;

    const image = new this.homeImageModel({
      url,
      section,
      filename,
      originalName,
      mimetype,
      size,
      order: newOrder,
    });

    return image.save();
  }

  async getImages(section?: 'hero' | 'howItWorks' | 'about'): Promise<HomeImageDocument[]> {
    const query = section ? { section } : {};
    return this.homeImageModel.find(query).sort({ order: 1 }).exec();
  }

  async deleteImage(id: string): Promise<void> {
    await this.homeImageModel.findByIdAndDelete(id).exec();
  }

  async deleteAllImages(section: 'hero' | 'howItWorks'): Promise<void> {
    await this.homeImageModel.deleteMany({ section }).exec();
  }
}

