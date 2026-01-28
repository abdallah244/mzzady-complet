import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  AuctionProduct,
  AuctionProductDocument,
} from '../schemas/auction-product.schema';
import { AuctionsService } from '../auctions/auctions.service';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class AuctionProductsService {
  private readonly logger = new Logger(AuctionProductsService.name);

  constructor(
    @InjectModel(AuctionProduct.name)
    private auctionProductModel: Model<AuctionProductDocument>,
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

      // Copy images from auction-products to auctions folder
      const uploadsDir = path.join(process.cwd(), 'uploads');
      const auctionProductsDir = path.join(uploadsDir, 'auction-products');
      const auctionsDir = path.join(uploadsDir, 'auctions');

      // Ensure auctions directory exists
      if (!fs.existsSync(auctionsDir)) {
        fs.mkdirSync(auctionsDir, { recursive: true });
      }

      // Copy main image
      const mainImageSource = path.join(
        auctionProductsDir,
        product.mainImageFilename,
      );

      if (!fs.existsSync(mainImageSource)) {
        console.error(`Main image not found: ${mainImageSource}`);
        throw new Error(
          `Main image file not found: ${product.mainImageFilename}`,
        );
      }

      const mainImageDestFilename = `auction-${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(product.mainImageFilename)}`;
      const mainImageDest = path.join(auctionsDir, mainImageDestFilename);

      fs.copyFileSync(mainImageSource, mainImageDest);

      const mainImageUrl = `/uploads/auctions/${mainImageDestFilename}`;
      const mainImageFilename = mainImageDestFilename;

      // Copy additional images
      const additionalImagesUrl: string[] = [];
      const additionalImagesFilename: string[] = [];

      for (
        let i = 0;
        i < (product.additionalImagesFilename?.length || 0);
        i++
      ) {
        const sourceFilename = product.additionalImagesFilename[i];
        const sourcePath = path.join(auctionProductsDir, sourceFilename);

        if (!fs.existsSync(sourcePath)) {
          console.warn(
            `Additional image not found: ${sourcePath}, skipping...`,
          );
          continue;
        }

        // Use different timestamp for each image to avoid conflicts
        const timestamp = Date.now();
        const destFilename = `auction-${timestamp}-${i}-${Math.round(Math.random() * 1e9)}${path.extname(sourceFilename)}`;
        const destPath = path.join(auctionsDir, destFilename);

        fs.copyFileSync(sourcePath, destPath);
        additionalImagesUrl.push(`/uploads/auctions/${destFilename}`);
        additionalImagesFilename.push(destFilename);
      }

      // Create auction with default values (admin can edit later)
      // Use minBidIncrement and durationInSeconds from product if available
      const minBidIncrement = product.minBidIncrement || 1;
      const durationInSeconds = product.durationInSeconds || 86400;

      const createdAuction = await this.auctionsService.createAuction(
        productName,
        sellerId,
        product.startingPrice,
        minBidIncrement, // Use minBidIncrement from product
        mainImageUrl,
        mainImageFilename,
        additionalImagesUrl,
        additionalImagesFilename,
        durationInSeconds, // Use durationInSeconds from product
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
      // The approval will still succeed even if auction creation fails
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
