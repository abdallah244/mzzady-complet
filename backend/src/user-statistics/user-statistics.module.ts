import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  UserStatistics,
  UserStatisticsSchema,
} from '../schemas/user-statistics.schema';
import { Bid, BidSchema } from '../schemas/bid.schema';
import { Invoice, InvoiceSchema } from '../schemas/invoice.schema';
import { Rating, RatingSchema } from '../schemas/rating.schema';
import {
  LoyaltyPoints,
  LoyaltyPointsSchema,
} from '../schemas/loyalty-points.schema';
import { Auction, AuctionSchema } from '../schemas/auction.schema';
import { UserStatisticsController } from './user-statistics.controller';
import { UserStatisticsService } from './user-statistics.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserStatistics.name, schema: UserStatisticsSchema },
      { name: Bid.name, schema: BidSchema },
      { name: Invoice.name, schema: InvoiceSchema },
      { name: Rating.name, schema: RatingSchema },
      { name: LoyaltyPoints.name, schema: LoyaltyPointsSchema },
      { name: Auction.name, schema: AuctionSchema },
    ]),
  ],
  controllers: [UserStatisticsController],
  providers: [UserStatisticsService],
  exports: [UserStatisticsService],
})
export class UserStatisticsModule {}
