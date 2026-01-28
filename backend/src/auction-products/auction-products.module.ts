import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuctionProduct, AuctionProductSchema } from '../schemas/auction-product.schema';
import { User, UserSchema } from '../schemas/user.schema';
import { Auction, AuctionSchema } from '../schemas/auction.schema';
import { Product, ProductSchema } from '../schemas/product.schema';
import { AuctionProductsController } from './auction-products.controller';
import { AuctionProductsService } from './auction-products.service';
import { AuctionsService } from '../auctions/auctions.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AuctionProduct.name, schema: AuctionProductSchema },
      { name: User.name, schema: UserSchema },
      { name: Auction.name, schema: AuctionSchema },
      { name: Product.name, schema: ProductSchema },
    ]),
  ],
  controllers: [AuctionProductsController],
  providers: [AuctionProductsService, AuctionsService],
})
export class AuctionProductsModule {}

