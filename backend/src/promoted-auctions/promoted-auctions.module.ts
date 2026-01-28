import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Auction, AuctionSchema } from '../schemas/auction.schema';
import { PromotedAuctionsController } from './promoted-auctions.controller';
import { PromotedAuctionsService } from './promoted-auctions.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Auction.name, schema: AuctionSchema },
    ]),
  ],
  controllers: [PromotedAuctionsController],
  providers: [PromotedAuctionsService],
  exports: [PromotedAuctionsService],
})
export class PromotedAuctionsModule {}
