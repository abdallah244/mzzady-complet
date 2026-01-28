import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AutoBid, AutoBidSchema } from '../schemas/auto-bid.schema';
import { Auction, AuctionSchema } from '../schemas/auction.schema';
import { AutoBidController } from './auto-bid.controller';
import { AutoBidService } from './auto-bid.service';
import { BidsModule } from '../bids/bids.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AutoBid.name, schema: AutoBidSchema },
      { name: Auction.name, schema: AuctionSchema },
    ]),
    forwardRef(() => BidsModule),
  ],
  controllers: [AutoBidController],
  providers: [AutoBidService],
  exports: [AutoBidService],
})
export class AutoBidModule {}
