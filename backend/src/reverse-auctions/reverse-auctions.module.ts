import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ReverseAuction, ReverseAuctionSchema } from '../schemas/reverse-auction.schema';
import { ReverseAuctionsController } from './reverse-auctions.controller';
import { ReverseAuctionsService } from './reverse-auctions.service';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ReverseAuction.name, schema: ReverseAuctionSchema },
    ]),
    forwardRef(() => NotificationsModule),
  ],
  controllers: [ReverseAuctionsController],
  providers: [ReverseAuctionsService],
  exports: [ReverseAuctionsService],
})
export class ReverseAuctionsModule {}
