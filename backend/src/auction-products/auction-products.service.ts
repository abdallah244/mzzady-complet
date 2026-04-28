import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  AuctionProduct,
  AuctionProductDocument,
} from '../schemas/auction-product.schema';
import { User, UserDocument } from '../schemas/user.schema';
import { AuctionsService } from '../auctions/auctions.service';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class AuctionProductsService {
  private readonly logger = new Logger(AuctionProductsService.name);

  constructor(
    @InjectModel(AuctionProduct.name)
    private auctionProductModel: Model<AuctionProductDocument>,
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
    private auctionsService: AuctionsService,
  ) {}

  async createProduct(
    userId: string,
    productName: string,
    mainImageUrl: string,
    mainImageFilename: string,
    additionalImagesUrl: string[],
    additionalImagesFilename: string[],
    startingPrice: number,
    minBidIncrement?: number,
    durationInSeconds?: number,
  ): Promise<AuctionProductDocument> {
    // Check if OAuth user has completed their profile
    const seller = await this.userModel.findById(userId);
    if (
      seller &&
      seller.authProvider !== 'local' &&
      !seller.isProfileComplete
    ) {
      throw new ForbiddenException(
        'يجب إكمال بيانات التحقق في صفحة الملف الشخصي قبل إنشاء مزاد | Please complete your profile verification before creating an auction',
      );
    }

    const product = new this.auctionProductModel({
      userId: new Types.ObjectId(userId) as any,
      productName,
      mainImageUrl,
      mainImageFilename,
      additionalImagesUrl,
      additionalImagesFilename,
      startingPrice,
      minBidIncrement: minBidIncrement || 1,
      durationInSeconds: durationInSeconds || 86400,
      status: 'pending',
    });

    return product.save();
  }

  async getAllProducts(): Promise<AuctionProductDocument[]> {
    return this.auctionProductModel
      .find()
      .populate({
        path: 'userId',
        select: 'firstName middleName lastName email profileImageUrl phone',
        model: 'User',
      })
      .sort({ createdAt: -1 })
      .exec();
  }

  async getProductById(id: string): Promise<AuctionProductDocument | null> {
    return this.auctionProductModel.findById(id).exec();
  }

  async getUserProducts(userId: string): Promise<AuctionProductDocument[]> {
    return this.auctionProductModel
      .find({ userId: new Types.ObjectId(userId) as any })
      .sort({ createdAt: -1 })
      .exec();
  }

  async approveProduct(
    id: string,
    reviewedBy: string,
  ): Promise<AuctionProductDocument | null> {
    const product = await this.auctionProductModel
      .findById(id)
      .populate('userId', 'nickname firstName lastName')
      .exec();

    if (!product) {
      return null;
    }

    product.status = 'approved';
    if (reviewedBy && Types.ObjectId.isValid(reviewedBy)) {
      product.reviewedBy = new Types.ObjectId(reviewedBy) as any;
    }
    product.reviewedAt = new Date();

    const savedProduct = await product.save();

    // Create auction automatically from approved product
    try {
      const user = product.userId as any;
      // Get userId as string (handle both ObjectId and populated user)
      const sellerId = user?._id
        ? user._id.toString()
        : user?.toString
          ? user.toString()
          : product.userId.toString();

      // Use productName from the product if available, otherwise generate one
      const productName =
        product.productName ||
        (user?.nickname
          ? `Product from ${user.nickname}`
          : `Auction Product ${id.substring(0, 8)}`);

      // Images are stored in MongoDB — reuse URLs directly (no file copying needed)
      const mainImageUrl = product.mainImageUrl;
      const mainImageFilename = product.mainImageFilename;
      const additionalImagesUrl = product.additionalImagesUrl || [];
      const additionalImagesFilename = product.additionalImagesFilename || [];

      // Create auction with default values (admin can edit later)
      const minBidIncrement = product.minBidIncrement || 1;
      const durationInSeconds = product.durationInSeconds || 86400;

      const createdAuction = await this.auctionsService.createAuction(
        productName,
        sellerId,
        product.startingPrice,
        minBidIncrement,
        mainImageUrl,
        mainImageFilename,
        additionalImagesUrl,
        additionalImagesFilename,
        durationInSeconds,
        false, // not featured by default
        'other', // default category
      );

      this.logger.log(
        `Auction created successfully from approved product ${id}: ${createdAuction._id}`,
      );
    } catch (error) {
      this.logger.error(
        `Error creating auction from approved product ${id}:`,
        error instanceof Error ? error.stack : String(error),
      );
      // Don't fail the approval if auction creation fails, but log the error
    }

    return savedProduct;
  }

  async rejectProduct(
    id: string,
    reviewedBy: string,
    adminNote: string,
  ): Promise<AuctionProductDocument | null> {
    const product = await this.auctionProductModel.findById(id);
    if (!product) {
      return null;
    }

    product.status = 'rejected';
    product.adminNote = adminNote;
    if (reviewedBy && Types.ObjectId.isValid(reviewedBy)) {
      product.reviewedBy = new Types.ObjectId(reviewedBy) as any;
    }
    product.reviewedAt = new Date();

    return product.save();
  }

  async deleteProduct(id: string): Promise<boolean> {
    const result = await this.auctionProductModel.findByIdAndDelete(id).exec();
    return !!result;
  }
}
