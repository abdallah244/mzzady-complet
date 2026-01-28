import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { CartService } from './cart.service';
import { AdminGuard } from '../auth/admin.guard';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get('user/:userId')
  async getUserCart(@Param('userId') userId: string) {
    return this.cartService.getUserCart(userId);
  }

  @Post('add')
  async addToCart(@Body() body: { userId: string; productId: string }) {
    const { userId, productId } = body;
    return this.cartService.addToCart(userId, productId);
  }

  @Put(':id')
  async updateCartItem(
    @Param('id') id: string,
    @Body() body: { userId: string; shippingMethod?: 'ground' | 'air'; insurance?: boolean },
  ) {
    const { userId, shippingMethod, insurance } = body;
    return this.cartService.updateCartItem(id, userId, shippingMethod, insurance);
  }

  @Post('remove/:id')
  async removeFromCart(@Param('id') id: string, @Body() body: { userId: string }) {
    const { userId } = body;
    await this.cartService.removeFromCart(id, userId);
    return { message: 'Item removed from cart successfully' };
  }

  @Get('total/:userId')
  async calculateTotal(@Param('userId') userId: string) {
    return this.cartService.calculateTotal(userId);
  }

  @Post('purchase')
  async purchase(
    @Body()
    body: {
      userId: string;
      cartItemId: string;
      shippingAddress: string;
      country: string;
      governorate: string;
      contactPhone: string;
      deliveryLocation: string;
    },
  ) {
    const { userId, cartItemId, shippingAddress, country, governorate, contactPhone, deliveryLocation } = body;
    return this.cartService.purchase(userId, cartItemId, shippingAddress, country, governorate, contactPhone, deliveryLocation);
  }

  @Get('invoice/:invoiceId/user/:userId')
  async getInvoice(@Param('invoiceId') invoiceId: string, @Param('userId') userId: string) {
    return this.cartService.getInvoice(invoiceId, userId);
  }
}

