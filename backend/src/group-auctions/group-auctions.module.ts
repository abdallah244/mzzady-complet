import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GroupAuction, GroupAuctionSchema } from '../schemas/group-auction.schema';
import { GroupAuctionsController } from './group-auctions.controller';
import { GroupAuctionsService } from './group-auctions.service';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: GroupAuction.name, schema: GroupAuctionSchema },
    ]),
    forwardRef(() => NotificationsModule),
  ],
  controllers: [GroupAuctionsController],
  providers: [GroupAuctionsService],
  exports: [GroupAuctionsService],
})
export class GroupAuctionsModule {}
