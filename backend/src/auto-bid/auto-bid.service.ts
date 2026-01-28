import {
  Injectable,
  BadRequestException,
  Inject,
  forwardRef,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { AutoBid, AutoBidDocument } from '../schemas/auto-bid.schema';
import { Auction, AuctionDocument } from '../schemas/auction.schema';
import { BidsService } from '../bids/bids.service';

@Injectable()
export class AutoBidService {
  private readonly logger = new Logger(AutoBidService.name);

  constructor(
    @InjectModel(AutoBid.name)
    private autoBidModel: Model<AutoBidDocument>,
    @InjectModel(Auction.name)
    private auctionModel: Model<AuctionDocument>,
    @Inject(forwardRef(() => BidsService))
    private bidsService: BidsService,
  ) {}

  // إنشاء مزايدة تلقائية
  async createAutoBid(
    userId: string,
    auctionId: string,
    maxBidAmount: number,
    incrementAmount: number,
  ): Promise<AutoBidDocument> {
    const auction = await this.auctionModel.findById(auctionId);
    if (!auction) {
      throw new BadRequestException('Auction not found');
    }

    if (auction.status !== 'active') {
      throw new BadRequestException('Auction is not active');
    }

    const existing = await this.autoBidModel.findOne({
      userId: new Types.ObjectId(userId),
      auctionId: new Types.ObjectId(auctionId),
    });

    if (existing) {
      existing.maxBidAmount = maxBidAmount;
      existing.incrementAmount = incrementAmount;
      existing.isActive = true;
      return existing.save();
    }

    const autoBid = new this.autoBidModel({
      userId: new Types.ObjectId(userId),
      auctionId: new Types.ObjectId(auctionId),
      maxBidAmount,
      incrementAmount,
      currentBidAmount: auction.highestBid || auction.startingPrice,
      isActive: true,
    });

    return autoBid.save();
  }

  // معالجة المزايدة التلقائية عند مزايدة جديدة
  async processAutoBids(
    auctionId: string,
    newBidAmount: number,
  ): Promise<void> {
    const autoBids = await this.autoBidModel
      .find({
        auctionId: new Types.ObjectId(auctionId),
        isActive: true,
      })
      .populate('userId');

    for (const autoBid of autoBids) {
      if (
        autoBid.currentBidAmount < newBidAmount &&
        autoBid.currentBidAmount + autoBid.incrementAmount <=
          autoBid.maxBidAmount
      ) {
        const nextBidAmount = Math.min(
          newBidAmount + autoBid.incrementAmount,
          autoBid.maxBidAmount,
        );

        if (nextBidAmount <= autoBid.maxBidAmount) {
          try {
            await this.bidsService.placeBid(
              auctionId,
              autoBid.userId._id.toString(),
              nextBidAmount,
            );
            autoBid.currentBidAmount = nextBidAmount;
            autoBid.lastBidAt = new Date();
            await autoBid.save();
          } catch (error) {
            this.logger.error('Error processing auto bid:', error);
            autoBid.isActive = false;
            await autoBid.save();
          }
        }
      }
    }
  }

  // الحصول على المزايدات التلقائية للمستخدم
  async getUserAutoBids(userId: string): Promise<AutoBidDocument[]> {
    return this.autoBidModel
      .find({ userId: new Types.ObjectId(userId) })
      .populate('auctionId', 'productName mainImageUrl status endDate')
      .sort({ createdAt: -1 })
      .exec();
  }

  // إلغاء المزايدة التلقائية
  async cancelAutoBid(userId: string, auctionId: string): Promise<void> {
    await this.autoBidModel.updateOne(
      {
        userId: new Types.ObjectId(userId),
        auctionId: new Types.ObjectId(auctionId),
      },
      { isActive: false },
    );
  }
}
