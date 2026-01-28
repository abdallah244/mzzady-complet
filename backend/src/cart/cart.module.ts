import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CartItem, CartItemSchema } from '../schemas/cart-item.schema';
import { Product, ProductSchema } from '../schemas/product.schema';
import { User, UserSchema } from '../schemas/user.schema';
import { Invoice, InvoiceSchema } from '../schemas/invoice.schema';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { AdminMessagesModule } from '../admin-messages/admin-messages.module';
import { ShippingTrackingModule } from '../shipping-tracking/shipping-tracking.module';
import { LoyaltyPointsModule } from '../loyalty-points/loyalty-points.module';
import { ActivityHistoryModule } from '../activity-history/activity-history.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CartItem.name, schema: CartItemSchema },
      { name: Product.name, schema: ProductSchema },
      { name: User.name, schema: UserSchema },
      { name: Invoice.name, schema: InvoiceSchema },
    ]),
    forwardRef(() => AdminMessagesModule),
    forwardRef(() => ShippingTrackingModule),
    forwardRef(() => LoyaltyPointsModule),
    forwardRef(() => ActivityHistoryModule),
  ],
  controllers: [CartController],
  providers: [CartService],
  exports: [CartService],
})
export class CartModule {}

