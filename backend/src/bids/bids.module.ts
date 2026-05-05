import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Bid, BidSchema } from '../schemas/bid.schema';
import { Auction, AuctionSchema } from '../schemas/auction.schema';
import { User, UserSchema } from '../schemas/user.schema';
import { BidsController } from './bids.controller';
import { BidsService } from './bids.service';
import { NotificationsModule } from '../notifications/notifications.module';
import { AutoBidModule } from '../auto-bid/auto-bid.module';
import { ActivityHistoryModule } from '../activity-history/activity-history.module';
import { WatchlistModule } from '../watchlist/watchlist.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Bid.name, schema: BidSchema },
      { name: Auction.name, schema: AuctionSchema },
      { name: User.name, schema: UserSchema },
    ]),
    forwardRef(() => NotificationsModule),
    forwardRef(() => AutoBidModule),
    forwardRef(() => ActivityHistoryModule),
    forwardRef(() => WatchlistModule),
  ],
  controllers: [BidsController],
  providers: [BidsService],
  exports: [BidsService],
})
export class BidsModule {}
