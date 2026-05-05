import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Inject,
  forwardRef,
  Logger,
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
import { AuctionsGateway } from '../auctions/auctions.gateway';

@Injectable()
export class BidsService {
  private readonly logger = new Logger(BidsService.name);

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
    @Inject(forwardRef(() => AuctionsGateway))
    private auctionsGateway: AuctionsGateway,
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

    // Validate bid amount and wallet balance
    const currentHighestBid = auction.highestBid || auction.startingPrice;
    const minBidAmount = currentHighestBid + (auction.minBidIncrement || 1);

    if (amount < minBidAmount) {
      throw new BadRequestException(
        `Bid must be at least ${minBidAmount} (current highest: ${currentHighestBid} + increment: ${auction.minBidIncrement})`,
      );
    }

    const walletBalance = user.walletBalance || 0;
    if (walletBalance < amount) {
      throw new BadRequestException(
        `Insufficient wallet balance. You have ${walletBalance} EGP but need ${amount} EGP`,
      );
    }

    // Atomic update of the auction to prevent race conditions
    // We check if the highestBid is still what we expected
    const updatedAuction = await this.auctionModel.findOneAndUpdate(
      {
        _id: new Types.ObjectId(auctionId),
        status: 'active',
        endDate: { $gt: now },
        $or: [
          { highestBid: { $lt: amount } },
          { highestBid: null }
        ]
      },
      {
        $set: {
          highestBid: amount,
          highestBidderId: new Types.ObjectId(userId),
        }
      },
      { new: true }
    );

    if (!updatedAuction) {
      throw new BadRequestException('Bid too low or auction ended. Please try again.');
    }

    // Auction Extension Logic (Anti-sniping)
    // If bid is placed in the last 2 minutes, extend by 3 minutes
    const extensionThreshold = 2 * 60 * 1000; // 2 minutes
    const extensionAmount = 3 * 60 * 1000; // 3 minutes
    const timeRemaining = updatedAuction.endDate.getTime() - now.getTime();

    if (timeRemaining < extensionThreshold) {
      const newEndDate = new Date(now.getTime() + extensionAmount);
      await this.auctionModel.findByIdAndUpdate(auctionId, {
        $set: { endDate: newEndDate }
      });
      updatedAuction.endDate = newEndDate;
      this.logger.log(`Auction ${auctionId} extended due to late bid`);
    }

    // Create bid record
    const bid = new this.bidModel({
      auctionId: new Types.ObjectId(auctionId),
      userId: new Types.ObjectId(userId),
      amount,
    });

    const savedBid = await bid.save();

    // Notify all users in the auction room about the new bid (Real-time)
    this.auctionsGateway.emitNewBid(auctionId, {
      auctionId,
      amount,
      highestBidderId: userId,
      highestBidderName: user.nickname || user.firstName,
      endDate: updatedAuction.endDate,
    });

    // Get previous highest bidder to notify them
    const previousHighestBidderId = auction.highestBidderId;

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
