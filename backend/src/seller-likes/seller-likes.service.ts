import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { SellerLike, SellerLikeDocument } from '../schemas/seller-like.schema';
import { Auction, AuctionDocument } from '../schemas/auction.schema';
import { Rating, RatingDocument } from '../schemas/rating.schema';
import { User, UserDocument } from '../schemas/user.schema';

@Injectable()
export class SellerLikesService {
  constructor(
    @InjectModel(SellerLike.name)
    private sellerLikeModel: Model<SellerLikeDocument>,
    @InjectModel(Auction.name)
    private auctionModel: Model<AuctionDocument>,
    @InjectModel(Rating.name)
    private ratingModel: Model<RatingDocument>,
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
  ) {}

  // إضافة إعجاب
  async likeSeller(
    sellerId: string,
    userId: string,
  ): Promise<SellerLikeDocument> {
    // التحقق من عدم وجود إعجاب سابق
    const existingLike = await this.sellerLikeModel
      .findOne({
        sellerId: new Types.ObjectId(sellerId),
        userId: new Types.ObjectId(userId),
      })
      .exec();

    if (existingLike) {
      return existingLike; // الإعجاب موجود بالفعل
    }

    const like = new this.sellerLikeModel({
      sellerId: new Types.ObjectId(sellerId),
      userId: new Types.ObjectId(userId),
      likedAt: new Date(),
    });

    return like.save();
  }

  // إزالة إعجاب
  async unlikeSeller(sellerId: string, userId: string): Promise<void> {
    await this.sellerLikeModel
      .deleteOne({
        sellerId: new Types.ObjectId(sellerId),
        userId: new Types.ObjectId(userId),
      })
      .exec();
  }

  // التحقق من وجود إعجاب
  async isLiked(sellerId: string, userId: string): Promise<boolean> {
    const like = await this.sellerLikeModel
      .findOne({
        sellerId: new Types.ObjectId(sellerId),
        userId: new Types.ObjectId(userId),
      })
      .exec();

    return !!like;
  }

  // الحصول على عدد الإعجابات لبائع
  async getLikesCount(sellerId: string): Promise<number> {
    return this.sellerLikeModel
      .countDocuments({
        sellerId: new Types.ObjectId(sellerId),
      })
      .exec();
  }

  // الحصول على جميع البائعين مع إحصائياتهم
  async getAllSellersWithStats(): Promise<any[]> {
    // الحصول على جميع البائعين الذين لديهم مزادات (حتى لو انتهت)
    const sellerIds = await this.auctionModel.distinct('sellerId').exec();

    const sellersWithStats = await Promise.all(
      sellerIds.map(async (sellerId) => {
        // تحويل sellerId لـ ObjectId للتأكد من التطابق
        const sellerObjectId = new Types.ObjectId(sellerId.toString());

        // الحصول على بيانات البائع
        const seller = await this.userModel
          .findById(sellerObjectId)
          .select(
            'firstName middleName lastName email nickname profileImageUrl',
          )
          .exec();

        if (!seller) {
          return null; // تخطي إذا لم يوجد البائع
        }

        // عدد المزادات - استخدام الـ sellerId الأصلي للتطابق مع البيانات المخزنة
        const totalAuctions = await this.auctionModel
          .countDocuments({
            sellerId: sellerId, // استخدام القيمة الأصلية
          })
          .exec();

        // عدد الإعجابات - استخدام ObjectId للتطابق الصحيح
        const likesCount = await this.sellerLikeModel
          .countDocuments({
            sellerId: sellerObjectId,
          })
          .exec();

        // متوسط التقييم
        const ratings = await this.ratingModel
          .find({
            sellerId: sellerObjectId,
            isVisible: true,
          })
          .exec();

        let averageRating = 0;
        if (ratings.length > 0) {
          const sum = ratings.reduce((acc, rating) => acc + rating.rating, 0);
          averageRating = sum / ratings.length;
        }

        return {
          sellerId: sellerObjectId.toString(),
          firstName: seller.firstName,
          middleName: seller.middleName,
          lastName: seller.lastName,
          email: seller.email,
          nickname: seller.nickname,
          profileImageUrl: seller.profileImageUrl,
          totalAuctions,
          likesCount,
          averageRating: Math.round(averageRating * 10) / 10, // تقريب لرقمين عشريين
          totalRatings: ratings.length,
        };
      }),
    );

    // إزالة القيم null وترتيب حسب عدد الإعجابات (الأكثر إعجابات أولاً)
    return sellersWithStats
      .filter((seller) => seller !== null)
      .sort((a, b) => b.likesCount - a.likesCount);
  }
}
