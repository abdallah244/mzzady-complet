import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { IdentityVerification, IdentityVerificationDocument, VerificationStatus, VerificationType } from '../schemas/identity-verification.schema';

@Injectable()
export class IdentityVerificationService {
  constructor(
    @InjectModel(IdentityVerification.name)
    private identityVerificationModel: Model<IdentityVerificationDocument>,
  ) {}

  async createVerificationRequest(
    userId: string,
    verificationType: VerificationType,
    idDocumentUrl: string,
    idDocumentFilename: string,
    addressDocumentUrl?: string,
    addressDocumentFilename?: string,
  ): Promise<IdentityVerificationDocument> {
    const verification = new this.identityVerificationModel({
      userId: new Types.ObjectId(userId),
      verificationType,
      status: VerificationStatus.PENDING,
      idDocumentUrl,
      idDocumentFilename,
      addressDocumentUrl,
      addressDocumentFilename,
    });

    return verification.save();
  }

  async verifyIdentity(
    verificationId: string,
    adminId: string,
    status: VerificationStatus,
    rejectionReason?: string,
  ): Promise<IdentityVerificationDocument> {
    const verification = await this.identityVerificationModel.findById(verificationId);
    if (!verification) {
      throw new Error('Verification not found');
    }

    verification.status = status;
    verification.verifiedBy = new Types.ObjectId(adminId);
    verification.verifiedAt = new Date();
    if (status === VerificationStatus.REJECTED) {
      verification.rejectionReason = rejectionReason;
    } else if (status === VerificationStatus.VERIFIED) {
      // التحقق صالح لمدة سنة
      verification.expiresAt = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
    }

    return verification.save();
  }

  async getUserVerification(userId: string): Promise<IdentityVerificationDocument | null> {
    return this.identityVerificationModel
      .findOne({ userId: new Types.ObjectId(userId) })
      .exec();
  }

  async isVerified(userId: string): Promise<boolean> {
    const verification = await this.getUserVerification(userId);
    return verification?.status === VerificationStatus.VERIFIED &&
           (!verification.expiresAt || verification.expiresAt > new Date());
  }
}
