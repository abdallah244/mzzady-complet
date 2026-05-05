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
  BadRequestException,
  UseGuards,
  Req,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { JobApplicationService } from './job-applications.service';
import { AdminGuard } from '../auth/admin.guard';

@Controller('job-applications')
export class JobApplicationController {
  constructor(private readonly jobApplicationService: JobApplicationService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('cvFile', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const uploadPath = './uploads/cvs';
          if (!existsSync(uploadPath)) {
            mkdirSync(uploadPath, { recursive: true });
          }
          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `cv-${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf') {
          cb(null, true);
        } else {
          cb(new Error('Only PDF files are allowed'), false);
        }
      },
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB
      },
    }),
  )
  async createApplication(
    @Body()
    body: {
      userId: string;
      category: string;
      backupEmail: string;
      whatsappPhone: string;
      linkedinUrl?: string;
      githubUrl?: string;
      facebookUrl?: string;
      experience: string;
    },
    @UploadedFile() file: any,
  ) {
    if (!file) {
      throw new BadRequestException('CV file is required');
    }

    if (
      !body.userId ||
      !body.category ||
      !body.backupEmail ||
      !body.whatsappPhone ||
      !body.experience
    ) {
      throw new BadRequestException('All required fields must be provided');
    }

    const cvFileUrl = `/uploads/cvs/${file.filename}`;
    const cvFilename = file.filename;

    return this.jobApplicationService.createApplication(
      body.userId,
      body.category,
      body.backupEmail,
      body.whatsappPhone,
      body.linkedinUrl || null,
      body.githubUrl || null,
      body.facebookUrl || null,
      cvFileUrl,
      cvFilename,
      body.experience,
    );
  }

  @Get()
  @UseGuards(AdminGuard)
  async getAllApplications() {
    return this.jobApplicationService.getAllApplications();
  }

  @Get(':id')
  @UseGuards(AdminGuard)
  async getApplicationById(@Param('id') id: string) {
    return this.jobApplicationService.getApplicationById(id);
  }

  @Put(':id/status')
  @UseGuards(AdminGuard)
  async updateApplicationStatus(
    @Param('id') id: string,
    @Body() body: { status: 'pending' | 'reviewed' | 'accepted' | 'rejected' },
  ) {
    if (!body.status) {
      throw new BadRequestException('Status is required');
    }

    return this.jobApplicationService.updateApplicationStatus(id, body.status);
  }

  @Put(':id/respond')
  @UseGuards(AdminGuard)
  async respondToApplication(
    @Param('id') id: string,
    @Body() body: { status: 'accepted' | 'rejected'; adminNote: string },
    @Req() req: any,
  ) {
    if (!body.status || !body.adminNote) {
      throw new BadRequestException('Status and admin note are required');
    }

    // Get admin ID from JWT user, session, or header
    const reviewedBy =
      req.user?.sub ||
      req.user?.id ||
      req.session?.adminId ||
      req.headers['x-admin-id'] ||
      'system-admin';

    return this.jobApplicationService.respondToApplication(
      id,
      body.status,
      body.adminNote,
      reviewedBy,
    );
  }

  @Get('user/:email')
  async getUserApplications(@Param('email') email: string) {
    return this.jobApplicationService.getApplicationByEmail(email);
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  async deleteApplication(@Param('id') id: string) {
    return this.jobApplicationService.deleteApplication(id);
  }
}
