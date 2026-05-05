import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  AuctionProduct,
  AuctionProductSchema,
} from '../schemas/auction-product.schema';
import { User, UserSchema } from '../schemas/user.schema';
import { Auction, AuctionSchema } from '../schemas/auction.schema';
import { Product, ProductSchema } from '../schemas/product.schema';
import { AuctionProductsController } from './auction-products.controller';
import { AuctionProductsService } from './auction-products.service';
import { AuctionsModule } from '../auctions/auctions.module';
import { AuthModule } from '../auth/auth.module';
import { ImageCompressionService } from '../image-compression.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AuctionProduct.name, schema: AuctionProductSchema },
      { name: User.name, schema: UserSchema },
      { name: Auction.name, schema: AuctionSchema },
      { name: Product.name, schema: ProductSchema },
    ]),
    forwardRef(() => AuctionsModule),
    AuthModule,
  ],
  controllers: [AuctionProductsController],
  providers: [AuctionProductsService, ImageCompressionService],
})
export class AuctionProductsModule {}
