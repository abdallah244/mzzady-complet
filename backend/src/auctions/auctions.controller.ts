import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseInterceptors,
  UploadedFiles,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { AuctionsService } from './auctions.service';
import { AdminGuard } from '../auth/admin.guard';

interface MulterFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  filename: string;
  path: string;
  size: number;
}

@Controller('auctions')
export class AuctionsController {
  constructor(private readonly auctionsService: AuctionsService) {}

  @Post()
  @UseGuards(AdminGuard)
  @UseInterceptors(
    FilesInterceptor('images', 10, {
      storage: diskStorage({
        destination: './uploads/auctions',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, `auction-${uniqueSuffix}${ext}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
          cb(null, true);
        } else {
          cb(new BadRequestException('Only image files are allowed'), false);
        }
      },
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB per file
      },
    }),
  )
  async createAuction(@Body() body: any, @UploadedFiles() files: MulterFile[]) {
    const {
      productName,
      sellerId,
      startingPrice,
      minBidIncrement,
      durationInSeconds,
      isFeatured,
      category,
    } = body;

    if (
      !productName ||
      !sellerId ||
      !startingPrice ||
      !files ||
      files.length === 0
    ) {
      throw new BadRequestException('Missing required fields');
    }

    if (files.length > 10) {
      throw new BadRequestException(
        'Maximum 10 images allowed (1 main + 9 additional)',
      );
    }

    const mainImage = files[0];
    const additionalImages = files.slice(1, 10); // Limit to 9 additional images (total 10: 1 main + 9 additional)

    const mainImageUrl = `/uploads/auctions/${mainImage.filename}`;
    const mainImageFilename = mainImage.filename;

    const additionalImagesUrl = additionalImages.map(
      (file) => `/uploads/auctions/${file.filename}`,
    );
    const additionalImagesFilename = additionalImages.map(
      (file) => file.filename,
    );

    const duration = parseInt(durationInSeconds, 10);
    const price = parseFloat(startingPrice);
    const increment = parseFloat(minBidIncrement) || 1;
    const featured = isFeatured === 'true' || isFeatured === true;

    return this.auctionsService.createAuction(
      productName,
      sellerId,
      price,
      increment,
      mainImageUrl,
      mainImageFilename,
      additionalImagesUrl,
      additionalImagesFilename,
      duration,
      featured,
      category || 'other',
    );
  }

  @Get()
  async getAllAuctions(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('category') category?: string,
    @Query('status') status?: string,
    @Query('search') search?: string,
  ) {
    const pageNum = parseInt(page || '1', 10);
    const limitNum = parseInt(limit || '20', 10);
    return this.auctionsService.getAllAuctionsPaginated(
      pageNum,
      limitNum,
      category,
      status,
      search,
    );
  }

  @Get('active')
  async getActiveAuctions(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const pageNum = parseInt(page || '1', 10);
    const limitNum = parseInt(limit || '20', 10);
    return this.auctionsService.getActiveAuctionsPaginated(pageNum, limitNum);
  }

  @Get('featured')
  async getFeaturedAuctions() {
    return this.auctionsService.getFeaturedAuctions();
  }

  @Get(':id')
  async getAuctionById(@Param('id') id: string) {
    return this.auctionsService.getAuctionById(id);
  }

  @Put(':id/settings')
  @UseGuards(AdminGuard)
  async updateAuctionSettings(
    @Param('id') id: string,
    @Body()
    body: {
      minBidIncrement?: number;
      durationInSeconds?: number;
      productName?: string;
      category?: string;
      isFeatured?: boolean;
    },
  ) {
    return this.auctionsService.updateAuctionSettings(id, body);
  }

  @Put(':id/activate')
  @UseGuards(AdminGuard)
  async activateAuction(@Param('id') id: string) {
    return this.auctionsService.activateAuction(id);
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  async deleteAuction(@Param('id') id: string) {
    await this.auctionsService.deleteAuction(id);
    return { success: true, message: 'Auction deleted successfully' };
  }
}
