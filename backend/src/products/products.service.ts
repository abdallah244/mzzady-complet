import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Product, ProductDocument } from '../schemas/product.schema';
import { User, UserDocument } from '../schemas/user.schema';
import { Invoice, InvoiceDocument } from '../schemas/invoice.schema';
import { CartItem, CartItemDocument } from '../schemas/cart-item.schema';
import { Auction, AuctionDocument } from '../schemas/auction.schema';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name)
    private productModel: Model<ProductDocument>,
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
    @InjectModel(Invoice.name)
    private invoiceModel: Model<InvoiceDocument>,
    @InjectModel(CartItem.name)
    private cartItemModel: Model<CartItemDocument>,
    @InjectModel(Auction.name)
    private auctionModel: Model<AuctionDocument>,
  ) {}

  async createProduct(
    productName: string,
    price: number,
    imageUrl: string,
    imageFilename: string,
    userId: string,
  ): Promise<ProductDocument> {
    // Validate user exists
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Validate inputs
    if (!productName || !price || price <= 0 || !imageUrl) {
      throw new BadRequestException('Invalid product data');
    }

    const product = new this.productModel({
      productName,
      price,
      imageUrl,
      imageFilename,
      userId: new Types.ObjectId(userId),
      addedAt: new Date(),
    });

    return product.save();
  }

  async getAllProducts(): Promise<ProductDocument[]> {
    return this.productModel
      .find()
      .populate({
        path: 'userId',
        select: 'firstName middleName lastName email nickname profileImageUrl',
      })
      .sort({ createdAt: -1 })
      .exec();
  }

  async getProductById(productId: string): Promise<ProductDocument> {
    const product = await this.productModel
      .findById(productId)
      .populate({
        path: 'userId',
        select: 'firstName middleName lastName email nickname profileImageUrl',
      })
      .exec();

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async updateProductStatus(
    productId: string,
    status: 'pending' | 'available' | 'sold',
  ): Promise<ProductDocument> {
    const product = await this.productModel.findByIdAndUpdate(
      productId,
      { status },
      { new: true },
    );

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async approveProduct(productId: string): Promise<ProductDocument> {
    const product = await this.productModel.findById(productId);
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (product.status !== 'pending') {
      throw new BadRequestException('Only pending products can be approved');
    }

    product.status = 'available';
    await product.save();

    // If product is from an ended auction, add it to winner's cart
    if (product.auctionId) {
      try {
        // Convert auctionId to string if it's ObjectId
        const auctionIdStr = product.auctionId.toString
          ? product.auctionId.toString()
          : String(product.auctionId);
        const auction = await this.auctionModel.findById(auctionIdStr).exec();

        if (auction && auction.highestBidderId) {
          // Convert highestBidderId to string
          const winnerId = auction.highestBidderId.toString
            ? auction.highestBidderId.toString()
            : String(auction.highestBidderId);

          // Check if product already in winner's cart
          const existingCartItem = await this.cartItemModel.findOne({
            userId: new Types.ObjectId(winnerId),
            productId: new Types.ObjectId(productId),
            status: 'pending',
          } as any);

          if (!existingCartItem) {
            // Add product to winner's cart
            const cartItem = new this.cartItemModel({
              userId: new Types.ObjectId(winnerId),
              productId: new Types.ObjectId(productId),
              shippingMethod: 'ground',
              insurance: false,
              status: 'pending',
              addedAt: new Date(),
            });

            await cartItem.save();
          }
        }
      } catch (error) {
        // Don't fail the approval if cart addition fails
      }
    }

    return product;
  }

  async deleteProduct(productId: string): Promise<void> {
    const product = await this.productModel.findById(productId);
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    await this.productModel.deleteOne({ _id: productId });
  }

  async getProductPaymentInfo(productId: string): Promise<any> {
    const product = await this.productModel.findById(productId);
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // Find invoice for this product
    const invoice = await this.invoiceModel
      .findOne({ productId: new Types.ObjectId(productId) } as any)
      .populate({
        path: 'userId',
        select:
          'firstName middleName lastName email nickname phone profileImageUrl',
      })
      .sort({ createdAt: -1 })
      .exec();

    // Find cart item for this product
    const cartItem = await this.cartItemModel
      .findOne({
        productId: new Types.ObjectId(productId),
        status: 'paid',
      } as any)
      .exec();

    return {
      product,
      invoice: invoice || null,
      cartItem: cartItem || null,
      isPaid: !!invoice,
    };
  }
}
