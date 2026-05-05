import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  Req,
  UnauthorizedException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { MoneyRequestsService } from './money-requests.service';
import { AdminGuard } from '../auth/admin.guard';
import { ImageCompressionService } from '../image-compression.service';

@Controller('money-requests')
export class MoneyRequestsController {
  constructor(
    private readonly moneyRequestsService: MoneyRequestsService,
    private readonly imageCompression: ImageCompressionService,
  ) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('depositImage', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const uploadPath = './uploads/deposits';
          if (!existsSync(uploadPath)) {
            mkdirSync(uploadPath, { recursive: true });
          }
          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, `deposit-${uniqueSuffix}${ext}`);
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
        fileSize: 5 * 1024 * 1024, // 5MB
      },
    }),
  )
  async createRequest(
    @Body() body: { amount: string; phoneNumber: string; userId: string },
    @UploadedFile() file: any,
  ) {
    const userId = body.userId;
    if (!userId) {
      throw new UnauthorizedException('User ID is required');
    }

    if (!file) {
      throw new Error('Deposit image is required');
    }

    const amount = parseFloat(body.amount);
    if (isNaN(amount) || amount <= 0) {
      throw new Error('Invalid amount');
    }

    // Compress deposit proof image and store in MongoDB
    const depositImageUrl = await this.imageCompression.compressAndStoreProduct(
      file.path,
    );
    const depositImageFilename = depositImageUrl;

    const request = await this.moneyRequestsService.createRequest(
      userId,
      amount,
      body.phoneNumber || '01142402039',
      depositImageUrl,
      depositImageFilename,
    );

    return request;
  }

  @Get()
  @UseGuards(AdminGuard)
  async getAllRequests() {
    return this.moneyRequestsService.getAllRequests();
  }

  @Get('user/:userId')
  async getUserRequests(@Param('userId') userId: string, @Req() req: any) {
    // Verify that the user is requesting their own requests
    const currentUserId = req.user?.id || req.body?.userId;
    if (currentUserId && currentUserId !== userId) {
      throw new Error('Unauthorized');
    }
    return this.moneyRequestsService.getUserRequests(userId);
  }

  @Delete('user/:userId/:id')
  async deleteUserRequest(
    @Param('userId') userId: string,
    @Param('id') id: string,
  ) {
    try {
      // Verify that the request belongs to the user
      const request = await this.moneyRequestsService.getRequestById(id);
      if (!request) {
        throw new NotFoundException('Request not found');
      }

      // Check if request belongs to user
      const requestUserId = request.userId.toString();
      if (requestUserId !== userId) {
        throw new UnauthorizedException(
          'Unauthorized: You can only delete your own requests',
        );
      }

      // Only allow deletion of approved or rejected requests
      if (request.status === 'pending') {
        throw new BadRequestException('Cannot delete pending requests');
      }

      const deleted = await this.moneyRequestsService.deleteRequest(id);
      if (!deleted) {
        throw new NotFoundException('Request not found');
      }

      return { success: true, message: 'Request deleted successfully' };
    } catch (error) {
      if (
        error instanceof UnauthorizedException ||
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new Error('Failed to delete request');
    }
  }

  @Get(':id')
  @UseGuards(AdminGuard)
  async getRequestById(@Param('id') id: string) {
    return this.moneyRequestsService.getRequestById(id);
  }

  @Put(':id/approve')
  @UseGuards(AdminGuard)
  async approveRequest(
    @Param('id') id: string,
    @Body() body: { reviewNote?: string },
    @Req() req: any,
  ) {
    // Get admin ID from JWT user, session, or header
    const reviewedBy =
      req.user?.sub ||
      req.user?.id ||
      req.session?.adminId ||
      req.headers['x-admin-id'] ||
      'system-admin';

    return this.moneyRequestsService.approveRequest(
      id,
      reviewedBy,
      body.reviewNote,
    );
  }

  @Put(':id/reject')
  @UseGuards(AdminGuard)
  async rejectRequest(
    @Param('id') id: string,
    @Body() body: { reviewNote?: string },
    @Req() req: any,
  ) {
    // Get admin ID from JWT user, session, or header
    const reviewedBy =
      req.user?.sub ||
      req.user?.id ||
      req.session?.adminId ||
      req.headers['x-admin-id'] ||
      'system-admin';

    return this.moneyRequestsService.rejectRequest(
      id,
      reviewedBy,
      body.reviewNote,
    );
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  async deleteRequest(@Param('id') id: string) {
    return this.moneyRequestsService.deleteRequest(id);
  }
}
