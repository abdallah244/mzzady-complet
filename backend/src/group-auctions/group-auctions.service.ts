import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { GroupAuction, GroupAuctionDocument } from '../schemas/group-auction.schema';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class GroupAuctionsService {
  constructor(
    @InjectModel(GroupAuction.name)
    private groupAuctionModel: Model<GroupAuctionDocument>,
    private notificationsService: NotificationsService,
  ) {}

  async createGroupAuction(
    auctionId: string,
    targetParticipants: number,
    pricePerParticipant: number,
  ): Promise<GroupAuctionDocument> {
    const groupAuction = new this.groupAuctionModel({
      auctionId: new Types.ObjectId(auctionId),
      targetParticipants,
      pricePerParticipant,
      status: 'open',
    });

    return groupAuction.save();
  }

  async joinGroupAuction(groupAuctionId: string, userId: string): Promise<void> {
    const groupAuction = await this.groupAuctionModel.findById(groupAuctionId);
    if (!groupAuction) {
      throw new Error('Group auction not found');
    }

    if (groupAuction.status !== 'open') {
      throw new Error('Group auction is not open');
    }

    if (groupAuction.participants.includes(new Types.ObjectId(userId))) {
      throw new Error('Already joined');
    }

    groupAuction.participants.push(new Types.ObjectId(userId));

    // التحقق من اكتمال العدد تلقائياً
    if (groupAuction.participants.length >= groupAuction.targetParticipants) {
      groupAuction.status = 'completed';
      groupAuction.completedAt = new Date();

      // إشعار جميع المشاركين تلقائياً
      for (const participantId of groupAuction.participants) {
        await this.notificationsService.createNotification(
          participantId.toString(),
          'auction_won' as any,
          'اكتمل المزاد الجماعي!',
          'تم اكتمال عدد المشاركين. سيتم إتمام عملية الشراء قريباً',
          groupAuction.auctionId.toString(),
          undefined,
          `/auctions/${groupAuction.auctionId}`,
        );
      }
    }

    await groupAuction.save();
  }
}
