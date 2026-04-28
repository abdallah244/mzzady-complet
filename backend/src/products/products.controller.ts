import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProductsService } from './products.service';
import { AdminGuard } from '../auth/admin.guard';
import { ImageCompressionService } from '../image-compression.service';
import { storage } from '../cloudinary.config';
import { extname } from 'path';
import { existsSync, mkdirSync } from 'fs';

interface MulterFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  destination: string;
  filename: string;
  path: string;
  buffer: Buffer;
}

@Controller('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly imageCompression: ImageCompressionService,
  ) {}

  @Post()
  @UseGuards(AdminGuard)
  @UseInterceptors(
    FileInterceptor('image', {
      storage: storage,
      fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
          return cb(
            new BadRequestException('Only image files are allowed!'),
            false,
          );
        }
        cb(null, true);
      },
    }),
  )
  async createProduct(
    @UploadedFile() file: MulterFile,
    @Body() body: { productName: string; price: string; userId: string },
  ) {
    if (!file) {
      throw new BadRequestException('Product image is required');
    }

    // Compress product image and store in MongoDB
    const imageUrl = await this.imageCompression.compressAndStoreProduct(
      file.path,
    );
    const imageFilename = imageUrl;
    return this.productsService.createProduct(
      body.productName,
      parseFloat(body.price),
      imageUrl,
      imageFilename,
      body.userId,
    );
  }

  @Get()
  async getAllProducts() {
    return this.productsService.getAllProducts();
  }

  @Get(':id')
  async getProductById(@Param('id') id: string) {
    return this.productsService.getProductById(id);
  }

  @Put(':id/status')
  @UseGuards(AdminGuard)
  async updateProductStatus(
    @Param('id') id: string,
    @Body('status') status: 'pending' | 'available' | 'sold',
  ) {
    return this.productsService.updateProductStatus(id, status);
  }

  @Put(':id/approve')
  @UseGuards(AdminGuard)
  async approveProduct(@Param('id') id: string) {
    return this.productsService.approveProduct(id);
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  async deleteProduct(@Param('id') id: string) {
    await this.productsService.deleteProduct(id);
    return { message: 'Product deleted successfully' };
  }

  @Get(':id/payment-info')
  @UseGuards(AdminGuard)
  async getProductPaymentInfo(@Param('id') productId: string) {
    return this.productsService.getProductPaymentInfo(productId);
  }
}
