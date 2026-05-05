import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Auction, AuctionDocument } from '../schemas/auction.schema';
import { User, UserDocument } from '../schemas/user.schema';
import { Product, ProductDocument } from '../schemas/product.schema';
import { AuctionsGateway } from './auctions.gateway';
import { NotificationsService } from '../notifications/notifications.service';
import { EmailService } from '../auth/email.service';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class AuctionsService {
  private readonly logger = new Logger(AuctionsService.name);

  constructor(
    @InjectModel(Auction.name)
    private auctionModel: Model<AuctionDocument>,
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
    @InjectModel(Product.name)
    private productModel: Model<ProductDocument>,
    @Inject(forwardRef(() => AuctionsGateway))
    private auctionsGateway: AuctionsGateway,
    @Inject(forwardRef(() => NotificationsService))
    private notificationsService: NotificationsService,
    private readonly emailService: EmailService,
  ) {}

  async createAuction(
    productName: string,
    sellerId: string,
    startingPrice: number,
    minBidIncrement: number,
    mainImageUrl: string,
    mainImageFilename: string,
    additionalImagesUrl: string[],
    additionalImagesFilename: string[],
    durationInSeconds: number,
    isFeatured: boolean,
    category: string,
  ): Promise<AuctionDocument> {
    // Validate seller exists
    const seller = await this.userModel.findById(sellerId);
    if (!seller) {
      throw new NotFoundException('Seller not found');
    }

    // Validate duration (1 second to 90 days)
    const maxDuration = 90 * 24 * 60 * 60; // 90 days in seconds
    if (durationInSeconds < 1 || durationInSeconds > maxDuration) {
      throw new BadRequestException(
        'Duration must be between 1 second and 90 days',
      );
    }

    const startDate = new Date();
    const endDate = new Date(startDate.getTime() + durationInSeconds * 1000);

    const auction = new this.auctionModel({
      productName,
      sellerId,
      startingPrice,
      minBidIncrement,
      mainImageUrl,
      mainImageFilename,
      additionalImagesUrl: additionalImagesUrl || [],
      additionalImagesFilename: additionalImagesFilename || [],
      status: 'pending', // Start as pending until admin activates it
      startDate,
      endDate,
      durationInSeconds,
      highestBid: null,
      highestBidderId: null,
      isFeatured,
      category: category || 'other',
    });

    return auction.save();
  }

  async getAllAuctions(): Promise<AuctionDocument[]> {
    return this.auctionModel
      .find()
      .populate({
        path: 'sellerId',
        select:
          'firstName middleName lastName email nickname profileImageUrl phone',
      })
      .populate({
        path: 'highestBidderId',
        select: 'firstName middleName lastName email nickname',
      })
      .sort({ createdAt: -1 })
      .exec();
  }

  async getAllAuctionsPaginated(
    page: number = 1,
    limit: number = 20,
    category?: string,
    status?: string,
    search?: string,
  ): Promise<{
    auctions: AuctionDocument[];
    total: number;
    page: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  }> {
    const skip = (page - 1) * limit;
    const filter: any = {};

    if (category && category !== 'all') {
      filter.category = category;
    }

    if (status && status !== 'all') {
      filter.status = status;
    }

    if (search) {
      filter.productName = { $regex: search, $options: 'i' };
    }

    const [auctions, total] = await Promise.all([
      this.auctionModel
        .find(filter)
        .populate({
          path: 'sellerId',
          select:
            'firstName middleName lastName email nickname profileImageUrl phone',
        })
        .populate({
          path: 'highestBidderId',
          select: 'firstName middleName lastName email nickname',
        })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.auctionModel.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      auctions,
      total,
      page,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    };
  }

  async getActiveAuctions(): Promise<AuctionDocument[]> {
    const now = new Date();
    return this.auctionModel
      .find({
        status: 'active',
        endDate: { $gt: now },
      })
      .populate({
        path: 'sellerId',
        select:
          'firstName middleName lastName email nickname profileImageUrl phone',
      })
      .populate({
        path: 'highestBidderId',
        select: 'firstName middleName lastName email nickname',
      })
      .sort({ createdAt: -1 })
      .exec();
  }

  async getActiveAuctionsPaginated(
    page: number = 1,
    limit: number = 20,
  ): Promise<{
    auctions: AuctionDocument[];
    total: number;
    page: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  }> {
    const skip = (page - 1) * limit;
    const now = new Date();
    const filter = {
      status: 'active',
      endDate: { $gt: now },
    };

    const [auctions, total] = await Promise.all([
      this.auctionModel
        .find(filter)
        .populate({
          path: 'sellerId',
          select:
            'firstName middleName lastName email nickname profileImageUrl phone',
        })
        .populate({
          path: 'highestBidderId',
          select: 'firstName middleName lastName email nickname',
        })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.auctionModel.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      auctions,
      total,
      page,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    };
  }

  async getFeaturedAuctions(): Promise<AuctionDocument[]> {
    const now = new Date();
    return this.auctionModel
      .find({
        isFeatured: true,
        status: 'active',
        endDate: { $gt: now },
      })
      .populate({
        path: 'sellerId',
        select:
          'firstName middleName lastName email nickname profileImageUrl phone',
      })
      .populate({
        path: 'highestBidderId',
        select: 'firstName middleName lastName email nickname',
      })
      .sort({ createdAt: -1 })
      .limit(10)
      .exec();
  }

  async getAuctionById(id: string): Promise<AuctionDocument> {
    const auction = await this.auctionModel
      .findById(id)
      .populate({
        path: 'sellerId',
        select:
          'firstName middleName lastName email nickname profileImageUrl phone',
      })
      .populate({
        path: 'highestBidderId',
        select: 'firstName middleName lastName email nickname',
      })
      .exec();

    if (!auction) {
      throw new NotFoundException('Auction not found');
    }

    return auction;
  }

  async deleteAuction(id: string): Promise<void> {
    const result = await this.auctionModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('Auction not found');
    }
  }

  async updateAuctionStatus(): Promise<void> {
    // Update expired auctions to 'ended' and create products for them
    const now = new Date();
    const expiredAuctions = await this.auctionModel
      .find({
        status: 'active',
        endDate: { $lte: now },
      })
      .exec();

    // Update status to 'ended'
    await this.auctionModel.updateMany(
      {
        status: 'active',
        endDate: { $lte: now },
      },
      {
        $set: { status: 'ended' },
      },
    );

    // Create products for ended auctions
    for (const auction of expiredAuctions) {
      try {
        // Check if product already exists for this auction
        const auctionIdStr =
          auction._id instanceof Types.ObjectId
            ? auction._id.toString()
            : String(auction._id as any);
        const existingProduct = await this.productModel
          .findOne({
            auctionId: new Types.ObjectId(auctionIdStr),
          } as any)
          .exec();

        if (existingProduct) {
          continue; // Skip if product already exists
        }

        // Copy main image from auctions to products folder
        const uploadsDir = path.join(process.cwd(), 'uploads');
        const auctionsDir = path.join(uploadsDir, 'auctions');
        const productsDir = path.join(uploadsDir, 'products');

        // Ensure products directory exists
        if (!fs.existsSync(productsDir)) {
          fs.mkdirSync(productsDir, { recursive: true });
        }

        // Copy main image
        const mainImageSource = path.join(
          auctionsDir,
          auction.mainImageFilename,
        );
        if (fs.existsSync(mainImageSource)) {
          const productImageFilename = `product-${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(auction.mainImageFilename)}`;
          const productImageDest = path.join(productsDir, productImageFilename);
          fs.copyFileSync(mainImageSource, productImageDest);

          const productImageUrl = `/uploads/products/${productImageFilename}`;

          // Determine price: use highest bid if exists, otherwise use starting price
          const productPrice = auction.highestBid || auction.startingPrice;

          // Create product with pending status
          const auctionIdValue =
            auction._id instanceof Types.ObjectId
              ? auction._id
              : new Types.ObjectId(String(auction._id as any));

          const product = new this.productModel({
            productName: auction.productName,
            price: productPrice,
            imageUrl: productImageUrl,
            imageFilename: productImageFilename,
            userId: auction.sellerId,
            status: 'pending', // Pending until admin approves
            auctionId: auctionIdValue,
            addedAt: new Date(),
          } as any);

          const savedProduct = await product.save();
          this.logger.log(
            `[UpdateAuctionStatus] Product created from ended auction: Auction ID: ${auction._id}, Product ID: ${savedProduct._id}`,
          );
        }
      } catch (error) {
        this.logger.error(
          `Error creating product from auction ${auction._id}:`,
          error,
        );
        // Continue with other auctions even if one fails
      }
    }
  }

  async updateAuctionSettings(
    id: string,
    settings: {
      minBidIncrement?: number;
      durationInSeconds?: number;
      productName?: string;
      category?: string;
      isFeatured?: boolean;
    },
  ): Promise<AuctionDocument> {
    const auction = await this.auctionModel.findById(id);
    if (!auction) {
      throw new NotFoundException('Auction not found');
    }

    // Only allow updating if auction hasn't started or has no bids
    if (auction.highestBid !== null && auction.highestBid !== undefined) {
      throw new BadRequestException(
        'Cannot update auction settings after bids have been placed',
      );
    }

    const {
      minBidIncrement,
      durationInSeconds,
      productName,
      category,
      isFeatured,
    } = settings;

    if (minBidIncrement !== undefined) {
      if (minBidIncrement < 1) {
        throw new BadRequestException('Min bid increment must be at least 1');
      }
      auction.minBidIncrement = minBidIncrement;
    }

    if (durationInSeconds !== undefined) {
      const maxDuration = 7 * 24 * 60 * 60; // 7 days in seconds
      if (durationInSeconds < 1 || durationInSeconds > maxDuration) {
        throw new BadRequestException(
          'Duration must be between 1 second and 7 days',
        );
      }

      // Update end date based on new duration
      const startDate = auction.startDate || new Date();
      auction.endDate = new Date(
        startDate.getTime() + durationInSeconds * 1000,
      );
      auction.durationInSeconds = durationInSeconds;
    }

    if (productName !== undefined && productName.trim() !== '') {
      auction.productName = productName.trim();
    }

    if (category !== undefined) {
      const validCategories = [
        'electronics',
        'fashion',
        'home',
        'vehicles',
        'art',
        'jewelry',
        'books',
        'sports',
        'other',
      ];
      if (!validCategories.includes(category)) {
        throw new BadRequestException('Invalid category');
      }
      auction.category = category;
    }

    if (isFeatured !== undefined) {
      auction.isFeatured = isFeatured;
    }

    return auction.save();
  }

  async activateAuction(id: string): Promise<AuctionDocument> {
    const auction = await this.auctionModel.findById(id);
    if (!auction) {
      throw new NotFoundException('Auction not found');
    }

    if (auction.status !== 'pending') {
      throw new BadRequestException('Only pending auctions can be activated');
    }

    // Set start date to now and calculate end date
    const startDate = new Date();
    const endDate = new Date(
      startDate.getTime() + auction.durationInSeconds * 1000,
    );

    auction.status = 'active';
    auction.startDate = startDate;
    auction.endDate = endDate;

    return auction.save();
  }
}
