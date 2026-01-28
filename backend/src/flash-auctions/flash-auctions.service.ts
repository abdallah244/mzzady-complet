import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  FlashAuction,
  FlashAuctionDocument,
} from '../schemas/flash-auction.schema';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class FlashAuctionsService {
  constructor(
    @InjectModel(FlashAuction.name)
    private flashAuctionModel: Model<FlashAuctionDocument>,
    private notificationsService: NotificationsService,
  ) {}

  async createFlashAuction(
    auctionId: string,
    durationInHours: number,
    discountPercentage: number,
  ): Promise<FlashAuctionDocument> {
    const startTime = new Date();
    const endTime = new Date(
      startTime.getTime() + durationInHours * 60 * 60 * 1000,
    );

    const flashAuction = new this.flashAuctionModel({
      auctionId: new Types.ObjectId(auctionId),
      startTime,
      endTime,
      durationInHours,
      discountPercentage,
      isActive: true,
    });

    return flashAuction.save();
  }

  async notifyUsersAboutFlashAuction(
    flashAuctionId: string,
    userIds: string[],
  ): Promise<void> {
    const flashAuction = await this.flashAuctionModel
      .findById(flashAuctionId)
      .populate('auctionId');
    if (!flashAuction) return;

    await Promise.all(
      userIds.map((userId) =>
        this.notificationsService.createNotification(
          userId,
          'flash_auction' as any,
          'مزاد سريع جديد!',
          `خصم ${flashAuction.discountPercentage}% - ينتهي قريباً!`,
          flashAuction.auctionId._id.toString(),
          undefined,
          `/auctions/${flashAuction.auctionId._id}`,
        ),
      ),
    );
  }
}
