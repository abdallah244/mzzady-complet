import { Module, forwardRef, Global } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Auction, AuctionSchema } from '../schemas/auction.schema';
import { User, UserSchema } from '../schemas/user.schema';
import { Product, ProductSchema } from '../schemas/product.schema';
import { Invoice, InvoiceSchema } from '../schemas/invoice.schema';
import { CartItem, CartItemSchema } from '../schemas/cart-item.schema';
import { AuctionsController } from './auctions.controller';
import { AuctionsService } from './auctions.service';
import { ImageCompressionService } from '../image-compression.service';
import { AuctionsGateway } from './auctions.gateway';
import { NotificationsModule } from '../notifications/notifications.module';
import { AuthModule } from '../auth/auth.module';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Auction.name, schema: AuctionSchema },
      { name: User.name, schema: UserSchema },
      { name: Product.name, schema: ProductSchema },
      { name: Invoice.name, schema: InvoiceSchema },
      { name: CartItem.name, schema: CartItemSchema },
    ]),
    forwardRef(() => NotificationsModule),
    AuthModule,
  ],
  controllers: [AuctionsController],
  providers: [
    AuctionsService,
    ImageCompressionService,
    AuctionsGateway,
  ],
  exports: [AuctionsService, AuctionsGateway],
})
export class AuctionsModule {}
