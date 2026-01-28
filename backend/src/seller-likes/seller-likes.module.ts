import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SellerLikesController } from './seller-likes.controller';
import { SellerLikesService } from './seller-likes.service';
import { SellerLike, SellerLikeSchema } from '../schemas/seller-like.schema';
import { Auction, AuctionSchema } from '../schemas/auction.schema';
import { Rating, RatingSchema } from '../schemas/rating.schema';
import { User, UserSchema } from '../schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SellerLike.name, schema: SellerLikeSchema },
      { name: Auction.name, schema: AuctionSchema },
      { name: Rating.name, schema: RatingSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [SellerLikesController],
  providers: [SellerLikesService],
  exports: [SellerLikesService],
})
export class SellerLikesModule {}
