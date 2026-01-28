import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  Notification,
  NotificationDocument,
  NotificationType,
} from '../schemas/notification.schema';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notification.name)
    private notificationModel: Model<NotificationDocument>,
  ) {}

  // إنشاء إشعار تلقائي
  async createNotification(
    userId: string,
    type: NotificationType,
    title: string,
    message: string,
    auctionId?: string,
    bidId?: string,
    link?: string,
    metadata?: any,
  ): Promise<NotificationDocument> {
    const notification = new this.notificationModel({
      userId: new Types.ObjectId(userId),
      type,
      title,
      message,
      auctionId: auctionId ? new Types.ObjectId(auctionId) : null,
      bidId: bidId ? new Types.ObjectId(bidId) : null,
      link,
      metadata,
      isRead: false,
    });

    return notification.save();
  }

  // إشعار عند تجاوز المزايدة
  async notifyBidOutbid(
    userId: string,
    auctionId: string,
    bidId: string,
    newHighestBid: number,
  ): Promise<void> {
    await this.createNotification(
      userId,
      NotificationType.BID_OUTBID,
      'تم تجاوز مزايدتك',
      `تم تجاوز مزايدتك في المزاد. المزايدة الحالية: ${newHighestBid} EGP`,
      auctionId,
      bidId,
      `/auctions/${auctionId}`,
      { newHighestBid },
    );
  }

  // إشعار عند الفوز بمزاد
  async notifyAuctionWon(
    userId: string,
    auctionId: string,
    winningBid: number,
  ): Promise<void> {
    await this.createNotification(
      userId,
      NotificationType.AUCTION_WON,
      'مبروك! فزت بالمزاد',
      `فزت بالمزاد بمبلغ ${winningBid} EGP. يرجى إكمال عملية الشراء`,
      auctionId,
      undefined,
      `/auctions/${auctionId}`,
      { winningBid },
    );
  }

  // إشعار عند انتهاء المزاد
  async notifyAuctionEnded(
    userId: string,
    auctionId: string,
    won: boolean,
  ): Promise<void> {
    const title = won ? 'انتهى المزاد - فزت!' : 'انتهى المزاد';
    const message = won
      ? 'انتهى المزاد وكنت الفائز. يرجى إكمال عملية الشراء'
      : 'انتهى المزاد ولم تفز بهذه المرة';

    await this.createNotification(
      userId,
      NotificationType.AUCTION_ENDED,
      title,
      message,
      auctionId,
      undefined,
      `/auctions/${auctionId}`,
      { won },
    );
  }

  // إشعار عند مزاد جديد
  async notifyNewAuction(
    userId: string,
    auctionId: string,
    productName: string,
  ): Promise<void> {
    await this.createNotification(
      userId,
      NotificationType.NEW_AUCTION,
      'مزاد جديد',
      `تم إضافة مزاد جديد: ${productName}`,
      auctionId,
      undefined,
      `/auctions/${auctionId}`,
      { productName },
    );
  }

  // إشعار عند تحديث الشحن
  async notifyShippingUpdate(
    userId: string,
    invoiceId: string,
    status: string,
    message: string,
  ): Promise<void> {
    await this.createNotification(
      userId,
      NotificationType.SHIPPING_UPDATE,
      'تحديث الشحن',
      message,
      undefined,
      undefined,
      `/cart`,
      { invoiceId, status },
    );
  }

  // الحصول على إشعارات المستخدم
  async getUserNotifications(
    userId: string,
    limit: number = 50,
  ): Promise<NotificationDocument[]> {
    return this.notificationModel
      .find({ userId: new Types.ObjectId(userId) })
      .populate('auctionId', 'productName mainImageUrl')
      .sort({ createdAt: -1 })
      .limit(limit)
      .exec();
  }

  // الحصول على الإشعارات غير المقروءة
  async getUnreadNotifications(
    userId: string,
  ): Promise<NotificationDocument[]> {
    return this.notificationModel
      .find({
        userId: new Types.ObjectId(userId),
        isRead: false,
      })
      .populate('auctionId', 'productName mainImageUrl')
      .sort({ createdAt: -1 })
      .exec();
  }

  // عدد الإشعارات غير المقروءة
  async getUnreadCount(userId: string): Promise<number> {
    return this.notificationModel.countDocuments({
      userId: new Types.ObjectId(userId),
      isRead: false,
    });
  }

  // تحديد الإشعار كمقروء
  async markAsRead(notificationId: string, userId: string): Promise<void> {
    await this.notificationModel.updateOne(
      {
        _id: new Types.ObjectId(notificationId),
        userId: new Types.ObjectId(userId),
      },
      {
        isRead: true,
        readAt: new Date(),
      },
    );
  }

  // تحديد جميع الإشعارات كمقروءة
  async markAllAsRead(userId: string): Promise<void> {
    await this.notificationModel.updateMany(
      { userId: new Types.ObjectId(userId), isRead: false },
      {
        isRead: true,
        readAt: new Date(),
      },
    );
  }

  // حذف إشعار
  async deleteNotification(
    notificationId: string,
    userId: string,
  ): Promise<void> {
    await this.notificationModel.deleteOne({
      _id: new Types.ObjectId(notificationId),
      userId: new Types.ObjectId(userId),
    });
  }

  // حذف جميع الإشعارات المقروءة
  async deleteReadNotifications(userId: string): Promise<void> {
    await this.notificationModel.deleteMany({
      userId: new Types.ObjectId(userId),
      isRead: true,
    });
  }

  // إشعار متابعي المزاد عند تغيير السعر (مزايدة جديدة)
  async notifyWatchlistPriceChange(
    watcherIds: string[],
    auctionId: string,
    productName: string,
    newPrice: number,
    bidderId: string,
  ): Promise<void> {
    const notifications = watcherIds
      .filter((id) => id !== bidderId) // Don't notify the bidder themselves
      .map((userId) => ({
        userId: new Types.ObjectId(userId),
        type: NotificationType.BID_PLACED,
        title: 'مزايدة جديدة على مزاد متابع',
        message: `تم تقديم مزايدة جديدة على "${productName}". السعر الحالي: ${newPrice} EGP`,
        auctionId: new Types.ObjectId(auctionId),
        link: `/auctions/${auctionId}`,
        metadata: { newPrice, productName },
        isRead: false,
      }));

    if (notifications.length > 0) {
      await this.notificationModel.insertMany(notifications);
    }
  }

  // إشعار متابعي المزاد عند اقتراب انتهائه
  async notifyWatchlistEndingSoon(
    watcherIds: string[],
    auctionId: string,
    productName: string,
    minutesRemaining: number,
  ): Promise<void> {
    const notifications = watcherIds.map((userId) => ({
      userId: new Types.ObjectId(userId),
      type: NotificationType.AUCTION_ENDED,
      title: 'المزاد المتابع على وشك الانتهاء',
      message: `المزاد "${productName}" سينتهي خلال ${minutesRemaining} دقيقة`,
      auctionId: new Types.ObjectId(auctionId),
      link: `/auctions/${auctionId}`,
      metadata: { minutesRemaining, productName },
      isRead: false,
    }));

    if (notifications.length > 0) {
      await this.notificationModel.insertMany(notifications);
    }
  }

  // إشعار متابعي المزاد عند انتهائه
  async notifyWatchlistAuctionEnded(
    watcherIds: string[],
    auctionId: string,
    productName: string,
    finalPrice: number,
    winnerId?: string,
  ): Promise<void> {
    const notifications = watcherIds.map((userId) => ({
      userId: new Types.ObjectId(userId),
      type: NotificationType.AUCTION_ENDED,
      title: 'انتهى المزاد المتابع',
      message:
        winnerId && userId === winnerId
          ? `مبروك! فزت بمزاد "${productName}" بمبلغ ${finalPrice} EGP`
          : `انتهى مزاد "${productName}". السعر النهائي: ${finalPrice} EGP`,
      auctionId: new Types.ObjectId(auctionId),
      link: `/auctions/${auctionId}`,
      metadata: { finalPrice, productName, won: winnerId === userId },
      isRead: false,
    }));

    if (notifications.length > 0) {
      await this.notificationModel.insertMany(notifications);
    }
  }
}
