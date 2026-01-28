import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  Res,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { HomeService } from './home.service';

@Controller('home')
export class HomeController {
  constructor(private readonly homeService: HomeService) {
    // Create uploads directory if it doesn't exist
    const uploadsDir = './uploads/home';
    if (!existsSync(uploadsDir)) {
      mkdirSync(uploadsDir, { recursive: true });
    }
  }

  @Post('upload/:section')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/home',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
      },
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
          return cb(new BadRequestException('Only image files are allowed!'), false);
        }
        cb(null, true);
      },
    }),
  )
  async uploadImage(
    @UploadedFile() file: any,
    @Param('section') section: string,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    if (section !== 'hero' && section !== 'howItWorks') {
      throw new BadRequestException('Invalid section. Must be "hero" or "howItWorks"');
    }

    const url = `/uploads/home/${file.filename}`;
    const image = await this.homeService.saveImage(
      url,
      section as 'hero' | 'howItWorks',
      file.filename,
      file.originalname,
      file.mimetype,
      file.size,
    );

    return {
      success: true,
      image: {
        id: image._id,
        url: image.url,
        section: image.section,
        order: image.order,
      },
    };
  }

  @Get('images')
  async getAllImages() {
    const images = await this.homeService.getImages();
    return {
      success: true,
      images: images.map((img) => ({
        id: img._id,
        url: img.url,
        section: img.section,
        order: img.order,
      })),
    };
  }

  @Get('images/:section')
  async getImagesBySection(@Param('section') section: string) {
    if (section !== 'hero' && section !== 'howItWorks') {
      throw new BadRequestException('Invalid section. Must be "hero" or "howItWorks"');
    }
    const images = await this.homeService.getImages(section as 'hero' | 'howItWorks');
    return {
      success: true,
      images: images.map((img) => ({
        id: img._id,
        url: img.url,
        section: img.section,
        order: img.order,
      })),
    };
  }

  @Delete('images/:id')
  async deleteImage(@Param('id') id: string) {
    await this.homeService.deleteImage(id);
    return { success: true, message: 'Image deleted successfully' };
  }
}

