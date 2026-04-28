import { Controller, Get, Param, Res, NotFoundException } from '@nestjs/common';
import type { Response } from 'express';
import { ImageStoreService } from './image-store.service';

@Controller('images')
export class ImageStoreController {
  constructor(private readonly imageStoreService: ImageStoreService) {}

  @Get(':id')
  async getImage(@Param('id') id: string, @Res() res: Response) {
    const image = await this.imageStoreService.getImage(id);
    if (!image) {
      throw new NotFoundException('Image not found');
    }
    res.set('Content-Type', image.contentType);
    res.set('Cache-Control', 'public, max-age=31536000, immutable');
    res.set('ETag', `"${id}"`);
    res.send(image.data);
  }
}
