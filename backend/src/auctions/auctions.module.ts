import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Auction, AuctionSchema } from '../schemas/auction.schema';
import { User, UserSchema } from '../schemas/user.schema';
import { Product, ProductSchema } from '../schemas/product.schema';
import { Invoice, InvoiceSchema } from '../schemas/invoice.schema';
import { CartItem, CartItemSchema } from '../schemas/cart-item.schema';
import { AuctionsController } from './auctions.controller';
import { AuctionsService } from './auctions.service';
import { ProductsService } from '../products/products.service';
import { ImageCompressionService } from '../image-compression.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Auction.name, schema: AuctionSchema },
      { name: User.name, schema: UserSchema },
      { name: Product.name, schema: ProductSchema },
      { name: Invoice.name, schema: InvoiceSchema },
      { name: CartItem.name, schema: CartItemSchema },
    ]),
  ],
  controllers: [AuctionsController],
  providers: [AuctionsService, ProductsService, ImageCompressionService],
  exports: [AuctionsService],
})
export class AuctionsModule {}
