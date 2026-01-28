import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Rating, RatingDocument } from '../schemas/rating.schema';
import { Invoice, InvoiceDocument } from '../schemas/invoice.schema';
import { Product, ProductDocument } from '../schemas/product.schema';

@Injectable()
export class RatingsService {
  constructor(
    @InjectModel(Rating.name)
    private ratingModel: Model<RatingDocument>,
    @InjectModel(Invoice.name)
    private invoiceModel: Model<InvoiceDocument>,
    @InjectModel(Product.name)
    private productModel: Model<ProductDocument>,
  ) {}

  // إنشاء تقييم تلقائي بعد الشراء
  async createRatingAfterPurchase(
    reviewerId: string,
    invoiceId: string,
    rating: number,
    comment?: string,
  ): Promise<RatingDocument> {
    // التحقق من أن المستخدم اشترى المنتج
    const invoice = await this.invoiceModel.findById(invoiceId);
    if (!invoice) {
      throw new BadRequestException('Invoice not found');
    }

    if (invoice.userId.toString() !== reviewerId) {
      throw new BadRequestException('You can only rate your own purchases');
    }

    // Check if user already rated this invoice
    const existingRating = await this.ratingModel.findOne({
      reviewerId: new Types.ObjectId(reviewerId),
      invoiceId: new Types.ObjectId(invoiceId),
    });
    if (existingRating) {
      throw new BadRequestException('You have already rated this purchase');
    }

    // الحصول على البائع من المنتج
    const product = await this.productModel.findById(invoice.productId);
    const sellerId = product?.userId || invoice.userId;

    const ratingDoc = new this.ratingModel({
      reviewerId: new Types.ObjectId(reviewerId),
      sellerId: new Types.ObjectId(sellerId.toString()),
      invoiceId: new Types.ObjectId(invoiceId),
      rating,
      comment,
      isVerified: true,
      isVisible: true,
    });

    return ratingDoc.save();
  }

  // الحصول على تقييمات البائع
  async getSellerRatings(sellerId: string): Promise<RatingDocument[]> {
    return this.ratingModel
      .find({ sellerId: new Types.ObjectId(sellerId), isVisible: true })
      .populate('reviewerId', 'firstName lastName nickname profileImageUrl')
      .sort({ createdAt: -1 })
      .exec();
  }

  // متوسط التقييم
  async getAverageRating(sellerId: string): Promise<number> {
    const ratings = await this.ratingModel.find({
      sellerId: new Types.ObjectId(sellerId),
      isVisible: true,
    });
    if (ratings.length === 0) return 0;
    const sum = ratings.reduce((acc, r) => acc + r.rating, 0);
    return sum / ratings.length;
  }

  // Get rating by ID
  async getRatingById(id: string): Promise<RatingDocument | null> {
    return this.ratingModel
      .findById(id)
      .populate('reviewerId', 'firstName lastName nickname profileImageUrl')
      .exec();
  }

  // Update rating
  async updateRating(
    ratingId: string,
    userId: string,
    rating?: number,
    comment?: string,
  ): Promise<RatingDocument> {
    const existingRating = await this.ratingModel.findById(ratingId);
    if (!existingRating) {
      throw new NotFoundException('Rating not found');
    }

    if (existingRating.reviewerId.toString() !== userId) {
      throw new ForbiddenException('You can only update your own ratings');
    }

    if (rating !== undefined) {
      if (rating < 1 || rating > 5) {
        throw new BadRequestException('Rating must be between 1 and 5');
      }
      existingRating.rating = rating;
    }

    if (comment !== undefined) {
      existingRating.comment = comment;
    }

    return existingRating.save();
  }

  // Delete rating
  async deleteRating(
    ratingId: string,
    userId: string,
  ): Promise<{ message: string }> {
    const existingRating = await this.ratingModel.findById(ratingId);
    if (!existingRating) {
      throw new NotFoundException('Rating not found');
    }

    if (existingRating.reviewerId.toString() !== userId) {
      throw new ForbiddenException('You can only delete your own ratings');
    }

    await this.ratingModel.findByIdAndDelete(ratingId);
    return { message: 'Rating deleted successfully' };
  }

  // Get user's ratings (ratings they have given)
  async getUserRatings(userId: string): Promise<RatingDocument[]> {
    return this.ratingModel
      .find({ reviewerId: new Types.ObjectId(userId) })
      .populate('sellerId', 'firstName lastName nickname profileImageUrl')
      .sort({ createdAt: -1 })
      .exec();
  }
}
