import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ShippingTracking, ShippingTrackingSchema } from '../schemas/shipping-tracking.schema';
import { ShippingTrackingController } from './shipping-tracking.controller';
import { ShippingTrackingService } from './shipping-tracking.service';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ShippingTracking.name, schema: ShippingTrackingSchema },
    ]),
    forwardRef(() => NotificationsModule),
  ],
  controllers: [ShippingTrackingController],
  providers: [ShippingTrackingService],
  exports: [ShippingTrackingService],
})
export class ShippingTrackingModule {}
