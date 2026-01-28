import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FlashAuction, FlashAuctionSchema } from '../schemas/flash-auction.schema';
import { FlashAuctionsController } from './flash-auctions.controller';
import { FlashAuctionsService } from './flash-auctions.service';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: FlashAuction.name, schema: FlashAuctionSchema },
    ]),
    forwardRef(() => NotificationsModule),
  ],
  controllers: [FlashAuctionsController],
  providers: [FlashAuctionsService],
  exports: [FlashAuctionsService],
})
export class FlashAuctionsModule {}
