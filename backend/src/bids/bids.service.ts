import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Bid, BidDocument } from '../schemas/bid.schema';
import { Auction, AuctionDocument } from '../schemas/auction.schema';
import { User, UserDocument } from '../schemas/user.schema';
import { NotificationsService } from '../notifications/notifications.service';
import { AutoBidService } from '../auto-bid/auto-bid.service';
import { ActivityHistoryService } from '../activity-history/activity-history.service';
import { WatchlistService } from '../watchlist/watchlist.service';
import { ActivityType } from '../schemas/activity-history.schema';

@Injectable()
export class BidsService {
  constructor(
    @InjectModel(Bid.name)
    private bidModel: Model<BidDocument>,
    @InjectModel(Auction.name)
    private auctionModel: Model<AuctionDocument>,
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
    @Inject(forwardRef(() => NotificationsService))
    private notificationsService: NotificationsService,
    @Inject(forwardRef(() => AutoBidService))
    private autoBidService: AutoBidService,
    @Inject(forwardRef(() => ActivityHistoryService))
    private activityHistoryService: ActivityHistoryService,
    @Inject(forwardRef(() => WatchlistService))
    private watchlistService: WatchlistService,
  ) {}

  async placeBid(
    auctionId: string,
    userId: string,
    amount: number,
  ): Promise<BidDocument> {
    // Validate auction exists and is active
    const auction = await this.auctionModel.findById(auctionId);
    if (!auction) {
      throw new NotFoundException('Auction not found');
    }

    if (auction.status !== 'active') {
      throw new BadRequestException('Auction is not active');
    }

    const now = new Date();
    if (auction.endDate < now) {
      throw new BadRequestException('Auction has ended');
    }

    // Validate user exists
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Validate bid amount
    const currentHighestBid = auction.highestBid || auction.startingPrice;
    const minBidAmount = currentHighestBid + auction.minBidIncrement;

    if (amount < minBidAmount) {
      throw new BadRequestException(
        `Bid must be at least ${minBidAmount} (current highest: ${currentHighestBid} + increment: ${auction.minBidIncrement})`,
      );
    }

    // Validate wallet balance
    const walletBalance = user.walletBalance || 0;
    if (walletBalance < amount) {
      throw new BadRequestException(
        `Insufficient wallet balance. You have ${walletBalance} EGP but need ${amount} EGP`,
      );
    }

    // Create bid
    const bid = new this.bidModel({
      auctionId: new Types.ObjectId(auctionId),
      userId: new Types.ObjectId(userId),
      amount,
    });

    const savedBid = await bid.save();

    // Get previous highest bidder to notify them
    const previousHighestBidderId = auction.highestBidderId;

    // Update auction with new highest bid
    auction.highestBid = amount;
    auction.highestBidderId = new Types.ObjectId(userId);
    await auction.save();

    // Send notification to previous highest bidder if exists
    if (
      previousHighestBidderId &&
      previousHighestBidderId.toString() !== userId
    ) {
      try {
        await this.notificationsService.notifyBidOutbid(
          previousHighestBidderId.toString(),
          auctionId,
          savedBid._id.toString(),
          amount,
        );
      } catch (error) {
        // Silently handle notification error
      }
    }

    // Send notification to seller about new bid
    try {
      await this.notificationsService.createNotification(
        auction.sellerId.toString(),
        'bid_placed' as any,
        'مزايدة جديدة',
        `تم تقديم مزايدة جديدة على منتجك: ${amount} EGP`,
        auctionId,
        savedBid._id.toString(),
        `/auctions/${auctionId}`,
      );
    } catch (error) {
      // Silently handle notification error
    }

    // Notify watchlist users about new bid
    try {
      const watchers =
        await this.watchlistService.getAuctionWatchers(auctionId);
      const watcherIds = watchers
        .filter((w) => w.notifyOnBid)
        .map((w) => w.userId.toString());

      if (watcherIds.length > 0) {
        await this.notificationsService.notifyWatchlistPriceChange(
          watcherIds,
          auctionId,
          auction.productName,
          amount,
          userId,
        );
      }
    } catch (error) {
      // Silently handle watchlist notification error
    }

    // معالجة المزايدات التلقائية
    try {
      await this.autoBidService.processAutoBids(auctionId, amount);
    } catch (error) {
      // Silently handle auto bid error
    }

    // حفظ سجل النشاط تلقائياً
    try {
      await this.activityHistoryService.createActivity(
        userId,
        ActivityType.BID_PLACED,
        `تم تقديم مزايدة بمبلغ ${amount} EGP`,
        auctionId,
        savedBid._id.toString(),
        undefined,
        amount,
      );
    } catch (error) {
      // Silently handle activity history error
    }

    return savedBid;
  }

  async getBidsByAuction(auctionId: string): Promise<BidDocument[]> {
    return this.bidModel
      .find({ auctionId: new Types.ObjectId(auctionId) })
      .populate({
        path: 'userId',
        select: 'firstName middleName lastName email nickname profileImageUrl',
      })
      .sort({ createdAt: -1 })
      .exec();
  }

  async getUserBids(userId: string): Promise<BidDocument[]> {
    return this.bidModel
      .find({ userId: new Types.ObjectId(userId) })
      .populate({
        path: 'auctionId',
        select: 'productName mainImageUrl status endDate',
      })
      .sort({ createdAt: -1 })
      .exec();
  }
}
