import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  PrivateAuction,
  PrivateAuctionDocument,
} from '../schemas/private-auction.schema';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class PrivateAuctionsService {
  constructor(
    @InjectModel(PrivateAuction.name)
    private privateAuctionModel: Model<PrivateAuctionDocument>,
    private notificationsService: NotificationsService,
  ) {}

  async createPrivateAuction(
    auctionId: string,
    invitedUsers: string[],
    isExclusive: boolean = false,
    minMembershipLevel?: number,
  ): Promise<PrivateAuctionDocument> {
    const inviteCode = Math.random()
      .toString(36)
      .substring(2, 10)
      .toUpperCase();

    const privateAuction = new this.privateAuctionModel({
      auctionId: new Types.ObjectId(auctionId),
      invitedUsers: invitedUsers.map((id) => new Types.ObjectId(id)),
      isExclusive,
      inviteCode,
      minMembershipLevel,
    });

    await privateAuction.save();

    // إرسال دعوات تلقائياً بالتوازي
    await Promise.all(
      invitedUsers.map((userId) =>
        this.notificationsService.createNotification(
          userId,
          'new_auction' as any,
          'دعوة لمزاد خاص',
          `تمت دعوتك لمزاد خاص حصري`,
          auctionId,
          undefined,
          `/auctions/${auctionId}?invite=${inviteCode}`,
        ),
      ),
    );

    return privateAuction;
  }

  async checkAccess(auctionId: string, userId: string): Promise<boolean> {
    const privateAuction = await this.privateAuctionModel.findOne({
      auctionId: new Types.ObjectId(auctionId),
    });

    if (!privateAuction) return true; // ليس مزاد خاص

    return privateAuction.invitedUsers.some((id) => id.toString() === userId);
  }
}
