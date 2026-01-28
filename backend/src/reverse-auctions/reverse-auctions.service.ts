import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ReverseAuction, ReverseAuctionDocument } from '../schemas/reverse-auction.schema';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class ReverseAuctionsService {
  constructor(
    @InjectModel(ReverseAuction.name)
    private reverseAuctionModel: Model<ReverseAuctionDocument>,
    private notificationsService: NotificationsService,
  ) {}

  async createReverseAuction(
    buyerId: string,
    productName: string,
    description: string,
    maxPrice: number,
    minPrice: number,
    endDate: Date,
    category: string,
  ): Promise<ReverseAuctionDocument> {
    const reverseAuction = new this.reverseAuctionModel({
      buyerId: new Types.ObjectId(buyerId),
      productName,
      description,
      maxPrice,
      minPrice,
      endDate,
      category,
      status: 'active',
    });

    return reverseAuction.save();
  }

  async submitSellerBid(reverseAuctionId: string, sellerId: string, price: number): Promise<void> {
    const reverseAuction = await this.reverseAuctionModel.findById(reverseAuctionId);
    if (!reverseAuction) {
      throw new Error('Reverse auction not found');
    }

    if (price < reverseAuction.minPrice || price > reverseAuction.maxPrice) {
      throw new Error('Price out of range');
    }

    if (!reverseAuction.sellerBids.includes(new Types.ObjectId(sellerId))) {
      reverseAuction.sellerBids.push(new Types.ObjectId(sellerId));
    }

    // تحديث الفائز تلقائياً (أقل سعر)
    if (!reverseAuction.winnerSellerId || price < reverseAuction.finalPrice!) {
      reverseAuction.winnerSellerId = new Types.ObjectId(sellerId);
      reverseAuction.finalPrice = price;
    }

    await reverseAuction.save();

    // إشعار المشتري تلقائياً
    await this.notificationsService.createNotification(
      reverseAuction.buyerId.toString(),
      'bid_placed' as any,
      'عرض جديد في المزاد العكسي',
      `تم تقديم عرض جديد: ${price} EGP`,
      undefined,
      undefined,
      `/reverse-auctions/${reverseAuctionId}`,
    );
  }
}
