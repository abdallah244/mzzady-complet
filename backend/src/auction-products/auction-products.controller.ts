import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  UseInterceptors,
  UploadedFiles,
  BadRequestException,
  UseGuards,
  Req,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { AuctionProductsService } from './auction-products.service';
import { AdminGuard } from '../auth/admin.guard';

@Controller('auction-products')
export class AuctionProductsController {
  constructor(
    private readonly auctionProductsService: AuctionProductsService,
  ) {}

  @Post()
  @UseInterceptors(
    FilesInterceptor('images', 10, {
      storage: diskStorage({
        destination: './uploads/auction-products',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `product-${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
          cb(null, true);
        } else {
          cb(new Error('Only image files are allowed'), false);
        }
      },
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB per image
      },
    }),
  )
  async createProduct(
    @Body()
    body: {
      userId: string;
      productName: string;
      startingPrice: number;
      minBidIncrement?: number;
      durationInSeconds?: number;
    },
    @UploadedFiles() files: any[],
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException('At least one image is required');
    }

    if (files.length > 10) {
      throw new BadRequestException(
        'Maximum 10 images allowed (1 main + 9 additional)',
      );
    }

    if (!body.userId || !body.productName || !body.startingPrice) {
      throw new BadRequestException(
        'User ID, product name and starting price are required',
      );
    }

    if (!body.productName.trim()) {
      throw new BadRequestException('Product name cannot be empty');
    }

    if (body.startingPrice <= 0) {
      throw new BadRequestException('Starting price must be greater than 0');
    }

    const mainImage = files[0];
    const additionalImages = files.slice(1);

    const mainImageUrl = `/uploads/auction-products/${mainImage.filename}`;
    const mainImageFilename = mainImage.filename;

    const additionalImagesUrl = additionalImages.map(
      (img) => `/uploads/auction-products/${img.filename}`,
    );
    const additionalImagesFilename = additionalImages.map(
      (img) => img.filename,
    );

    const minBidIncrement = body.minBidIncrement
      ? parseFloat(body.minBidIncrement.toString())
      : 1;
    if (minBidIncrement < 1) {
      throw new BadRequestException('Min bid increment must be at least 1');
    }

    const durationInSeconds = body.durationInSeconds
      ? parseInt(body.durationInSeconds.toString(), 10)
      : 86400;
    const maxDuration = 7 * 24 * 60 * 60; // 7 days in seconds
    if (durationInSeconds < 1 || durationInSeconds > maxDuration) {
      throw new BadRequestException(
        'Duration must be between 1 second and 7 days',
      );
    }

    return this.auctionProductsService.createProduct(
      body.userId,
      body.productName.trim(),
      mainImageUrl,
      mainImageFilename,
      additionalImagesUrl,
      additionalImagesFilename,
      body.startingPrice,
      minBidIncrement,
      durationInSeconds,
    );
  }

  @Get()
  @UseGuards(AdminGuard)
  async getAllProducts() {
    return this.auctionProductsService.getAllProducts();
  }

  @Get('user/:userId')
  async getUserProducts(@Param('userId') userId: string) {
    return this.auctionProductsService.getUserProducts(userId);
  }

  @Get(':id')
  @UseGuards(AdminGuard)
  async getProductById(@Param('id') id: string) {
    return this.auctionProductsService.getProductById(id);
  }

  @Put(':id/approve')
  @UseGuards(AdminGuard)
  async approveProduct(@Param('id') id: string, @Req() req: any) {
    // Get admin ID from JWT user, session, or header
    const reviewedBy =
      req.user?.sub ||
      req.user?.id ||
      req.session?.adminId ||
      req.headers['x-admin-id'] ||
      'system-admin';
    return this.auctionProductsService.approveProduct(id, reviewedBy);
  }

  @Put(':id/reject')
  @UseGuards(AdminGuard)
  async rejectProduct(
    @Param('id') id: string,
    @Body() body: { adminNote: string },
    @Req() req: any,
  ) {
    if (!body.adminNote || !body.adminNote.trim()) {
      throw new BadRequestException('Admin note is required for rejection');
    }

    // Get admin ID from JWT user, session, or header
    const reviewedBy =
      req.user?.sub ||
      req.user?.id ||
      req.session?.adminId ||
      req.headers['x-admin-id'] ||
      'system-admin';
    return this.auctionProductsService.rejectProduct(
      id,
      reviewedBy,
      body.adminNote,
    );
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  async deleteProduct(@Param('id') id: string) {
    return this.auctionProductsService.deleteProduct(id);
  }

  @Delete('user/:userId/:id')
  async deleteUserProduct(
    @Param('userId') userId: string,
    @Param('id') id: string,
  ) {
    const product = await this.auctionProductsService.getProductById(id);
    if (!product) {
      throw new BadRequestException('Product not found');
    }

    // Verify the product belongs to the user
    if (product.userId.toString() !== userId) {
      throw new BadRequestException('You can only delete your own products');
    }

    // Only allow deletion if product is approved or rejected
    if (product.status === 'pending') {
      throw new BadRequestException('Cannot delete pending products');
    }

    return this.auctionProductsService.deleteProduct(id);
  }
}
