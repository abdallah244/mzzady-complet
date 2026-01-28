import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CartItem, CartItemDocument } from '../schemas/cart-item.schema';
import { Product, ProductDocument } from '../schemas/product.schema';
import { User, UserDocument } from '../schemas/user.schema';
import { Invoice, InvoiceDocument } from '../schemas/invoice.schema';
import { AdminMessagesService } from '../admin-messages/admin-messages.service';
import { ShippingTrackingService } from '../shipping-tracking/shipping-tracking.service';
import { LoyaltyPointsService } from '../loyalty-points/loyalty-points.service';
import { ActivityHistoryService } from '../activity-history/activity-history.service';
import { PointsSource } from '../schemas/loyalty-points.schema';
import { ActivityType } from '../schemas/activity-history.schema';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(CartItem.name)
    private cartItemModel: Model<CartItemDocument>,
    @InjectModel(Product.name)
    private productModel: Model<ProductDocument>,
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
    @InjectModel(Invoice.name)
    private invoiceModel: Model<InvoiceDocument>,
    @Inject(forwardRef(() => AdminMessagesService))
    private adminMessagesService: AdminMessagesService,
    @Inject(forwardRef(() => ShippingTrackingService))
    private shippingTrackingService: ShippingTrackingService,
    @Inject(forwardRef(() => LoyaltyPointsService))
    private loyaltyPointsService: LoyaltyPointsService,
    @Inject(forwardRef(() => ActivityHistoryService))
    private activityHistoryService: ActivityHistoryService,
  ) {}

  async getUserCart(userId: string): Promise<CartItemDocument[]> {
    return this.cartItemModel
      .find({ userId: new Types.ObjectId(userId), status: 'pending' } as any)
      .populate({
        path: 'productId',
        populate: {
          path: 'userId',
          select:
            'firstName middleName lastName email nickname profileImageUrl',
        },
      })
      .sort({ createdAt: -1 })
      .exec();
  }

  async addToCart(
    userId: string,
    productId: string,
  ): Promise<CartItemDocument> {
    // Validate user and product
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const product = await this.productModel.findById(productId);
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // Check if product already in cart
    const existingCartItem = await this.cartItemModel.findOne({
      userId: new Types.ObjectId(userId),
      productId: new Types.ObjectId(productId),
      status: 'pending',
    } as any);

    if (existingCartItem) {
      throw new BadRequestException('Product already in cart');
    }

    const cartItem = new this.cartItemModel({
      userId: new Types.ObjectId(userId),
      productId: new Types.ObjectId(productId),
      shippingMethod: 'ground',
      insurance: false,
      status: 'pending',
      addedAt: new Date(),
    });

    return cartItem.save();
  }

  async updateCartItem(
    cartItemId: string,
    userId: string,
    shippingMethod?: 'ground' | 'air',
    insurance?: boolean,
  ): Promise<CartItemDocument> {
    const cartItem = await this.cartItemModel.findOne({
      _id: new Types.ObjectId(cartItemId),
      userId: new Types.ObjectId(userId),
      status: 'pending',
    } as any);

    if (!cartItem) {
      throw new NotFoundException('Cart item not found');
    }

    if (shippingMethod !== undefined) {
      cartItem.shippingMethod = shippingMethod;
    }

    if (insurance !== undefined) {
      cartItem.insurance = insurance;
    }

    return cartItem.save();
  }

  async removeFromCart(cartItemId: string, userId: string): Promise<void> {
    const cartItem = await this.cartItemModel.findOne({
      _id: new Types.ObjectId(cartItemId),
      userId: new Types.ObjectId(userId),
      status: 'pending',
    } as any);

    if (!cartItem) {
      throw new NotFoundException('Cart item not found');
    }

    await this.cartItemModel.deleteOne({ _id: new Types.ObjectId(cartItemId) });
  }

  async calculateTotal(
    userId: string,
  ): Promise<{
    total: number;
    items: Array<{
      cartItem: CartItemDocument;
      product: ProductDocument;
      shippingCost: number;
      insuranceCost: number;
      itemTotal: number;
    }>;
  }> {
    // Use populate to avoid N+1 query problem
    const cartItems = await this.cartItemModel
      .find({ userId: new Types.ObjectId(userId), status: 'pending' } as any)
      .populate('productId')
      .sort({ createdAt: -1 })
      .exec();

    let total = 0;
    const items: Array<{
      cartItem: CartItemDocument;
      product: ProductDocument;
      shippingCost: number;
      insuranceCost: number;
      itemTotal: number;
    }> = [];

    for (const item of cartItems) {
      const product = item.productId as unknown as ProductDocument;
      if (!product) continue;

      // Shipping cost is 0 (calculated based on location only)
      const shippingCost = 0;
      // Insurance is 10% of product price
      const insuranceCost = item.insurance ? product.price * 0.1 : 0;
      const itemTotal = product.price + shippingCost + insuranceCost;

      total += itemTotal;
      items.push({
        cartItem: item,
        product: product,
        shippingCost,
        insuranceCost,
        itemTotal,
      });
    }

    return { total, items };
  }

  async purchase(
    userId: string,
    cartItemId: string,
    shippingAddress: string,
    country: string,
    governorate: string,
    contactPhone: string,
    deliveryLocation: string,
  ): Promise<InvoiceDocument> {
    const cartItem = await this.cartItemModel
      .findOne({
        _id: new Types.ObjectId(cartItemId),
        userId: new Types.ObjectId(userId),
        status: 'pending',
      } as any)
      .populate('productId')
      .exec();

    if (!cartItem) {
      throw new NotFoundException('Cart item not found');
    }

    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const product = await this.productModel.findById(cartItem.productId);
    if (!product) {
      throw new BadRequestException('Product not found');
    }

    // Calculate costs
    // Shipping cost is 0 (calculated based on location only)
    const shippingCost = 0;
    // Insurance is 10% of product price
    const insuranceCost = cartItem.insurance ? product.price * 0.1 : 0;
    const totalAmount = product.price + shippingCost + insuranceCost;

    // Check wallet balance
    if (user.walletBalance < totalAmount) {
      throw new BadRequestException('Insufficient wallet balance');
    }

    // Deduct from wallet
    user.walletBalance -= totalAmount;
    await user.save();

    // Update cart item status
    cartItem.status = 'paid';
    cartItem.paidAt = new Date();
    await cartItem.save();

    // Create invoice
    const invoice = new this.invoiceModel({
      userId: new Types.ObjectId(userId),
      productId: product._id,
      cartItemId: cartItem._id,
      productName: product.productName,
      productPrice: product.price,
      shippingMethod: cartItem.shippingMethod,
      shippingCost,
      insurance: cartItem.insurance,
      insuranceCost,
      totalAmount,
      shippingAddress,
      country,
      governorate,
      contactPhone,
      deliveryLocation,
      issuedAt: new Date(),
    });

    const savedInvoice = await invoice.save();

    // Notify admin about successful payment
    try {
      // Find admin user (assuming admin email is 'admin@gmail.com')
      const adminUser = await this.userModel.findOne({
        email: 'admin@gmail.com',
      });
      if (adminUser) {
        await this.adminMessagesService.sendMessage(
          adminUser._id.toString(),
          'تم الدفع - عملية شراء جديدة',
          `تم إتمام عملية شراء جديدة:\n\n` +
            `المستخدم: ${user.firstName} ${user.middleName} ${user.lastName} (${user.email})\n` +
            `المنتج: ${product.productName}\n` +
            `المبلغ: ${totalAmount} جنيه\n` +
            `رقم الفاتورة: ${savedInvoice._id}\n` +
            `التاريخ: ${new Date().toLocaleString('ar-EG')}`,
        );
      }
    } catch (error) {
      console.error('Error sending admin notification:', error);
      // Don't fail the purchase if notification fails
    }

    // إنشاء تتبع الشحن تلقائياً
    try {
      const fullAddress = `${country}, ${governorate}, ${shippingAddress}, ${deliveryLocation}`;
      await this.shippingTrackingService.createTracking(
        savedInvoice._id.toString(),
        userId,
        fullAddress,
      );
    } catch (error) {
      console.error('Error creating shipping tracking:', error);
    }

    // إضافة نقاط تلقائياً (1 نقطة لكل 10 جنيه)
    try {
      const points = Math.floor(totalAmount / 10);
      if (points > 0) {
        await this.loyaltyPointsService.addPoints(
          userId,
          PointsSource.PURCHASE,
          points,
          `نقاط مكافأة لشراء بقيمة ${totalAmount} جنيه`,
          savedInvoice._id.toString(),
        );
      }
    } catch (error) {
      console.error('Error adding loyalty points:', error);
    }

    // حفظ سجل النشاط تلقائياً
    try {
      await this.activityHistoryService.createActivity(
        userId,
        ActivityType.PURCHASE,
        `تم شراء منتج بمبلغ ${totalAmount} جنيه`,
        undefined,
        undefined,
        savedInvoice._id.toString(),
        totalAmount,
      );
    } catch (error) {
      console.error('Error creating activity history:', error);
    }

    return savedInvoice;
  }

  async getInvoice(
    invoiceId: string,
    userId: string,
  ): Promise<InvoiceDocument> {
    const invoice = await this.invoiceModel
      .findOne({
        _id: new Types.ObjectId(invoiceId),
        userId: new Types.ObjectId(userId),
      } as any)
      .populate({
        path: 'productId',
        populate: {
          path: 'userId',
          select: 'firstName middleName lastName email nickname',
        },
      })
      .exec();

    if (!invoice) {
      throw new NotFoundException('Invoice not found');
    }

    return invoice;
  }
}
