import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { IdentityVerification, IdentityVerificationSchema } from '../schemas/identity-verification.schema';
import { IdentityVerificationController } from './identity-verification.controller';
import { IdentityVerificationService } from './identity-verification.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: IdentityVerification.name, schema: IdentityVerificationSchema },
    ]),
  ],
  controllers: [IdentityVerificationController],
  providers: [IdentityVerificationService],
  exports: [IdentityVerificationService],
})
export class IdentityVerificationModule {}
