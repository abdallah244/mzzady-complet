import { Controller, Get, Put, Param, Body } from '@nestjs/common';
import { ShippingTrackingService } from './shipping-tracking.service';
import { ShippingStatus } from '../schemas/shipping-tracking.schema';

@Controller('shipping-tracking')
export class ShippingTrackingController {
  constructor(private readonly shippingTrackingService: ShippingTrackingService) {}

  @Get('invoice/:invoiceId')
  async getTracking(@Param('invoiceId') invoiceId: string) {
    return this.shippingTrackingService.getTracking(invoiceId);
  }

  @Get('user/:userId')
  async getUserShipments(@Param('userId') userId: string) {
    return this.shippingTrackingService.getUserShipments(userId);
  }

  @Put('invoice/:invoiceId/status')
  async updateStatus(
    @Param('invoiceId') invoiceId: string,
    @Body() body: { status: ShippingStatus; location?: string; description?: string },
  ) {
    return this.shippingTrackingService.updateStatus(
      invoiceId,
      body.status,
      body.location,
      body.description,
    );
  }
}
