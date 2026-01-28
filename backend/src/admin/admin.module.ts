import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { User, UserSchema } from '../schemas/user.schema';
import { MoneyRequest, MoneyRequestSchema } from '../schemas/money-request.schema';
import { CustomerSupport, CustomerSupportSchema } from '../schemas/customer-support.schema';
import { JobApplication, JobApplicationSchema } from '../schemas/job-application.schema';
import { AuctionProduct, AuctionProductSchema } from '../schemas/auction-product.schema';
import { Auction, AuctionSchema } from '../schemas/auction.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: MoneyRequest.name, schema: MoneyRequestSchema },
      { name: CustomerSupport.name, schema: CustomerSupportSchema },
      { name: JobApplication.name, schema: JobApplicationSchema },
      { name: AuctionProduct.name, schema: AuctionProductSchema },
      { name: Auction.name, schema: AuctionSchema },
    ]),
  ],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}

