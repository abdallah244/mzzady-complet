import { Controller, Get, Post, Put, Param, Body } from '@nestjs/common';
import { IdentityVerificationService } from './identity-verification.service';
import { VerificationType, VerificationStatus } from '../schemas/identity-verification.schema';

@Controller('identity-verification')
export class IdentityVerificationController {
  constructor(private readonly identityVerificationService: IdentityVerificationService) {}

  @Post()
  async createVerificationRequest(@Body() body: { userId: string; verificationType: VerificationType; idDocumentUrl: string; idDocumentFilename: string; addressDocumentUrl?: string; addressDocumentFilename?: string }) {
    return this.identityVerificationService.createVerificationRequest(
      body.userId,
      body.verificationType,
      body.idDocumentUrl,
      body.idDocumentFilename,
      body.addressDocumentUrl,
      body.addressDocumentFilename,
    );
  }

  @Get('user/:userId')
  async getUserVerification(@Param('userId') userId: string) {
    return this.identityVerificationService.getUserVerification(userId);
  }

  @Get('user/:userId/is-verified')
  async isVerified(@Param('userId') userId: string) {
    const isVerified = await this.identityVerificationService.isVerified(userId);
    return { isVerified };
  }

  @Put(':id/verify')
  async verifyIdentity(@Param('id') id: string, @Body() body: { adminId: string; status: VerificationStatus; rejectionReason?: string }) {
    return this.identityVerificationService.verifyIdentity(
      id,
      body.adminId,
      body.status,
      body.rejectionReason,
    );
  }
}
