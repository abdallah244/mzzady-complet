import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PrivateAuction, PrivateAuctionSchema } from '../schemas/private-auction.schema';
import { PrivateAuctionsController } from './private-auctions.controller';
import { PrivateAuctionsService } from './private-auctions.service';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PrivateAuction.name, schema: PrivateAuctionSchema },
    ]),
    forwardRef(() => NotificationsModule),
  ],
  controllers: [PrivateAuctionsController],
  providers: [PrivateAuctionsService],
  exports: [PrivateAuctionsService],
})
export class PrivateAuctionsModule {}
